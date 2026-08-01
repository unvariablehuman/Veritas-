import React, { useEffect, useRef, useState, useCallback } from 'react';
import { KEPO_LEVELS } from '../utils/data';
import * as KepoState from '../utils/state';
import {
  Cpu, HeartPulse, FlaskConical, Landmark, Palette, Star,
  Lock, CheckCircle, Play, Trophy, Zap, Swords, X, Printer, Award, Sparkles, Check,
  FileText, ChevronRight, LayoutDashboard
} from 'lucide-react';

/* ── Category meta ─────────────────────────────────────────── */
const CAT_META = {
  tech:    { Icon: Cpu,          color: '#00b4d8', shadow: 'rgba(0,180,216,0.45)',    bg: 'linear-gradient(135deg,#0096b7,#00d4f0)', border: '#006a80', label: 'Teknologi'  },
  health:  { Icon: HeartPulse,   color: '#26c76e', shadow: 'rgba(38,199,110,0.45)',  bg: 'linear-gradient(135deg,#1dac5e,#43e088)', border: '#167a42', label: 'Kesehatan'  },
  science: { Icon: FlaskConical, color: '#9b72ef', shadow: 'rgba(155,114,239,0.45)', bg: 'linear-gradient(135deg,#7c3aed,#b591ff)', border: '#5b21b6', label: 'Sains'      },
  history: { Icon: Landmark,     color: '#d4a200', shadow: 'rgba(212,162,0,0.45)',   bg: 'linear-gradient(135deg,#b38600,#ffd000)', border: '#8a6600', label: 'Sejarah'    },
  culture: { Icon: Palette,      color: '#e83e7c', shadow: 'rgba(232,62,124,0.45)',  bg: 'linear-gradient(135deg,#c41c5a,#ff5c9b)', border: '#9a1646', label: 'Budaya'     },
  mixed:   { Icon: Star,         color: '#e83e7c', shadow: 'rgba(232,62,124,0.45)',  bg: 'linear-gradient(135deg,#c41c5a,#a855f7)', border: '#9a1646', label: 'Campuran'   },
};

/* ── Section zone banners ───────────────────────────────────── */
const ZONE_BANNERS = {
  1: { label: 'ZONA PEMULA',    emoji: '🌱', color: '#26c76e', desc: 'Mulai petualanganmu di sini' },
  3: { label: 'ZONA KESEHATAN', emoji: '💊', color: '#26c76e', desc: 'Mitos seputar tubuh & pikiran' },
  5: { label: 'ZONA SEJARAH',   emoji: '⚔️', color: '#d4a200', desc: 'Cerita yang dibengkokkan waktu' },
  7: { label: 'ZONA FINAL',     emoji: '👾', color: '#e83e7c', desc: 'Boss fight terakhir menantimu' },
};

const DONE_GRADIENT = 'linear-gradient(135deg,#1dac5e,#00b4d8)';
const DONE_BORDER   = '#0c7040';

/* ─────────────────────────────────────────────────────────────
   NodeTooltip — rendered into a portal-like fixed overlay
────────────────────────────────────────────────────────────── */
function NodeTooltip({ level, isCompleted, isUnlocked, onStart, onClose, anchorRect, onOpenVictory }) {
  const meta    = CAT_META[level.category] || CAT_META.mixed;
  const CatIcon = meta.Icon;
  const TIP_W   = 220;
  const TIP_H   = 260;

  if (!anchorRect) return null;

  const viewportW = window.innerWidth;
  const rightSpace  = viewportW - anchorRect.right;
  const leftSpace   = anchorRect.left;
  let left, top;

  if (rightSpace >= TIP_W + 16) {
    left = anchorRect.right + 10;
  } else if (leftSpace >= TIP_W + 16) {
    left = anchorRect.left - TIP_W - 10;
  } else {
    left = anchorRect.left + anchorRect.width / 2 - TIP_W / 2;
  }

  left = Math.max(8, Math.min(left, viewportW - TIP_W - 8));
  top = anchorRect.top + anchorRect.height / 2 - TIP_H / 2;
  top = Math.max(8, Math.min(top, window.innerHeight - TIP_H - 8));

  return (
    <div
      style={{
        position: 'fixed',
        top,
        left,
        zIndex: 9000,
        width: TIP_W,
        background: 'var(--bg-surface)',
        backdropFilter: 'blur(18px)',
        border: `1.5px solid ${meta.color}50`,
        borderRadius: '18px',
        padding: '1rem',
        boxShadow: `0 12px 48px rgba(0,0,0,0.35), 0 0 0 1px ${meta.color}20`,
        animation: 'tooltipPop 180ms cubic-bezier(0.34,1.56,0.64,1) both',
      }}
      onClick={e => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 8, right: 8,
          background: 'var(--border-default)', border: 'none', borderRadius: '50%',
          width: 22, height: 22, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', transition: 'background 150ms',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--border-strong)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--border-default)'}
      >
        <X size={11} strokeWidth={2.5} />
      </button>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '2px 8px', borderRadius: '999px',
        background: `${meta.color}18`, border: `1px solid ${meta.color}35`,
        color: meta.color, fontSize: '.64rem', fontWeight: 800,
        fontFamily: "'JetBrains Mono', monospace", marginBottom: '.4rem',
      }}>
        <CatIcon size={10} />
        {meta.label.toUpperCase()}
      </div>

      <div style={{
        fontSize: '.72rem', fontWeight: 800,
        fontFamily: "'JetBrains Mono', monospace",
        color: isCompleted ? 'var(--brand-mint)' : meta.color,
        marginBottom: '2px',
      }}>
        {level.id === 8 ? '👾 BOSS LEVEL' : `LEVEL ${String(level.id).padStart(2,'0')}`}
      </div>

      <h4 style={{
        fontSize: '1rem', fontWeight: 800,
        color: 'var(--text-primary)',
        fontFamily: "'Cabinet Grotesk', sans-serif",
        lineHeight: 1.25, margin: 0,
      }}>
        {level.title}
      </h4>

      <p style={{
        fontSize: '.74rem', color: 'var(--text-secondary)',
        margin: '.3rem 0 .8rem', lineHeight: 1.45,
      }}>
        {level.subtitle}
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '.4rem .6rem', background: 'var(--bg-elev)',
        borderRadius: '8px', border: '1px solid var(--border-default)',
        marginBottom: '.8rem', fontSize: '.7rem',
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Target XP:</span>
        <span style={{ fontWeight: 800, color: 'var(--brand-accent)' }}>+{level.xp} XP</span>
      </div>

      {isUnlocked ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={onStart}
            style={{
              width: '100%', padding: '.55rem 0', borderRadius: '10px',
              background: isCompleted ? DONE_GRADIENT : meta.bg,
              border: `1.5px solid ${isCompleted ? DONE_BORDER : meta.border}`,
              borderBottomWidth: '4px',
              color: '#fff', fontSize: '.78rem', fontWeight: 900,
              fontFamily: "'Cabinet Grotesk', sans-serif",
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'transform 100ms, border-bottom-width 100ms',
              letterSpacing: '.02em',
              textShadow: '0 1px 2px rgba(0,0,0,0.35)',
            }}
          >
            {isCompleted
              ? <><CheckCircle size={14} strokeWidth={2.5} /> MAIN LAGI</>
              : <><Play size={13} fill="#fff" strokeWidth={0} /> MULAI</>
            }
          </button>

          {/* If level 8 is completed, show button to open Victory Master Cert */}
          {level.id === 8 && isCompleted && (
            <button
              onClick={onOpenVictory}
              style={{
                width: '100%', padding: '.45rem 0', borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(0,240,255,0.15))',
                border: '1.5px solid #FFD700',
                color: '#FFD700', fontSize: '.72rem', fontWeight: 800,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}
            >
              <Trophy size={12} /> SERTIFIKAT MASTER
            </button>
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center', fontSize: '.72rem',
          color: 'var(--text-muted)', fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          padding: '.4rem 0',
          background: 'var(--border-default)',
          borderRadius: '8px',
        }}>
          Selesaikan level sebelumnya
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ECertificateModal — Official E-Certificate Card
────────────────────────────────────────────────────────────── */
export function ECertificateModal({ state, onClose }) {
  const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

  /* Hide navbar and lock body scroll while this modal is open */
  React.useEffect(() => {
    const header = document.querySelector('header');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (header) {
      header.style.visibility   = 'hidden';
      header.style.pointerEvents = 'none';
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      if (header) {
        header.style.visibility   = '';
        header.style.pointerEvents = '';
      }
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="ecertificate-modal"
      className="print:w-full print:h-screen print:flex print:flex-col print:justify-center print:items-center print:bg-slate-900 print:inset-0 print:p-0 print:m-0 print:border-none print:shadow-none"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 7, 15, 0.9)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="ecert-card print:w-full print:max-w-4xl print:bg-slate-900 print:p-6 print:border-2 print:border-yellow-400 print:shadow-none print:rounded-2xl"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(145deg, #0d121f 0%, #151d30 100%)',
          border: '2px solid rgba(255,215,0,0.65)',
          borderRadius: '20px',
          padding: '1.5rem 1.2rem',
          boxShadow: '0 25px 70px rgba(0,0,0,0.7), 0 0 60px rgba(255,215,0,0.25)',
          position: 'relative',
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {/* Glow corner highlights */}
        <div className="no-print print:hidden" style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,240,255,0.2), transparent 70%)', filter: 'blur(25px)' }} />
        <div className="no-print print:hidden" style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,215,0,0.2), transparent 70%)', filter: 'blur(25px)' }} />

        {/* Close Button */}
        <button
          className="no-print print:hidden"
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%', width: 28, height: 28, color: '#fff', cursor: 'pointer',
            display: 'grid', placeItems: 'center', transition: 'all 150ms',
            zIndex: 10,
          }}
        >
          <X size={14} />
        </button>

        {/* Certificate Frame Box */}
        <div
          className="ecert-frame print:p-6 print:border-dashed print:border-yellow-400/60"
          style={{
            border: '1.5px dashed rgba(255,215,0,0.4)',
            borderRadius: '16px',
            padding: '1.2rem 1.1rem',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.02)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 12px', borderRadius: '999px', background: 'rgba(255,215,0,0.14)', border: '1px solid rgba(255,215,0,0.45)', color: '#FFD700', fontSize: '.7rem', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.06em' }}>
            <Trophy size={12} /> VERITAS+ OFFICIAL CERTIFICATE
          </div>

          <h2 style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.8rem)', fontWeight: 900, marginTop: '.6rem', color: '#fff', fontFamily: "'Cabinet Grotesk', sans-serif", letterSpacing: '.04em' }}>
            SERTIFIKAT KELULUSAN
          </h2>
          <p style={{ color: 'var(--brand-primary)', fontWeight: 800, fontSize: '.78rem', marginTop: '.2rem', letterSpacing: '.08em', fontFamily: "'JetBrains Mono', monospace" }}>
            GELAR: VERITAS MASTER (100% PATH COMPLETE)
          </p>

          <div style={{ margin: '1rem 0', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.12em', fontFamily: "'JetBrains Mono', monospace" }}>DIBERIKAN KEPADA CHAMPION:</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFD700', marginTop: '.25rem', fontFamily: "'Cabinet Grotesk', sans-serif", textShadow: '0 0 15px rgba(255,215,0,0.4)' }}>
              VERITAS CHAMPION
            </h3>
            <p style={{ fontSize: '.82rem', color: '#cbd5e1', marginTop: '.4rem', maxWidth: '440px', margin: '.4rem auto 0', lineHeight: 1.45 }}>
              Atas keberhasilan menuntaskan <strong>seluruh 8 Level Petualangan</strong> dan memverifikasi ratusan fakta Mitos vs Fakta di platform <strong>Veritas+</strong>.
            </p>
          </div>

          {/* Certificate Badge Seal & Stats Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '.8rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '.6rem', color: '#94a3b8', display: 'block', fontFamily: "'JetBrains Mono', monospace" }}>TOTAL REWARD XP</span>
              <strong style={{ fontSize: '1rem', color: '#FFD700', fontFamily: "'Cabinet Grotesk', sans-serif", display: 'inline-flex', alignItems: 'center', gap: 4 }}><Star size={14} fill="#FFD700" /> {state.xp || 680} XP</strong>
            </div>

            {/* Golden Trophy Seal */}
            <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, #FFD700, #F59E0B)', display: 'grid', placeItems: 'center', boxShadow: '0 0 20px rgba(255,215,0,0.5)', border: '2px solid #fff' }}>
              <Trophy size={22} color="#000" strokeWidth={2.4} />
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '.6rem', color: '#94a3b8', display: 'block', fontFamily: "'JetBrains Mono', monospace" }}>TANGGAL TERBIT</span>
              <strong style={{ fontSize: '.82rem', color: '#fff', fontFamily: "'JetBrains Mono', monospace" }}>{dateStr}</strong>
            </div>
          </div>
        </div>

        {/* Action Button inside cert modal */}
        <div className="no-print print:hidden" style={{ marginTop: '1rem', display: 'flex', gap: '.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary no-print print:hidden"
            onClick={handlePrint}
            style={{
              background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
              color: '#000',
              fontWeight: 900,
              fontSize: '.85rem',
              padding: '.6rem 1.3rem',
              boxShadow: '0 4px 16px rgba(255,215,0,0.3)',
            }}
          >
            <Printer size={15} /> Cetak / Simpan Sertifikat
          </button>
          <button className="btn btn-ghost no-print print:hidden" onClick={onClose} style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: '.85rem', padding: '.55rem 1.2rem' }}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VictoryModal — Glassmorphism Celebration Modal
────────────────────────────────────────────────────────────── */
function VictoryModal({ state, onNavigate, onClose, onOpenCert }) {
  /* Hide navbar and lock body scroll while this modal is open */
  React.useEffect(() => {
    const header = document.querySelector('header');
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (header) {
      header.style.visibility   = 'hidden';
      header.style.pointerEvents = 'none';
    }
    return () => {
      document.body.style.overflow = prevOverflow;
      if (header) {
        header.style.visibility   = '';
        header.style.pointerEvents = '';
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 7, 15, 0.88)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'linear-gradient(145deg, var(--bg-surface), var(--bg-elev))',
          border: '2px solid rgba(255, 215, 0, 0.45)',
          borderRadius: '20px',
          padding: '1.5rem 1.3rem 1.2rem',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 45px rgba(255,215,0,0.2)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow backdrop */}
        <div style={{
          position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
          width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,215,0,0.2), transparent 70%)',
          filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 12,
            background: 'var(--bg-elev)', border: '1px solid var(--border-default)',
            borderRadius: '50%', width: 28, height: 28, color: 'var(--text-muted)',
            cursor: 'pointer', display: 'grid', placeItems: 'center',
          }}
        >
          <X size={14} />
        </button>

        {/* Trophy icon */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: '.6rem',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(0,240,255,0.15))',
            border: '2px solid #FFD700',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 0 30px rgba(255,215,0,0.5)',
            animation: 'bounce-gentle 3s ease-in-out infinite',
          }}>
            <Trophy size={30} color="#FFD700" strokeWidth={2.2} />
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(1.15rem, 3.8vw, 1.45rem)', fontWeight: 900,
          color: 'var(--text-primary)', fontFamily: "'Cabinet Grotesk', sans-serif",
          lineHeight: 1.2, position: 'relative', zIndex: 1, margin: 0,
        }}>
          Selamat! Kamu Resmi Menjadi
          <br />
          <span style={{ color: '#FFD700' }}>Veritas Master</span>
        </h2>
        <p style={{
          color: 'var(--text-secondary)', marginTop: '.35rem', fontSize: '.82rem',
          lineHeight: 1.4, position: 'relative', zIndex: 1,
        }}>
          Kamu telah memverifikasi seluruh mitos &amp; fakta dari 5 Zona di peta petualangan.
        </p>

        {/* XP & Stats Badge */}
        <div style={{
          margin: '.9rem 0 0',
          padding: '.6rem .9rem',
          borderRadius: '12px',
          background: 'var(--bg-elev)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: '.6rem',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '.6rem', color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
              display: 'block', marginBottom: '.1rem', letterSpacing: '.05em',
            }}>PATH PROGRESS</span>
            <strong style={{
              fontSize: '.95rem', color: 'var(--brand-mint)',
              fontFamily: "'Cabinet Grotesk', sans-serif",
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <CheckCircle size={13} /> 8 / 8 Level
            </strong>
          </div>

          <div style={{ width: '1px', height: '26px', background: 'var(--border-default)', flexShrink: 0 }} />

          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '.6rem', color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
              display: 'block', marginBottom: '.1rem', letterSpacing: '.05em',
            }}>TOTAL REWARD</span>
            <strong style={{
              fontSize: '.95rem', color: '#FFD700',
              fontFamily: "'Cabinet Grotesk', sans-serif",
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <Star size={13} fill="#FFD700" /> {state.xp || 680} XP
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: '.55rem',
          marginTop: '.9rem', position: 'relative', zIndex: 1,
        }}>
          <button
            className="btn btn-primary"
            onClick={onOpenCert}
            style={{
              background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
              color: '#000',
              fontWeight: 900,
              fontSize: '.85rem',
              padding: '.6rem 1rem',
              boxShadow: '0 4px 16px rgba(255,215,0,0.3)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              borderRadius: '10px',
            }}
          >
            <FileText size={14} /> Unduh Sertifikat Kelulusan
          </button>

          <button
            className="btn"
            onClick={() => { onClose(); onNavigate('quiz'); }}
            style={{
              background: 'var(--bg-surface)',
              border: '1.5px solid var(--brand-secondary)',
              color: 'var(--brand-secondary)',
              fontWeight: 800,
              fontSize: '.82rem',
              padding: '.55rem 1rem',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              borderRadius: '10px',
            }}
          >
            <Zap size={14} /> Coba Quiz Cepat Harian
          </button>

          <button
            onClick={() => { onClose(); onNavigate('dashboard'); }}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '.78rem',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              padding: '.15rem',
              transition: 'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#00F0FF'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <LayoutDashboard size={13} /> Lihat Progres Selengkapnya di Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Map page
────────────────────────────────────────────────────────────── */
export default function Map({ onNavigate, state }) {
  const containerRef = useRef(null);
  const nodeRefs     = useRef([]);
  const [paths, setPaths]               = useState([]);
  const [tooltip, setTooltip]           = useState(null); // { index, anchorRect }
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showCertModal, setShowCertModal]       = useState(false);

  const normState       = KepoState.normalizeState(state);
  const completedLevels = normState.completedLevels;
  const isAllCompleted = completedLevels.length >= 8 || completedLevels.includes(8);

  /* ── Active level: first unlocked and NOT completed ──────── */
  const activeIndex = KEPO_LEVELS.findIndex(
    l => KepoState.isUnlocked(normState, l.id) && !completedLevels.includes(l.id)
  );

  /* ── S-curve offset per node ─────────────────────────────── */
  const getSCurveX = (i) => Math.sin(i * 1.6) * 110;

  /* ── Draw SVG curved paths between nodes ─────────────────── */
  const drawPaths = useCallback(() => {
    if (!containerRef.current) return;
    const cr = containerRef.current.getBoundingClientRect();

    const pts = nodeRefs.current
      .map(n => {
        if (!n) return null;
        const r = n.getBoundingClientRect();
        return {
          x: r.left - cr.left + r.width  / 2,
          y: r.top  - cr.top  + r.height / 2,
        };
      })
      .filter(Boolean);

    const newPaths = [];
    for (let i = 1; i < pts.length; i++) {
      const a   = pts[i - 1];
      const b   = pts[i];
      const prevLevelId = KEPO_LEVELS[i - 1].id;
      const currLevelId = KEPO_LEVELS[i].id;
      // Segment from prev to curr is green if prevLevel is completed
      const done = completedLevels.includes(prevLevelId) && (completedLevels.includes(currLevelId) || KepoState.isUnlocked(normState, currLevelId));
      const cy  = (a.y + b.y) / 2;
      const dx  = (b.x - a.x) * 0.55;
      newPaths.push({
        d: `M ${a.x} ${a.y} C ${a.x + dx} ${cy}, ${b.x - dx} ${cy}, ${b.x} ${b.y}`,
        done,
      });
    }
    setPaths(newPaths);
  }, [completedLevels, normState]);

  useEffect(() => {
    const t = setTimeout(drawPaths, 120);
    window.addEventListener('resize', drawPaths);
    return () => { clearTimeout(t); window.removeEventListener('resize', drawPaths); };
  }, [drawPaths]);

  /* ── Close tooltip on outside click OR scroll ─────────── */
  useEffect(() => {
    const handle = () => setTooltip(null);
    document.addEventListener('click', handle);
    window.addEventListener('scroll', handle, { passive: true });
    return () => {
      document.removeEventListener('click', handle);
      window.removeEventListener('scroll', handle);
    };
  }, []);

  const handleNodeClick = (level, i, e) => {
    e.stopPropagation();
    if (tooltip?.index === i) {
      setTooltip(null);
      return;
    }
    // If level 8 (boss node) is clicked and path is complete, open victory modal directly
    if (level.id === 8 && completedLevels.includes(8)) {
      setShowVictoryModal(true);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ index: i, anchorRect: rect });
  };

  const handleStart = (levelId) => {
    setTooltip(null);
    if (!KepoState.isUnlocked(state, levelId)) return;
    // If starting level 8 and already completed, open victory modal
    if (levelId === 8 && completedLevels.includes(8)) {
      setShowVictoryModal(true);
      return;
    }
    onNavigate('quiz', levelId);
  };

  /* ── Layout: cumulative node positions with extra slot for zone banners ── */
  const NODE_GAP   = 155; // gap between consecutive nodes
  const ZONE_SLOT  = 85;  // extra vertical space reserved for a zone banner

  const nodeTops = KEPO_LEVELS.reduce((acc, level, i) => {
    if (i === 0) {
      acc.push(ZONE_BANNERS[level.id] ? 145 : 75);
    } else {
      const prev = acc[i - 1];
      const extra = ZONE_BANNERS[level.id] ? ZONE_SLOT : 0;
      acc.push(prev + NODE_GAP + extra);
    }
    return acc;
  }, []);

  const containerHeight = nodeTops[nodeTops.length - 1] + 210;

  return (
    <div style={{ paddingTop: '5.5rem', paddingBottom: '5rem', minHeight: '100vh', position: 'relative' }}>
      
      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="container-x" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="chip">PETA PETUALANGAN</div>
        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', marginTop: '.6rem' }}>
          Jelajahi <span className="neon-cyan">8 Level</span> Mitos & Fakta
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '.6rem', fontSize: '1.05rem', maxWidth: '520px', margin: '.6rem auto 0' }}>
          Selesaikan setiap node untuk membuka zona berikutnya. Kumpulkan XP dan klaim badge eksklusif!
        </p>

        {/* Global path progress pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '.8rem',
          marginTop: '1rem', padding: '.45rem 1.1rem',
          borderRadius: '999px', background: 'var(--bg-surface)',
          border: '1.5px solid var(--border-strong)',
          fontSize: '.82rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
        }}>
          <span style={{ color: 'var(--text-muted)' }}>PROGRESS PETA:</span>
          <span style={{ color: isAllCompleted ? '#FFD700' : 'var(--brand-mint)' }}>{completedLevels.length} / 8 LEVEL</span>
          <div style={{ width: '80px', height: '6px', borderRadius: '3px', background: 'var(--border-default)', overflow: 'hidden' }}>
            <div style={{ width: `${(completedLevels.length / 8) * 100}%`, height: '100%', background: isAllCompleted ? 'linear-gradient(90deg, #FFD700, #00F0FF)' : 'var(--brand-mint)', transition: 'width 400ms ease' }} />
          </div>
        </div>
      </div>

      {/* ── Path Container (max-width 660px for S-curve width) ── */}
      <div style={{ maxWidth: '660px', margin: '0 auto', padding: '0 1rem' }}>
        <div
          ref={containerRef}
          style={{
            position: 'relative',
            width: '100%',
            height: `${containerHeight}px`,
          }}
        >
          {/* SVG background connecting curves */}
          <svg
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 1,
            }}
          >
            <defs>
              <linearGradient id="pathGradientDone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#1dac5e" />
                <stop offset="100%" stopColor="#00b4d8" />
              </linearGradient>
            </defs>

            {paths.map((p, i) => (
              <React.Fragment key={i}>
                {/* Thick background glow track */}
                <path
                  d={p.d}
                  fill="none"
                  stroke={p.done ? 'rgba(38,199,110,0.25)' : 'var(--border-default)'}
                  strokeWidth={p.done ? 14 : 10}
                  strokeLinecap="round"
                />
                {/* Main path line */}
                <path
                  d={p.d}
                  fill="none"
                  stroke={p.done ? 'url(#pathGradientDone)' : 'var(--border-strong)'}
                  strokeWidth={p.done ? 7 : 5}
                  strokeDasharray={p.done ? 'none' : '8 6'}
                  strokeLinecap="round"
                />
              </React.Fragment>
            ))}
          </svg>

          {/* ── Render Path Nodes & Banners ──────────────────── */}
          {KEPO_LEVELS.map((level, i) => {
            const isCompleted = completedLevels.includes(level.id);
            const isUnlocked  = KepoState.isUnlocked(normState, level.id);
            const isActive    = i === activeIndex;
            const isBoss      = level.id === 8;
            const meta        = CAT_META[level.category] || CAT_META.mixed;
            const CatIcon     = meta.Icon;

            const topPx       = nodeTops[i];
            const xOffset     = getSCurveX(i);
            const banner      = ZONE_BANNERS[level.id];

            /* Node dimensions */
            const btnSize = isBoss ? 84 : isActive ? 76 : 68;

            /* Zone banner positioning: sits above node & badge */
            const bannerTop = topPx - (isActive ? 122 : 78);

            return (
              <React.Fragment key={level.id}>

                {/* ── Compact Floating Zone Banner Pill ───────────── */}
                {banner && (
                  <div
                    style={{
                      position: 'absolute',
                      top: `${bannerTop}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 18px',
                      borderRadius: '999px',
                      background: 'var(--bg-surface)',
                      backdropFilter: 'blur(16px)',
                      border: `1.5px solid ${banner.color}44`,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.12), 0 0 15px ${banner.color}22`,
                      fontSize: '.75rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                    }}>
                      <span>{banner.emoji}</span>
                      <span style={{ color: banner.color, letterSpacing: '.06em' }}>{banner.label}</span>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>—</span>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '.72rem' }}>{banner.desc}</span>
                    </div>
                  </div>
                )}

                {/* ── Node Button Container ────────────────────────── */}
                <div
                  ref={el => (nodeRefs.current[i] = el)}
                  style={{
                    position: 'absolute',
                    top: `${topPx}px`,
                    left: `calc(50% + ${xOffset}px)`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isActive ? 20 : 10,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                  }}>

                    {/* ── Single Merged Badge ABOVE Node ────────────── */}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        top: -38,
                        whiteSpace: 'nowrap',
                        zIndex: 30,
                        animation: 'bounce-gentle 1.8s ease-in-out infinite',
                      }}>
                        <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '5px 14px',
                          borderRadius: '999px',
                          background: 'linear-gradient(135deg, #FF9500, #FFD700)',
                          color: '#0A0B10',
                          fontSize: '.75rem',
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 900,
                          boxShadow: '0 4px 16px rgba(255,149,0,0.5)',
                          letterSpacing: '.04em',
                        }}>
                          <span>▶</span> MULAI · +{level.xp} XP
                        </div>
                      </div>
                    )}

                    {/* Outer glowing pulsing ring for active node */}
                    {isActive && (
                      <div style={{
                        position: 'absolute',
                        width: btnSize + 24,
                        height: btnSize + 24,
                        borderRadius: '50%',
                        border: `2px solid ${meta.color}`,
                        animation: 'ring-pulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
                        pointerEvents: 'none',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }} />
                    )}

                    {/* Node 3D Glossy Button */}
                    <button
                      onClick={e => handleNodeClick(level, i, e)}
                      aria-label={`${level.title} - Level ${level.id}`}
                      style={{
                        width:  `${btnSize}px`,
                        height: `${btnSize}px`,
                        borderRadius: '50%',
                        border: isCompleted
                          ? `3px solid ${DONE_BORDER}`
                          : isUnlocked
                            ? `3px solid ${meta.border}`
                            : '3px solid var(--border-strong)',
                        borderBottomWidth: isUnlocked ? '7px' : '4px',
                        background: isCompleted
                          ? DONE_GRADIENT
                          : isUnlocked
                            ? meta.bg
                            : 'var(--bg-elev)',
                        boxShadow: isCompleted
                          ? `0 6px 24px rgba(38,199,110,0.4)`
                          : isActive
                            ? `0 8px 32px ${meta.shadow}, 0 0 24px ${meta.color}`
                            : isUnlocked
                              ? `0 4px 16px ${meta.shadow}`
                              : 'none',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
                        transform: isActive ? 'scale(1.08)' : 'scale(1)',
                      }}
                      onMouseDown={e => {
                        if (isUnlocked) {
                          e.currentTarget.style.transform = 'scale(0.95)';
                          e.currentTarget.style.borderBottomWidth = '3px';
                        }
                      }}
                      onMouseUp={e => {
                        if (isUnlocked) {
                          e.currentTarget.style.transform = isActive ? 'scale(1.08)' : 'scale(1)';
                          e.currentTarget.style.borderBottomWidth = '7px';
                        }
                      }}
                    >
                      {/* Gloss highlight arc at top of button */}
                      <div aria-hidden="true" style={{
                        position: 'absolute',
                        top: '4px', left: '15%', right: '15%', height: '35%',
                        borderRadius: '50%',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 100%)',
                        pointerEvents: 'none',
                      }} />

                      {/* Icon inside node button */}
                      {isCompleted ? (
                        <CheckCircle size={isBoss ? 36 : 28} color="#fff" strokeWidth={2.8} />
                      ) : isUnlocked ? (
                        isBoss ? (
                          <Swords size={34} color="#fff" strokeWidth={2.4} />
                        ) : (
                          <CatIcon size={26} color="#fff" strokeWidth={2.4} />
                        )
                      ) : (
                        <Lock size={22} color="var(--text-muted)" strokeWidth={2.2} />
                      )}

                      {/* XP badge top-right — hidden when active */}
                      {isUnlocked && !isCompleted && !isActive && (
                        <div style={{
                          position: 'absolute', top: -6, right: -6,
                          background: 'var(--brand-accent)', color: '#0A0B10',
                          fontSize: '.55rem', fontWeight: 900,
                          padding: '2px 6px', borderRadius: '8px',
                          fontFamily: "'JetBrains Mono', monospace",
                          lineHeight: 1.4,
                          boxShadow: '0 2px 10px rgba(255,215,0,0.45)',
                          pointerEvents: 'none',
                          zIndex: 12,
                        }}>
                          +{level.xp}
                        </div>
                      )}
                    </button>

                    {/* ── Level label under node ────────────────── */}
                    <div style={{
                      marginTop: '16px',
                      fontSize: '.6rem',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 800,
                      letterSpacing: '.07em',
                      color: isCompleted ? 'var(--brand-mint)' : isUnlocked ? meta.color : 'var(--text-muted)',
                      opacity: isUnlocked ? 1 : 0.6,
                      whiteSpace: 'nowrap',
                      userSelect: 'none',
                    }}>
                      {isBoss
                        ? '👾 BOSS'
                        : isCompleted
                          ? `✓ LVL ${String(level.id).padStart(2,'0')}`
                          : `LVL ${String(level.id).padStart(2,'0')}`}
                    </div>

                  </div>
                </div>

              </React.Fragment>
            );
          })}

          {/* ── Finish Flag / 100% Completion Pedestal ─────────────── */}
          <div style={{
            position: 'absolute',
            top: nodeTops[nodeTops.length - 1] + 160,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            paddingBottom: '2rem',
            cursor: isAllCompleted ? 'pointer' : 'default',
          }}
          onClick={() => {
            if (isAllCompleted) setShowVictoryModal(true);
          }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '.8rem',
              padding: '.75rem 1.8rem', borderRadius: '999px',
              background: isAllCompleted
                ? 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(0,240,255,0.2))'
                : 'var(--nav-xp-bg)',
              border: isAllCompleted
                ? '2px solid #FFD700'
                : '1.5px solid var(--border-strong)',
              color: isAllCompleted ? '#FFD700' : 'var(--brand-accent)',
              fontSize: '.85rem', fontWeight: 900,
              fontFamily: "'JetBrains Mono', monospace",
              boxShadow: isAllCompleted ? '0 0 35px rgba(255,215,0,0.45)' : 'none',
              transition: 'all 200ms ease',
            }}>
              <Trophy size={20} color={isAllCompleted ? "#FFD700" : "currentColor"} />
              <span>{isAllCompleted ? "🏆 100% SELESAI · VERITAS MASTER CERTIFICATE" : "GRAND VERITAS+"}</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Tooltip rendered at fixed position ──────────────── */}
      {tooltip && (
        <NodeTooltip
          level={KEPO_LEVELS[tooltip.index]}
          isCompleted={completedLevels.includes(KEPO_LEVELS[tooltip.index].id)}
          isUnlocked={KepoState.isUnlocked(state, KEPO_LEVELS[tooltip.index].id)}
          onStart={() => handleStart(KEPO_LEVELS[tooltip.index].id)}
          onClose={() => setTooltip(null)}
          anchorRect={tooltip.anchorRect}
          onOpenVictory={() => { setTooltip(null); setShowVictoryModal(true); }}
        />
      )}

      {/* ── Victory Master Celebration Modal ──────────────────── */}
      {showVictoryModal && (
        <VictoryModal
          state={state}
          onNavigate={onNavigate}
          onClose={() => setShowVictoryModal(false)}
          onOpenCert={() => { setShowVictoryModal(false); setShowCertModal(true); }}
        />
      )}

      {/* ── Official E-Certificate Modal ──────────────────────── */}
      {showCertModal && (
        <ECertificateModal
          state={state}
          onClose={() => setShowCertModal(false)}
        />
      )}

      {/* Tooltip pop keyframe */}
      <style>{`
        @keyframes tooltipPop {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
