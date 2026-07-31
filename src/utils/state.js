/**
 * Veritas+ — Global state management
 * Strategy:
 *   - Guest (not logged in): read/write localStorage only
 *   - Logged in: read/write Firestore + mirror to localStorage as cache
 *
 * Firestore path: users/{uid}/progress/main
 */
import { KEPO_BADGES, KEPO_LEVELS } from './data';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LS_KEY        = 'veritas.state.v1';
const GUEST_LS_KEY  = 'veritas.guest.v1';

export const defaults = {
  xp: 0,
  completedLevels: [],
  currentStreak: 0,
  bestStreak: 0,
  lastPlayed: null,
  playedDays: [],
  dayStreak: 0,
  seenMyths: [],
  correctCount: 0,
  totalAnswers: 0,
};

export const demoDefaults = {
  xp: 1175,
  completedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
  currentStreak: 5,
  bestStreak: 12,
  lastPlayed: new Date().toISOString().slice(0, 10),
  playedDays: [new Date().toISOString().slice(0, 10)],
  dayStreak: 3,
  seenMyths: ['q_tech_1', 'q_health_1', 'q_science_1'],
  correctCount: 24,
  totalAnswers: 26,
};

/* ─── State normalization helper ───────────────────────────────────── */

export function normalizeState(state) {
  if (!state) return { ...defaults };
  const rawCompleted = Array.isArray(state.completedLevels) ? state.completedLevels : [];
  const completedSet = new Set(rawCompleted);

  // If level N is completed, all preceding levels 1..N-1 must also be marked completed
  const maxCompleted = rawCompleted.length > 0 ? Math.max(...rawCompleted) : 0;
  for (let i = 1; i <= maxCompleted; i++) {
    completedSet.add(i);
  }

  return {
    ...defaults,
    ...state,
    completedLevels: Array.from(completedSet).sort((a, b) => a - b),
  };
}

/* ─── localStorage helpers ─────────────────────────────────────────── */

export function loadGuestState() {
  try {
    const raw = localStorage.getItem(GUEST_LS_KEY);
    if (!raw) return { ...defaults };
    return normalizeState(JSON.parse(raw));
  } catch {
    return { ...defaults };
  }
}

export function loadDemoState() {
  try {
    const raw = localStorage.getItem('veritas.demoState.v1');
    if (!raw) return { ...demoDefaults };
    return normalizeState(JSON.parse(raw));
  } catch {
    return { ...demoDefaults };
  }
}

export function saveDemoState(state) {
  const norm = normalizeState(state);
  localStorage.setItem('veritas.demoState.v1', JSON.stringify(norm));
}

export function load() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...defaults };
    return normalizeState(JSON.parse(raw));
  } catch {
    return { ...defaults };
  }
}

export function save(state) {
  const norm = normalizeState(state);
  localStorage.setItem(LS_KEY, JSON.stringify(norm));
}

/* ─── Firestore sync ────────────────────────────────────────────────── */

export async function loadFromFirestore(uid) {
  try {
    const ref  = doc(db, 'users', uid, 'progress', 'main');
    const snap = await getDoc(ref);

    const guestRaw  = localStorage.getItem(GUEST_LS_KEY) || localStorage.getItem(LS_KEY);
    const guestData = guestRaw ? normalizeState(JSON.parse(guestRaw)) : null;

    let cloudData = snap.exists() ? normalizeState(snap.data()) : null;

    if (cloudData && guestData) {
      cloudData = mergeProgress(cloudData, guestData);
    } else if (!cloudData && guestData) {
      cloudData = guestData;
    } else if (!cloudData) {
      cloudData = { ...defaults };
    }

    cloudData = normalizeState(cloudData);

    await setDoc(ref, cloudData, { merge: true });
    localStorage.setItem(LS_KEY, JSON.stringify(cloudData));
    localStorage.removeItem(GUEST_LS_KEY);

    return cloudData;
  } catch (err) {
    console.warn('[Veritas] Firestore load failed, using localStorage:', err);
    return load();
  }
}

export async function saveToFirestore(uid, state) {
  const norm = normalizeState(state);
  localStorage.setItem(LS_KEY, JSON.stringify(norm));
  try {
    const ref = doc(db, 'users', uid, 'progress', 'main');
    await setDoc(ref, norm, { merge: true });
  } catch (err) {
    console.warn('[Veritas] Firestore save failed, saved locally only:', err);
  }
}

export function saveGuest(state) {
  const norm = normalizeState(state);
  localStorage.setItem(GUEST_LS_KEY, JSON.stringify(norm));
  localStorage.setItem(LS_KEY, JSON.stringify(norm));
}

/* ─── Merge helper ──────────────────────────────────────────────────── */

function mergeProgress(a, b) {
  const mergedCompleted = [...new Set([...(a.completedLevels || []), ...(b.completedLevels || [])])];
  return normalizeState({
    xp:              Math.max(a.xp || 0, b.xp || 0),
    completedLevels: mergedCompleted,
    currentStreak:   Math.max(a.currentStreak || 0, b.currentStreak || 0),
    bestStreak:      Math.max(a.bestStreak || 0, b.bestStreak || 0),
    lastPlayed:      (a.lastPlayed || '') > (b.lastPlayed || '') ? a.lastPlayed : b.lastPlayed,
    playedDays:      [...new Set([...(a.playedDays || []), ...(b.playedDays || [])])],
    dayStreak:       Math.max(a.dayStreak || 0, b.dayStreak || 0),
    seenMyths:       [...new Set([...(a.seenMyths || []), ...(b.seenMyths || [])])],
    correctCount:    Math.max(a.correctCount || 0, b.correctCount || 0),
    totalAnswers:    Math.max(a.totalAnswers || 0, b.totalAnswers || 0),
  });
}

/* ─── Game logic helpers ───────────────────────────────────────────── */

export function unlockedLevels(state) {
  const unlocked = new Set([1]);
  const norm = normalizeState(state);
  for (const lid of norm.completedLevels) {
    for (let i = 1; i <= lid + 1; i++) {
      unlocked.add(i);
    }
  }
  return unlocked;
}

export function isUnlocked(state, levelId) {
  return unlockedLevels(state).has(levelId);
}

export function completeLevel(state, levelId, xpGain) {
  const s = normalizeState(state);

  const isFirstTimeCompletion = !s.completedLevels.includes(levelId);

  // Ensure all levels up to levelId are completed sequentially
  for (let i = 1; i <= levelId; i++) {
    if (!s.completedLevels.includes(i)) {
      s.completedLevels.push(i);
    }
  }
  s.completedLevels.sort((a, b) => a - b);

  if (isFirstTimeCompletion) {
    s.xp = (s.xp || 0) + xpGain;
  }

  const today = new Date().toISOString().slice(0, 10);
  if (!s.playedDays.includes(today)) {
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    s.dayStreak = s.playedDays.includes(yest) ? (s.dayStreak || 0) + 1 : 1;
    s.playedDays.push(today);
  }
  s.lastPlayed = today;
  save(s);
  return s;
}

export function recordAnswer(state, questionId, isCorrect) {
  const s = normalizeState(state);
  s.totalAnswers = (s.totalAnswers || 0) + 1;
  if (isCorrect) {
    s.correctCount  = (s.correctCount || 0) + 1;
    s.currentStreak = (s.currentStreak || 0) + 1;
    if (s.currentStreak > (s.bestStreak || 0)) s.bestStreak = s.currentStreak;
  } else {
    s.currentStreak = 0;
  }
  if (!s.seenMyths.includes(questionId)) s.seenMyths.push(questionId);
  return s;
}

export function earnedBadges(state) {
  const badges = KEPO_BADGES || [];
  const norm = normalizeState(state);
  return badges.filter(b => {
    try { return b.condition(norm); } catch { return false; }
  });
}

export function reset() {
  const fresh = { ...defaults };
  localStorage.setItem(LS_KEY, JSON.stringify(fresh));
  localStorage.setItem(GUEST_LS_KEY, JSON.stringify(fresh));
  localStorage.setItem('veritas.demoState.v1', JSON.stringify(fresh));
  return fresh;
}
