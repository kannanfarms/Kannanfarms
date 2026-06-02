// src/components/Navbar.jsx  (Stage 2 — Firebase Auth integrated)
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollY } from '../hooks/useScrollY'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { label: 'Products',     targetId: 'products' },
  { label: 'How It Works', targetId: 'how'      },
  { label: 'Why Us',       targetId: 'features' },
  { label: 'Contact Us',   targetId: 'contact'  },
]

export default function Navbar() {
  const { isScrolled, scrollDir } = useScrollY(50)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const location = useLocation()
  const { profile, isAuthenticated, signInWithGoogle, loading: authLoading, isAdmin } = useAuth()

  const handleNavClick = (e, targetId) => {
    setMenuOpen(false)
    if (location.pathname === '/') {
      e.preventDefault()
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  useEffect(() => { setMenuOpen(false) }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('kf_cart') || '[]')
    setCartCount(stored.reduce((sum, item) => sum + (item.qty || 1), 0))
    const handler = () => {
      const s = JSON.parse(localStorage.getItem('kf_cart') || '[]')
      setCartCount(s.reduce((a, i) => a + (i.qty || 1), 0))
    }
    window.addEventListener('kf_cart_update', handler)
    return () => window.removeEventListener('kf_cart_update', handler)
  }, [])

  const headerBg = isScrolled
    ? 'bg-green-dark/95 backdrop-blur-premium shadow-[0_2px_24px_rgba(15,92,50,0.4)]'
    : 'bg-green-dark'
  const isHidden = scrollDir === 'down' && isScrolled

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 flex items-center justify-between h-[68px] md:h-[76px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group no-underline" aria-label="Kannan Farms Home">
            <div className="h-14 w-14 overflow-hidden flex items-center justify-center flex-shrink-0">
              <img
                src="assets/Logowoback.png"
                alt="Kannan Farms"
                className="h-13 w-13 object-contain transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <span className="hidden text-white font-playfair font-black text-lg" aria-hidden="true">KF</span>
            </div>
            <div>
              <div className="font-playfair font-black text-[19px] text-white leading-tight tracking-[0.2px]">
                Kannan Farms
              </div>
              <div className="text-[10px] text-white/50 tracking-[1.8px] uppercase">
                Est. Natural Goodness
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={`/?scroll=${link.targetId}`}
                onClick={(e) => handleNavClick(e, link.targetId)}
                className="text-white/75 hover:text-white hover:bg-white/10 text-[13px] font-medium px-4 py-2 rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                className="text-amber hover:text-amber-light hover:bg-white/10 text-[13px] font-bold px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-1"
              >
                ⚙️ Admin Panel
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative ml-2 flex items-center gap-2 bg-white/10 border border-white/25 hover:bg-white/18 hover:border-white/45 text-white px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-250"
            >
              <CartIcon />
              <span>Cart</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber text-green-dark text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth zone */}
            <div className="ml-1">
              {authLoading ? (
                <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
              ) : isAuthenticated ? (
                <Link to="/profile" className="group flex items-center gap-2 hover:bg-white/10 rounded-xl px-2 py-1.5 transition-all duration-200">
                  {profile?.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full ring-2 ring-white/30 group-hover:ring-white/60 transition-all object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-vivid ring-2 ring-white/30 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{profile?.initials}</span>
                    </div>
                  )}
                  <span className="text-white/80 text-[12px] font-medium max-w-[80px] truncate group-hover:text-white transition-colors">
                    {profile?.displayName?.split(' ')[0]}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 bg-white text-green-dark hover:bg-green-xlight px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 shadow-sm"
                >
                  <GoogleIcon />
                  Sign In
                </button>
              )}
            </div>
          </nav>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 text-white/80">
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-amber text-green-dark text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Mobile avatar */}
            {!authLoading && isAuthenticated && (
              <Link to="/profile">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} referrerPolicy="no-referrer" alt="" className="w-8 h-8 rounded-full ring-2 ring-white/30 object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-green-vivid flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{profile?.initials}</span>
                  </div>
                )}
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-white/80 hover:text-white transition-colors"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <HamburgerIcon open={menuOpen} />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="h-[68px] md:h-[76px]" aria-hidden="true" />

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              key="drawer"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-green-dark z-50 md:hidden flex flex-col pt-20 px-6 pb-8"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-1 flex-1">
                 {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      to={`/?scroll=${link.targetId}`}
                      onClick={(e) => handleNavClick(e, link.targetId)}
                      className="text-white/80 hover:text-white hover:bg-white/10 text-[16px] font-medium px-4 py-3.5 rounded-xl transition-all duration-200 block no-underline"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * NAV_LINKS.length, duration: 0.3 }}
                  >
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-amber hover:text-amber-light hover:bg-white/10 text-[16px] font-bold px-4 py-3.5 rounded-xl transition-all duration-200 block"
                    >
                      ⚙️ Admin Panel
                    </Link>
                  </motion.div>
                )}
                <motion.div
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  className="mt-2"
                >
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 bg-green-vivid/20 border border-green-vivid/40 text-white px-4 py-3.5 rounded-xl text-[16px] font-semibold transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <CartIcon />
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                </motion.div>

                {/* Mobile auth */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="mt-2"
                >
                  {isAuthenticated ? (
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 bg-white/10 border border-white/20 text-white px-4 py-3.5 rounded-xl text-[15px] font-medium"
                    >
                      {profile?.photoURL ? (
                        <img src={profile.photoURL} referrerPolicy="no-referrer" alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-green-vivid flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{profile?.initials}</span>
                        </div>
                      )}
                      My Profile & Orders
                    </Link>
                  ) : (
                    <button
                      onClick={() => { signInWithGoogle(); setMenuOpen(false) }}
                      className="w-full flex items-center justify-center gap-2 bg-white text-green-dark px-4 py-3.5 rounded-xl text-[15px] font-semibold"
                    >
                      <GoogleIcon />
                      Sign In with Google
                    </button>
                  )}
                </motion.div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-5 right-5 p-2 text-white/60 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}

function HamburgerIcon({ open }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <><line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/></>
      ) : (
        <><line x1="3" y1="7" x2="19" y2="7"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="15" x2="19" y2="15"/></>
      )}
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
