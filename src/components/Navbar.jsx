import React, { useState, useEffect, useRef } from 'react';
import { Info, X, Sparkles, ShieldCheck, Trophy, Bot } from 'lucide-react';

const NAV_ITEMS = [
  { page: 'home',      label: 'Home',         key: 'home' },
  { page: 'map',       label: 'Learning Path', key: 'map' },
  { page: 'quiz',      label: 'Quiz Cepat',   key: 'quiz' },
  { page: 'library',   label: 'Library',      key: 'library' },
  { page: 'dashboard', label: 'Dashboard',    key: 'dashboard' },
];

export default function Navbar({
  activePage, selectedLevelId, onNavigate, xp,
  lightMode, setLightMode,
  currentUser, onOpenAuth, onSignOut,
}) {
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const [userMenuOpen,  setUserMenuOpen]  = useState(false);
  const [showAbout,     setShowAbout]     = useState(false);
  const userMenuRef = useRef(null);

  // When playing a level from Learning Path (selectedLevelId is not null), keep 'map' active
  const activeNavPage = (activePage === 'quiz' && selectedLevelId !== null) ? 'map' : activePage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const avatarUrl  = currentUser?.photoURL;
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Veritas';
  const initials   = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <header className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[94%] sm:w-[92%] max-w-6xl pointer-events-auto overflow-visible">
        <nav
          className={`floating-dock ${scrolled ? 'scrolled' : ''} ${mobileOpen ? 'rounded-2xl sm:rounded-3xl' : 'rounded-full'} px-3.5 sm:px-6 py-2 sm:py-3 transition-all duration-300 overflow-visible`}
          data-testid="site-nav"
        >
          <div className="flex items-center justify-between gap-1.5 sm:gap-6">

            {/* Logo */}
            <a
              className="brand-mark no-underline font-bold text-lg brand-logo-link flex-shrink-0"
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              data-testid="brand-home"
            >
              <img src="/logo.svg" alt="Veritas+ Logo" className="brand-logo-img h-6 sm:h-7" />
            </a>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2" id="nav-links">
              {NAV_ITEMS.map(item => {
                const isActive = item.page === activeNavPage;
                return (
                  <a
                    key={item.key}
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigate(item.page); setMobileOpen(false); }}
                    className={`dock-item ${isActive ? 'active' : ''}`}
                    data-testid={`nav-${item.key}`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">

              {/* Info About Us Button — hidden on mobile, shown md+ */}
              <button
                className="hidden md:inline-flex p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setShowAbout(true)}
                title="Tentang Veritas+"
                aria-label="Tentang Veritas+"
                data-testid="nav-info-about"
              >
                <Info size={18} strokeWidth={2.2} />
              </button>

              {/* Dark mode toggle — hidden on mobile, shown md+ */}
              <button
                className="hidden md:inline-flex p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                onClick={() => setLightMode(!lightMode)}
                title={lightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {lightMode ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M20 15.5A8.5 8.5 0 1 1 8.5 4a7 7 0 0 0 11.5 11.5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>

              {/* XP badge */}
              <div
                className="nav-xp flex items-center gap-1 font-mono font-bold text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-400/50 bg-amber-400/10 text-amber-500 shadow-sm shadow-amber-400/20"
                data-testid="nav-xp-display"
                title="Total XP"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFD700" stroke="#FF8C00" strokeWidth="1.2" style={{ filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z"/>
                </svg>
                <span id="nav-xp-count">{xp}</span>
                <span className="hidden xs:inline sm:inline ml-0.5">XP</span>
              </div>

              {/* ── Auth section ── */}
              {currentUser ? (
                /* User avatar + dropdown */
                <div ref={userMenuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    title={displayName}
                    aria-label="User menu"
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      border: '2px solid rgba(245,158,11,0.6)',
                      background: 'var(--bg-elev)',
                      cursor: 'pointer', overflow: 'hidden', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#F59E0B' }}>
                        {initials}
                      </span>
                    )}
                  </button>

                  {userMenuOpen && (
                    <div
                      style={{
                        position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                        width: '200px', background: 'var(--bg-surface)',
                        border: '1px solid var(--border-default)',
                        borderRadius: '16px', boxShadow: '0 12px 35px rgba(0,0,0,0.35)',
                        overflow: 'hidden', zIndex: 100,
                      }}
                    >
                      <div style={{ padding: '.8rem 1rem', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elev)' }}>
                        <div style={{ fontWeight: 800, fontSize: '.88rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {displayName}
                        </div>
                        <div style={{ fontSize: '.73rem', color: 'var(--text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {currentUser.email || (currentUser.isDemo ? 'Akun Demo' : 'Tamu')}
                        </div>
                      </div>

                      <div style={{ padding: '.4rem' }}>
                        <button
                          onClick={() => { setUserMenuOpen(false); onNavigate('dashboard'); }}
                          style={dropdownItemStyle}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                          Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            if (window.confirm('Yakin keluar dari Veritas+?')) onSignOut();
                          }}
                          style={{ ...dropdownItemStyle, color: '#FF7095' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login button — guest */
                <button
                  onClick={() => onOpenAuth('login')}
                  data-testid="nav-login-btn"
                  style={{
                    padding: '.35rem .75rem',
                    borderRadius: '20px',
                    border: '1.5px solid rgba(245,158,11,0.5)',
                    background: 'rgba(245,158,11,0.08)',
                    color: '#F59E0B',
                    fontWeight: 700,
                    fontSize: '.78rem',
                    cursor: 'pointer',
                    transition: 'all 200ms',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.18)';
                    e.currentTarget.style.borderColor = '#F59E0B';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)';
                  }}
                >
                  Masuk
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                id="mobile-menu-btn"
                data-testid="mobile-menu-btn"
                aria-label="Menu"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileOpen && (
            <div className="md:hidden mt-2.5 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-1">
              {NAV_ITEMS.map(item => {
                const isActive = item.page === activeNavPage;
                return (
                  <a
                    key={item.key}
                    href="#"
                    onClick={(e) => { e.preventDefault(); onNavigate(item.page); setMobileOpen(false); }}
                    className={`dock-item flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-teal-500/15 text-teal-600 dark:text-cyan-400 border border-teal-500/30 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                    }`}
                    data-testid={`nav-${item.key}`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-cyan-400 shadow-sm"></span>}
                  </a>
                );
              })}
              {/* Auth action in mobile menu */}
              {!currentUser && (
                <button
                  onClick={() => { setMobileOpen(false); onOpenAuth('login'); }}
                  className="mt-1 w-full text-center px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-400/40 text-amber-600 dark:text-amber-400 font-bold text-sm hover:bg-amber-500/20 transition-all cursor-pointer"
                >
                  Masuk / Daftar ✨
                </button>
              )}

              {/* Info + Theme Toggle — only show in mobile drawer */}
              <div className="flex items-center gap-2 pt-1 mt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() => { setMobileOpen(false); setShowAbout(true); }}
                >
                  <Info size={15} strokeWidth={2.2} />
                  <span>Tentang</span>
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() => setLightMode(!lightMode)}
                >
                  {lightMode ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 15.5A8.5 8.5 0 1 1 8.5 4a7 7 0 0 0 11.5 11.5z" stroke="currentColor" strokeWidth="2"/></svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" strokeWidth="2"/></svg>
                  )}
                  <span>{lightMode ? 'Mode Gelap' : 'Mode Terang'}</span>
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* ── Tentang Veritas+ Modal ── */}
      {showAbout && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowAbout(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              animation: 'fadeIn 200ms ease',
            }}
          />

          {/* Modal card wrapper */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tentang Veritas+"
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
                padding: '1.25rem 1.3rem 1.5rem',
                width: '100%',
                maxWidth: '400px',
                maxHeight: '88vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                animation: 'slideUp 240ms cubic-bezier(0.34,1.56,0.64,1)',
                position: 'relative',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowAbout(false)}
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
                <X size={18} strokeWidth={2.2} />
              </button>

              {/* Logo + Header */}
              <div style={{ textAlign: 'center', marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/logo.svg" alt="Veritas+" style={{ height: '28px', marginBottom: '.4rem', display: 'block' }} />
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--brand-primary)', letterSpacing: '.02em' }}>
                  CITECH UNEJ 2026 Innovation Project
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: '.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '1rem', textAlign: 'center' }}>
                <strong style={{ color: 'var(--text-primary)' }}>Veritas+</strong> membantu masyarakat membedakan mitos dan fakta melalui pembelajaran interaktif, gamifikasi, serta dukungan AI Assistant yang mendorong kebiasaan berpikir kritis dan verifikasi informasi.
              </p>

              {/* Features list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  Fitur Utama Platform
                </div>

                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '.7rem',
                  padding: '.65rem .8rem', borderRadius: '12px',
                  background: 'var(--bg-elev)',
                  border: '1px solid var(--border-default)',
                }}>
                  <ShieldCheck size={20} style={{ color: 'var(--brand-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Kartu 3D & Learning Path</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>Jelajahi 8 level pembelajaran interaktif melalui kartu 3D flip.</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '.7rem',
                  padding: '.65rem .8rem', borderRadius: '12px',
                  background: 'var(--bg-elev)',
                  border: '1px solid var(--border-default)',
                }}>
                  <Bot size={20} style={{ color: 'var(--brand-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Veritas AI Assistant</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>Verifikasi fakta secara real-time berbasis Google Gemini.</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: '.7rem',
                  padding: '.65rem .8rem', borderRadius: '12px',
                  background: 'var(--bg-elev)',
                  border: '1px solid var(--border-default)',
                }}>
                  <Trophy size={20} style={{ color: 'var(--brand-primary)', marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>Gamifikasi & Rewards</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>Dapatkan XP, streak harian, badge, dan sertifikat digital.</div>
                  </div>
                </div>
              </div>

              {/* Footer info */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '.75rem', borderTop: '1px solid var(--border-default)',
                fontSize: '.75rem', color: 'var(--text-muted)'
              }}>
                <span>© Tim Saya Akan Lawan! • CITECH UNEJ 2026</span>
                <span style={{
                  padding: '2px 8px', borderRadius: '999px',
                  background: 'var(--nav-xp-bg)', border: '1px solid var(--border-neon)',
                  color: 'var(--brand-primary)', fontWeight: 800, fontSize: '.7rem'
                }}>v1.0.0</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const dropdownItemStyle = {
  display: 'flex', alignItems: 'center', gap: '.55rem',
  width: '100%', padding: '.55rem .75rem',
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-primary)', fontSize: '.85rem', fontWeight: 600,
  borderRadius: '9px', transition: 'background 150ms', textAlign: 'left',
};
