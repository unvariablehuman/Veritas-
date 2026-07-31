import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import KepoAI from './components/KepoAI';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Map from './pages/Map';
import Quiz from './pages/Quiz';
import Library from './pages/Library';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './utils/AuthContext';
import * as KepoState from './utils/state';

/* ─── Inner app (needs access to useAuth) ─────────────────────────── */
function AppInner() {
  const { currentUser, authLoading, signOut } = useAuth();

  const [activePage,       setActivePage]       = useState('home');
  const [selectedLevelId,  setSelectedLevelId]  = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameState,        setGameState]         = useState(() => KepoState.loadGuestState());

  // Auth modal state
  const [authModalOpen,    setAuthModalOpen]    = useState(false);
  const [authModalTab,     setAuthModalTab]     = useState('login');
  const [authModalReason,  setAuthModalReason]  = useState('');

  // Light / dark mode
  const [lightMode, setLightMode] = useState(() => localStorage.getItem('theme') === 'light');
  useEffect(() => {
    document.documentElement.classList.toggle('light', lightMode);
    localStorage.setItem('theme', lightMode ? 'light' : 'dark');
  }, [lightMode]);

  /* ── Load / sync progress when auth state resolves ─────────────── */
  useEffect(() => {
    if (authLoading) return;

    if (currentUser) {
      if (currentUser.isDemo) {
        setGameState(KepoState.loadDemoState());
      } else {
        KepoState.loadFromFirestore(currentUser.uid).then(state => {
          setGameState(state);
        });
      }
    } else {
      // Guest → fresh guest state (0 XP, level 1 unlocked)
      setGameState(KepoState.loadGuestState());
    }
  }, [currentUser, authLoading]);

  /* ── Persist state change ───────────────────────────────────────── */
  const handleStateChange = useCallback((newState) => {
    setGameState(newState);
    if (currentUser) {
      if (currentUser.isDemo) {
        KepoState.saveDemoState(newState);
      } else {
        KepoState.saveToFirestore(currentUser.uid, newState);
      }
    } else {
      KepoState.saveGuest(newState);
    }
  }, [currentUser]);

  /* ── Navigation with soft-auth gate ────────────────────────────── */
  const handleNavigate = (page, arg = null) => {
    // Soft gate: Dashboard requires login to show real persisted progress
    if (page === 'dashboard' && !currentUser) {
      setAuthModalReason('Simpan progressmu dan lihat statistik lengkap dengan login dulu.');
      setAuthModalTab('login');
      setAuthModalOpen(true);
      return; // don't navigate yet — will re-navigate after login via useEffect below
    }

    setActivePage(page);
    if (page === 'quiz')    setSelectedLevelId(arg);
    if (page === 'library') setSelectedCategory(arg);
  };

  // After login succeeds (currentUser changes from null → user),
  // if user was trying to reach Dashboard, take them there.
  const [pendingPage, setPendingPage] = useState(null);
  useEffect(() => {
    if (currentUser && pendingPage) {
      setActivePage(pendingPage);
      setPendingPage(null);
    }
  }, [currentUser, pendingPage]);

  // Override handleNavigate to track pending page
  const handleNavigateWithPending = (page, arg = null) => {
    if (page === 'dashboard' && !currentUser) {
      setPendingPage('dashboard');
      setAuthModalReason('Simpan progressmu dan lihat statistik lengkap dengan login dulu.');
      setAuthModalTab('login');
      setAuthModalOpen(true);
      return;
    }
    handleNavigate(page, arg);
  };

  /* ── Open auth modal from Navbar ────────────────────────────────── */
  const openAuthModal = (tab = 'login', reason = '') => {
    setAuthModalTab(tab);
    setAuthModalReason(reason);
    setAuthModalOpen(true);
  };

  /* ── Page renderer ──────────────────────────────────────────────── */
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={handleNavigateWithPending} />;
      case 'map':
        return <Map onNavigate={handleNavigateWithPending} state={gameState} />;
      case 'quiz':
        return (
          <Quiz
            levelId={selectedLevelId}
            onNavigate={handleNavigateWithPending}
            state={gameState}
            onStateChange={handleStateChange}
          />
        );
      case 'library':
        return <Library initialCat={selectedCategory} />;
      case 'dashboard':
        return (
          <Dashboard
            state={gameState}
            onStateChange={handleStateChange}
            onNavigate={handleNavigateWithPending}
          />
        );
      default:
        return <Home onNavigate={handleNavigateWithPending} />;
    }
  };

  if (authLoading) {
    // Minimal loading screen while Firebase resolves auth state
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-main)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo.svg" alt="Veritas+" style={{ height: '36px', opacity: .7 }} />
          <div style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '.85rem' }}>Memuat…</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        activePage={activePage}
        selectedLevelId={selectedLevelId}
        onNavigate={handleNavigateWithPending}
        xp={gameState.xp}
        lightMode={lightMode}
        setLightMode={setLightMode}
        currentUser={currentUser}
        onOpenAuth={openAuthModal}
        onSignOut={signOut}
      />
      <main>{renderPage()}</main>
      <KepoAI />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
        reason={authModalReason}
      />
    </>
  );
}

/* ─── Root with AuthProvider ─────────────────────────────────────── */
export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
