import React, { useState, useEffect } from 'react';
import { KEPO_QUESTIONS, KEPO_LEVELS, KEPO_CATEGORIES } from '../utils/data';
import * as KepoState from '../utils/state';

export default function Quiz({ levelId, onNavigate, state, onStateChange }) {
  const [questions, setQuestions] = useState([]);
  const [level, setLevel] = useState(null);
  const [isRandomMode, setIsRandomMode] = useState(false);

  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [userResultCorrect, setUserResultCorrect] = useState(false);
  const [isMythResult, setIsMythResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [bestStreakAtFinish, setBestStreakAtFinish] = useState(0);
  const [xpGained, setXpGained] = useState(0);

  // Notifications / toasts
  const [toastMessage, setToastMessage] = useState(null);
  const [toastKind, setToastKind] = useState("");

  const showToast = (msg, kind) => {
    setToastMessage(msg);
    setToastKind(kind);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  useEffect(() => {
    let qList = [];
    let lvl = null;

    if (!levelId) {
      setIsRandomMode(true);
      const allIds = Object.keys(KEPO_QUESTIONS);
      const randomQuestions = allIds
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map(id => KEPO_QUESTIONS[id]);
      qList = randomQuestions;
      lvl = { title: "Quiz Cepat", subtitle: "5 Kartu Acak", boss: "Sesi Latihan", color: "#00F0FF", xp: 50, id: null };
    } else {
      setIsRandomMode(false);
      lvl = KEPO_LEVELS.find(l => l.id === levelId);
      if (!lvl) {
        onNavigate("map");
        return;
      }
      qList = lvl.questions.map(qid => KEPO_QUESTIONS[qid]);
    }

    setQuestions(qList);
    setLevel(lvl);
    setIdx(0);
    setCorrect(0);
    setFlipped(false);
    setFinished(false);
  }, [levelId]);

  if (!level || questions.length === 0) return <div className="container-x" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>Loading...</div>;

  const currentQ = questions[idx];

  const getCatLabel = (catId) => {
    const c = KEPO_CATEGORIES.find(x => x.id === catId);
    return c ? `${c.emoji} ${c.name.toUpperCase()}` : catId.toUpperCase();
  };

  const handleAnswer = (pick) => {
    if (flipped) return;
    const isCorrect = pick === currentQ.answer;
    
    // Update local React correct count
    if (isCorrect) setCorrect(prev => prev + 1);

    // Save to state
    const updatedState = KepoState.recordAnswer(state, currentQ.id, isCorrect);
    onStateChange(updatedState);

    // Flip animation state
    setIsMythResult(currentQ.answer === "myth");
    setUserResultCorrect(isCorrect);
    setFlipped(true);

    showToast(
      isCorrect ? "Veritas poin +! 🎯" : "Salah — tapi sekarang tau!",
      isCorrect ? "fact" : "myth"
    );
  };

  const handleNext = () => {
    if (idx + 1 >= questions.length) {
      // Calculate XP Gain
      const finalCorrect = correct + (flipped && userResultCorrect ? 0 : 0); // correct is already updated in handleAnswer
      const xpGain = isRandomMode
        ? Math.round((finalCorrect / questions.length) * level.xp)
        : (finalCorrect === questions.length ? level.xp : Math.round(level.xp * 0.6));

      let updatedState = { ...state };
      if (!isRandomMode && finalCorrect >= Math.ceil(questions.length * 0.6)) {
        updatedState = KepoState.completeLevel(state, level.id, xpGain);
      } else {
        updatedState.xp += xpGain;
        KepoState.save(updatedState);
      }
      onStateChange(updatedState);
      setXpGained(xpGain);
      setBestStreakAtFinish(updatedState.bestStreak || 0);
      setFinished(true);

      if (!isRandomMode && finalCorrect === questions.length) {
        setTimeout(() => showToast("Perfect run! 💎", "fact"), 400);
      }
    } else {
      setFlipped(false);
      setIdx(prev => prev + 1);
    }
  };

  return (
    <div style={{ background: '#0A0B10', minHeight: '100vh', paddingBottom: '6rem' }}>
      {toastMessage && (
        <div className={`toast show ${toastKind}`}>
          {toastKind === 'fact' ? '✓ ' : '✗ '}
          {toastMessage}
        </div>
      )}

      <section className="container-x" style={{ padding: '2.5rem 1.5rem 2rem' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="chip">{isRandomMode ? "RANDOM MODE" : `LVL ${String(level.id).padStart(2, "0")}`}</div>
            <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', marginTop: '.7rem' }}>{level.title}</h1>
            <div style={{ color: 'var(--text-muted)', marginTop: '.3rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '.85rem' }}>
              {isRandomMode ? "5 kartu acak · Latihan Veritas" : `Boss: ${level.boss} · Reward: ${level.xp} XP`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '.7rem', alignItems: 'center' }}>
            <div className="glass" style={{ padding: '.7rem 1rem', borderRadius: '12px', fontFamily: "'JetBrains Mono', monospace", display: 'flex', alignItems: 'center', gap: '.5rem' }} data-testid="streak-display">
              <span>🔥</span> <span style={{ color: 'var(--brand-secondary)', fontWeight: 800 }}>{state.currentStreak || 0}</span>
            </div>
            <button className="btn btn-ghost" onClick={() => onNavigate("map")} data-testid="back-to-map">← Peta</button>
          </div>
        </div>

        {/* Progress bar */}
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

      {/* QUIZ VIEW */}
      {!finished ? (
        <section className="container-x" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
          <div className={`flip-card ${flipped ? "flipped" : ""}`} data-testid="quiz-flip-card">
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
                  Menurutmu ini <span className="neon-pink" style={{ fontWeight: 800 }}>MITOS</span> atau <span style={{ color: '#7CFFB2', fontWeight: 800 }}>FAKTA</span>?
                </div>
              </div>

              {/* BACK */}
              <div className={`flip-face flip-face--back ${flipped ? (isMythResult ? "flip-face--myth" : "flip-face--fact") : ""}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="chip" style={{ borderColor: isMythResult ? 'rgba(255,92,122,.6)' : 'rgba(124,255,178,.6)', color: isMythResult ? '#FF7095' : '#7CFFB2' }}>
                    {isMythResult ? "✗ MITOS" : "✓ FAKTA"}
                  </div>
                  <div className="mono" style={{ color: userResultCorrect ? '#7CFFB2' : '#FF7095', fontSize: '.75rem' }}>
                    {userResultCorrect ? "✓ TEBAKAN BENAR" : "✗ TEBAKAN SALAH"}
                  </div>
                </div>
                <div style={{ marginTop: '1.4rem' }}>
                  <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '2rem', lineHeight: 1, color: isMythResult ? '#FF7095' : '#7CFFB2' }}>
                    {isMythResult ? "Itu MITOS." : "Itu FAKTA."}
                  </div>
                  <p data-testid="quiz-explain-text" style={{ marginTop: '1rem', color: 'var(--text-secondary)', lineHeight: 1.55, fontSize: '1rem', textAlign: 'left' }}>
                    {currentQ.explain}
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
                  <div className="mono" style={{ fontSize: '.7rem', color: 'var(--text-muted)', letterSpacing: '.1em' }}>
                    SOURCE · {currentQ.source || "—"}
                  </div>
                  <button className="btn btn-primary" onClick={handleNext} data-testid="quiz-next-btn">Lanjut →</button>
                </div>
              </div>
            </div>
          </div>

          {/* Answer buttons */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className="btn btn-secondary"
              data-testid="quiz-answer-myth"
              style={{ minWidth: '180px', fontSize: '1.1rem' }}
              disabled={flipped}
              onClick={() => handleAnswer("myth")}
            >
              <span style={{ fontSize: '1.3rem' }}>✗</span> MITOS
            </button>
            <button
              className="btn"
              data-testid="quiz-answer-fact"
              style={{ minWidth: '180px', fontSize: '1.1rem', background: '#7CFFB2', color: '#0A0B10', borderColor: '#7CFFB2' }}
              disabled={flipped}
              onClick={() => handleAnswer("fact")}
            >
              <span style={{ fontSize: '1.3rem' }}>✓</span> FAKTA
            </button>
          </div>
        </section>
      ) : (
        /* COMPLETE VIEW */
        <section className="container-x" style={{ marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem' }} className="floaty">🏆</div>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginTop: '1rem' }}>Level Selesai!</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem' }}>
            Kamu berhasil menyelesaikan <strong style={{ color: '#fff' }}>{level.boss}</strong>
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
              <div className="mono" style={{ fontSize: '2rem', color: 'var(--brand-secondary)', fontWeight: 900 }}>🔥 {bestStreakAtFinish}</div>
            </div>
          </div>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate("map")} data-testid="complete-back-map">← Kembali ke Peta</button>
            {!isRandomMode && levelId < KEPO_LEVELS.length && (
              <button
                className="btn btn-ghost"
                data-testid="complete-next-level"
                onClick={() => onNavigate("quiz", levelId + 1)}
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
