import React, { useEffect, useRef, useState } from 'react';
import { KEPO_CATEGORIES, KEPO_LEVELS } from '../utils/data';
import * as KepoState from '../utils/state';

export default function Map({ onNavigate, state }) {
  const nodeRefs = useRef([]);
  const trackRef = useRef(null);
  const [segments, setSegments] = useState([]);
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

  const completedLevels = state.completedLevels;
  const isCompleted = (index) => completedLevels.includes(KEPO_LEVELS[index].id);

  const drawPath = () => {
    if (!trackRef.current) return;
    const trackRect = trackRef.current.getBoundingClientRect();
    setSvgSize({ width: trackRect.width, height: trackRect.height });

    const pts = [];
    nodeRefs.current.forEach(node => {
      if (!node) return;
      const r = node.getBoundingClientRect();
      pts.push({
        x: r.left - trackRect.left + r.width / 2,
        y: r.top - trackRect.top + r.height / 2
      });
    });

    const newSegments = [];
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const p = pts[i];
      const midY = (prev.y + p.y) / 2;
      const done = isCompleted(i - 1);
      newSegments.push({
        d: `M ${prev.x} ${prev.y} C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`,
        done
      });
    }
    setSegments(newSegments);
  };

  useEffect(() => {
    // Wait for render to complete, then draw
    const timer = setTimeout(drawPath, 150);
    window.addEventListener("resize", drawPath);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", drawPath);
    };
  }, [state]);

  const handleNodeClick = (levelId) => {
    if (!KepoState.isUnlocked(state, levelId)) {
      alert("Level ini masih terkunci 🔒 Selesaikan level sebelumnya dulu!");
      return;
    }
    onNavigate("quiz", levelId);
  };

  return (
    <div style={{ background: '#0A0B10', minHeight: '100vh', paddingBottom: '4rem' }}>
      <section className="container-x" style={{ paddingTop: '3rem', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="chip">LEARNING PATH</div>
            <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 3.6rem)', marginTop: '1rem', maxWidth: '640px' }}>
              Peta <span className="neon-cyan">Petualangan Veritas</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', marginTop: '1rem' }}>
              8 level, 5 kategori. Setiap boss = mitos legendaris yang harus kamu robohkan.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div id="progress-badge" className="glass" style={{ padding: '.7rem 1rem', borderRadius: '12px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
              <span>{completedLevels.length}/{KEPO_LEVELS.length}</span> · <span className="neon-gold"><span>{state.xp}</span> XP</span>
            </div>
          </div>
        </div>
      </section>

      <div className="map-wrap">
        <div className="map-track" ref={trackRef} id="map-track">
          <svg
            className="map-svg"
            id="map-svg"
            width={svgSize.width}
            height={svgSize.height}
            viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
          >
            <defs>
              <linearGradient id="lg-done" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7CFFB2"/>
                <stop offset="1" stopColor="#00F0FF"/>
              </linearGradient>
              <linearGradient id="lg-pending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#22273A"/>
                <stop offset="1" stopColor="#22273A"/>
              </linearGradient>
            </defs>
            {segments.map((seg, idx) => (
              <path
                key={idx}
                d={seg.d}
                stroke={seg.done ? "url(#lg-done)" : "#22273A"}
                strokeWidth="3"
                fill="none"
                strokeDasharray={seg.done ? "0" : "6 8"}
                strokeLinecap="round"
              />
            ))}
          </svg>

          <div id="node-container">
            {KEPO_LEVELS.map((level, i) => {
              const isLvlCompleted = completedLevels.includes(level.id);
              const isLvlUnlocked = KepoState.isUnlocked(state, level.id);
              const side = i % 2 === 0 ? "right" : "left";
              const catObj = KEPO_CATEGORIES.find(c => c.id === level.category) || { emoji: "⭐", name: "Boss" };
              const isBoss = level.id === KEPO_LEVELS.length;

              return (
                <div key={level.id} className={`node-row ${side} reveal-up`} style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="node-blank"></div>
                  <button
                    ref={el => nodeRefs.current[i] = el}
                    className={`node-circle ${isLvlCompleted ? 'completed' : (isLvlUnlocked ? 'unlocked' : 'locked')} ${isBoss ? 'boss' : ''}`}
                    onClick={() => handleNodeClick(level.id)}
                    data-testid={`map-node-${level.id}`}
                    aria-disabled={!isLvlUnlocked}
                  >
                    {isLvlCompleted ? (
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0A0B10" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    ) : isLvlUnlocked ? (
                      level.id
                    ) : (
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                      </svg>
                    )}
                  </button>
                  <div className="node-info" style={{ display: 'flex', flexDirection: 'column', alignItems: side === 'right' ? 'flex-start' : 'flex-end' }}>
                    <div className="chip" style={{ borderColor: `${level.color}55`, color: level.color }}>
                      {catObj.emoji} {isBoss ? 'BOSS FINAL' : `LVL ${String(level.id).padStart(2, '0')}`}
                    </div>
                    <h3 style={{ marginTop: '.5rem' }}>{level.title}</h3>
                    <div className="sub">{level.subtitle}</div>
                    <div className="boss-line" style={{ color: level.color }}>
                      🎯 {level.boss} · <span style={{ color: '#FFD700' }}>{level.xp} XP</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
