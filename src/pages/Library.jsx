import React, { useState, useEffect } from 'react';
import { KEPO_CATEGORIES, KEPO_LIBRARY } from '../utils/data';

export default function Library({ initialCat }) {
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    if (initialCat) {
      setCurrentFilter(initialCat);
    }
  }, [initialCat]);

  const filters = [
    { id: "all",     name: "Semua",     emoji: "✨" },
    ...KEPO_CATEGORIES,
    { id: "myth",    name: "Mitos",     emoji: "✗" },
    { id: "fact",    name: "Fakta",     emoji: "✓" },
  ];

  const filteredItems = KEPO_LIBRARY.filter(l => {
    if (currentFilter === "all") return true;
    if (currentFilter === "myth" || currentFilter === "fact") return l.verdict === currentFilter;
    return l.category === currentFilter;
  });

  return (
    <div style={{ background: '#0A0B10', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="container-x" style={{ padding: '3rem 1.5rem 6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="chip">MYTH LIBRARY</div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: '1rem' }}>Koleksi <span className="neon-pink">Mitos Buster</span></h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: '560px' }}>Gulung-gulung kartu, tanpa quiz. Cocok buat kamu yang lagi kepo iseng.</p>
          </div>
        </div>

        {/* Filter chips */}
        <div id="filter-row" style={{ marginTop: '2.4rem', display: 'flex', gap: '.6rem', flexWrap: 'wrap' }}>
          {filters.map(f => {
            const active = f.id === currentFilter;
            return (
              <button
                key={f.id}
                className="chip"
                data-testid={`library-filter-${f.id}`}
                style={{
                  cursor: 'pointer',
                  padding: '.55rem 1rem',
                  fontSize: '.78rem',
                  background: active ? 'rgba(0,240,255,.14)' : undefined,
                  borderColor: active ? 'rgba(0,240,255,.55)' : undefined,
                  color: active ? '#00F0FF' : undefined
                }}
                onClick={() => setCurrentFilter(f.id)}
              >
                <span>{f.emoji}</span> {f.name}
              </button>
            );
          })}
        </div>

        {/* Library Grid */}
        <div id="lib-grid" style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {filteredItems.map((f, i) => {
            const isMyth = f.verdict === "myth";
            return (
              <div
                key={i}
                className="card reveal-up"
                style={{ animationDelay: `${i * 60}ms` }}
                data-testid={`library-card-${i}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '2.4rem' }}>{f.icon}</div>
                  <span className="chip" style={{ borderColor: isMyth ? 'rgba(255,92,122,.55)' : 'rgba(124,255,178,.55)', color: isMyth ? '#FF7095' : '#7CFFB2' }}>
                    {isMyth ? '✗ MITOS' : '✓ FAKTA'}
                  </span>
                </div>
                <h3 style={{ marginTop: '1.4rem', fontSize: '1.35rem', lineHeight: 1.15 }}>{f.title}</h3>
                <p style={{ marginTop: '.8rem', color: 'var(--text-secondary)', fontSize: '.92rem', lineHeight: 1.55 }}>{f.text}</p>
                <div
                  style={{
                    marginTop: '1.2rem',
                    height: '2px',
                    background: `linear-gradient(90deg, ${isMyth ? '#FF2A6D' : '#7CFFB2'}, transparent)`
                  }}
                ></div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
            Belum ada kartu untuk filter ini.
          </div>
        )}
      </section>
    </div>
  );
}
