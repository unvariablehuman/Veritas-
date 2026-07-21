import React from 'react';
import { KEPO_CATEGORIES, KEPO_QUESTIONS, KEPO_LIBRARY } from '../utils/data';

export default function Home({ onNavigate }) {
  // Count questions per category
  const stats = { tech: 0, health: 0, science: 0, history: 0, culture: 0 };
  Object.values(KEPO_QUESTIONS).forEach(q => {
    if (stats[q.category] !== undefined) stats[q.category]++;
  });

  const featured = KEPO_LIBRARY.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="container-x" style={{ paddingTop: '4rem', paddingBottom: '3rem', position: 'relative' }}>
        <div aria-hidden="true" style={{ position: 'absolute', top: '30px', right: '-20px', width: '340px', height: '340px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,240,255,0.28) 0%, transparent 65%)', filter: 'blur(20px)', zIndex: 0 }}></div>
        <div aria-hidden="true" style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,42,109,0.22) 0%, transparent 65%)', filter: 'blur(30px)', zIndex: 0 }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '3rem', alignItems: 'center', position: 'relative', zIndex: 2 }} className="hero-grid">
          <div>
            <div className="reveal-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '.6rem', padding: '.45rem .9rem', borderRadius: '999px', border: '1px solid rgba(0,240,255,.35)', background: 'rgba(0,240,255,.06)', color: 'var(--brand-primary)', fontFamily: "'JetBrains Mono', monospace", fontSize: '.75rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-primary)', boxShadow: '0 0 10px var(--brand-primary)', animation: 'pulse-glow 2s infinite' }}></span>
              v1.0 · Untuk yang selalu Kritis
            </div>

            <h1 className="reveal-up delay-1" style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', marginTop: '1.5rem' }}>
              Bedain <span className="neon-pink" style={{ fontStyle: 'italic' }}>Mitos</span><br/>
              dari <span className="neon-cyan">Fakta</span>,<br/>
              sambil main.
            </h1>

            <p className="reveal-up delay-2" style={{ marginTop: '1.5rem', fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '540px', lineHeight: 1.65 }}>
              <strong style={{ color: '#fff' }}>Veritas+</strong> ubah rasa penasaranmu jadi petualangan.
              Jelajahi 8 level di 5 kategori — Teknologi, Kesehatan, Sains, Sejarah, Budaya —
              lewat kartu 3D flip yang bikin ketagihan. Ditemani <em className="neon-cyan">Veritas AI</em> 24/7.
            </p>

            <div className="reveal-up delay-3" style={{ marginTop: '2.2rem', display: 'flex', gap: '.9rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => onNavigate("map")} data-testid="cta-start-journey">
                Mulai Petualangan
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="btn btn-ghost" onClick={() => onNavigate("library")} data-testid="cta-library">
                Lihat Mitos Populer
              </button>
            </div>

            <div className="reveal-up delay-4" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', maxWidth: '520px' }}>
              <div>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-primary)' }}>8</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Level Peta</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-secondary)' }}>30+</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Mitos vs Fakta</div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--brand-accent)' }}>5</div>
                <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Kategori</div>
              </div>
            </div>
          </div>

          {/* Right side: floating preview card */}
          <div className="reveal-up delay-2 hero-preview" style={{ position: 'relative', height: '500px' }}>
            {/* Background decorative card */}
            <div className="floaty" style={{ position: 'absolute', top: '30px', right: '40px', width: '220px', height: '260px', borderRadius: '1.3rem', background: 'linear-gradient(160deg, rgba(255,42,109,.20), rgba(255,42,109,.02))', border: '1.5px solid rgba(255, 42, 109, 0.35)', padding: '1.4rem', boxShadow: '0 20px 60px rgba(255,42,109,.2)', backdropFilter: 'blur(12px)', animationDelay: '-1s' }}>
              <div className="chip" style={{ borderColor: 'rgba(255,42,109,.5)', color: '#FF7095' }}>MITOS</div>
              <div style={{ marginTop: '1rem', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '1.35rem', lineHeight: 1.15 }}>
                "10% otak yang kita pakai."
              </div>
              <div style={{ marginTop: '1rem', fontSize: '.8rem', color: 'var(--text-secondary)' }}>
                Faktanya, fMRI menunjukkan seluruh otak aktif.
              </div>
            </div>

            {/* Main flipped fact card */}
            <div className="floaty" style={{ position: 'absolute', bottom: '20px', left: '20px', width: '260px', borderRadius: '1.3rem', background: 'linear-gradient(160deg, rgba(124,255,178,.20), rgba(124,255,178,.02))', border: '1.5px solid rgba(124, 255, 178, 0.45)', padding: '1.6rem', boxShadow: '0 20px 60px rgba(124,255,178,.18)', backdropFilter: 'blur(12px)' }}>
              <div className="chip" style={{ borderColor: 'rgba(124,255,178,.55)', color: '#7CFFB2' }}>✓ FAKTA</div>
              <div style={{ marginTop: '1rem', fontFamily: "'Cabinet Grotesk', sans-serif", fontWeight: 900, fontSize: '1.5rem', lineHeight: 1.1 }}>
                Petir bisa menyambar tempat sama berkali-kali.
              </div>
              <div style={{ marginTop: '1rem', fontSize: '.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Empire State Building tersambar <span className="mono" style={{ color: '#FFD700', fontWeight: 700 }}>~25×/tahun.</span>
              </div>
              <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '.7rem', color: 'var(--text-muted)', letterSpacing: '.1em' }}>SOURCE · NOAA</span>
                <span style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(124,255,178,.15)', display: 'grid', placeItems: 'center', color: '#7CFFB2' }}>✓</span>
              </div>
            </div>

            {/* Kepo AI mini bubble */}
            <div className="floaty" style={{ position: 'absolute', top: 0, left: '90px', padding: '.8rem 1rem', borderRadius: '1rem', borderBottomLeftRadius: '.3rem', background: '#1A1D28', border: '1.5px solid rgba(0, 240, 255, 0.3)', boxShadow: '0 0 30px rgba(0,240,255,.15)', animationDelay: '-2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '.4rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'linear-gradient(135deg, #00F0FF, #FF2A6D)', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '.7rem', color: '#0A0B10' }}>V</div>
                <span style={{ fontSize: '.72rem', color: 'var(--brand-primary)', fontWeight: 700 }}>Veritas AI</span>
              </div>
              <div style={{ fontSize: '.82rem', maxWidth: '220px', lineHeight: 1.4 }}>
                Tanya aku apa aja soal <span className="neon-cyan">mitos</span>! 👇
              </div>
            </div>
          </div>
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
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="container-x" style={{ padding: '5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          <div>
            <div className="chip">03 STEPS</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem', maxWidth: '620px' }}>
              Ragu → Verifikasi → <span className="neon-cyan">Veritas</span>
            </h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>
            Gak ada rasa 'lagi belajar'. Yang ada, cuma rasa penasaran yang terus tumbuh.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Step 1 */}
          <div className="card animate-reveal">
            <div className="mono" style={{ color: 'var(--brand-primary)', fontSize: '.8rem', fontWeight: 700 }}>01</div>
            <div style={{ marginTop: '1.2rem', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(0,240,255,.1)', display: 'grid', placeItems: 'center', border: '1.5px solid rgba(0,240,255,.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '1.2rem' }}>Pilih Node di Peta</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem', fontSize: '.95rem' }}>Peta petualangan bercabang 8 level. Setiap node buka topik baru — dari HP semalaman sampai Tembok Cina.</p>
          </div>
          {/* Step 2 */}
          <div className="card animate-reveal delay-1">
            <div className="mono" style={{ color: 'var(--brand-secondary)', fontSize: '.8rem', fontWeight: 700 }}>02</div>
            <div style={{ marginTop: '1.2rem', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,42,109,.1)', display: 'grid', placeItems: 'center', border: '1.5px solid rgba(255,42,109,.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF2A6D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9l6 6M15 9l-6 6"/></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '1.2rem' }}>Tebak: Mitos atau Fakta?</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem', fontSize: '.95rem' }}>Kartu 3D flip yang bikin dramatis. Salah? Ga masalah — kamu bakal ingat penjelasannya lebih lama.</p>
          </div>
          {/* Step 3 */}
          <div className="card animate-reveal delay-2">
            <div className="mono" style={{ color: 'var(--brand-accent)', fontSize: '.8rem', fontWeight: 700 }}>03</div>
            <div style={{ marginTop: '1.2rem', width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,215,0,.1)', display: 'grid', placeItems: 'center', border: '1.5px solid rgba(255,215,0,.3)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.4rem', marginTop: '1.2rem' }}>Kumpulin XP & Badge</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '.5rem', fontSize: '.95rem' }}>10 badge, streak counter, dan gelar 'Raja Veritas' menantimu. Progress tersimpan di browser — gak ribet sign-up.</p>
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="container-x" style={{ padding: '3rem 1.5rem 5rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <div className="chip">KATEGORI</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '1rem' }}>Lima Zona, Ratusan Kejutan.</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.2rem' }}>
          {KEPO_CATEGORIES.map((c, i) => (
            <a
              key={c.id}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate("library", c.id); }}
              className="card reveal-up"
              style={{ animationDelay: `${i * 80}ms`, textDecoration: 'none', color: '#fff' }}
              data-testid={`cat-card-${c.id}`}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '2.4rem', lineHeight: 1 }}>{c.emoji}</div>
                <span className="mono" style={{ color: c.color, fontSize: '.75rem', letterSpacing: '.1em' }}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 style={{ marginTop: '1.5rem', fontSize: '1.4rem' }}>{c.name}</h3>
              <div style={{ marginTop: '.3rem', fontSize: '.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                {stats[c.id]}+ mitos populer
              </div>
              <div style={{ marginTop: '1.5rem', height: '3px', borderRadius: '3px', background: `linear-gradient(90deg, ${c.color}, transparent)` }}></div>
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED CARDS */}
      <section className="container-x" style={{ padding: '3rem 1.5rem 6rem' }}>
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
              <div key={i} className="card reveal-up" style={{ animationDelay: `${i * 90}ms` }} data-testid={`featured-card-${i}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '2.2rem' }}>{f.icon}</div>
                  <span className="chip" style={{ borderColor: isMyth ? 'rgba(255,92,122,.5)' : 'rgba(124,255,178,.5)', color: isMyth ? '#FF7095' : '#7CFFB2' }}>{isMyth ? 'MITOS' : '✓ FAKTA'}</span>
                </div>
                <h3 style={{ marginTop: '1.4rem', fontSize: '1.35rem', lineHeight: 1.15 }}>{f.title}</h3>
                <p style={{ marginTop: '.8rem', color: 'var(--text-secondary)', fontSize: '.92rem', lineHeight: 1.55 }}>{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container-x" style={{ padding: '3rem 1.5rem 6rem' }}>
        <div style={{ position: 'relative', padding: 'clamp(2rem, 5vw, 4.5rem)', borderRadius: '1.6rem', overflow: 'hidden', background: 'linear-gradient(135deg, #12141D 0%, #0F1119 100%)', border: '1.5px solid rgba(0, 240, 255, 0.35)', boxShadow: '0 0 80px rgba(0,240,255,.12)' }}>
          {/* glow blobs */}
          <div aria-hidden="true" style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,240,255,.4), transparent 65%)', filter: 'blur(30px)' }}></div>
          <div aria-hidden="true" style={{ position: 'absolute', bottom: '-100px', left: '-80px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,42,109,.35), transparent 65%)', filter: 'blur(30px)' }}></div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
            <div className="chip">SIAP MULAI?</div>
            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.6rem)', marginTop: '1.2rem' }}>Jangan cuma <span className="neon-pink">forward</span> pesan.<br/>Cek dulu, biar gak <span className="neon-cyan">kepo asal</span>.</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.05rem', maxWidth: '560px' }}>
              Setiap hari kamu terpapar puluhan klaim di grup keluarga, TikTok, dan berita. Veritas+ latih otakmu untuk otomatis bertanya: <em style={{ color: '#fff' }}>"bener, atau cuma katanya?"</em>
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => onNavigate("map")} data-testid="cta-bottom-start">
                Buka Peta Petualangan
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <button className="btn btn-ghost" onClick={() => onNavigate("quiz")} data-testid="cta-bottom-quiz">Coba Quiz Random</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="container-x" style={{ padding: '2rem 1.5rem 5rem', color: 'var(--text-muted)', fontSize: '.85rem', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>© 2026 <span style={{ color: '#fff' }}>Veritas+</span> · Dibuat untuk yang selalu bertanya.</div>
        <div className="mono">v1.0 · VERITAS-EDITION</div>
      </footer>
    </div>
  );
}
