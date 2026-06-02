// src/pages/AdminDashboard.jsx
// ─── Administrative Management Dashboard for Kannan Farms ──────────────────
// Enforces complete inventory CRUD operations, real-time metrics trackers,
// automated SEO synthesizers, and side-by-side stock balance sheets.

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, getDocs, writeBatch, doc, query, orderBy, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import SEOHead from '../components/SEOHead'

const INITIAL_FORM = {
  name: '',
  shortName: '',
  badge: 'Pure Organic',
  tagline: 'Nature\'s gold, straight from our fields',
  description: '',
  images: 'assets/Banana 1.png', // comma-separated strings or default path
  tags: 'Natural, Pure, Organic',
  usage: 'Mix 1–2 teaspoons daily into warm water, milk, or smoothies.',
  category: 'superfood-powders',
  highlights: [
    '100% natural and grown on chemical-free soil',
    'Cold stone-ground to preserve full enzymes',
    'Sun-dried naturally for maximum nutrient retention'
  ],
  benefits: [
    { icon: '🌱', title: '100% Preservative Free', desc: 'Crafted with zero chemical preservatives or fillers.' },
    { icon: '☀️', title: 'Solar Dried Purity', desc: 'Sun-dried under natural daylight to lock in nutrients.' }
  ],
  sizes: [
    { weight: '250g', price: '₹249', stock: 50 },
    { weight: '500g', price: '₹449', stock: 30 }
  ]
}

export default function AdminDashboard() {
  const { products, addProduct, updateProduct, updateStock, toggleProductVisibility } = useProducts()
  const { profile, signOut } = useAuth()
  
  // UI States
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [newHighlight, setNewHighlight] = useState('')
  
  // Festive Promotions Batch distributor state
  const [bonusPoints, setBonusPoints] = useState('')
  const [distributing, setDistributing] = useState(false)
  const [distResult, setDistResult] = useState('')

  // Active Tab state: 'inventory' | 'orders'
  const [activeTab, setActiveTab] = useState('inventory')
  
  // Orders management states
  const [orders, setOrders] = useState([])
  const [orderFilter, setOrderFilter] = useState('All')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

  // Fetch orders in real-time when activeTab is orders OR to show the alert badge on mount
  useEffect(() => {
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, orderBy('timestamp', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList = []
      snapshot.forEach((docSnap) => {
        ordersList.push({ id: docSnap.id, ...docSnap.data() })
      })
      setOrders(ordersList)
    }, (err) => {
      console.error('[AdminDashboard] Fetch orders failed:', err)
    })

    return () => unsubscribe()
  }, [])

  const handleUpdateOrderStatus = async (orderDocId, newStatus) => {
    setUpdatingOrderId(orderDocId)
    try {
      const order = orders.find((o) => o.id === orderDocId)
      if (!order) return

      const orderRef = doc(db, 'orders', orderDocId)
      
      // If status is Shipped and stock has not been reduced yet
      if (newStatus === 'Shipped' && !order.inventoryReduced) {
        const batch = writeBatch(db)
        
        for (const item of order.items || []) {
          // Resolve product slug (id)
          const productId = item.id || (item.name.toLowerCase().includes('moringa') ? 'moringa-powder' : 'banana-powder')
          
          // Parse weight size e.g. "500g"
          let sizeWeight = item.sizeWeight
          if (!sizeWeight) {
            const match = item.name.match(/\(([^)]+)\)/)
            if (match) {
              sizeWeight = match[1]
            }
          }
          
          if (!sizeWeight) continue

          const product = products.find(p => p.id === productId)
          if (product && product.sizes) {
            const updatedSizes = product.sizes.map((s) => {
              if (s.weight === sizeWeight) {
                const currentStock = s.stock !== undefined ? s.stock : 50
                return { ...s, stock: Math.max(0, currentStock - item.qty) }
              }
              return s
            })
            const prodRef = doc(db, 'products', productId)
            batch.update(prodRef, {
              sizes: updatedSizes,
              updatedAt: new Date().toISOString()
            })
          }
        }
        
        // Update the order status and set inventoryReduced to true in the batch
        batch.update(orderRef, {
          status: newStatus,
          inventoryReduced: true,
          updatedAt: new Date().toISOString()
        })
        
        await batch.commit()
      } else {
        // Just update status normally
        await updateDoc(orderRef, {
          status: newStatus,
          updatedAt: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('[AdminDashboard] Failed to update order status:', err)
      alert('Failed to update order status. Please try again.')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const formatDate = (ts) => {
    if (!ts) return 'N/A'
    const date = ts.toDate ? ts.toDate() : new Date(ts)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDistributePoints = async (e) => {
    e.preventDefault()
    const pointsNum = parseInt(bonusPoints, 10)
    if (isNaN(pointsNum) || pointsNum <= 0) {
      alert('Please enter a valid positive number for bonus points.')
      return
    }

    setDistributing(true)
    setDistResult('')

    try {
      // 1. Fetch all user profile documents
      const usersColRef = collection(db, 'users')
      const snapshot = await getDocs(usersColRef)
      
      if (snapshot.empty) {
        setDistResult('ℹ️ No registered user accounts found to credit.')
        setDistributing(false)
        return
      }

      // 2. Commit updates in batches of 500 documents (Firestore limit)
      const users = []
      snapshot.forEach((docSnap) => {
        users.push({ id: docSnap.id, data: docSnap.data() })
      })

      let batch = writeBatch(db)
      let count = 0
      let batchCount = 0

      for (let i = 0; i < users.length; i++) {
        const u = users[i]
        const userRef = doc(db, 'users', u.id)
        const currentPoints = u.data.points || 0
        
        batch.set(userRef, {
          points: currentPoints + pointsNum,
          updatedAt: new Date().toISOString()
        }, { merge: true })

        count++

        if (count === 500) {
          await batch.commit()
          batch = writeBatch(db)
          count = 0
          batchCount++
        }
      }

      if (count > 0) {
        await batch.commit()
        batchCount++
      }

      setDistResult(`✅ Successfully distributed +${pointsNum} bonus points to ${users.length} registered accounts across ${batchCount} batches!`)
      setBonusPoints('')
      setTimeout(() => setDistResult(''), 8000)
    } catch (err) {
      console.error('[AdminDashboard] Points distribution error:', err)
      setDistResult('❌ Points distribution failed. Check Firestore rules and collection paths.')
    } finally {
      setDistributing(false)
    }
  }
  
  // Custom states for interactive list inputs
  const [newBenefit, setNewBenefit] = useState({ icon: '✨', title: '', desc: '' })
  const [newSize, setNewSize] = useState({ weight: '', price: '₹', stock: 50 })
  
  // Validation Messages
  const [errors, setErrors] = useState({})
  const [proTip, setProTip] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Watch description to trigger smart organic marketing validations (solar-dried, zero preservatives)
  useEffect(() => {
    const desc = form.description.toLowerCase()
    let tip = ''
    if (desc.length > 5) {
      const hasSolar = desc.includes('solar') || desc.includes('sun')
      const hasPreservative = desc.includes('preservative') || desc.includes('chemical')
      
      if (!hasSolar && !hasPreservative) {
        tip = '💡 Pro-Tip: Add details about our solar-dried benefits and zero-preservatives guarantee to build customer trust!'
      } else if (!hasSolar) {
        tip = '💡 Pro-Tip: Mention that it is stone-ground and traditionally sun-dried/solar-dried!'
      } else if (!hasPreservative) {
        tip = '💡 Pro-Tip: Explicitly emphasize the 100% preservative-free, pure nature of the farm-to-table process!'
      }
    }
    setProTip(tip)
  }, [form.description])

  // Populate form for editing
  const handleEdit = (p) => {
    setEditingId(p.id)
    setForm({
      name: p.name || '',
      shortName: p.shortName || '',
      badge: p.badge || 'Pure Organic',
      tagline: p.tagline || '',
      description: p.description || '',
      images: Array.isArray(p.images) ? p.images.join(', ') : p.images || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
      usage: p.usage || '',
      category: p.category || 'superfood-powders',
      highlights: p.highlights || [],
      benefits: p.benefits || [],
      sizes: p.sizes || []
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null)
    setForm(INITIAL_FORM)
    setErrors({})
  }

  // Form value change handler
  const handleValueChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  // Highlights management
  const addHighlight = () => {
    if (!newHighlight.trim()) return
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight.trim()]
    }))
    setNewHighlight('')
  }

  const removeHighlight = (idx) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx)
    }))
  }

  // Benefits management
  const addBenefit = () => {
    if (!newBenefit.title.trim() || !newBenefit.desc.trim()) return
    setForm((prev) => ({
      ...prev,
      benefits: [...prev.benefits, { ...newBenefit }]
    }))
    setNewBenefit({ icon: '✨', title: '', desc: '' })
  }

  const removeBenefit = (idx) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== idx)
    }))
  }

  // Sizes management
  const addSize = () => {
    if (!newSize.weight.trim() || !newSize.price.trim()) return
    // Clean price structure
    let cleanPrice = newSize.price.trim()
    if (!cleanPrice.startsWith('₹')) cleanPrice = `₹${cleanPrice}`

    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { ...newSize, price: cleanPrice, stock: parseInt(newSize.stock, 10) || 0 }]
    }))
    setNewSize({ weight: '', price: '₹', stock: 50 })
  }

  const removeSize = (idx) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== idx)
    }))
  }

  // Form Validation and Submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!form.name.trim()) newErrors.name = 'Product name is required'
    if (!form.shortName.trim()) newErrors.shortName = 'Short name is required'
    if (!form.description.trim()) newErrors.description = 'Detailed description is required'
    if (form.sizes.length === 0) newErrors.sizes = 'At least one packaging size/price is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Scroll to errors
      window.scrollTo({ top: 120, behavior: 'smooth' })
      return
    }

    // Process lists and values
    const imagesArray = form.images.split(',').map((img) => img.trim()).filter(Boolean)
    const tagsArray = form.tags.split(',').map((t) => t.trim()).filter(Boolean)

    // Synthesize SEO fields automatically if editing / adding new
    const seoTitle = `${form.name} — Solar-Dried & 100% Pure | Kannan Farms`
    const seoDescription = `Buy premium chemical-free ${form.name} online from Kannan Farms. 100% natural, traditionally solar-dried & cold stone-ground, free of preservatives.`
    const seoKeywords = `${form.name.toLowerCase()}, organic ${form.name.toLowerCase()}, preservative free, solar-dried, Kannan Farms`

    const finalProductData = {
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      badge: form.badge.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      images: imagesArray,
      heroImage: imagesArray[0] || 'assets/Logowoback.png',
      tags: tagsArray,
      usage: form.usage.trim(),
      category: form.category,
      highlights: form.highlights,
      benefits: form.benefits,
      sizes: form.sizes,
      seo: {
        title: seoTitle,
        description: seoDescription,
        keywords: seoKeywords,
        ogTitle: seoTitle,
        ogDescription: seoDescription
      }
    }

    try {
      if (editingId) {
        await updateProduct(editingId, finalProductData)
        setSuccessMsg(`🎉 Successfully updated "${form.name}"`)
        setEditingId(null)
      } else {
        await addProduct(finalProductData)
        setSuccessMsg(`🎉 Successfully added "${form.name}" to inventory`)
      }
      setForm(INITIAL_FORM)
      setErrors({})
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      console.error(err)
      setErrors({ api: 'Database operation failed. Check connection & permissions.' })
    }
  }

  // Calculate high-level warehouse statistics
  const totalProducts = products.length
  const hiddenProducts = products.filter((p) => p.hidden).length
  const activeProducts = totalProducts - hiddenProducts
  const totalWarehouseStock = products.reduce((acc, p) => {
    const pStock = p.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0
    return acc + pStock
  }, 0)

  return (
    <>
      <SEOHead
        title="Admin Portal — Kannan Farms"
        description="Private Administrative Dashboard for product configuration and live stock synchronization."
        canonical="/admin"
      />

      <div className="bg-offwhite min-h-screen py-10 px-5 md:px-10 lg:px-16">
        <div className="max-w-[1440px] mx-auto mt-6">
          
          {/* Header Strip */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border-green pb-6 mb-8 gap-4">
            <div>
              <p className="eyebrow text-left m-0">Kannan Farms Console</p>
              <h1 className="font-playfair font-black text-text-dark text-[32px] md:text-[40px] leading-tight">
                Management Dashboard
              </h1>
              <p className="text-[13px] text-text-muted mt-1">
                Authenticated as: <span className="font-semibold text-green-dark">{profile?.email}</span> (Owner Mode)
              </p>
            </div>
            <button
              onClick={signOut}
              className="self-start md:self-center bg-white/80 hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-dm font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              Sign Out Securely
            </button>
          </div>

          {/* Real-Time Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="bg-white border border-border-green rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-2">🌿</div>
              <div className="text-[12px] uppercase tracking-wider text-text-muted font-bold">Total Catalog</div>
              <div className="text-3xl font-playfair font-black text-text-dark mt-1">{totalProducts} Products</div>
            </div>
            <div className="bg-white border border-border-green rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-2">🟢</div>
              <div className="text-[12px] uppercase tracking-wider text-text-muted font-bold">Active Listings</div>
              <div className="text-3xl font-playfair font-black text-green-main mt-1">{activeProducts} Active</div>
            </div>
            <div className="bg-white border border-border-green rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-[12px] uppercase tracking-wider text-text-muted font-bold">Warehouse Balance</div>
              <div className="text-3xl font-playfair font-black text-text-dark mt-1">{totalWarehouseStock} Packs</div>
            </div>
            <div className="bg-white border border-border-green rounded-2xl p-6 shadow-sm">
              <div className="text-3xl mb-2">👁️</div>
              <div className="text-[12px] uppercase tracking-wider text-text-muted font-bold">Hidden Products</div>
              <div className="text-3xl font-playfair font-black text-amber mt-1">{hiddenProducts} Private</div>
            </div>
          </div>

          {/* Success messages */}
          <AnimatePresence>
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-green-xlight border-2 border-green-main text-green-dark rounded-2xl p-5 mb-8 flex items-center gap-3 font-semibold"
              >
                <span>{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Promotions Distribution Panel */}
          <div className="bg-white border border-border-green rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center gap-2.5 mb-2.5">
              <span className="text-2xl">🎁</span>
              <h2 className="font-playfair font-bold text-[19px] text-text-dark">
                Festive Loyalty Promotions & Bonus Distribution Console
              </h2>
            </div>
            <p className="text-[13px] text-text-muted mb-4">
              Distribute a batch of bonus points to all registered customer profile documents in Firestore atomically (e.g. Credit 50 points as a festive gift).
            </p>
            <form onSubmit={handleDistributePoints} className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="w-full sm:w-64">
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Enter Bonus Points (e.g., 50)"
                  value={bonusPoints}
                  onChange={(e) => setBonusPoints(e.target.value)}
                  className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                />
              </div>
              <motion.button
                type="submit"
                disabled={distributing}
                className="w-full sm:w-auto bg-green-main hover:bg-green-dark text-white font-dm font-bold text-[14px] rounded-xl px-6 py-3.5 shadow-glow-green disabled:opacity-50"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {distributing ? 'Distributing batch writes...' : 'Distribute Bonus Points'}
              </motion.button>
            </form>
            {distResult && (
              <p className="text-xs font-semibold text-green-dark mt-3 leading-relaxed bg-green-xlight border border-green-light p-2.5 rounded-lg">
                {distResult}
              </p>
            )}
          </div>

          {/* Tab Selector */}
          <div className="flex gap-6 border-b border-border-green/60 pb-px mb-8 mt-4">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`font-dm font-bold text-sm pb-3 px-2 relative transition-all ${
                activeTab === 'inventory'
                  ? 'text-green-dark border-b-2 border-green-main'
                  : 'text-text-muted hover:text-green-main'
              }`}
            >
              📦 Inventory Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`font-dm font-bold text-sm pb-3 px-2 relative transition-all ${
                activeTab === 'orders'
                  ? 'text-green-dark border-b-2 border-green-main'
                  : 'text-text-muted hover:text-green-main'
              }`}
            >
              📋 Orders Management
              {orders.filter(o => o.status === 'Pending').length > 0 && (
                <span className="ml-2 bg-amber text-green-dark text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {orders.filter(o => o.status === 'Pending').length} new
                </span>
              )}
            </button>
          </div>

          {activeTab === 'inventory' ? (
            /* Main workspace grid */
            <div className="flex flex-col lg:flex-row gap-10">

            {/* Left side: CRUD Console Form */}
            <div className="lg:w-[48%] flex-shrink-0">
              <div className="bg-white border border-border-green rounded-3xl p-6 md:p-8 shadow-card sticky top-24">
                <h2 className="font-playfair font-bold text-[24px] text-text-dark mb-1">
                  {editingId ? '✍️ Edit Product Listing' : '🌱 Register New Product'}
                </h2>
                <p className="text-[13px] text-text-muted mb-6">
                  {editingId ? 'Modify existing catalog details. Changes sync instantly on submit.' : 'Add a farm-direct natural powder to Kannan Farms catalogue.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {errors.api && (
                    <div className="bg-red-50 text-red-600 text-xs font-semibold p-3.5 border border-red-200 rounded-xl">
                      {errors.api}
                    </div>
                  )}

                  {/* Name and Short Name */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Banana Powder"
                        value={form.name}
                        onChange={(e) => handleValueChange('name', e.target.value)}
                        className={`w-full bg-offwhite border-2 p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition ${errors.name ? 'border-red-400' : 'border-border-green'}`}
                      />
                      {errors.name && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Short Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Banana"
                        value={form.shortName}
                        onChange={(e) => handleValueChange('shortName', e.target.value)}
                        className={`w-full bg-offwhite border-2 p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition ${errors.shortName ? 'border-red-400' : 'border-border-green'}`}
                      />
                      {errors.shortName && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.shortName}</p>}
                    </div>
                  </div>

                  {/* Badge & Tagline */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Highlight Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. Best Seller"
                        value={form.badge}
                        onChange={(e) => handleValueChange('badge', e.target.value)}
                        className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => handleValueChange('category', e.target.value)}
                        className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                      >
                        <option value="superfood-powders">Superfood Powders</option>
                        <option value="organic-spices">Organic Spices</option>
                        <option value="traditional-supplements">Traditional Supplements</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Product Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g. Nature's perfect weight-gain superfood"
                      value={form.tagline}
                      onChange={(e) => handleValueChange('tagline', e.target.value)}
                      className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                    />
                  </div>

                  {/* Description with dynamic assistant Pro-Tip validation alerts */}
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Detailed Description</label>
                    <textarea
                      rows="3"
                      placeholder="Describe the product, focusing on sun-dried process, zero additives, and nutrient values..."
                      value={form.description}
                      onChange={(e) => handleValueChange('description', e.target.value)}
                      className={`w-full bg-offwhite border-2 p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition ${errors.description ? 'border-red-400' : 'border-border-green'}`}
                    />
                    {errors.description && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.description}</p>}
                    {proTip && (
                      <p className="text-amber-dark font-dm font-semibold text-[11px] mt-1 leading-relaxed bg-amber-light/35 border border-amber-light p-2 rounded-lg">
                        {proTip}
                      </p>
                    )}
                  </div>

                  {/* Images & Tags comma separated */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Images Array Links</label>
                      <input
                        type="text"
                        placeholder="comma separated URLs"
                        value={form.images}
                        onChange={(e) => handleValueChange('images', e.target.value)}
                        className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                      />
                      <span className="text-[10px] text-text-muted mt-0.5 block">Separate paths with a comma</span>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Catalog Tags</label>
                      <input
                        type="text"
                        placeholder="Weight Gain, Kids Friendly..."
                        value={form.tags}
                        onChange={(e) => handleValueChange('tags', e.target.value)}
                        className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                      />
                      <span className="text-[10px] text-text-muted mt-0.5 block">Separate tags with a comma</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-text-dark mb-1.5">Directions for Usage</label>
                    <input
                      type="text"
                      placeholder="e.g. Mix 2-3 tablespoons in warm milk..."
                      value={form.usage}
                      onChange={(e) => handleValueChange('usage', e.target.value)}
                      className="w-full bg-offwhite border-2 border-border-green p-3 text-[14px] rounded-xl focus:border-green-main focus:outline-none transition"
                    />
                  </div>

                  {/* Dynamic Size and Weight Configuration */}
                  <div className="border border-border-green bg-green-xlight/30 rounded-2xl p-4">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-green-dark mb-2">Packaging Sizes & Prices</label>
                    {form.sizes.length > 0 ? (
                      <div className="space-y-2 mb-3.5">
                        {form.sizes.map((s, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-white border border-border-green rounded-xl py-2 px-3 text-[13px]">
                            <div>
                              <span className="font-semibold text-text-dark">{s.weight}</span>
                              <span className="mx-2 text-border-green">|</span>
                              <span className="font-bold text-green-main">{s.price}</span>
                              <span className="mx-2 text-border-green">|</span>
                              <span className="text-text-muted">Stock: <strong className="text-text-dark">{s.stock}</strong></span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSize(idx)}
                              className="text-red-500 hover:text-red-700 text-xs font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-text-muted italic mb-3">No pack sizes defined yet.</p>
                    )}

                    {/* Inline Size Inputs */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Size (e.g., 200g)"
                        value={newSize.weight}
                        onChange={(e) => setNewSize((prev) => ({ ...prev, weight: e.target.value }))}
                        className="bg-white border border-border-green rounded-xl p-2.5 text-[12px] flex-1 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Price (₹)"
                        value={newSize.price}
                        onChange={(e) => setNewSize((prev) => ({ ...prev, price: e.target.value }))}
                        className="bg-white border border-border-green rounded-xl p-2.5 text-[12px] w-[75px] focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={newSize.stock}
                        onChange={(e) => setNewSize((prev) => ({ ...prev, stock: e.target.value }))}
                        className="bg-white border border-border-green rounded-xl p-2.5 text-[12px] w-[65px] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addSize}
                        className="bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl px-3 py-2"
                      >
                        + Add
                      </button>
                    </div>
                    {errors.sizes && <p className="text-red-500 text-[11px] mt-1.5 font-semibold">{errors.sizes}</p>}
                  </div>

                  {/* Highlights configuration list */}
                  <div className="border border-border-green bg-green-xlight/30 rounded-2xl p-4">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-green-dark mb-2">Highlights List</label>
                    <div className="space-y-1.5 mb-3.5">
                      {form.highlights.map((h, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white border border-border-green rounded-xl py-2 px-3 text-[12px]">
                          <span className="text-text-dark truncate flex-1 pr-4">{h}</span>
                          <button
                            type="button"
                            onClick={() => removeHighlight(idx)}
                            className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add selling bullet point..."
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="bg-white border border-border-green rounded-xl p-2.5 text-[12px] flex-1 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl px-3 py-2"
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  {/* Core Benefits grid constructor */}
                  <div className="border border-border-green bg-green-xlight/30 rounded-2xl p-4">
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-green-dark mb-2">Interactive Benefits (Grid)</label>
                    {form.benefits.length > 0 && (
                      <div className="space-y-1.5 mb-3.5">
                        {form.benefits.map((b, idx) => (
                          <div key={idx} className="flex justify-between items-start bg-white border border-border-green rounded-xl p-2.5 text-[12px] gap-2">
                            <span className="text-[16px]">{b.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-text-dark">{b.title}</div>
                              <div className="text-[11px] text-text-muted line-clamp-1">{b.desc}</div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBenefit(idx)}
                              className="text-red-500 hover:text-red-700 text-[11px] font-bold"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={newBenefit.icon}
                          onChange={(e) => setNewBenefit((prev) => ({ ...prev, icon: e.target.value }))}
                          className="bg-white border border-border-green rounded-xl p-2 text-xs w-[52px]"
                        >
                          <option>⚡</option><option>🌱</option><option>☀️</option><option>💪</option>
                          <option>🧠</option><option>👶</option><option>🦴</option><option>✨</option>
                          <option>🛡️</option><option>🩸</option><option>⚖️</option><option>🔥</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Benefit Title (e.g. Brain Support)"
                          value={newBenefit.title}
                          onChange={(e) => setNewBenefit((prev) => ({ ...prev, title: e.target.value }))}
                          className="bg-white border border-border-green rounded-xl p-2.5 text-[12px] flex-1 focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Short benefit description..."
                          value={newBenefit.desc}
                          onChange={(e) => setNewBenefit((prev) => ({ ...prev, desc: e.target.value }))}
                          className="bg-white border border-border-green rounded-xl p-2.5 text-[12px] flex-1 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={addBenefit}
                          className="bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl px-3"
                        >
                          + Add Benefit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Submission buttons */}
                  <div className="flex gap-3 pt-3">
                    <motion.button
                      type="submit"
                      className="flex-1 bg-green-main hover:bg-green-dark text-white font-dm font-bold text-[14px] rounded-xl py-3.5 shadow-glow-green"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingId ? '💾 Save Changes' : '📦 Launch Product'}
                    </motion.button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-dm font-bold text-[14px] rounded-xl px-6 py-3.5 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Specialized Stock & Visibility Inventory tracking table */}
            <div className="flex-1">
              <div className="bg-white border border-border-green rounded-3xl p-6 md:p-8 shadow-card">
                <h2 className="font-playfair font-bold text-[24px] text-text-dark mb-1">
                  📦 Warehouse Inventory Tracker
                </h2>
                <p className="text-[13px] text-text-muted mb-6">
                  Dynamic balance sheets. Click + / - increments to atomically adjust stock configurations instantly.
                </p>

                {products.length === 0 ? (
                  <div className="text-center py-14">
                    <p className="text-text-muted italic">Seeding initial catalog... Standby.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {products.map((p) => {
                      const totalProdStock = p.sizes?.reduce((sum, s) => sum + (s.stock || 0), 0) || 0;
                      
                      return (
                        <div
                          key={p.id}
                          className={`border rounded-2xl p-5 transition relative overflow-hidden ${
                            p.hidden
                              ? 'bg-gray-50/70 border-gray-200 opacity-80'
                              : 'bg-white border-border-green shadow-sm hover:border-green-main'
                          }`}
                        >
                          {/* Top row details */}
                          <div className="flex justify-between items-start gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              {/* Small Thumbnail placeholder */}
                              <div className="w-12 h-12 bg-green-xlight border border-border-green rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                                <img
                                  src={p.images && p.images[0] ? (p.images[0].startsWith('/') ? p.images[0].slice(1) : p.images[0]) : 'assets/Logowoback.png'}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = `https://placehold.co/48x48/EDFAF3/1B8A4C?text=${p.shortName[0]}`
                                  }}
                                />
                              </div>
                              <div>
                                <h3 className="font-playfair font-bold text-[18px] text-text-dark flex items-center gap-2">
                                  {p.name}
                                  {p.badge && (
                                    <span className="bg-green-light text-green-dark text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      {p.badge}
                                    </span>
                                  )}
                                </h3>
                                <p className="text-[12px] text-text-muted italic">{p.tagline}</p>
                              </div>
                            </div>

                            {/* Action links */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(p)}
                                className="bg-green-xlight hover:bg-green-light text-green-dark font-dm font-bold text-[11px] px-3.5 py-1.5 rounded-lg border border-border-green transition"
                              >
                                Edit Details
                              </button>
                              <button
                                onClick={() => toggleProductVisibility(p.id, !p.hidden)}
                                className={`font-dm font-bold text-[11px] px-3.5 py-1.5 rounded-lg border transition ${
                                  p.hidden
                                    ? 'bg-amber-light/40 border-amber text-amber-dark hover:bg-amber-light/75'
                                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {p.hidden ? '👁️ Unhide' : '🚫 Hide'}
                              </button>
                            </div>
                          </div>

                          {/* Sizes table for stock balances */}
                          <div className="bg-offwhite rounded-xl border border-border-green overflow-hidden">
                            <table className="w-full text-left text-[12px]">
                              <thead>
                                <tr className="border-b border-border-green text-green-dark bg-green-xlight/30">
                                  <th className="py-2.5 px-3 font-bold w-[30%]">Pack Size</th>
                                  <th className="py-2.5 px-3 font-bold w-[25%]">Price</th>
                                  <th className="py-2.5 px-3 font-bold w-[45%] text-right">Warehouse stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                {p.sizes && p.sizes.map((s, sIdx) => {
                                  const isLow = (s.stock || 0) <= 10;
                                  const isOut = (s.stock || 0) === 0;

                                  return (
                                    <tr key={sIdx} className="border-b border-border-green last:border-0 hover:bg-green-xlight/15">
                                      <td className="py-2 px-3 font-medium text-text-dark">{s.weight}</td>
                                      <td className="py-2 px-3 font-bold text-green-main">{s.price}</td>
                                      <td className="py-2 px-3 text-right">
                                        <div className="flex items-center justify-end gap-2.5">
                                          {/* Stock indicators */}
                                          {isOut ? (
                                            <span className="text-[10px] text-red-500 font-bold bg-red-50 border border-red-100 rounded-md px-2 py-0.5">
                                              OUT OF STOCK
                                            </span>
                                          ) : isLow ? (
                                            <span className="text-[10px] text-amber-dark font-bold bg-amber-light border border-amber-light rounded-md px-2 py-0.5">
                                              LOW STOCK ({s.stock})
                                            </span>
                                          ) : (
                                            <span className="text-[11px] text-text-dark font-semibold">
                                              {s.stock} in stock
                                            </span>
                                          )}

                                          {/* Increment Decrement Controls */}
                                          <div className="flex bg-white border border-border-green rounded-lg overflow-hidden flex-shrink-0">
                                            <button
                                              onClick={() => updateStock(p.id, s.weight, -1)}
                                              className="w-7 h-7 flex items-center justify-center text-text-dark font-bold hover:bg-green-xlight transition-colors"
                                              aria-label="Decrease stock"
                                            >
                                              −
                                            </button>
                                            <button
                                              onClick={() => updateStock(p.id, s.weight, 1)}
                                              className="w-7 h-7 flex items-center justify-center text-text-dark font-bold hover:bg-green-xlight border-l border-border-green transition-colors"
                                              aria-label="Increase stock"
                                            >
                                              +
                                            </button>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Status overlay bar */}
                          <div className="mt-3.5 flex justify-between items-center text-[10px] text-text-muted font-dm uppercase tracking-wider font-semibold">
                            <span>Status: {p.hidden ? <strong className="text-red-500">Private / Hidden</strong> : <strong className="text-green-vivid">Live on Storefront</strong>}</span>
                            <span>Total stock: {totalProdStock} packs</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
          ) : (
            /* Orders Tab Content */
            <div className="space-y-6">
              {/* Filter controls */}
              <div className="flex flex-wrap gap-2 bg-white border border-border-green rounded-2xl p-4 shadow-sm items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((filterVal) => {
                    const count = filterVal === 'All' ? orders.length : orders.filter(o => o.status === filterVal).length;
                    return (
                      <button
                        key={filterVal}
                        onClick={() => setOrderFilter(filterVal)}
                        className={`font-dm font-bold text-xs px-3.5 py-2 rounded-lg border transition ${
                          orderFilter === filterVal
                            ? 'bg-green-main border-green-main text-white'
                            : 'bg-offwhite border-border-green text-green-dark hover:bg-green-xlight'
                        }`}
                      >
                        {filterVal} ({count})
                      </button>
                    )
                  })}
                </div>
                <div className="text-xs text-text-muted font-medium">
                  Showing {orders.filter(o => orderFilter === 'All' ? true : o.status === orderFilter).length} order{orders.filter(o => orderFilter === 'All' ? true : o.status === orderFilter).length !== 1 && 's'}
                </div>
              </div>

              {/* Orders List */}
              {orders.filter(o => orderFilter === 'All' ? true : o.status === orderFilter).length === 0 ? (
                <div className="bg-white border border-border-green rounded-3xl p-14 text-center shadow-sm">
                  <div className="text-5xl mb-4">📋</div>
                  <h3 className="font-playfair font-bold text-lg text-text-dark mb-1">No Orders Found</h3>
                  <p className="text-text-muted text-xs">
                    {orderFilter === 'All' ? 'No orders have been received yet on this store.' : `No orders with status "${orderFilter}" were found.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.filter(o => orderFilter === 'All' ? true : o.status === orderFilter).map((order) => {
                    const statusColors = {
                      'Pending': 'bg-amber-light text-amber-dark border-amber/30',
                      'Processing': 'bg-blue-50 text-blue-600 border-blue-200',
                      'Shipped': 'bg-cyan-50 text-cyan-600 border-cyan-200',
                      'Out for Delivery': 'bg-purple-50 text-purple-600 border-purple-200',
                      'Delivered': 'bg-green-light text-green-dark border-green-main/30',
                      'Cancelled': 'bg-red-50 text-red-600 border-red-200'
                    };

                    return (
                      <div
                        key={order.id}
                        className="bg-white border border-border-green rounded-3xl p-6 md:p-8 shadow-card flex flex-col gap-6 relative overflow-hidden text-left"
                      >
                        {/* Status bar top */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border-green/40 pb-5">
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono font-bold text-green-dark text-[15px] sm:text-[16px] tracking-wide">
                                {order.orderId || order.id.slice(0, 10)}
                              </span>
                              <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-text-muted mt-1">
                              Ordered on {formatDate(order.timestamp)}
                            </p>
                          </div>

                          {/* Status changer dropdown */}
                          <div className="flex items-center gap-2">
                            <label className="text-[11px] font-bold text-text-dark uppercase tracking-wider">Change Status:</label>
                            <div className="relative flex items-center">
                              <select
                                value={order.status}
                                disabled={updatingOrderId === order.id}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-offwhite border border-border-green rounded-xl py-1.5 px-3 text-xs font-semibold focus:outline-none focus:border-green-main disabled:opacity-50"
                              >
                                {['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((statusOption) => (
                                  <option key={statusOption} value={statusOption}>
                                    {statusOption}
                                  </option>
                                ))}
                              </select>
                              {updatingOrderId === order.id && (
                                <div className="w-3.5 h-3.5 border-2 border-green-light border-t-green-main rounded-full animate-spin ml-2" />
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Customer & Shipping grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px] border-b border-border-green/40 pb-5">
                          {/* Recipient info */}
                          <div>
                            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Customer Info</h4>
                            <p className="font-bold text-text-dark">{order.fullName || 'N/A'}</p>
                            <p className="text-text-muted font-medium mt-1">
                              📞 <a href={`tel:${order.phone}`} className="hover:underline">{order.phone || 'N/A'}</a>
                            </p>
                          </div>

                          {/* Shipping address */}
                          <div className="md:col-span-2">
                            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Shipping Details</h4>
                            <p className="text-text-dark font-medium leading-relaxed">
                              📍 {order.address || 'N/A'}
                            </p>
                            <p className="text-[11px] text-text-muted mt-1.5 italic bg-offwhite border border-border-green/30 px-2 py-1 rounded w-fit">
                              Timeline: {order.estimatedDelivery || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Items summary and Financials breakdown row */}
                        <div className="flex flex-col md:flex-row justify-between gap-6 items-start">
                          {/* Items table */}
                          <div className="flex-1 w-full space-y-2">
                            <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5">Items Ordered</h4>
                            {order.items && order.items.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-xs bg-offwhite/50 border border-border-green/20 rounded-xl p-2 px-3">
                                <span className="font-medium text-text-dark">{item.name || item.title}</span>
                                <span className="font-semibold text-text-dark">
                                  {item.qty} × ₹{item.price}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Financials details card */}
                          <div className="w-full md:w-[260px] bg-green-xlight/30 border border-border-green rounded-2xl p-4 text-xs space-y-2.5">
                            <h4 className="text-[10px] font-bold text-green-dark uppercase tracking-wider mb-2">Billing Details</h4>
                            <div className="flex justify-between text-text-muted">
                              <span>Subtotal</span>
                              <span className="font-semibold text-text-dark">₹{order.subtotal?.toLocaleString('en-IN') || 0}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between text-amber-dark font-semibold">
                                <span>Points Discount</span>
                                <span>−₹{order.discount?.toLocaleString('en-IN') || 0}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-text-muted">
                              <span>Shipping</span>
                              <span className="font-semibold text-text-dark">
                                {order.shippingFee === 0 ? <span className="text-green-main font-bold">FREE</span> : `₹${order.shippingFee}`}
                              </span>
                            </div>
                            <div className="border-t border-border-green/60 pt-2 flex justify-between font-bold text-sm text-text-dark">
                              <span>Total Paid</span>
                              <span className="text-green-main">₹{order.total?.toLocaleString('en-IN') || 0}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
