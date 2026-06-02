import { useState, useCallback } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SEOHead, { productSchema } from '../components/SEOHead'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { useProducts } from '../context/ProductContext'

export default function ProductDetail() {
  const { slug } = useParams()
  const { products, loading } = useProducts()

  if (loading) {
    return (
      <div className="min-h-screen bg-offwhite flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-green-light border-t-green-main rounded-full animate-spin" />
        <p className="text-text-muted font-dm text-sm tracking-wide">
          Loading Product Details…
        </p>
      </div>
    )
  }

  const product = products.find((p) => p.slug === slug)

  if (!product || product.hidden) return <Navigate to="/404" replace />

  return <ProductDetailInner product={product} products={products} />
}

// Separated so hooks always run after null check
function ProductDetailInner({ product, products }) {
  const related = (product.relatedProducts || [])
    .map((relSlug) => products.find((p) => p.slug === relSlug))
    .filter(Boolean)
    .filter((p) => !p.hidden) // Do not recommend hidden products
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(0)
  const [qty, setQty]     = useState(1)
  const [added, setAdded] = useState(false)

  const handleThumb = useCallback((i) => {
    if (i !== activeImg) setActiveImg(i)
  }, [activeImg])

  const handleAddToCart = () => {
    const cart  = JSON.parse(localStorage.getItem('kf_cart') || '[]')
    const key   = `${product.id}_${product.sizes[selectedSize].weight}`
    const existing = cart.findIndex((i) => i.key === key)
    if (existing >= 0) cart[existing].qty += qty
    else cart.push({ key, name: product.name, size: product.sizes[selectedSize], qty, slug: product.slug })
    localStorage.setItem('kf_cart', JSON.stringify(cart))
    window.dispatchEvent(new Event('kf_cart_update'))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <SEOHead
        title={product.seo.title}
        description={product.seo.description}
        keywords={product.seo.keywords}
        ogTitle={product.seo.ogTitle}
        ogDescription={product.seo.ogDescription}
        ogImage={product.heroImage}
        ogType="product"
        canonical={`/product/${product.slug}`}
        structuredData={productSchema(product)}
      />

      {/* Breadcrumb */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 mt-8 mb-2">
        <nav className="text-[13px] text-text-muted" aria-label="Breadcrumb">
          <Link to="/" className="text-green-main font-medium hover:underline">Home</Link>
          <span className="mx-2 text-border-green">/</span>
          <Link to="/#products" className="text-green-main font-medium hover:underline">Our Collection</Link>
          <span className="mx-2 text-border-green">/</span>
          <strong className="text-text-dark font-semibold">{product.name}</strong>
        </nav>
      </div>

      {/* ── PRODUCT LAYOUT ── */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-14 xl:gap-16">

          {/* ── IMAGE GALLERY ── */}
          <div className="flex flex-col-reverse md:flex-row gap-4 lg:flex-1">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 justify-center md:justify-start overflow-x-auto md:overflow-visible">
              {product.images.map((src, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleThumb(i)}
                  className={`
                    flex-shrink-0 w-[70px] h-[70px] md:w-[78px] md:h-[78px] 
                    rounded-xl overflow-hidden border-2 transition-all duration-250
                    ${activeImg === i
                      ? 'border-green-main shadow-[0_4px_14px_rgba(27,138,76,0.2)]'
                      : 'border-border-green hover:border-green-main/60'
                    }
                  `}
                  aria-label={`View ${product.name} image ${i + 1}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <img
                    src={src}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://placehold.co/78x78/EDFAF3/1B8A4C?text=${i + 1}`
                    }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Main image with fade transition */}
            <div className="flex-1 relative bg-white border-2 border-border-green rounded-3xl overflow-hidden aspect-square max-h-[520px]"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.04)' }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images[activeImg]}
                  alt={`${product.name} — view ${activeImg + 1}`}
                  className="w-full h-full object-contain p-6"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  onError={(e) => {
                    e.target.src = `https://placehold.co/520x520/EDFAF3/1B8A4C?text=${encodeURIComponent(product.name)}`
                  }}
                />
              </AnimatePresence>

              {/* Badge overlay */}
              <div className="absolute top-4 left-4 bg-green-main text-white text-[11px] font-semibold tracking-[1px] uppercase px-3 py-1.5 rounded-full z-10">
                {product.badge}
              </div>

              {/* Image counter dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleThumb(i)}
                    className={`rounded-full transition-all duration-200 ${
                      activeImg === i ? 'w-5 h-2 bg-green-main' : 'w-2 h-2 bg-green-main/30 hover:bg-green-main/60'
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── PRODUCT DETAILS ── */}
          <div className="lg:flex-1 flex flex-col justify-start">
            {/* Badge + title */}
            <span className="self-start bg-green-main text-white text-[11px] font-semibold tracking-[1px] uppercase px-3 py-1.5 rounded-full mb-3.5">
              {product.badge}
            </span>
            <h1
              className="font-playfair font-black text-text-dark leading-[1.1] mb-2"
              style={{ fontSize: 'clamp(28px, 4vw, 44px)' }}
            >
              {product.name}
            </h1>
            <p className="text-text-muted text-[15px] italic mb-4">{product.tagline}</p>

            {/* Stars */}
            <div className="flex items-center gap-2 mb-5">
              <span className="text-amber text-[15px] tracking-[1px]">★★★★★</span>
              <span className="text-[13px] text-text-muted">(120 reviews)</span>
            </div>

            {/* Description */}
            <p className="text-[15px] text-text-muted leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Highlights */}
            <div className="bg-white border border-border-green rounded-2xl p-5 mb-6">
              <h3 className="text-[12px] uppercase tracking-[1.2px] text-text-muted font-semibold mb-3.5">Highlights</h3>
              <ul className="space-y-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[14px] text-text-dark">
                    <span className="text-green-vivid text-[12px] mt-[3px]">✦</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Size selector */}
            <div className="mb-5">
              <div className="text-[12px] uppercase tracking-[1.2px] text-text-muted font-semibold mb-2.5">
                Select Size
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {product.sizes.map((s, i) => (
                  <button
                    key={s.weight}
                    onClick={() => setSelectedSize(i)}
                    className={`px-4 py-2.5 rounded-xl border-2 text-[13px] font-medium transition-all duration-200 ${
                      selectedSize === i
                        ? 'bg-green-main text-white border-green-main shadow-glow-green'
                        : 'bg-white text-text-dark border-border-green hover:border-green-main/60'
                    }`}
                  >
                    <span className="font-semibold">{s.weight}</span>
                    <span className="block text-[11px] mt-0.5 opacity-80">{s.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="font-playfair font-black text-[30px] text-green-main leading-none">
                {product.sizes[selectedSize].price}
              </span>
              <span className="text-[13px] text-text-muted">/ {product.sizes[selectedSize].weight}</span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* Qty */}
              <div className="flex items-center bg-white border-2 border-border-green rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-[18px] font-semibold text-text-dark hover:bg-green-xlight hover:text-green-dark transition-colors duration-200"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[32px] text-center text-[15px] font-semibold text-text-dark">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-[18px] font-semibold text-text-dark hover:bg-green-xlight hover:text-green-dark transition-colors duration-200"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <motion.button
                onClick={handleAddToCart}
                className="flex-1 min-w-[180px] flex items-center justify-center gap-2.5 font-dm font-semibold text-[15px] text-white rounded-xl py-[14px] px-8 transition-all duration-300"
                style={{ background: added ? '#0F5C32' : '#1B8A4C', boxShadow: '0 6px 20px rgba(27,138,76,0.3)' }}
                whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(27,138,76,0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span key="added" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex items-center gap-2">
                      ✓ Added to Cart
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="flex items-center gap-2">
                      🛒 Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-green-xlight border border-green-light text-green-dark text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── */}
      <div className="bg-white border-t border-border-green border-b px-5 py-5">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 md:gap-10">
          {[['🌾','Farm Direct'],['🚫','No Additives'],['☀️','Sun Dried'],['📦','Fresh Packed'],['💯','100% Pure']].map(([icon, label]) => (
            <div key={label} className="flex items-center gap-2.5 text-green-dark font-semibold text-[13px]">
              <span className="text-xl">{icon}</span>{label}
            </div>
          ))}
        </div>
      </div>

      {/* ── DEEP DETAIL CONTENT ── */}
      <section className="bg-white py-20 px-5 md:px-10">
        <div className="max-w-[900px] mx-auto">

          {/* Benefits grid */}
          <Reveal>
            <h2 className="font-playfair font-black text-[28px] md:text-[34px] text-text-dark mb-3">
              Health Benefits
            </h2>
            <p className="text-[16px] text-text-muted leading-relaxed mb-8">
              Every spoon of {product.name} delivers measurable nutrition your body can feel.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-12">
            {product.benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="flex items-start gap-3.5 bg-green-xlight border border-green-light rounded-2xl p-4">
                  <span className="text-[18px] flex-shrink-0 mt-0.5">{b.icon}</span>
                  <div>
                    <div className="text-[14px] font-semibold text-text-dark mb-0.5">{b.title}</div>
                    <div className="text-[13px] text-text-muted leading-relaxed">{b.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Usage */}
          <Reveal>
            <h2 className="font-playfair font-black text-[22px] text-text-dark mb-4">
              How to Use
            </h2>
            <div className="bg-offwhite border-l-4 border-green-main rounded-r-2xl p-5 mb-10">
              <p className="text-[15px] text-text-dark font-medium leading-relaxed">{product.usage}</p>
            </div>
          </Reveal>

          {/* About the farm paragraph */}
          <Reveal>
            <h2 className="font-playfair font-black text-[22px] text-text-dark mb-3">
              Our Promise
            </h2>
            <p className="text-[15px] text-text-muted leading-relaxed mb-4">
              At Kannan Farms, every batch of {product.name} begins on our own land in Tamil Nadu, where we control every step from soil to shelf. We never use synthetic pesticides, artificial preservatives, or flavor enhancers. Our stone-grinding and traditional drying methods have been refined over years to extract the maximum nutritional value from each harvest.
            </p>
            <p className="text-[15px] text-text-muted leading-relaxed">
              When you open a packet of Kannan Farms powder, you're receiving a product that has been grown, processed, and packed by the same family that cares deeply about your wellbeing. That's a promise we make with every order.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="section-pad bg-offwhite border-t border-border-green">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <p className="eyebrow">You May Also Like</p>
              <h2 className="font-playfair font-black text-[30px] md:text-[38px] text-text-dark text-center mb-12">
                Complete Your Wellness Routine
              </h2>
            </Reveal>
            <div className="flex flex-wrap justify-center gap-7">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
