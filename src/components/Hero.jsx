import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants = {
  hidden:  { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  return (
    <section className="relative bg-green-dark overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{ background: 'rgba(34,168,92,0.07)', top: '-250px', left: '-180px' }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ background: 'rgba(34,168,92,0.07)', bottom: '-120px', right: '-100px' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 5, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[220px] h-[220px] rounded-full"
          style={{ background: 'rgba(34,168,92,0.07)', top: '35%', left: '62%' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 py-24 md:py-32 lg:py-40 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-7">
            <span
              className="flex items-center gap-2 text-[11px] tracking-[2px] uppercase font-semibold px-5 py-2 rounded-full"
              style={{
                background: 'rgba(34,168,92,0.15)',
                border: '1px solid rgba(34,168,92,0.45)',
                color: '#6EE9A8',
              }}
            >
              <span>✦</span>
              100% Natural &amp; Pure
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-playfair font-black text-white leading-[1.06] mb-5"
            style={{ fontSize: 'clamp(42px, 7vw, 86px)' }}
          >
            From Our Farm
            <br />
            To Your{' '}
            <em
              className="not-italic"
              style={{ color: '#6EE9A8' }}
            >
              Wellness
            </em>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={itemVariants}
            className="text-[17px] leading-relaxed font-light max-w-[520px] mx-auto mb-10"
            style={{ color: 'rgba(255,255,255,0.68)' }}
          >
            Premium natural powders from the finest farms — pure, potent, and packed with nature's best nutrition.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary text-[15px] cursor-pointer"
            >
              Shop Now
              <ArrowRight />
            </button>
            <button
              onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-outline-white text-[15px] cursor-pointer"
            >
              How It Works
            </button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 opacity-30"
            >
              <span className="text-white text-[10px] tracking-[2px] uppercase">Scroll</span>
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <rect x="1" y="1" width="14" height="22" rx="7" stroke="white" strokeWidth="1.5"/>
                <circle cx="8" cy="8" r="2.5" fill="white"/>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="relative z-10" style={{ lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" height="60" width="100%">
          <path fill="#F7FDF4" d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z"/>
        </svg>
      </div>
    </section>
  )
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="8" x2="13" y2="8"/>
      <polyline points="9,4 13,8 9,12"/>
    </svg>
  )
}
