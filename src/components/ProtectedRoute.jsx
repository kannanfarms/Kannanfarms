// src/components/ProtectedRoute.jsx
// ─── Route guard for authenticated pages ─────────────────────────────────────
// Usage: <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
// While loading → shows a full-page spinner (avoids flash of login screen)
// Not authenticated → redirects to / with a ?from= param for post-login redirect

import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, authLoading } = useAuth()
  const location = useLocation()

  // While Firebase resolves the persisted session, show a spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-offwhite flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-green-light border-t-green-vivid rounded-full"
        />
        <p className="text-text-muted font-dm text-sm tracking-wide">
          Verifying your session…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Preserve the intended destination so we can redirect back after login
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
