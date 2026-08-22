/**
 * Veritas+ — AuthModal
 * Soft-auth modal: tab Login / Daftar, Google OAuth, Email+Password
 * Props:
 *   open        {boolean}
 *   onClose     {() => void}
 *   defaultTab  {'login'|'signup'}  — optional, defaults to 'login'
 *   reason      {string}            — optional contextual message shown above form
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';

const LOGO_SRC = '/logo.svg';

export default function AuthModal({ open, onClose, defaultTab = 'login', reason }) {
  const { signInGoogle, signInEmail, signUpEmail, signInDemo, authError, clearError } = useAuth();

  const [tab,          setTab]          = useState(defaultTab);
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [displayName,  setDisplayName]  = useState('');
  const [loading,      setLoading]      = useState(false);
  const [localError,   setLocalError]   = useState(null);
  const [showPass,     setShowPass]     = useState(false);

  // Sync tab when defaultTab prop changes (e.g. from "Daftar" button on landing)
  useEffect(() => { setTab(defaultTab); }, [defaultTab]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!open) {
      setEmail(''); setPassword(''); setDisplayName('');
      setLocalError(null); setLoading(false); setShowPass(false);
      clearError();
    }
  }, [open]);

  const errorMsg = localError || authError;

  function switchTab(t) {
    setTab(t);
    setLocalError(null);
    clearError();
    setEmail(''); setPassword(''); setDisplayName('');
  }

  function handleDemoLogin() {
    signInDemo();
    onClose();
  }

  async function handleGoogle() {
    setLoading(true); setLocalError(null);
    try {
      await signInGoogle();
      onClose();
    } catch (_) {
      /* authError set by context */
    } finally { setLoading(false); }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);

    // Basic client-side validation
    if (!email.trim())    return setLocalError('Email tidak boleh kosong.');
    if (!password.trim()) return setLocalError('Password tidak boleh kosong.');
    if (tab === 'signup') {
      if (!displayName.trim()) return setLocalError('Nama tidak boleh kosong.');
      if (password.length < 6) return setLocalError('Password minimal 6 karakter.');
    }

    setLoading(true);
    try {
      if (tab === 'login') {
        await signInEmail(email.trim(), password);
      } else {
        await signUpEmail(email.trim(), password, displayName.trim());
      }
      onClose();
    } catch (_) {
      /* authError set by context */
    } finally { setLoading(false); }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          animation: 'fadeIn 200ms ease',
        }}
      />

      {/* Modal card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tab === 'login' ? 'Login ke Veritas+' : 'Daftar Veritas+'}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 201,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            pointerEvents: 'auto',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: '18px',
            padding: '1.2rem 1.25rem 1.4rem',
            width: '100%',
            maxWidth: '370px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
            animation: 'slideUp 240ms cubic-bezier(0.34,1.56,0.64,1)',
            position: 'relative',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Tutup"
            style={{
              position: 'absolute', top: '.8rem', right: '.8rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', padding: '4px', lineHeight: 1,
              borderRadius: '8px',
              transition: 'color 150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Logo + heading */}
          <div style={{ textAlign: 'center', marginBottom: '.6rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img src={LOGO_SRC} alt="Veritas+" style={{ height: '26px', marginBottom: '.4rem', display: 'block' }} />
            {reason && (
              <p style={{
                fontSize: '.76rem', color: 'var(--text-muted)',
                background: 'var(--bg-elev)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                padding: '.4rem .7rem',
                marginBottom: '.5rem',
              }}>
                {reason}
              </p>
            )}
            
            {/* Feature Perks Badge (Jury 3 Feedback: Convince user to signup with clear access breakdown) */}
            <div style={{
              fontSize: '.73rem',
              lineHeight: 1.35,
              color: 'var(--text-secondary)',
              background: 'linear-gradient(135deg, rgba(0,240,255,0.08), rgba(124,255,178,0.06))',
              border: '1px solid rgba(0,240,255,0.25)',
              borderRadius: '10px',
              padding: '.5rem .7rem',
              marginTop: '.4rem',
              textAlign: 'left',
              width: '100%',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--brand-mint)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ⚡ Modul & AI Bisa Diakses Langsung!
              </div>
              <div>Sebagai <strong>Guest</strong> kamu bisa langsung mencoba Learning Path & Kepo AI. <strong>Daftar Akun</strong> untuk sinkronkan progress Cloud, klaim Badge, & Peringkat.</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: '.4rem', marginBottom: '.8rem',
            background: 'var(--bg-elev)', borderRadius: '10px', padding: '3px',
          }}>
            {[['login','Masuk'], ['signup','Daftar']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                style={{
                  flex: 1, padding: '.45rem', border: 'none',
                  borderRadius: '7px', cursor: 'pointer', fontWeight: 700,
                  fontSize: '.82rem', transition: 'all 200ms',
                  background: tab === key ? 'var(--bg-surface)' : 'transparent',
                  color: tab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                  boxShadow: tab === key ? '0 1px 5px rgba(0,0,0,.15)' : 'none',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Google OAuth button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '.5rem', width: '100%',
              padding: '.55rem .8rem', borderRadius: '10px', cursor: 'pointer',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-elev)',
              color: 'var(--text-primary)',
              fontWeight: 600, fontSize: '.82rem',
              transition: 'all 200ms',
              opacity: loading ? .6 : 1,
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.borderColor = '#F59E0B'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          >
            {/* Google G logo */}
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          {/* Quick Demo Login button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '.5rem', width: '100%', marginTop: '.5rem',
              padding: '.55rem .8rem', borderRadius: '10px', cursor: 'pointer',
              border: '1.5px solid #F59E0B',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(255,215,0,0.08))',
              color: '#FFD700',
              fontWeight: 800, fontSize: '.82rem',
              transition: 'all 200ms',
              boxShadow: '0 2px 10px rgba(245,158,11,0.2)',
            }}
          >
            ⚡ Quick Demo Login
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.6rem',
            margin: '.7rem 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
            <span style={{ fontSize: '.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>atau dengan email</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-default)' }} />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {/* Name field — signup only */}
            {tab === 'signup' && (
              <div>
                <label style={labelStyle}>Nama</label>
                <input
                  type="text"
                  placeholder="Nama kamu"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="email@kamu.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
                autoComplete={tab === 'login' ? 'email' : 'email'}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder={tab === 'signup' ? 'Min. 6 karakter' : 'Password kamu'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  style={{ ...inputStyle, paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: '.6rem', top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 0, lineHeight: 1,
                  }}
                  aria-label={showPass ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPass
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Error message */}
            {errorMsg && (
              <div style={{
                padding: '.45rem .7rem', borderRadius: '8px',
                background: 'rgba(255,92,122,0.1)',
                border: '1px solid rgba(255,92,122,0.3)',
                color: '#FF7095', fontSize: '.78rem', lineHeight: 1.35,
              }}>
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '.6rem', borderRadius: '10px', border: 'none',
                background: loading
                  ? 'rgba(245,158,11,0.4)'
                  : 'linear-gradient(135deg, #FBBF24, #F59E0B)',
                color: '#1a1000',
                fontWeight: 800, fontSize: '.88rem', cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '.2rem',
                transition: 'opacity 200ms, transform 120ms',
                boxShadow: loading ? 'none' : '0 3px 14px rgba(245,158,11,0.3)',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
            >
              {loading
                ? 'Memproses…'
                : tab === 'login' ? 'Masuk' : 'Buat Akun'}
            </button>
          </form>

          {/* Footer switch tab */}
          <p style={{ textAlign: 'center', marginTop: '.7rem', fontSize: '.78rem', color: 'var(--text-muted)' }}>
            {tab === 'login'
              ? <>Belum punya akun?{' '}
                  <button onClick={() => switchTab('signup')} style={linkBtnStyle}>Daftar gratis</button>
                </>
              : <>Sudah punya akun?{' '}
                  <button onClick={() => switchTab('login')} style={linkBtnStyle}>Masuk</button>
                </>
            }
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(.98) } to { opacity: 1; transform: none } }
      `}</style>
    </>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '.72rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: '.2rem',
  letterSpacing: '.02em',
};

const inputStyle = {
  width: '100%',
  padding: '.5rem .75rem',
  borderRadius: '9px',
  border: '1px solid var(--border-default)',
  background: 'var(--bg-elev)',
  color: 'var(--text-primary)',
  fontSize: '.82rem',
  outline: 'none',
  transition: 'border-color 200ms',
  boxSizing: 'border-box',
};

const linkBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#F59E0B', fontWeight: 700, fontSize: 'inherit',
  padding: 0, textDecoration: 'underline',
  textUnderlineOffset: '2px',
};
