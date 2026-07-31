import React, { useState, useEffect } from 'react';
import { KEPO_CATEGORIES, KEPO_LIBRARY } from '../utils/data';
import { CardIcon, FilterIcon } from '../utils/icons';

export default function Library({ initialCat }) {
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    if (initialCat) {
      setCurrentFilter(initialCat);
    }
  }, [initialCat]);

  const filters = [
    { id: "all",     name: "Semua"   },
    ...KEPO_CATEGORIES,
    { id: "myth",    name: "Mitos"   },
    { id: "fact",    name: "Fakta"   },
  ];

  const filteredItems = KEPO_LIBRARY.filter(l => {
    if (currentFilter === "all") return true;
    if (currentFilter === "myth" || currentFilter === "fact") return l.verdict === currentFilter;
    return l.category === currentFilter;
  });

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="container-x" style={{ paddingTop: '7.5rem', paddingBottom: '6rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="chip">MYTH LIBRARY</div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: '1rem', lineHeight: 1.15 }}>
              Koleksi <span className="neon-pink">Mitos Buster</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', maxWidth: '560px', lineHeight: 1.6 }}>
              Gulung-gulung kartu, tanpa quiz. Jelajahi mana mitos yang sering salah kaprah dan mana fakta sebenarnya.
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div id="filter-row" style={{ marginTop: '2.4rem', display: 'flex', gap: '.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {filters.map(f => {
            const active = f.id === currentFilter;
            return (
              <button
                key={f.id}
                data-testid={`library-filter-${f.id}`}
                style={{
                  cursor: 'pointer',
                  padding: '.5rem 1.1rem',
                  fontSize: '.8rem',
                  fontWeight: active ? 800 : 600,
                  fontFamily: "'JetBrains Mono', monospace",
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 180ms ease',
                  background: active ? 'var(--brand-primary)' : 'var(--bg-surface)',
                  color: active ? '#0A0B10' : 'var(--text-secondary)',
                  border: active ? '1px solid var(--brand-primary)' : '1px solid var(--border-default)',
                  boxShadow: active ? '0 4px 14px rgba(0,240,255,0.25)' : 'none',
                }}
                onClick={() => setCurrentFilter(f.id)}
              >
                <FilterIcon filterId={f.id} />
                {f.name}
              </button>
            );
          })}
        </div>

        {/* Library Grid */}
        <div id="lib-grid" style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredItems.map((f, i) => {
            const isMyth = f.verdict === "myth";
            return (
              <div
                key={i}
                className="card reveal-up transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                style={{
                  animationDelay: `${i * 60}ms`,
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-default)',
                  borderRadius: '20px',
                  padding: '1.4rem',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                }}
                data-testid={`library-card-${i}`}
              >
                <div>
                  {/* Top row: Icon + Verdict Chip */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <CardIcon emoji={f.icon} isMyth={isMyth} />
                    <span
                      style={{
                        fontSize: '.7rem',
                        fontWeight: 900,
                        fontFamily: "'JetBrains Mono', monospace",
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: isMyth ? 'rgba(255,42,109,0.12)' : 'rgba(38,199,110,0.12)',
                        border: `1px solid ${isMyth ? 'rgba(255,42,109,0.35)' : 'rgba(38,199,110,0.35)'}`,
                        color: isMyth ? 'var(--brand-red)' : 'var(--brand-mint)',
                        letterSpacing: '.05em',
                      }}
                    >
                      {isMyth ? '✗ MITOS' : '✓ FAKTA'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{
                    marginTop: '1.2rem',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    lineHeight: 1.25,
                    color: 'var(--text-primary)',
                  }}>
                    {f.title}
                  </h3>

                  {/* Body text */}
                  <p style={{
                    marginTop: '.7rem',
                    color: 'var(--text-secondary)',
                    fontSize: '.92rem',
                    lineHeight: 1.6,
                  }}>
                    {f.text}
                  </p>
                </div>

                {/* Card Footer (Clean single source line, no duplicate badge) */}
                <div style={{
                  marginTop: '1.4rem',
                  paddingTop: '.8rem',
                  borderTop: '1px solid var(--border-default)',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                }}>
                  <span className="mono" style={{ fontSize: '.68rem', color: 'var(--text-muted)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                    SOURCE · {f.source || 'VERITAS RESEARCH'}
                  </span>
                  <span className="mono" style={{ fontSize: '.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {f.category?.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'var(--bg-surface)',
            borderRadius: '20px',
            border: '1px dashed var(--border-default)',
            marginTop: '3rem',
            color: 'var(--text-muted)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '.9rem',
          }}>
            Belum ada kartu untuk filter ini. Coba pilih filter lain!
          </div>
        )}
      </section>
    </div>
  );
}
