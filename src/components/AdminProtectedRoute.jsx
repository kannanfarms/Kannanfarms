// src/components/AdminProtectedRoute.jsx
// ─── Route guard for admin-only pages ────────────────────────────────────────
// Usage: <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
//
// Blocks non-administrators, showing a premium loading spinner while resolving.
// Unauthorized users are instantly redirected back to the home storefront.

import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  // Show a premium, custom spinner while checking authentication and admin status
  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite flex flex-col items-center justify-center gap-4">
        <div className="relative w-14 h-14">
          {/* Inner pulse */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-green-xlight rounded-full border-2 border-green-light"
          />
          {/* Outer spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-4 border-transparent border-t-green-vivid rounded-full"
          />
        </div>
        <p className="text-text-dark font-dm font-semibold text-sm tracking-wide mt-2">
          Verifying Admin Credentials…
        </p>
      </div>
    )
  }

  // Instant redirect to storefront if not authenticated or not an admin
  if (!isAuthenticated || !isAdmin) {
    console.warn('[AdminProtectedRoute] Unauthorized access attempt blocked.')
    return <Navigate to="/" replace />
  }

  return children
}
