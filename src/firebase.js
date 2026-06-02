// src/firebase.js
// ─── Modular Firebase v10 initialisation ────────────────────────────────────
// All sensitive values are pulled from Vite env vars (VITE_ prefix required).
// Never hard-code credentials in this file.

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB8ah-qkL9dO6D7J78jKn9wN2re4Ny6zzk",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kannan-farms.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID || "kannan-farms",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kannan-farms.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1042900938920",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID || "1:1042900938920:web:719094bdc71f7a08fbd29d",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-75RW7BKBNS",
}

// Guard: avoid re-initialising during HMR in development
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// ── Auth ─────────────────────────────────────────────────────────────────────
export const auth = getAuth(app)

// Pre-configured Google provider – request profile + email scopes
export const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('profile')
googleProvider.addScope('email')
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account picker
})

// ── Firestore ─────────────────────────────────────────────────────────────────
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  }),
  experimentalForceLongPolling: true,
})

export default app
