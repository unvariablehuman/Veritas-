/* Veritas+ — Global state (localStorage) */
import { KEPO_BADGES, KEPO_LEVELS } from './data';

const KEY = "veritas.state.v1";

export const defaults = {
  xp: 0,
  completedLevels: [],   // array of level ids
  currentStreak: 0,      // in-session, but persisted
  bestStreak: 0,
  lastPlayed: null,      // ISO date
  playedDays: [],        // for day streak
  dayStreak: 0,
  seenMyths: [],         // question ids
  correctCount: 0,
  totalAnswers: 0,
};

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (e) {
    return { ...defaults };
  }
}

export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function reset() {
  localStorage.removeItem(KEY);
}

export function unlockedLevels(state) {
  const unlocked = new Set([1]);
  for (const lid of state.completedLevels) {
    unlocked.add(lid);
    unlocked.add(lid + 1);
  }
  return unlocked;
}

export function isUnlocked(state, levelId) {
  return unlockedLevels(state).has(levelId);
}

export function completeLevel(state, levelId, xpGain) {
  if (!state.completedLevels.includes(levelId)) {
    state.completedLevels.push(levelId);
    state.xp += xpGain;
  }
  // update day streak
  const today = new Date().toISOString().slice(0, 10);
  if (!state.playedDays.includes(today)) {
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.dayStreak = state.playedDays.includes(yest) ? (state.dayStreak || 0) + 1 : 1;
    state.playedDays.push(today);
  }
  state.lastPlayed = today;
  save(state);
  return state;
}

export function recordAnswer(state, questionId, isCorrect) {
  state.totalAnswers += 1;
  if (isCorrect) {
    state.correctCount += 1;
    state.currentStreak += 1;
    if (state.currentStreak > state.bestStreak) state.bestStreak = state.currentStreak;
  } else {
    state.currentStreak = 0;
  }
  if (!state.seenMyths.includes(questionId)) state.seenMyths.push(questionId);
  save(state);
  return state;
}

export function earnedBadges(state) {
  const badges = KEPO_BADGES || [];
  return badges.filter(b => {
    try { return b.condition(state); } catch (e) { return false; }
  });
}
