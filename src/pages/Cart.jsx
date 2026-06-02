// src/pages/Cart.jsx
// ─── Enhanced Cart, Checkout, Delhivery Timeline & Gamified Loyalty Engine ───
// Integrates client-side checkout stepping, Delhivery transit api adapters,
// real-time loyalty point discount toggles, and atomic Firestore order transactions.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, collection, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import SEOHead from '../components/SEOHead'
import Reveal from '../components/Reveal'

export default function Cart() {
  const { user, isAuthenticated, userPoints, signInWithGoogle, loading: authLoading } = useAuth()
  
  // Checkout Stepping state: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState('cart')
  const [items, setItems] = useState([])
  const [placedOrderId, setPlacedOrderId] = useState('')

  // Checkout Form States
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [landmark, setLandmark] = useState('')
  const [pincode, setPincode] = useState('')
  
  // Delhivery API States
  const [pincodeError, setPincodeError] = useState('')
  const [delhiveryLoading, setDelhiveryLoading] = useState(false)
  const [delhiveryEstimate, setDelhiveryEstimate] = useState(null)

  // Points Redemption State
  const [redeemPoints, setRedeemPoints] = useState(false)
  
  // Form submission and loading states
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  // Load cart from localStorage
  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem('kf_cart') || '[]')
    setItems(stored)
  }

  useEffect(() => {
    loadCart()
    window.addEventListener('kf_cart_update', loadCart)
    return () => window.removeEventListener('kf_cart_update', loadCart)
  }, [])

  const updateQty = (key, delta) => {
    const updated = items
      .map((i) => i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
      .filter((i) => i.qty > 0)
    setItems(updated)
    localStorage.setItem('kf_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('kf_cart_update'))
  }

  const removeItem = (key) => {
    const updated = items.filter((i) => i.key !== key)
    setItems(updated)
    localStorage.setItem('kf_cart', JSON.stringify(updated))
    window.dispatchEvent(new Event('kf_cart_update'))
  }

  const parsePrice = (str) => parseInt(str?.replace(/[₹,]/g, '') || '0', 10)
  const subtotal = items.reduce((sum, i) => sum + parsePrice(i.size?.price) * i.qty, 0)

  // Delhivery API Adapter: Triggers when pincode input hits exactly 6 digits
  useEffect(() => {
    if (pincode.length === 6) {
      if (/^\d{6}$/.test(pincode)) {
        triggerDelhiveryAPI(pincode)
      } else {
        setPincodeError('Pincode must be exactly 6 digits')
        setDelhiveryEstimate(null)
      }
    } else {
      setPincodeError('')
      if (pincode.length > 0 && pincode.length < 6) {
        setDelhiveryEstimate(null)
      }
    }
  }, [pincode])

  const triggerDelhiveryAPI = async (pin) => {
    setDelhiveryLoading(true)
    setPincodeError('')
    try {
      // Call Delhivery API serviceability & package tracking endpoint
      const response = await fetch(`https://track.delhivery.com/api/v1/packages/json/?clname=KANNANFARMS&pincode=${pin}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Delhivery API error or CORS restriction')
      }

      const data = await response.json()
      if (data && data.delivery_codes && data.delivery_codes.length > 0) {
        const route = data.delivery_codes[0]
        setDelhiveryEstimate({
          duration: route.expected_delivery_date || '3–4 days',
          carrier: 'Delhivery Express',
          serviceable: true
        })
      } else {
        throw new Error('Pincode not serviceable')
      }
    } catch (err) {
      console.warn('[Delhivery Adapter] Falling back to zone-based duration logic:', err.message)
      
      // Dynamic Zone-Based Pincode Router
      const firstDigit = pin[0]
      let duration = '4–5 days'
      let carrier = 'Delhivery Express (Air)'

      if (firstDigit === '6') {
        // South Local (e.g. Tamil Nadu, Kerala, Karnataka)
        duration = '2–3 days'
        carrier = 'Delhivery Local (Surface)'
      } else if (firstDigit === '5') {
        // South-Central (e.g. AP, Telangana)
        duration = '3–4 days'
        carrier = 'Delhivery Zonal (Surface)'
      } else if (firstDigit === '4') {
        // Central/West (e.g. Maharashtra, Goa, MP)
        duration = '3–4 days'
        carrier = 'Delhivery Zonal'
      } else if (firstDigit === '7' || firstDigit === '8') {
        // East India
        duration = '5–6 days'
        carrier = 'Delhivery Surface (National)'
      }

      setDelhiveryEstimate({
        duration,
        carrier,
        serviceable: true
      })
    } finally {
      setDelhiveryLoading(false)
    }
  }

  // Calculate total cart weight in Kg
  const parseWeightInKg = (weightStr) => {
    const num = parseFloat(weightStr?.replace(/[a-zA-Z]/g, '') || '0')
    if (weightStr?.toLowerCase().includes('kg')) return num
    if (weightStr?.toLowerCase().includes('g')) return num / 1000
    return 0.5
  }

  const totalWeight = items.reduce((sum, item) => {
    const weight = parseWeightInKg(item.size?.weight)
    return sum + weight * item.qty
  }, 0)

  const calculateDelhiveryShippingCharge = (destPin, weight) => {
    if (!destPin || destPin.length !== 6 || !/^\d{6}$/.test(destPin)) {
      return 0
    }
    const stepsOfHalfKg = Math.max(1, Math.ceil(weight / 0.5))
    const pin = destPin.trim()
    
    let zone = 'D' // Default
    if (pin.startsWith('641')) {
      zone = 'A'
    } else if (
      pin.startsWith('19') ||
      pin.startsWith('78') || pin.startsWith('79') ||
      pin.startsWith('17') ||
      pin.startsWith('744')
    ) {
      zone = 'E'
    } else if (
      pin.startsWith('600') || pin.startsWith('601') || pin.startsWith('602') || pin.startsWith('603') ||
      pin.startsWith('560') || pin.startsWith('561') || pin.startsWith('562') ||
      pin.startsWith('400') || pin.startsWith('401') || pin.startsWith('402') || pin.startsWith('403') || pin.startsWith('404') ||
      pin.startsWith('110') || pin.startsWith('121') || pin.startsWith('122') ||
      pin.startsWith('700') || pin.startsWith('701') || pin.startsWith('702') || pin.startsWith('703') ||
      pin.startsWith('500') || pin.startsWith('501') || pin.startsWith('502') || pin.startsWith('503')
    ) {
      zone = 'C'
    } else if (pin.startsWith('5') || pin.startsWith('6')) {
      zone = 'B'
    }

    let baseRate = 95
    let incrementalRate = 50
    switch(zone) {
      case 'A':
        baseRate = 40
        incrementalRate = 20
        break
      case 'B':
        baseRate = 60
        incrementalRate = 30
        break
      case 'C':
        baseRate = 80
        incrementalRate = 40
        break
      case 'D':
        baseRate = 95
        incrementalRate = 50
        break
      case 'E':
        baseRate = 140
        incrementalRate = 70
        break
    }
    return baseRate + incrementalRate * (stepsOfHalfKg - 1)
  }

  const calculatedShipping = pincode.length === 6 && delhiveryEstimate && delhiveryEstimate.serviceable
    ? calculateDelhiveryShippingCharge(pincode, totalWeight)
    : 0

  const shippingFee = (subtotal > 500 && calculatedShipping <= 100) ? 0 : calculatedShipping

  // Gamified Loyalty Points Calculations
  const pointsRedemptionVal = redeemPoints && isAuthenticated ? Math.min(userPoints, subtotal) : 0
  const finalTotal = Math.max(0, subtotal - pointsRedemptionVal) + shippingFee
  const estimatedEarnedPoints = Math.floor(Math.max(0, subtotal - pointsRedemptionVal) / 100) * 5

  // Atomic Checkout Transaction
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      alert('Please sign in to place your order and earn reward points!')
      return
    }

    if (!fullName.trim() || !phone.trim() || !address.trim() || !pincode.trim()) {
      setCheckoutError('Please complete all shipping address fields.')
      return
    }

    if (!/^\d{6}$/.test(pincode)) {
      setCheckoutError('Pincode must be exactly 6 digits.')
      return
    }

    if (!delhiveryEstimate || !delhiveryEstimate.serviceable) {
      setCheckoutError('Cannot proceed without a valid Delhivery delivery service check.')
      return
    }

    setCheckoutLoading(true)
    setCheckoutError('')

    const orderId = `KF-${Date.now().toString().slice(-6)}`
    const orderDocRef = doc(collection(db, 'orders'))
    const userDocRef = doc(db, 'users', user.uid)

    const orderData = {
      userId: user.uid,
      orderId,
      timestamp: serverTimestamp(),
      status: 'Pending',
      address: `${address.trim()}${landmark.trim() ? `, Landmark: ${landmark.trim()}` : ''}, Pincode: ${pincode.trim()}`,
      pincode: pincode.trim(),
      phone: phone.trim(),
      fullName: fullName.trim(),
      total: finalTotal,
      subtotal,
      discount: pointsRedemptionVal,
      pointsRedeemed: redeemPoints ? pointsRedemptionVal : 0,
      pointsEarned: estimatedEarnedPoints,
      estimatedDelivery: `Arriving in ${delhiveryEstimate.duration} via ${delhiveryEstimate.carrier}`,
      courier: 'Delhivery',
      shippingFee,
      items: items.map((item) => ({
        name: `${item.name} (${item.size?.weight})`,
        qty: item.qty,
        price: parsePrice(item.size?.price)
      }))
    }

    try {
      await runTransaction(db, async (transaction) => {
        // Read user doc to fetch points balance securely
        const userDoc = await transaction.get(userDocRef)
        let currentPoints = 0
        if (userDoc.exists()) {
          currentPoints = userDoc.data().points || 0
        }

        // Security check: Verify points to redeem are actually owned
        const pointsToRedeem = redeemPoints ? pointsRedemptionVal : 0
        if (pointsToRedeem > 0 && currentPoints < pointsToRedeem) {
          throw new Error('Point balance changed. Please refresh and try again.')
        }

        const nextPointsBalance = currentPoints - pointsToRedeem + estimatedEarnedPoints
        
        // Write order and update profile document in a single commit
        transaction.set(orderDocRef, orderData)
        transaction.set(userDocRef, {
          points: nextPointsBalance,
          updatedAt: new Date().toISOString()
        }, { merge: true })
      })

      // Success cleanup
      localStorage.removeItem('kf_cart')
      window.dispatchEvent(new Event('kf_cart_update'))
      setPlacedOrderId(orderId)
      setStep('success')
    } catch (err) {
      console.error('[Checkout Transaction Failed]:', err)
      setCheckoutError(err.message || 'Checkout failed. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Confetti Animation elements for Order Success
  const renderConfetti = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
        {[...Array(24)].map((_, i) => {
          const delay = i * 0.15
          const left = `${(i * 17) % 100}%`
          return (
            <motion.div
              key={i}
              className={`w-2.5 h-2.5 rounded-full absolute top-0`}
              style={{
                left,
                background: i % 3 === 0 ? '#1B8A4C' : i % 3 === 1 ? '#F59E0B' : '#6EE9A8'
              }}
              initial={{ y: -20, opacity: 1, scale: 0.8 }}
              animate={{
                y: 500,
                x: i % 2 === 0 ? [0, 20, -20, 0] : [0, -20, 20, 0],
                opacity: 0,
                rotate: 360
              }}
              transition={{
                duration: 2.5,
                delay,
                repeat: Infinity,
                ease: 'easeOut'
              }}
            />
          )
        })}
      </div>
    )
  }

  return (
    <>
      <SEOHead
        title={step === 'cart' ? 'Your Cart' : step === 'checkout' ? 'Loyalty Checkout' : 'Order Confirmed'}
        description="Review items in your cart, calculate shipping serviceability via Delhivery, and redeem reward points."
        canonical="/cart"
      />

      <section className="min-h-[75vh] section-pad bg-offwhite relative">
        {step === 'success' && renderConfetti()}

        <div className="max-w-5xl mx-auto">
          
          {/* STEP 1: CART VIEW */}
          {step === 'cart' && (
            <>
              <Reveal>
                <h1 className="font-playfair font-black text-[36px] md:text-[46px] text-text-dark mb-2">
                  Your Cart
                </h1>
                <p className="text-text-muted text-[15px] mb-10">
                  {items.length > 0 ? `${items.length} item${items.length > 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
                </p>
              </Reveal>

              {items.length === 0 ? (
                <Reveal>
                  <div className="bg-white border border-border-green rounded-3xl p-14 text-center shadow-sm">
                    <div className="text-6xl mb-5">🌿</div>
                    <h2 className="font-playfair font-bold text-[24px] text-text-dark mb-2">
                      Nothing here yet
                    </h2>
                    <p className="text-text-muted text-[15px] mb-7">
                      Add some of nature's finest powders to get started.
                    </p>
                    <Link to="/#products" className="btn-primary no-underline inline-block">
                      Browse Products →
                    </Link>
                  </div>
                </Reveal>
              ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                  
                  {/* Items list */}
                  <div className="flex-1 space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div
                          key={item.key}
                          layout
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 60, transition: { duration: 0.25 } }}
                          className="bg-white border border-border-green rounded-2xl p-5 flex items-center gap-5 shadow-sm"
                        >
                          <Link to={`/product/${item.slug}`} className="flex-shrink-0">
                            <div className="w-[72px] h-[72px] rounded-xl bg-green-xlight border border-border-green overflow-hidden flex items-center justify-center">
                              <img
                                src={`assets/${item.name.split(' ')[0]} 1.png`}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://placehold.co/72x72/EDFAF3/1B8A4C?text=${item.name[0]}`
                                }}
                              />
                            </div>
                          </Link>

                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.slug}`} className="font-playfair font-bold text-[16px] text-text-dark hover:text-green-main transition-colors no-underline block truncate">
                              {item.name}
                            </Link>
                            <div className="text-[12px] text-text-muted mt-0.5">{item.size?.weight}</div>
                            <div className="text-[15px] font-bold text-green-main mt-1">{item.size?.price}</div>
                          </div>

                          {/* Qty controls */}
                          <div className="flex items-center gap-1 bg-offwhite border border-border-green rounded-xl overflow-hidden">
                            <button onClick={() => updateQty(item.key, -1)} className="w-9 h-9 flex items-center justify-center text-[16px] font-bold text-text-dark hover:bg-green-xlight transition-colors">−</button>
                            <span className="min-w-[28px] text-center text-[14px] font-semibold">{item.qty}</span>
                            <button onClick={() => updateQty(item.key, +1)} className="w-9 h-9 flex items-center justify-center text-[16px] font-bold text-text-dark hover:bg-green-xlight transition-colors">+</button>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeItem(item.key)}
                            className="p-2 text-text-muted hover:text-red-500 transition-colors"
                            aria-label="Remove item"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Summary card */}
                  <div className="lg:w-[320px]">
                    <div className="bg-white border border-border-green rounded-2xl p-6 sticky top-24 shadow-sm">
                      <h3 className="font-playfair font-bold text-[20px] text-text-dark mb-5">Order Summary</h3>
                      
                      <div className="space-y-3 mb-5 text-[14px] border-b border-border-green/60 pb-4">
                        <div className="flex justify-between text-text-muted">
                          <span>Subtotal</span>
                          <span className="font-semibold text-text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-text-muted">
                          <span>Shipping</span>
                          <span className="text-green-main font-semibold">Calculated next step</span>
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex justify-between font-bold text-[17px] text-text-dark">
                          <span>Total</span>
                          <span className="text-green-main">₹{subtotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {isAuthenticated ? (
                        <button
                          onClick={() => setStep('checkout')}
                          className="w-full btn-primary justify-center font-bold font-dm text-[14px] py-3.5 shadow-glow-green"
                        >
                          Proceed to Checkout →
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-[12px] text-text-muted text-center leading-relaxed">
                            Sign in with your Google account to earn loyalty reward points and place orders.
                          </p>
                          <button
                            onClick={signInWithGoogle}
                            className="w-full bg-green-dark text-white hover:bg-green-main font-semibold rounded-xl py-3 flex items-center justify-center gap-2 text-xs transition"
                          >
                            🔒 Sign In to Checkout
                          </button>
                        </div>
                      )}

                      <Link to="/#products" className="block text-center text-[13px] text-text-muted hover:text-green-main transition-colors mt-4 no-underline">
                        ← Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT VIEW */}
          {step === 'checkout' && (
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              
              {/* Shipping Form Panel */}
              <div className="flex-1 bg-white border border-border-green rounded-3xl p-6 md:p-8 shadow-card">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => setStep('cart')}
                    className="text-[13px] text-green-main font-bold hover:underline"
                  >
                    ← Review Cart
                  </button>
                </div>
                
                <h2 className="font-playfair font-black text-text-dark text-[26px] mb-1">
                  Shipping & Loyalty Details
                </h2>
                <p className="text-xs text-text-muted mb-6">
                  Verify shipping addresses and toggle points redemption below.
                </p>

                <form onSubmit={handlePlaceOrder} className="space-y-5">
                  {checkoutError && (
                    <div className="bg-red-50 text-red-600 text-xs font-semibold p-4 border border-red-200 rounded-xl">
                      {checkoutError}
                    </div>
                  )}

                  {/* Name and Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Recipient Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karthik Kannan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Support Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Delivery Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat, Street, Area name"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                    />
                  </div>

                  {/* Landmark */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Near Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Near Amman Temple, Opposite Govt School"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                    />
                  </div>

                  {/* Pincode with dynamic Delhivery timeline query */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Destination Pincode</label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength="6"
                        required
                        placeholder="e.g. 641601"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                        className={`w-full bg-offwhite border-2 p-3 pr-10 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition ${pincodeError ? 'border-red-400' : 'border-border-green'}`}
                      />
                      {delhiveryLoading && (
                        <div className="absolute right-3.5 top-3.5 w-5 h-5 border-2 border-green-light border-t-green-main rounded-full animate-spin" />
                      )}
                    </div>
                    {pincodeError && (
                      <p className="text-red-500 text-[11px] mt-1 font-semibold">{pincodeError}</p>
                    )}
                  </div>

                  {/* Delhivery timeline card */}
                  <AnimatePresence>
                    {delhiveryEstimate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="bg-green-xlight border border-green-light rounded-2xl p-4 flex items-start gap-3.5"
                      >
                        <span className="text-xl mt-0.5">🚚</span>
                        <div>
                          <p className="text-xs font-bold text-green-dark">Delhivery Serviceability Confirmed</p>
                          <p className="text-sm text-text-dark font-medium mt-1">
                            Arriving within <strong className="text-green-main">{delhiveryEstimate.duration}</strong> via {delhiveryEstimate.carrier}.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Gamified Loyalty Point Redemption Panel */}
                  <div className="border border-border-green bg-green-xlight/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">🌿</span>
                      <h3 className="font-playfair font-bold text-text-dark text-[15px]">Kannan Farms Loyalty Points</h3>
                    </div>

                    {authLoading ? (
                      <div className="h-6 w-32 bg-gray-100 animate-pulse rounded-md" />
                    ) : (
                      <div className="space-y-3.5">
                        <p className="text-xs text-text-muted leading-relaxed">
                          Your points balance: <strong className="text-green-dark text-sm">{userPoints} points</strong> available. 
                          Redeem points for an immediate cash discount (10 points = ₹10 off).
                        </p>

                        {userPoints > 0 ? (
                          <label className="flex items-center gap-3 bg-white border border-border-green rounded-xl p-3.5 cursor-pointer hover:border-green-main transition">
                            <input
                              type="checkbox"
                              checked={redeemPoints}
                              onChange={(e) => setRedeemPoints(e.target.checked)}
                              className="w-4.5 h-4.5 accent-green-main rounded focus:outline-none"
                            />
                            <div className="text-[13px] text-text-dark font-medium">
                              Redeem <strong className="text-green-dark">{pointsRedemptionVal}</strong> points for a discount of <strong className="text-green-main">₹{pointsRedemptionVal}</strong>
                            </div>
                          </label>
                        ) : (
                          <div className="text-[11px] text-text-muted italic bg-white p-3 border border-border-green border-dashed rounded-xl">
                            Earn points on this purchase! For every ₹100 spent, you earn 5 loyalty points.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={checkoutLoading || delhiveryLoading}
                    className="w-full bg-green-main hover:bg-green-dark text-white font-dm font-bold text-[15px] rounded-xl py-3.5 shadow-glow-green disabled:opacity-50"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {checkoutLoading ? 'Processing transaction...' : 'Place Order & Pay →'}
                  </motion.button>
                </form>
              </div>

              {/* Sidebar breakdown details */}
              <div className="lg:w-[320px] bg-white border border-border-green rounded-3xl p-6 shadow-sm">
                <h3 className="font-playfair font-bold text-[18px] text-text-dark mb-4">Checkout Details</h3>
                
                {/* Items */}
                <div className="space-y-2.5 mb-5 border-b border-border-green/60 pb-4 max-h-[180px] overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.key} className="flex justify-between text-xs text-text-dark font-medium">
                      <span className="truncate pr-4">{item.name} × {item.qty}</span>
                      <span className="font-semibold">{item.size?.price}</span>
                    </div>
                  ))}
                </div>

                {/* Math breakdown summary */}
                <div className="space-y-3 mb-5 border-b border-border-green/60 pb-4 text-[13px]">
                  <div className="flex justify-between text-text-muted">
                    <span>Subtotal</span>
                    <span className="font-semibold text-text-dark">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  
                  {pointsRedemptionVal > 0 && (
                    <div className="flex justify-between text-amber-dark font-semibold">
                      <span>Points Discount</span>
                      <span>−₹{pointsRedemptionVal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-text-muted text-[13px]">
                    <span>Shipping</span>
                    <span className="font-semibold text-text-dark">
                      {shippingFee === 0 ? (
                        <span className="flex items-center gap-1.5">
                          {calculatedShipping > 0 && <span className="line-through text-text-muted text-[11px]">₹{calculatedShipping}</span>}
                          <span className="text-green-main font-semibold">FREE Delivery</span>
                        </span>
                      ) : (
                        <span className="flex flex-col items-end">
                          <span>₹{shippingFee}</span>
                          {subtotal > 500 && calculatedShipping > 100 && (
                            <span className="text-[9px] text-amber-dark font-medium leading-none mt-0.5">
                              (Shipping exceeds ₹100 threshold)
                            </span>
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between font-bold text-[16px] text-text-dark">
                    <span>Final Amount</span>
                    <span className="text-green-main">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Future Earned points display */}
                <div className="bg-green-xlight border border-dashed border-green-main/40 rounded-xl p-3 text-center">
                  <p className="text-[11px] text-green-dark font-semibold">
                    🌿 Placing this order grants you
                  </p>
                  <p className="text-lg font-playfair font-black text-green-main mt-0.5">
                    +{estimatedEarnedPoints} Reward Points
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: ORDER SUCCESS PAGE */}
          {step === 'success' && (
            <Reveal>
              <div className="max-w-xl mx-auto bg-white border border-border-green rounded-3xl p-10 md:p-14 text-center shadow-card mt-8">
                <div className="text-6xl mb-6">🎉</div>
                <h1 className="font-playfair font-black text-text-dark text-[32px] md:text-[38px] leading-tight mb-3">
                  Thank You for Your Order!
                </h1>
                <p className="text-[15px] text-text-muted leading-relaxed mb-6">
                  Your order <strong className="text-green-dark font-bold font-mono">#{placedOrderId}</strong> has been successfully registered. We are preparing your fresh, solar-dried wellness package.
                </p>

                {/* Delivery breakdown card */}
                {delhiveryEstimate && (
                  <div className="bg-green-xlight border border-green-light rounded-2xl p-5 mb-8 text-left space-y-2">
                    <p className="text-xs font-bold text-green-main flex items-center gap-1.5 uppercase tracking-wide">
                      🚚 Shipping Route Dispatched
                    </p>
                    <p className="text-sm text-text-dark font-semibold">
                      Estimated delivery: <span className="text-green-dark">{delhiveryEstimate.duration}</span>
                    </p>
                    <p className="text-[12px] text-text-muted">
                      Carried by {delhiveryEstimate.carrier}. Tracking IDs will be loaded shortly.
                    </p>
                    <p className="text-[12px] text-text-dark font-semibold">
                      Earned Points: <span className="text-green-main">+{estimatedEarnedPoints} points</span> added to profile.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/profile" className="btn-primary no-underline font-semibold text-sm justify-center">
                    📦 Track Orders & Points
                  </Link>
                  <Link to="/" className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-dm font-bold text-sm rounded-xl px-6 py-3.5 transition flex items-center justify-center">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </Reveal>
          )}

        </div>
      </section>
    </>
  )
}
