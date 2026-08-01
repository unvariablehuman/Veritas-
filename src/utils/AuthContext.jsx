/**
 * Veritas+ — Auth Context
 * Provides: currentUser, authLoading, signInGoogle, signInEmail,
 *           signUpEmail, signOut, authError
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [demoUser,     setDemoUser]     = useState(() => {
    try {
      const saved = localStorage.getItem('veritas.demoUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading,  setAuthLoading]  = useState(true);
  const [authError,    setAuthError]    = useState(null);

  const currentUser = firebaseUser || demoUser;

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    try {
      const unsub = onAuthStateChanged(auth, (user) => {
        setFirebaseUser(user);
        setAuthLoading(false);
      }, (err) => {
        console.warn("Firebase Auth state listener error:", err);
        setAuthLoading(false);
      });
      return unsub;
    } catch (e) {
      console.warn("Firebase Auth listener failed:", e);
      setAuthLoading(false);
    }
  }, []);

  function clearError() { setAuthError(null); }

  function signInDemo() {
    setAuthError(null);
    const dUser = {
      uid: 'demo_user_veritas',
      displayName: 'Veritas Master',
      email: 'demo@veritas.app',
      photoURL: null,
      isDemo: true,
    };
    localStorage.setItem('veritas.demoUser', JSON.stringify(dUser));
    // Always set full demo progress (1175 XP, 8 completed levels) on Quick Demo Login
    localStorage.setItem('veritas.demoState.v1', JSON.stringify({
      xp: 1175,
      completedLevels: [1, 2, 3, 4, 5, 6, 7, 8],
      currentStreak: 5,
      bestStreak: 12,
      lastPlayed: new Date().toISOString().slice(0, 10),
      playedDays: [new Date().toISOString().slice(0, 10)],
      dayStreak: 3,
      seenMyths: ['q_tech_1', 'q_health_1', 'q_science_1'],
      correctCount: 24,
      totalAnswers: 26,
    }));
    setDemoUser(dUser);
  }

  async function signInGoogle() {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(friendlyError(err.code));
      throw err;
    }
  }

  async function signInEmail(email, password) {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setAuthError(friendlyError(err.code));
      throw err;
    }
  }

  async function signUpEmail(email, password, displayName) {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    } catch (err) {
      setAuthError(friendlyError(err.code));
      throw err;
    }
  }

  async function signOut() {
    setAuthError(null);
    localStorage.removeItem('veritas.demoUser');
    setDemoUser(null);
    try {
      await firebaseSignOut(auth);
    } catch (_) {}
  }

  return (
    <AuthContext.Provider value={{
      currentUser,
      authLoading,
      authError,
      clearError,
      signInDemo,
      signInGoogle,
      signInEmail,
      signUpEmail,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// Map Firebase error codes → human-readable Indonesian messages
function friendlyError(code) {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email atau password salah.';
    case 'auth/email-already-in-use':
      return 'Email sudah terdaftar. Coba login.';
    case 'auth/weak-password':
      return 'Password minimal 6 karakter.';
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Coba lagi nanti.';
    case 'auth/popup-closed-by-user':
      return 'Login dibatalkan.';
    case 'auth/network-request-failed':
      return 'Koneksi gagal. Periksa internet kamu.';
    default:
      return 'Terjadi kesalahan. Coba lagi.';
  }
}
