// src/context/AuthContext.jsx
// ─── Global authentication context ──────────────────────────────────────────
// Wraps the entire app; any component can call useAuth() to access:
//   • user         – Firebase user object (or null when signed out)
//   • profile      – Parsed { displayName, email, photoURL, uid }
//   • loading      – True while auth state is being resolved on mount
//   • isAdmin      - True if logged-in user is an administrator
//   • isAdminLoading - True while verifying admin status in Firestore
//   • signInWithGoogle  – Triggers Google pop-up sign-in
//   • signOut      – Clears the session

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase'

// ── Context creation ──────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ── Helper: extract normalised profile from Firebase user ────────────────────
function parseProfile(user) {
  if (!user) return null
  return {
    uid:         user.uid,
    displayName: user.displayName  ?? 'Kannan Farms User',
    email:       user.email        ?? '',
    photoURL:    user.photoURL     ?? null,
    // Derive initials as fallback avatar text
    initials:    (user.displayName ?? 'KF')
                   .split(' ')
                   .map((n) => n[0])
                   .join('')
                   .toUpperCase()
                   .slice(0, 2),
  }
}

// ── Provider component ────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)   // True until first auth check
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminLoading, setIsAdminLoading] = useState(true)
  const [userPoints, setUserPoints] = useState(0)
  const [userPointsLoading, setUserPointsLoading] = useState(true)
  const [error,   setError]   = useState(null)

  // Subscribe to Firebase auth state changes
  useEffect(() => {
    let unsubscribeAdmin = null
    let unsubscribePoints = null

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setProfile(parseProfile(firebaseUser))

      // Clean up previous listeners if user changes
      if (unsubscribeAdmin) {
        unsubscribeAdmin()
        unsubscribeAdmin = null
      }
      if (unsubscribePoints) {
        unsubscribePoints()
        unsubscribePoints = null
      }

      if (firebaseUser) {
        // Subscribe to user points in real-time
        setUserPointsLoading(true)
        const userDocRef = doc(db, 'users', firebaseUser.uid)
        unsubscribePoints = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserPoints(docSnap.data().points || 0)
          } else {
            setUserPoints(0)
          }
          setUserPointsLoading(false)
        }, (err) => {
          console.error('[AuthContext] Error listening to user points:', err)
          setUserPoints(0)
          setUserPointsLoading(false)
        })

        if (firebaseUser.email) {
          setIsAdminLoading(true)
          const email = firebaseUser.email.toLowerCase()
          const adminDocRef = doc(db, 'admins', email)

          // Real-time snapshot listener on the user's admin document
          unsubscribeAdmin = onSnapshot(adminDocRef, (docSnap) => {
            if (docSnap.exists() && docSnap.data().isAdmin === true) {
              setIsAdmin(true)
            } else {
              setIsAdmin(false)
            }
            setIsAdminLoading(false)
            setLoading(false)
          }, (err) => {
            console.error('[AuthContext] Error listening to admin doc:', err)
            setIsAdmin(false)
            setIsAdminLoading(false)
            setLoading(false)
          })
        } else {
          setIsAdmin(false)
          setIsAdminLoading(false)
          setLoading(false)
        }
      } else {
        setIsAdmin(false)
        setIsAdminLoading(false)
        setUserPoints(0)
        setUserPointsLoading(false)
        setLoading(false)
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeAdmin) {
        unsubscribeAdmin()
      }
      if (unsubscribePoints) {
        unsubscribePoints()
      }
    }
  }, [])

  // ── Sign in with Google pop-up ────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setError(null)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      // onAuthStateChanged will fire immediately after – no manual state set needed
      return result.user
    } catch (err) {
      // Ignore the benign "popup closed by user" error
      if (err.code !== 'auth/popup-closed-by-user' &&
          err.code !== 'auth/cancelled-popup-request') {
        setError(err.message)
        console.error('[AuthContext] Google sign-in error:', err)
      }
      return null
    }
  }, [])

  // ── Sign out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    setError(null)
    try {
      await firebaseSignOut(auth)
    } catch (err) {
      setError(err.message)
      console.error('[AuthContext] Sign-out error:', err)
    }
  }, [])

  const value = {
    user,
    profile,
    loading: loading || isAdminLoading || userPointsLoading, // Expose unified loading state
    isAdmin,
    isAdminLoading,
    userPoints,
    userPointsLoading,
    error,
    isAuthenticated: !!user,
    signInWithGoogle,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Consumer hook ─────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}

export default AuthContext
