import React, { useState } from 'react';

const NAV_ITEMS = [
  { page: "home",      label: "Home",         key: "home" },
  { page: "map",       label: "Learning Path", key: "map" },
  { page: "quiz",      label: "Quiz Cepat",   key: "quiz" },
  { page: "library",   label: "Library",      key: "library" },
  { page: "dashboard", label: "Dashboard",    key: "dashboard" },
];

export default function Navbar({ activePage, onNavigate, xp }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="site-nav" data-testid="site-nav">
      <div className="nav-inner">
        <a className="brand-mark" href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} data-testid="brand-home">
          <div className="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C7 6 6 10 6 13a6 6 0 0 0 12 0c0-3-1-7-6-11z"/>
              <circle cx="12" cy="14" r="2.2" fill="#FF2A6D" stroke="none"/>
            </svg>
          </div>
          <div className="brand-name">Veritas<span className="accent">+</span></div>
        </a>
        <div className={`nav-links ${mobileOpen ? 'open' : ''}`} id="nav-links">
          {NAV_ITEMS.map(item => (
            <a
              key={item.key}
              className={`nav-link ${item.page === activePage ? "active" : ""}`}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate(item.page); setMobileOpen(false); }}
              data-testid={`nav-${item.key}`}
            >
              {item.label}
            </a>
          ))}
          <div className="nav-xp" data-testid="nav-xp-display" title="Total XP">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 6.91-1.01L12 2z"/></svg>
            <span id="nav-xp-count">{xp}</span> XP
          </div>
        </div>
        <button
          className="btn btn-ghost mobile-menu-btn"
          id="mobile-menu-btn"
          data-testid="mobile-menu-btn"
          aria-label="Menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </nav>
  );
}
