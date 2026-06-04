// src/firebase.js
// ─── Modular Firebase v10 initialisation ────────────────────────────────────
// All sensitive values are pulled from Vite env vars (VITE_ prefix required).
// Never hard-code credentials in this file.

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore
} from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const isFirebaseConfigured = !!firebaseConfig.apiKey

let app = null
let auth = null
let googleProvider = null
let db = null

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig)
    auth = getAuth(app)
    
    googleProvider = new GoogleAuthProvider()
    googleProvider.addScope('profile')
    googleProvider.addScope('email')
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    })

    try {
      db = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        }),
        experimentalForceLongPolling: true,
      })
    } catch (err) {
      console.warn('[Firebase] Persistent cache initialization failed. Falling back to standard getFirestore:', err)
      db = getFirestore(app)
    }
  } catch (err) {
    console.error('[Firebase] Initialization error:', err)
  }
} else {
  console.warn('[Firebase] Firebase API Key is missing. Running in offline/fallback mode.')
}

export { app, auth, googleProvider, db, isFirebaseConfigured }
export default app
