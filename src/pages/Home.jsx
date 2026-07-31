import React, { useState, useEffect } from 'react';
import { KEPO_CATEGORIES, KEPO_LIBRARY } from '../utils/data';
import { CardIcon } from '../utils/icons';
import { Cpu, HeartPulse, FlaskConical, Landmark, Palette, ShieldCheck, Layers, Bot, FileCheck } from 'lucide-react';

const CAT_ICON_MAP = {
  tech:    { Icon: Cpu,          iconColor: "text-cyan-400",    gradFrom: "from-cyan-500/10",    gradTo: "to-cyan-950/30",    border: "border-cyan-500/30",    bar: "#00b4d8", glow: "rgba(0,180,216,0.25)" },
  health:  { Icon: HeartPulse,   iconColor: "text-emerald-400", gradFrom: "from-emerald-500/10", gradTo: "to-emerald-950/30", border: "border-emerald-500/30", bar: "#26c76e", glow: "rgba(38,199,110,0.25)" },
  science: { Icon: FlaskConical, iconColor: "text-purple-400",  gradFrom: "from-purple-500/10",  gradTo: "to-purple-950/30",  border: "border-purple-500/30",  bar: "#9b72ef", glow: "rgba(155,114,239,0.25)" },
  history: { Icon: Landmark,     iconColor: "text-amber-400",   gradFrom: "from-amber-500/10",   gradTo: "to-amber-950/30",   border: "border-amber-500/30",   bar: "#d4a200", glow: "rgba(212,162,0,0.25)" },
  culture: { Icon: Palette,      iconColor: "text-pink-400",    gradFrom: "from-pink-500/10",    gradTo: "to-pink-950/30",    border: "border-pink-500/30",    bar: "#e83e7c", glow: "rgba(232,62,124,0.25)" },
};

const SAMPLE_PROMPTS = [
  "Mitos vs Fakta otak 10%?",
  "Petir menyambar tempat sama?",
  "Membaca di tempat gelap merusak mata?",
  "Kopi beneran bikin dehidrasi?",
];

const FLIP_ITEMS = [
  {
    id: 1,
    myth: '"Manusia cuma pakai 10% kapasitas otak."',
    fact: "fMRI menunjukkan seluruh bagian otak aktif secara berkala. Tidak ada area otak yang menganggur.",
    source: "Journal of Neuroscience",
    category: "Sains 🧪",
  },
  {
    id: 2,
    myth: '"Petir gak pernah nyambar tempat sama 2x."',
    fact: "Petir bisa menyambar tempat yang sama berkali-kali. Empire State Building tersambar ~25×/tahun.",
    source: "NOAA Weather Service",
    category: "Sains 🧪",
  },
  {
    id: 3,
    myth: '"Membaca di tempat gelap merusak mata."',
    fact: "Hanya bikin mata lelah sementara, tidak menyebabkan kerusakan struktur penglihatan permanen.",
    source: "Academy of Ophthalmology",
    category: "Kesehatan 🩺",
  },
];

function HeroCardPreview() {
  const [promptIdx, setPromptIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentFullText = SAMPLE_PROMPTS[promptIdx];
    let timer;

    if (isTyping) {
      if (displayText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 55);
      } else {
        timer = setTimeout(() => setIsTyping(false), 2200);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length - 1));
        }, 30);
      } else {
        setIsTyping(true);
        setPromptIdx((prev) => (prev + 1) % SAMPLE_PROMPTS.length);
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isTyping, promptIdx]);

  // Auto flip card every 3.8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped((prev) => !prev);
      if (isFlipped) {
        setCardIdx((prev) => (prev + 1) % FLIP_ITEMS.length);
      }
    }, 3800);
    return () => clearInterval(interval);
  }, [isFlipped]);

  const item = FLIP_ITEMS[cardIdx];

  return (
    <div className="relative reveal-up delay-2 flex justify-center w-full">
      <div
        className="w-full max-w-sm rounded-3xl p-5 border relative backdrop-blur-xl transition-all duration-500"
        style={{
          background: 'linear-gradient(145deg, var(--bg-surface), var(--bg-elev))',
          borderColor: 'rgba(0,240,255,0.35)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.1), 0 0 35px rgba(0,240,255,0.18)',
          animation: 'float-slow 4s ease-in-out infinite',
        }}
      >
        {/* Top Veritas AI Prompt Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-default)' }}>
          <img src="/logo.svg" alt="Veritas+ Logo" style={{ height: '24px', objectFit: 'contain' }} />
          <span className="text-xs font-semibold mono" style={{ color: 'var(--text-secondary)' }}>
            {displayText}<span className="animate-pulse" style={{ color: 'var(--brand-primary)' }}>|</span>
          </span>
        </div>

        {/* 3D Flip Card Container */}
        <div style={{ perspective: '1000px', height: '200px' }}>
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            title="Klik untuk flip manual"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transition: 'transform 0.7s cubic-bezier(0.34, 1.25, 0.64, 1)',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              cursor: 'pointer',
            }}
          >
            {/* FRONT SIDE: MITOS */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                borderRadius: '18px',
                padding: '1.2rem',
                background: 'var(--bg-elev)',
                border: '1.5px solid rgba(255,42,109,0.35)',
                boxShadow: '0 4px 20px rgba(255,42,109,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: '.68rem', fontWeight: 900, color: 'var(--brand-secondary)', letterSpacing: '.08em' }}>
                    ✗ MITOS POPULER
                  </span>
                  <span style={{ fontSize: '.65rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.category}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.08rem', fontWeight: 800, marginTop: '.7rem', color: 'var(--text-primary)', fontFamily: "'Cabinet Grotesk', sans-serif", lineHeight: 1.35 }}>
                  {item.myth}
                </h4>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '.6rem', borderTop: '1px solid var(--border-default)' }}>
                <span className="mono" style={{ fontSize: '.65rem', color: 'var(--brand-secondary)', fontWeight: 800 }}>
                  MITOS
                </span>
              </div>
            </div>

            {/* BACK SIDE: FAKTA */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                borderRadius: '18px',
                padding: '1.2rem',
                background: 'var(--bg-elev)',
                border: '1.5px solid rgba(38,199,110,0.35)',
                boxShadow: '0 4px 20px rgba(38,199,110,0.08)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transform: 'rotateY(180deg)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: '.68rem', fontWeight: 900, color: 'var(--brand-mint)', letterSpacing: '.08em' }}>
                    ✓ FAKTA TERVERIFIKASI
                  </span>
                  <span style={{ fontSize: '.65rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {item.category}
                  </span>
                </div>
                <p style={{ fontSize: '.88rem', fontWeight: 600, marginTop: '.6rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                  {item.fact}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '.6rem', borderTop: '1px solid var(--border-default)' }}>
                <span style={{ fontSize: '.64rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  SOURCE · {item.source}
                </span>
                <span className="mono" style={{ fontSize: '.65rem', color: 'var(--brand-mint)', fontWeight: 800 }}>
                  ✓ FAKTA
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home({ onNavigate }) {
  const featured = KEPO_LIBRARY.slice(0, 3);

  const stats = {
    tech:    KEPO_LIBRARY.filter(l => l.category === "tech").length,
    health:  KEPO_LIBRARY.filter(l => l.category === "health").length,
    science: KEPO_LIBRARY.filter(l => l.category === "science").length,
    history: KEPO_LIBRARY.filter(l => l.category === "history").length,
    culture: KEPO_LIBRARY.filter(l => l.category === "culture").length,
  };

  return (
    <div>
      {/* HERO */}
      <section className="container-x" style={{ paddingTop: '7.5rem', paddingBottom: '3rem', position: 'relative' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '30px', right: '-20px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,240,255,0.13) 0%, transparent 65%)', filter: 'blur(24px)', zIndex: 0 }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,42,109,0.10) 0%, transparent 65%)', filter: 'blur(32px)', zIndex: 0 }}></div>

        <div className="hero-grid grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 items-center relative z-10">
          <div>
            <h1 className="reveal-up delay-1" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', marginTop: '1rem', lineHeight: 1.18 }}>
              Bedain <span className="neon-pink" style={{ fontStyle: 'italic' }}>Mitos</span><br/>
              dari <span className="neon-cyan">Fakta</span>,<br/>
              sambil main.
            </h1>

            <p className="reveal-up delay-2" style={{ marginTop: '2.2rem', fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '540px', lineHeight: 1.65 }}>
              <strong style={{ color: 'var(--brand-accent)', fontWeight: 800 }}>Veritas+</strong> ubah rasa penasaranmu jadi petualangan.
              Jelajahi 8 level di 5 kategori — Teknologi, Kesehatan, Sains, Sejarah, Budaya —
              lewat kartu 3D flip yang bikin ketagihan. Ditemani <em className="neon-cyan">Veritas AI</em> 24/7.
            </p>

            <div className="reveal-up delay-3" style={{ marginTop: '1.8rem', display: 'flex', gap: '.9rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn btn-primary" onClick={() => onNavigate("map")} data-testid="cta-start-journey">
                Mulai Petualangan
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button
                className="btn"
                onClick={() => onNavigate("library")}
                data-testid="cta-library"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1.5px solid var(--border-strong)',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 200ms ease',
                }}
              >
                Jelajahi Library
              </button>
            </div>
          </div>

          {/* Right Hero Dynamic Interactive Preview */}
          <HeroCardPreview />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee" style={{ marginTop: '2rem' }}>
        <div className="marquee-inner">
          <span><span className="dot"></span>ANTIBIOTIK BUKAN OBAT FLU</span>
          <span><span className="dot" style={{ background: '#FF2A6D', boxShadow: '0 0 12px #FF2A6D' }}></span>WORTEL ≠ KACAMATA GRATIS</span>
          <span><span className="dot" style={{ background: '#FFD700', boxShadow: '0 0 12px #FFD700' }}></span>10% OTAK ITU MITOS FILM</span>
          <span><span className="dot"></span>BULAN TETAP BERPUTAR</span>
          <span><span className="dot" style={{ background: '#FF2A6D', boxShadow: '0 0 12px #FF2A6D' }}></span>NAPOLEON GA PENDEK</span>
          <span><span className="dot" style={{ background: '#7CFFB2', boxShadow: '0 0 12px #7CFFB2' }}></span>KOPI BUKAN DEHIDRASI</span>
          <span><span className="dot"></span>VIKING TANPA HELM TANDUK</span>
          <span><span className="dot" style={{ background: '#FFD700', boxShadow: '0 0 12px #FFD700' }}></span>BATIK UNESCO 2009</span>
          {/* Duplicate set for seamless loop */}
          <span><span className="dot"></span>ANTIBIOTIK BUKAN OBAT FLU</span>
          <span><span className="dot" style={{ background: '#FF2A6D', boxShadow: '0 0 12px #FF2A6D' }}></span>WORTEL ≠ KACAMATA GRATIS</span>
          <span><span className="dot" style={{ background: '#FFD700', boxShadow: '0 0 12px #FFD700' }}></span>10% OTAK ITU MITOS FILM</span>
          <span><span className="dot"></span>BULAN TETAP BERPUTAR</span>
          <span><span className="dot" style={{ background: '#FF2A6D', boxShadow: '0 0 12px #FF2A6D' }}></span>NAPOLEON GA PENDEK</span>
          <span><span className="dot" style={{ background: '#7CFFB2', boxShadow: '0 0 12px #7CFFB2' }}></span>KOPI BUKAN DEHIDRASI</span>
          <span><span className="dot"></span>VIKING TANPA HELM TANDUK</span>
          <span><span className="dot" style={{ background: '#FFD700', boxShadow: '0 0 12px #FFD700' }}></span>BATIK UNESCO 2009</span>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="container-x" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="reveal-up mb-4">
          <div className="chip">03 STEPS</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem', maxWidth: '620px' }}>
            Ragu → Verifikasi → <span style={{ color: 'var(--brand-accent)' }}>Veritas+</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Step 1 */}
          <div className="card animate-reveal">
            <div className="mono" style={{ color: 'var(--brand-primary)', fontSize: '.8rem', fontWeight: 700 }}>01</div>
            <div style={{ marginTop: '1.2rem', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0,240,255,.1)', display: 'grid', placeItems: 'center', border: '1.5px solid rgba(0,240,255,.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand-primary)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '1.2rem' }}>Pilih Node di Peta</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem', fontSize: '.95rem' }}>Peta petualangan bercabang 8 level. Tiap node buka topik baru — dari mitos HP sampai sejarah yang lama kita percaya.</p>
          </div>
          {/* Step 2 */}
          <div className="card animate-reveal delay-1">
            <div className="mono" style={{ color: 'var(--brand-secondary)', fontSize: '.8rem', fontWeight: 700 }}>02</div>
            <div style={{ marginTop: '1.2rem', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,42,109,.1)', display: 'grid', placeItems: 'center', border: '1.5px solid rgba(255,42,109,.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand-secondary)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '1.2rem' }}>Tebak: Mitos atau Fakta?</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem', fontSize: '.95rem' }}>Kartu 3D flip yang bikin deg-degan. Salah? Santai — justru itu yang bakal paling nyangkut di kepala.</p>
          </div>
          {/* Step 3 */}
          <div className="card animate-reveal delay-2">
            <div className="mono" style={{ color: 'var(--brand-accent)', fontSize: '.8rem', fontWeight: 700 }}>03</div>
            <div style={{ marginTop: '1.2rem', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,215,0,.1)', display: 'grid', placeItems: 'center', border: '1.5px solid rgba(255,215,0,.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--brand-accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '1.2rem' }}>Kumpulin XP & Badge</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem', fontSize: '.95rem' }}>10 badge, streak counter, dan gelar <strong style={{color:'var(--brand-accent)'}}>'Raja Veritas+'</strong> menantimu. Progress tersimpan otomatis — bisa mulai kapan aja.</p>
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="container-x" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div className="chip">KATEGORI</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem' }}>Lima Zona, <span className="neon-cyan">Ratusan Kejutan.</span></h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {KEPO_CATEGORIES.map((c, i) => {
            const meta = CAT_ICON_MAP[c.id];
            const { Icon, iconColor, gradFrom, gradTo, border, bar, glow } = meta;
            return (
              <a
                key={c.id}
                href="#"
                onClick={(e) => { e.preventDefault(); onNavigate("library", c.id); }}
                className={`reveal-up group flex flex-col no-underline rounded-3xl p-5 border backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 cursor-pointer bg-gradient-to-b ${gradFrom} ${gradTo} ${border}`}
                style={{
                  animationDelay: `${i * 80}ms`,
                  boxShadow: `0 4px 20px ${glow}, 0 1px 4px rgba(0,0,0,0.15)`,
                  background: `linear-gradient(145deg, var(--bg-surface), var(--bg-elev))`,
                  borderColor: `${bar}33`,
                }}
                data-testid={`cat-card-${c.id}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="mono text-xs font-semibold" style={{ color: 'var(--text-muted)', letterSpacing: '.1em' }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${bar}22`, color: bar, border: `1px solid ${bar}44`, fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {stats[c.id]}+
                  </span>
                </div>

                <div
                  className="mb-4 p-3.5 rounded-2xl self-start shadow-md"
                  style={{
                    background: `${bar}18`,
                    border: `1.5px solid ${bar}33`,
                    boxShadow: `0 0 16px ${glow}`,
                  }}
                >
                  <Icon className={`w-8 h-8 ${iconColor}`} strokeWidth={1.6} />
                </div>

                <h3 className="font-bold text-base leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {c.name}
                </h3>

                <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  mitos populer
                </p>

                <div className="mt-auto pt-4">
                  <div
                    className="h-0.5 rounded-full w-full transition-all duration-300 group-hover:opacity-100 opacity-60"
                    style={{ background: `linear-gradient(90deg, ${bar}, transparent)` }}
                  />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="container-x" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div className="chip">TRENDING NOW</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem' }}>Mitos yang <span className="neon-pink">Hampir Semua Orang</span> Percaya</h2>
          </div>
          <button className="btn btn-ghost" onClick={() => onNavigate("library")} data-testid="cta-see-all-library">Lihat Semua →</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {featured.map((f, i) => {
            const isMyth = f.verdict === "myth";
            return (
              <div key={i} className="card reveal-up transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between" style={{ animationDelay: `${i * 90}ms` }} data-testid={`featured-card-${i}`}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <CardIcon emoji={f.icon} isMyth={isMyth} />
                    <span className="chip" style={{ borderColor: isMyth ? 'rgba(255,92,122,.5)' : 'rgba(124,255,178,.5)', color: isMyth ? '#FF7095' : '#7CFFB2' }}>{isMyth ? 'MITOS' : '✓ FAKTA'}</span>
                  </div>
                  <h3 style={{ marginTop: '1.4rem', fontSize: '1.35rem', lineHeight: 1.15 }}>{f.title}</h3>
                  <p style={{ marginTop: '.8rem', color: 'var(--text-secondary)', fontSize: '.92rem', lineHeight: 1.55 }}>{f.text}</p>
                </div>
                <div style={{ marginTop: '1.4rem', paddingTop: '.8rem', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: '.7rem', color: 'var(--text-muted)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
                    SOURCE · {f.source || 'VERITAS RESEARCH'}
                  </span>
                  <span style={{ fontSize: '.75rem', fontWeight: 700, color: isMyth ? 'var(--brand-red)' : 'var(--brand-mint)' }}>
                    {isMyth ? '✗ MITOS' : '✓ FAKTA'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* STATISTIK & DAMPAK LITERASI BANNER */}
      <section className="container-x my-12">
        <div
          style={{
            background: 'var(--bg-elev)',
            border: '1px solid var(--border-default)',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
            {/* Stat 1 */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '16px',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 250ms ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <ShieldCheck size={30} style={{ color: '#00b4d8', marginBottom: '8px' }} />
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>80+</div>
              <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '6px' }}>Mitos & Fakta Terverifikasi</div>
            </div>

            {/* Stat 2 */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '16px',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 250ms ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <Layers size={30} style={{ color: '#00f0ff', marginBottom: '8px' }} />
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>5</div>
              <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '6px' }}>Zona Kategori Edukasi</div>
            </div>

            {/* Stat 3 */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '16px',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 250ms ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <Bot size={30} style={{ color: '#9b72ef', marginBottom: '8px' }} />
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>24/7</div>
              <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '6px' }}>Veritas AI Assistant</div>
            </div>

            {/* Stat 4 */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-default)',
                borderRadius: '16px',
                padding: '1.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 250ms ease',
                boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
              }}
            >
              <FileCheck size={30} style={{ color: '#26c76e', marginBottom: '8px' }} />
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1 }}>100%</div>
              <div style={{ fontSize: '.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '6px' }}>Berbasis Data & Jurnal</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="container-x" style={{ paddingTop: '3rem', paddingBottom: '5rem', marginTop: '2rem' }}>
        
        {/* System Status Pill Row */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '999px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            fontSize: '.75rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 700,
            color: 'var(--text-secondary)',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#26c76e',
              boxShadow: '0 0 10px #26c76e',
              display: 'inline-block',
            }}></span>
            <span>Veritas+ Online</span>
          </div>
        </div>

        {/* Bottom Copyright Bar with Divider */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-default)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          color: 'var(--text-muted)',
          fontSize: '.85rem',
        }}>
          <div>
            © 2026{' '}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              style={{ color: 'var(--text-primary)', fontWeight: 800, textDecoration: 'none', transition: 'color 180ms ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#00F0FF'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
            >
              Veritas+
            </a>
            . Dibuat untuk yang nggak mau asal percaya.
          </div>
        </div>
      </footer>
    </div>
  );
}
