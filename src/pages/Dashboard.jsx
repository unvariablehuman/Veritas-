import React from 'react';
import { KEPO_BADGES, KEPO_LEVELS } from '../utils/data';
import * as KepoState from '../utils/state';

export default function Dashboard({ state, onStateChange, onNavigate }) {
  const acc = state.totalAnswers ? Math.round(state.correctCount / state.totalAnswers * 100) : 0;
  const pct = Math.min(100, (state.xp / 1000) * 100);

  const earned = KepoState.earnedBadges(state);
  const earnedIds = new Set(earned.map(b => b.id));

  const handleReset = () => {
    if (window.confirm("Yakin reset semua progres? Aksi ini tidak bisa di-undo.")) {
      KepoState.reset();
      onStateChange(KepoState.load());
      alert("Progres di-reset. Fresh start! 🔄");
    }
  };

  const handleLevelClick = (levelId, unlocked) => {
    if (unlocked) {
      onNavigate("quiz", levelId);
    }
  };

  return (
    <div style={{ background: '#0A0B10', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="container-x" style={{ padding: '3rem 1.5rem' }}>
        <div className="chip">DASHBOARD</div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: '1rem' }}>Progres <span className="neon-cyan">Veritas</span>-mu</h1>

        {/* Top stats */}
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="card" data-testid="stat-xp">
            <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>TOTAL XP</div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '3rem', marginTop: '.3rem', color: '#FFD700' }}>{state.xp}</div>
            <div style={{ marginTop: '.8rem' }}>
              <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${pct}%` }}></div></div>
              <div style={{ marginTop: '.4rem', fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {state.xp >= 1000 ? "🏆 Grand Veritas tercapai!" : `Menuju Raja Veritas (${state.xp}/1000)`}
              </div>
            </div>
          </div>
          <div className="card" data-testid="stat-levels">
            <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>LEVELS COMPLETED</div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '3rem', marginTop: '.3rem', color: '#00F0FF' }}>
              {state.completedLevels.length}<span style={{ color: 'var(--text-muted)', fontSize: '1.8rem', fontWeight: 500 }}>/8</span>
            </div>
          </div>
          <div className="card" data-testid="stat-streak">
            <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>BEST STREAK</div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '3rem', marginTop: '.3rem', color: 'var(--brand-secondary)' }}>🔥 {state.bestStreak || 0}</div>
          </div>
          <div className="card" data-testid="stat-accuracy">
            <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>ACCURACY</div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '3rem', marginTop: '.3rem', color: '#7CFFB2' }}>{acc}%</div>
            <div style={{ marginTop: '.4rem', fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{state.totalAnswers} jawaban total</div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Badges</h2>
            <div style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontSize: '.85rem' }}>{earned.length} / {KEPO_BADGES.length} unlocked</div>
          </div>
          <div id="badges-grid" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
            {KEPO_BADGES.map((b, i) => {
              const owned = earnedIds.has(b.id);
              return (
                <div key={b.id} className="card reveal-up" style={{ animationDelay: `${i * 40}ms`, opacity: owned ? 1 : 0.45, padding: '1.2rem' }} data-testid={`badge-${b.id}`}>
                  <div style={{ fontSize: '2.2rem', filter: owned ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
                  <div style={{ marginTop: '.6rem', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '1rem' }}>{b.name}</div>
                  <div style={{ marginTop: '.2rem', fontSize: '.75rem', color: 'var(--text-muted)', letterSpacing: '.02em' }}>{b.desc}</div>
                  <div style={{ marginTop: '.8rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '.7rem', color: owned ? '#7CFFB2' : 'var(--text-muted)' }}>
                    {owned ? '✓ UNLOCKED' : '🔒 LOCKED'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Log */}
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>Progres Level</h2>
          <div id="lvl-log" style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '.8rem' }}>
            {KEPO_LEVELS.map(l => {
              const done = state.completedLevels.includes(l.id);
              const unlocked = KepoState.isUnlocked(state, l.id);
              return (
                <button
                  key={l.id}
                  className="card"
                  style={{ textDecoration: 'none', color: '#fff', display: 'block', padding: '1rem 1.2rem', opacity: unlocked ? 1 : 0.55, textAlign: 'left', cursor: unlocked ? 'pointer' : 'default', width: '100%' }}
                  onClick={() => handleLevelClick(l.id, unlocked)}
                  data-testid={`dashboard-lvl-${l.id}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div className="mono" style={{ color: l.color, fontSize: '.72rem', letterSpacing: '.1em' }}>LVL {String(l.id).padStart(2, '0')}</div>
                      <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 800, marginTop: '.2rem' }}>{l.title}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.15rem' }}>{l.subtitle}</div>
                    </div>
                    <div style={{ fontSize: '1.4rem', color: done ? '#7CFFB2' : (unlocked ? l.color : 'var(--text-muted)') }}>
                      {done ? '✓' : (unlocked ? '▶' : '🔒')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action row */}
        <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => onNavigate("map")} data-testid="dashboard-back-map">Lanjut ke Peta →</button>
          <button className="btn btn-ghost" onClick={() => onNavigate("quiz")} data-testid="dashboard-random-quiz">Quiz Random 5 Kartu</button>
          <button className="btn btn-ghost" onClick={handleReset} data-testid="dashboard-reset-btn" style={{ borderColor: 'rgba(255,92,122,.35)', color: '#FF7095' }}>Reset Progres</button>
        </div>
      </section>
    </div>
  );
}
