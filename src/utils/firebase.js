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

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ⬇️  Replace these values with your own from Firebase Console
//     Project Settings → Your apps → SDK setup and configuration
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app        = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
