import React, { useState } from 'react';
import { KEPO_BADGES, KEPO_LEVELS } from '../utils/data';
import * as KepoState from '../utils/state';
import { BadgeIcon } from '../utils/icons';
import { Trophy, Flame, Lock, Check, Play, Award } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { ECertificateModal } from './Map';

export default function Dashboard({ state, onStateChange, onNavigate }) {
  const { currentUser } = useAuth();
  const [showCertModal, setShowCertModal] = useState(false);
  const acc = state.totalAnswers ? Math.round(state.correctCount / state.totalAnswers * 100) : 0;
  const pct = Math.min(100, (state.xp / 1000) * 100);

  const earned = KepoState.earnedBadges(state);
  const earnedIds = new Set(earned.map(b => b.id));

  const handleReset = async () => {
    if (window.confirm('Yakin reset semua progres? Aksi ini tidak bisa di-undo.')) {
      const fresh = KepoState.reset();
      if (currentUser) {
        if (currentUser.isDemo) {
          KepoState.saveDemoState(fresh);
        } else {
          await KepoState.saveToFirestore(currentUser.uid, fresh);
        }
      } else {
        KepoState.saveGuest(fresh);
      }
      onStateChange(fresh);
      alert('Progres berhasil di-reset! Kembali ke Level 1 dengan 0 XP. 🔄');
    }
  };

  const handleLevelClick = (levelId, unlocked) => {
    if (unlocked) {
      onNavigate("quiz", levelId);
    }
  };

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="container-x" style={{ paddingTop: '7.5rem', paddingBottom: '3rem' }}>
        <div className="chip">DASHBOARD</div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: '1rem' }}>Progres <span style={{ color: 'var(--brand-accent)' }}>Veritas+</span> mu</h1>

        {/* Top stats */}
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="card" data-testid="stat-xp">
            <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '.75rem' }}>TOTAL XP</div>
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '3rem', marginTop: '.3rem', color: '#FFD700' }}>{state.xp}</div>
            <div style={{ marginTop: '.8rem' }}>
              <div className="xp-bar"><div className="xp-bar-fill" style={{ width: `${pct}%` }}></div></div>
              <div style={{ marginTop: '.4rem', fontSize: '.75rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {state.xp >= 1000
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><Trophy size={14} color="#FFD700" /> Grand Veritas+ tercapai! 🎉</span>
                  : `Menuju Raja Veritas+ (${state.xp}/1000)`}
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
            <div style={{ fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '3rem', marginTop: '.3rem', color: 'var(--brand-secondary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Flame size={32} color="#FF9500" />
              {state.bestStreak || 0}
            </div>
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
                  <BadgeIcon badgeId={b.id} owned={owned} />
                  <div style={{ marginTop: '.6rem', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '1rem' }}>{b.name}</div>
                  <div style={{ marginTop: '.2rem', fontSize: '.75rem', color: 'var(--text-muted)', letterSpacing: '.02em' }}>{b.desc}</div>
                  <div style={{ marginTop: '.8rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '.7rem', color: owned ? '#7CFFB2' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {owned
                      ? <><Check size={11} color="#7CFFB2" /> UNLOCKED</>
                      : <><Lock size={11} /> LOCKED</>}
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
                    <div style={{ fontSize: '1.4rem', color: done ? '#7CFFB2' : (unlocked ? l.color : 'var(--text-muted)'), display: 'flex', alignItems: 'center' }}>
                      {done
                        ? <Check size={20} color="#7CFFB2" strokeWidth={2.5} />
                        : unlocked
                          ? <Play size={18} color={l.color} fill={l.color} />
                          : <Lock size={18} />}
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
          <button className="btn btn-ghost" onClick={() => setShowCertModal(true)} data-testid="dashboard-cert-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} /> Cetak Sertifikat
          </button>
          <button className="btn btn-ghost" onClick={handleReset} data-testid="dashboard-reset-btn" style={{ borderColor: 'rgba(255,92,122,.35)', color: '#FF7095' }}>Reset Progres</button>
        </div>
      </section>

      {/* Official E-Certificate Modal */}
      {showCertModal && (
        <ECertificateModal state={state} onClose={() => setShowCertModal(false)} />
      )}
    </div>
  );
}
