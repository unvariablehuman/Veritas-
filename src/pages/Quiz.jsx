import React, { useState, useEffect, useRef, useCallback } from 'react';
import { KEPO_QUESTIONS, KEPO_LEVELS, KEPO_CATEGORIES } from '../utils/data';
import * as KepoState from '../utils/state';
import { Flame, Gem } from 'lucide-react';

/* ── Auto-advance delay (ms) ──────────────────────────────── */
const REVEAL_DURATION = 3500;

export default function Quiz({ levelId, onNavigate, state, onStateChange }) {
  /* ─── Render-triggering state (UI needs re-render on change) ── */
  const [uiState, setUiState] = useState({
    idx:             0,
    correct:         0,
    flipped:         false,
    userCorrect:     false,
    isMythResult:    false,
    timerActive:     false,
    finished:        false,
    xpGained:        0,
    bestStreakAtEnd:  0,
  });

  /* ─── Stable refs — readable inside setTimeout without staleness ─ */
  const questionsRef  = useRef([]);
  const levelRef      = useRef(null);
  const isRandomRef   = useRef(false);
  const idxRef        = useRef(0);
  const correctRef    = useRef(0);
  const autoTimerRef  = useRef(null);

  /* ─── Derived from ref (needed for rendering) ─── */
  const [questions, setQuestions]   = useState([]);
  const [level,     setLevel]       = useState(null);
  const [isRandom,  setIsRandom]    = useState(false);

  // Notifications / toasts
  const [toastMsg,  setToastMsg]  = useState(null);
  const [toastKind, setToastKind] = useState('');
  const showToast = (msg, kind) => {
    setToastMsg(msg);
    setToastKind(kind);
    setTimeout(() => setToastMsg(null), 2500);
  };

  /* ─── Init / reset on levelId change ─────────────────────────── */
  useEffect(() => {
    clearTimeout(autoTimerRef.current);

    let qList = [];
    let lvl   = null;

    if (!levelId) {
      isRandomRef.current = true;
      const allIds = Object.keys(KEPO_QUESTIONS);
      qList = allIds
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map(id => KEPO_QUESTIONS[id]);
      lvl = { title: 'Quiz Cepat', subtitle: '5 Kartu Acak', boss: 'Sesi Latihan', color: '#00F0FF', xp: 50, id: null };
    } else {
      isRandomRef.current = false;
      lvl = KEPO_LEVELS.find(l => l.id === levelId);
      if (!lvl) { onNavigate('map'); return; }
      qList = lvl.questions.map(qid => KEPO_QUESTIONS[qid]);
    }

    questionsRef.current = qList;
    levelRef.current     = lvl;
    idxRef.current       = 0;
    correctRef.current   = 0;

    setQuestions(qList);
    setLevel(lvl);
    setIsRandom(isRandomRef.current);
    setUiState({
      idx: 0, correct: 0, flipped: false,
      userCorrect: false, isMythResult: false,
      timerActive: false, finished: false,
      xpGained: 0, bestStreakAtEnd: 0,
    });
  }, [levelId]);

  /* ─── Cleanup timer on unmount ───────────────────────────────── */
  useEffect(() => () => clearTimeout(autoTimerRef.current), []);

  /* ─── Advance to next card (or finish) — reads refs, no staleness ─ */
  const advance = useCallback((finalCorrect) => {
    const qs      = questionsRef.current;
    const lvl     = levelRef.current;
    const isRnd   = isRandomRef.current;
    const nextIdx = idxRef.current + 1;

    if (nextIdx >= qs.length) {
      /* ── SESSION COMPLETE ─────────────────────────────────── */
      const xpGain = isRnd
        ? Math.round((finalCorrect / qs.length) * lvl.xp)
        : (finalCorrect === qs.length ? lvl.xp : Math.round(lvl.xp * 0.6));

      // Always deep-copy to avoid mutating the state reference
      let updatedState = JSON.parse(JSON.stringify(state));

      if (!isRnd && finalCorrect >= Math.ceil(qs.length * 0.6)) {
        updatedState = KepoState.completeLevel(state, lvl.id, xpGain);
      } else {
        updatedState.xp = (updatedState.xp || 0) + xpGain;
        KepoState.save(updatedState);
      }
      onStateChange(updatedState);

      setUiState(prev => ({
        ...prev,
        timerActive:    false,
        finished:       true,
        xpGained:       xpGain,
        bestStreakAtEnd: updatedState.bestStreak || 0,
      }));

      if (!isRnd && finalCorrect === qs.length) {
        setTimeout(() => showToast('Perfect! Semua bener', 'fact'), 400);
      }
    } else {
      /* ── NEXT CARD ────────────────────────────────────────── */
      idxRef.current = nextIdx;
      setUiState(prev => ({
        ...prev,
        idx:         nextIdx,
        flipped:     false,
        timerActive: false,
      }));
    }
  }, [state, onStateChange]);

  /* ─── Answer handler ─────────────────────────────────────────── */
  const handleAnswer = useCallback((pick) => {
    if (uiState.flipped) return;

    const currentQ  = questionsRef.current[idxRef.current];
    const isCorrect = pick === currentQ.answer;

    // Update correct count ref immediately — advance() will read it
    if (isCorrect) correctRef.current += 1;
    const snapshotCorrect = correctRef.current;

    // Persist answer to state
    const updatedState = KepoState.recordAnswer(JSON.parse(JSON.stringify(state)), currentQ.id, isCorrect);
    onStateChange(updatedState);

    const isMyth = currentQ.answer === 'myth';

    setUiState(prev => ({
      ...prev,
      flipped:      true,
      userCorrect:  isCorrect,
      isMythResult: isMyth,
      correct:      snapshotCorrect,
    }));

    showToast(
      isCorrect ? 'Beneran! +XP' : 'Meleset — tapi sekarang udah tau!',
      isCorrect ? 'fact' : 'myth',
    );

    /* ── Timer bar: rAF double-frame trick so CSS picks up transition ── */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setUiState(prev => ({ ...prev, timerActive: true }));
      });
    });

    clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      advance(snapshotCorrect);
    }, REVEAL_DURATION);
  }, [uiState.flipped, state, onStateChange, advance]);

  /* ─── Guard ──────────────────────────────────────────────────── */
  if (!level || questions.length === 0)
    return <div className="container-x" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading...</div>;

  const { idx, correct, flipped, userCorrect, isMythResult, timerActive, finished, xpGained, bestStreakAtEnd } = uiState;
  const currentQ = questions[idx];

  const getCatLabel = (catId) => {
    const c = KEPO_CATEGORIES.find(x => x.id === catId);
    return c ? `${c.emoji} ${c.name.toUpperCase()}` : catId.toUpperCase();
  };

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '6rem' }}>
      {toastMsg && (
        <div className={`toast show ${toastKind}`}>
          {toastKind === 'fact' ? '✓ ' : '✗ '}
          {toastMsg}
        </div>
      )}

      <section className="container-x" style={{ paddingTop: '7.5rem', paddingBottom: '2rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="chip">{isRandom ? 'RANDOM MODE' : `LVL ${String(level.id).padStart(2, '0')}`}</div>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', marginTop: '.7rem' }}>{level.title}</h1>
            <div style={{ color: 'var(--text-muted)', marginTop: '.3rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '.85rem' }}>
              {isRandom ? '5 kartu acak · Sesi Latihan Veritas+' : `Boss: ${level.boss} · Reward: ${level.xp} XP`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.7rem', alignItems: 'center' }}>
            <div className="glass" style={{ padding: '.7rem 1rem', borderRadius: '12px', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '.5rem' }} data-testid="streak-display">
              <Flame size={16} color="#FF9500" strokeWidth={2} />
              <span style={{ color: 'var(--brand-secondary)', fontWeight: 800 }}>{state.currentStreak || 0}</span>
            </div>
            <button className="btn btn-ghost" onClick={() => onNavigate('map')} data-testid="back-to-map">← Peta</button>
          </div>
        </div>

        {/* Overall progress bar */}
        {!finished && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.4rem', fontSize: '.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
              <span data-testid="quiz-question-progress">Kartu {idx + 1} / {questions.length}</span>
              <span>Benar: {correct}</span>
            </div>
            <div className="xp-bar">
              <div className="xp-bar-fill" style={{ width: `${(idx / questions.length) * 100}%` }}></div>
            </div>
          </div>
        )}
      </section>

      {/* ── QUIZ VIEW ─────────────────────────────────────────────── */}
      {!finished ? (
        <section className="container-x" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
          <div className={`flip-card ${flipped ? 'flipped' : ''}`} data-testid="quiz-flip-card">
            <div className="flip-card-inner">

              {/* FRONT */}
              <div className="flip-face flip-face--front">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="chip" style={{ borderColor: 'rgba(0,240,255,.35)', color: 'var(--brand-primary)' }}>
                    <span>{getCatLabel(currentQ.category)}</span>
                  </div>
                  <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>CLAIM</div>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <p data-testid="quiz-claim-text" style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: 'clamp(1.4rem, 3.5vw, 1.9rem)', textAlign: 'center', lineHeight: 1.15, letterSpacing: '-.02em' }}>
                    {currentQ.claim}
                  </p>
                </div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '.85rem', letterSpacing: '.04em' }}>
                  Menurutmu ini <span className="neon-pink" style={{ fontWeight: 800 }}>MITOS</span> atau <span style={{ color: 'var(--brand-mint)', fontWeight: 800 }}>FAKTA</span>?
                </div>
              </div>

              {/* BACK */}
              <div className={`flip-face flip-face--back ${flipped ? (isMythResult ? 'flip-face--myth' : 'flip-face--fact') : ''}`}>

                {/* ── Countdown timer bar (shrinks left → right) ── */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '4px',
                  background: 'rgba(255,255,255,0.08)',
                  borderRadius: '12px 12px 0 0',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: timerActive ? '0%' : '100%',
                    background: isMythResult
                      ? 'linear-gradient(90deg, #FF5C7A, #FF9090)'
                      : 'linear-gradient(90deg, #00F0FF, #7CFFB2)',
                    transition: timerActive
                      ? `width ${REVEAL_DURATION}ms linear`
                      : 'none',
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="chip" style={{ borderColor: isMythResult ? 'rgba(255,92,122,.6)' : 'rgba(124,255,178,.6)', color: isMythResult ? '#FF7095' : 'var(--brand-mint)' }}>
                    {isMythResult ? '✗ MITOS' : '✓ FAKTA'}
                  </div>
                  <div className="mono" style={{ color: userCorrect ? 'var(--brand-mint)' : '#FF7095', fontSize: '.75rem' }}>
                    {userCorrect ? '✓ TEBAKAN BENAR' : '✗ TEBAKAN SALAH'}
                  </div>
                </div>

                <div style={{ marginTop: '1.4rem' }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '2rem', lineHeight: 1, color: isMythResult ? '#FF7095' : '#7CFFB2' }}>
                    {isMythResult ? 'Itu MITOS.' : 'Itu FAKTA.'}
                  </div>
                  <p data-testid="quiz-explain-text" style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.55, fontSize: '1rem', textAlign: 'left' }}>
                    {currentQ.explain}
                  </p>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                  <div className="mono" style={{ fontSize: '.7rem', color: 'var(--text-muted)', letterSpacing: '.1em' }}>
                    SOURCE · {currentQ.source || '—'}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Answer buttons */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn btn-secondary"
              data-testid="quiz-answer-myth"
              style={{ minWidth: '180px', fontSize: '1.1rem', opacity: flipped ? 0.4 : 1, transition: 'opacity 200ms' }}
              disabled={flipped}
              onClick={() => handleAnswer('myth')}
            >
              <span style={{ fontSize: '1.3rem' }}>✗</span> MITOS
            </button>
            <button
              className="btn"
              data-testid="quiz-answer-fact"
              style={{ minWidth: '180px', fontSize: '1.1rem', background: 'var(--brand-mint)', color: 'var(--bg-elev)', borderColor: 'var(--brand-mint)', opacity: flipped ? 0.4 : 1, transition: 'opacity 200ms' }}
              disabled={flipped}
              onClick={() => handleAnswer('fact')}
            >
              <span style={{ fontSize: '1.3rem' }}>✓</span> FAKTA
            </button>
          </div>
        </section>
      ) : (
        /* ── COMPLETE VIEW ─────────────────────────────────────── */
        <section className="container-x" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', display: 'flex', justifyContent: 'center' }} className="floaty">
            <Gem size={64} color="#FFD700" strokeWidth={1.4} style={{ filter: 'drop-shadow(0 0 18px rgba(255,215,0,0.5))' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginTop: '1rem' }}>Sesi Selesai!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem' }}>
            Kamu baru aja ngalahin <strong style={{ color: '#fff' }}>{level.boss}</strong>. Gokil.
          </p>
          <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem', maxWidth: '520px', marginLeft: 'auto', marginRight: 'auto' }}>
            <div className="card">
              <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>XP GAINED</div>
              <div className="mono" style={{ fontSize: '2rem', color: '#FFD700', fontWeight: 900 }}>+{xpGained}</div>
            </div>
            <div className="card">
              <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>CORRECT</div>
              <div className="mono" style={{ fontSize: '2rem', color: '#7CFFB2', fontWeight: 900 }}>{correct}/{questions.length}</div>
            </div>
            <div className="card">
              <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>BEST STREAK</div>
              <div className="mono" style={{ fontSize: '2rem', color: 'var(--brand-secondary)', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={28} color="#FF9500" strokeWidth={1.8} /> {bestStreakAtEnd}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('map')} data-testid="complete-back-map">← Kembali ke Peta</button>
            {!isRandom && levelId < KEPO_LEVELS.length && (
              <button
                className="btn btn-ghost"
                data-testid="complete-next-level"
                onClick={() => onNavigate('quiz', levelId + 1)}
              >
                Level Berikutnya →
              </button>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
