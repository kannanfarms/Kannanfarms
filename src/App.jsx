// src/App.jsx  — Stage 2: AuthProvider + ProtectedRoute wired in
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import ScrollToTop from './components/ScrollToTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <ProductProvider>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/"              element={<Home />} />
                <Route path="/home"          element={<Navigate to="/" replace />} />
                <Route path="/cart"          element={<Cart />} />
                <Route path="/product/:slug" element={<ProductDetail />} />

                {/* Protected route — requires authentication */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Secure Admin Route — requires administrator privileges */}
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />

                {/* Legacy .html redirects */}
                <Route path="/index.html"   element={<Navigate to="/" replace />} />
                <Route path="/cart.html"    element={<Navigate to="/cart" replace />} />
                <Route path="/banana.html"  element={<Navigate to="/product/banana-powder" replace />} />
                <Route path="/moringa.html" element={<Navigate to="/product/moringa-powder" replace />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </ProductProvider>
      </AuthProvider>
    </HashRouter>
  )
}
