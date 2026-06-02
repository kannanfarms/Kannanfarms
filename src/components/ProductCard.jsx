import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function ProductCard({ product, index = 0 }) {
  const ref        = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  // Raw motion values for mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring-smooth the raw values
  const springConfig = { stiffness: 200, damping: 25, mass: 0.8 }
  const smoothX = useSpring(mouseX, springConfig)
  const smoothY = useSpring(mouseY, springConfig)

  // Map smoothed values to rotation
  const rotateX = useTransform(smoothY, [-0.5, 0.5], ['8deg', '-8deg'])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ['-8deg', '8deg'])

  // Subtle glare overlay position
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%'])

  function handleMouseMove(e) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: '1000px' }}
    >
      <motion.article
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[340px] max-w-full bg-white border-2 border-border-green rounded-3xl overflow-hidden cursor-pointer select-none"
        whileHover={{ borderColor: 'rgba(27,138,76,0.8)' }}
        transition={{ duration: 0.3 }}
        aria-label={`View ${product.name}`}
      >
        {/* Glare overlay */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-30 opacity-0"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.18) 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Drop shadow elevation on hover */}
        <motion.div
          className="absolute -inset-px rounded-3xl pointer-events-none z-0"
          style={{
            boxShadow: hovered
              ? '0 30px 70px rgba(27,138,76,0.22), 0 10px 30px rgba(15,92,50,0.12)'
              : '0 4px 16px rgba(15,92,50,0.06)',
          }}
          transition={{ duration: 0.35 }}
        />

        {/* Image area */}
        <div className="relative h-[260px] bg-green-xlight overflow-hidden">
          {/* Skeleton shimmer while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-green-xlight via-green-light to-green-xlight" />
          )}
          <motion.img
            src={product.heroImage}
            alt={product.name}
            className="w-full h-full object-cover"
            style={{ opacity: imgLoaded ? 1 : 0 }}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.src = `https://placehold.co/340x260/EDFAF3/1B8A4C?text=${encodeURIComponent(product.name)}`
              setImgLoaded(true)
            }}
          />

          {/* Badge */}
          <div className="absolute top-3.5 left-3.5 z-10 bg-green-main text-white text-[11px] font-semibold tracking-[1px] uppercase px-3 py-1.5 rounded-full">
            {product.badge}
          </div>

          {/* Gradient overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent" />
        </div>

        {/* Card body */}
        <div className="p-6">
          <h3 className="font-playfair font-bold text-[22px] text-text-dark mb-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-[13px] text-text-muted leading-relaxed mb-4 line-clamp-2">
            {product.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-green-xlight border border-green-light text-green-dark text-[11px] font-medium px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-[1px]">Starting from</div>
              <div className="text-[20px] font-bold text-green-main leading-tight">
                {product.sizes?.[0]?.price || '₹ View Price'}
              </div>
            </div>
            <Link
              to={`/product/${product.slug}`}
              className="btn-primary text-[13px] px-5 py-3 no-underline"
              tabIndex={0}
            >
              Buy Now →
            </Link>
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}
