// src/pages/Profile.jsx
// ─── Authenticated user profile + real-time order tracking ───────────────────

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import useOrders, { STATUS_COLORS, STATUS_ORDER } from '../hooks/useOrders'
import SEOHead from '../components/SEOHead'
import Reveal from '../components/Reveal'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(date)
}

function StepTracker({ status }) {
  const steps = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered']
  const current = STATUS_ORDER[status] ?? 0
  const isCancelled = status === 'Cancelled'

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-red-50 rounded-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0" />
        <span className="text-red-700 text-xs font-medium">Order Cancelled</span>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {steps.map((step, i) => {
          const done    = i < current
          const active  = i === current
          const isLast  = i === steps.length - 1
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              {/* Node */}
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                    ${done   ? 'bg-green-vivid'  : ''}
                    ${active ? 'bg-green-dark ring-4 ring-green-light' : ''}
                    ${!done && !active ? 'bg-border-green' : ''}
                  `}
                >
                  {done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {active && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <span className={`text-[9px] font-medium leading-tight text-center w-14 hidden sm:block
                  ${active ? 'text-green-dark' : done ? 'text-green-main' : 'text-text-muted'}`}>
                  {step}
                </span>
              </div>
              {/* Connector line */}
              {!isLast && (
                <div className={`flex-1 h-0.5 mx-0.5 rounded transition-all duration-500
                  ${i < current ? 'bg-green-vivid' : 'bg-border-green'}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false)
  const colors = STATUS_COLORS[order.status] ?? STATUS_COLORS['Pending']

  return (
    <motion.div
      layout
      className="bg-white rounded-2xl border border-border-green shadow-card overflow-hidden"
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between p-5 text-left hover:bg-green-xlight/50 transition-colors duration-200"
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-1.5 min-w-0 pr-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-playfair font-semibold text-text-dark text-[15px]">
              #{order.orderId ?? order.id.slice(0, 8).toUpperCase()}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              {order.status}
            </span>
          </div>
          <p className="text-text-muted text-xs">
            Placed on {formatDate(order.timestamp)}
          </p>
          {order.items && (
            <p className="text-text-dark text-sm font-medium truncate">
              {order.items.map(i => i.name).join(', ')}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          {order.total && (
            <span className="font-playfair font-bold text-green-dark text-[15px]">
              ₹{order.total.toLocaleString('en-IN')}
            </span>
          )}
          <motion.svg
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="w-4 h-4 text-text-muted"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border-green/60 pt-4 space-y-4">

              {/* Step tracker */}
              <StepTracker status={order.status} />

              {/* Meta grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {order.trackingId && (
                  <div className="bg-green-xlight rounded-xl p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide font-medium mb-0.5">Tracking ID</p>
                    <p className="text-text-dark text-xs font-mono font-semibold truncate">{order.trackingId}</p>
                  </div>
                )}
                {order.courier && (
                  <div className="bg-green-xlight rounded-xl p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide font-medium mb-0.5">Courier</p>
                    <p className="text-text-dark text-xs font-semibold">{order.courier}</p>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="bg-green-xlight rounded-xl p-3">
                    <p className="text-[10px] text-text-muted uppercase tracking-wide font-medium mb-0.5">Est. Delivery</p>
                    <p className="text-text-dark text-xs font-semibold">{order.estimatedDelivery}</p>
                  </div>
                )}
              </div>

              {/* Items list */}
              {order.items?.length > 0 && (
                <div>
                  <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium mb-2">Items Ordered</p>
                  <div className="space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5 px-3 bg-green-xlight rounded-lg">
                        <span className="text-text-dark text-sm">{item.name}</span>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <span>×{item.qty}</span>
                          {item.price && <span className="font-semibold text-green-dark">₹{item.price.toLocaleString('en-IN')}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery address */}
              {order.address && (
                <div className="bg-amber-light/40 border border-amber/20 rounded-xl p-3">
                  <p className="text-[10px] text-amber-dark uppercase tracking-wide font-semibold mb-0.5 flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Delivery Address
                  </p>
                  <p className="text-text-dark text-xs leading-relaxed">{order.address}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function EmptyOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6"
    >
      <div className="text-6xl mb-4">🌿</div>
      <h3 className="font-playfair font-bold text-text-dark text-xl mb-2">No orders yet</h3>
      <p className="text-text-muted text-sm max-w-xs mx-auto mb-6">
        Looks like you haven't placed an order with Kannan Farms yet. Explore our natural products!
      </p>
      <Link
        to="/?scroll=products"
        className="inline-flex items-center gap-2 bg-green-dark text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-green-main transition-colors duration-200 no-underline"
      >
        Shop Now
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </motion.div>
  )
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function Profile() {
  const { profile, signOut, userPoints } = useAuth()
  const { orders, loading: ordersLoading, error: ordersError } = useOrders()
  const [signingOut, setSigningOut] = useState(false)
  const [activeTab, setActiveTab] = useState('orders')

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
  }

  const delivered = orders.filter(o => o.status === 'Delivered').length
  const active    = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length

  return (
    <>
      <SEOHead
        title="My Profile — Kannan Farms"
        description="Manage your Kannan Farms account and track your orders."
        noIndex
      />

      <div className="min-h-screen bg-offwhite">

        {/* ── Hero banner ── */}
        <div className="bg-green-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #6EE9A8 0%, transparent 60%), radial-gradient(circle at 80% 20%, #22A85C 0%, transparent 50%)' }}
          />
          <div className="max-w-5xl mx-auto px-5 md:px-10 py-10 md:py-14 relative z-10">
            <Reveal>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {profile?.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover ring-4 ring-white/20 shadow-glow-green"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-green-main flex items-center justify-center ring-4 ring-white/20 shadow-glow-green">
                      <span className="font-playfair font-black text-white text-2xl md:text-3xl">
                        {profile?.initials}
                      </span>
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-mint-glow rounded-full border-2 border-green-dark" title="Online" />
                </div>

                {/* Name / email */}
                <div className="flex-1 min-w-0">
                  <p className="text-white/60 text-xs uppercase tracking-widest font-medium mb-0.5">Welcome back</p>
                  <h1 className="font-playfair font-black text-white text-2xl md:text-3xl leading-tight truncate">
                    {profile?.displayName}
                  </h1>
                  <p className="text-white/60 text-sm mt-1 truncate">{profile?.email}</p>
                </div>

                {/* Sign-out */}
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {signingOut ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full"
                    />
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  )}
                  Sign Out
                </button>
              </div>
            </Reveal>

            {/* Stats chips */}
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { label: 'Total Orders',     value: orders.length, icon: '📦' },
                  { label: 'Active',            value: active,        icon: '🚚' },
                  { label: 'Delivered',         value: delivered,     icon: '✅' },
                  { label: 'Reward Points',     value: userPoints || 0, icon: '🌿' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5">
                    <span className="text-base">{stat.icon}</span>
                    <div>
                      <p className="text-white font-bold font-playfair text-lg leading-none">{stat.value}</p>
                      <p className="text-white/50 text-[10px] uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="max-w-5xl mx-auto px-5 md:px-10">
          <div className="flex gap-1 border-b border-border-green pt-2">
            {[
              { id: 'orders',  label: 'Order Tracking', icon: '📦' },
              { id: 'profile', label: 'Profile Details', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 -mb-px transition-all duration-200
                  ${activeTab === tab.id
                    ? 'border-green-dark text-green-dark'
                    : 'border-transparent text-text-muted hover:text-text-dark'}`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
                {tab.id === 'orders' && active > 0 && (
                  <span className="ml-1 w-5 h-5 bg-amber text-green-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                    {active}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab panels ── */}
        <div className="max-w-5xl mx-auto px-5 md:px-10 py-8">
          <AnimatePresence mode="wait">

            {/* ── Orders tab ── */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {ordersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 border-4 border-green-light border-t-green-vivid rounded-full"
                    />
                    <p className="text-text-muted text-sm">Fetching your orders…</p>
                  </div>
                ) : ordersError ? (
                  <div className="text-center py-16 px-6">
                    <p className="text-red-500 text-sm mb-4">{ordersError}</p>
                    <p className="text-text-muted text-xs">Please refresh the page or try again later.</p>
                  </div>
                ) : orders.length === 0 ? (
                  <EmptyOrders />
                ) : (
                  <div className="space-y-4">
                    <p className="text-text-muted text-xs uppercase tracking-widest font-medium">
                      {orders.length} order{orders.length !== 1 ? 's' : ''} found
                    </p>
                    {orders.map((order) => (
                      <Reveal key={order.id}>
                        <OrderCard order={order} />
                      </Reveal>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Profile tab ── */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="max-w-xl space-y-5"
              >
                {/* Contact information */}
                <div className="bg-white rounded-2xl border border-border-green shadow-card overflow-hidden">
                  <div className="px-5 py-4 border-b border-border-green/60 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-light rounded-lg flex items-center justify-center text-base">👤</div>
                    <h2 className="font-playfair font-semibold text-text-dark text-[16px]">Contact Information</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    {[
                      { label: 'Full Name',       value: profile?.displayName, icon: '🧑' },
                      { label: 'Email Address',   value: profile?.email,       icon: '📧' },
                      { label: 'Account ID',      value: profile?.uid?.slice(0, 16) + '…', icon: '🔑' },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="flex items-start gap-3">
                        <span className="text-lg mt-0.5">{icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-text-muted uppercase tracking-widest font-medium mb-0.5">{label}</p>
                          <p className="text-text-dark text-sm font-medium truncate">{value || '—'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Authentication method */}
                <div className="bg-white rounded-2xl border border-border-green shadow-card p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-green-light rounded-lg flex items-center justify-center text-base">🔒</div>
                    <h2 className="font-playfair font-semibold text-text-dark text-[16px]">Sign-In Method</h2>
                  </div>
                  <div className="flex items-center gap-3 bg-green-xlight rounded-xl px-4 py-3">
                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <div>
                      <p className="text-text-dark text-sm font-semibold">Google Account</p>
                      <p className="text-text-muted text-xs">Signed in via Google OAuth 2.0</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-green-main text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-vivid" />
                      Active
                    </span>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-white rounded-2xl border border-red-100 shadow-card p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-base">⚠️</div>
                    <h2 className="font-playfair font-semibold text-text-dark text-[16px]">Session</h2>
                  </div>
                  <p className="text-text-muted text-xs mb-4">
                    Signing out will end your current session. Your order history will remain safely stored.
                  </p>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
                  >
                    Sign Out of Kannan Farms
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </>
  )
}
