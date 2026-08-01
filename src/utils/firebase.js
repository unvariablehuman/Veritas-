/**
 * Veritas+ — Firebase config & service initialization
 *
 * SETUP STEPS (do this once in Firebase Console):
 * 1. Go to https://console.firebase.google.com
 * 2. Create new project → "veritas-plus" (disable Google Analytics is fine)
 * 3. Project Settings → Add app → Web (</>) → register as "veritas-plus-web"
 * 4. Copy the firebaseConfig object below and replace the placeholder values
 * 5. Authentication → Get Started → Enable:
 *    - Email/Password (native provider)
 *    - Google (OAuth provider) — set support email
 * 6. Firestore Database → Create database → Start in test mode → choose region
 * 7. (Optional for deploy) Add your domain to Authentication → Authorized domains
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKeyForVercelDeploymentFallback",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "veritas-plus.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "veritas-plus",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "veritas-plus.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

let app = null;
let auth = null;
let db = null;

try {
  app  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
} catch (err) {
  console.warn("Firebase initialization warning (fallback mode active):", err);
}

export { auth, db };

export const googleProvider = new GoogleAuthProvider();
try {
  googleProvider.setCustomParameters({ prompt: 'select_account' });
} catch (e) {
  // Safe fallback if GoogleAuthProvider parameter setting fails
}
