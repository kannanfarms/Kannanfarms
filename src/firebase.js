// src/firebase.js
// ─── Modular Firebase v10 initialisation ────────────────────────────────────
// All sensitive values are pulled from Vite env vars (VITE_ prefix required).
// Never hard-code credentials in this file.

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
export const db = getFirestore(app)

export default app
