import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import FloatingJars from './FloatingJars'

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
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 py-20 md:py-28 lg:py-36">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          <motion.div
            className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left"
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
                <LeafIcon />
                100% Natural &amp; Pure
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="font-playfair font-black text-white leading-[1.06] mb-5"
              style={{ fontSize: 'clamp(42px, 5.5vw, 68px)' }}
            >
              From Our Farm
              <br />
              To Your{' '}
              <em className="not-italic" style={{ color: '#6EE9A8' }}>
                Wellness
              </em>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-[17px] leading-relaxed font-light max-w-[520px] mb-10"
              style={{ color: 'rgba(255,255,255,0.68)' }}
            >
              Premium natural powders from the finest farms — pure, potent, and packed with nature's best nutrition.
            </motion.p>

            {/* Mobile-only Mockup (shown only on mobile between subtext and CTA) */}
            <motion.div 
              className="lg:hidden w-full flex justify-center my-6"
              variants={itemVariants}
            >
              <FloatingJars />
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary text-[15px] cursor-pointer"
              >
                Shop Now
                <ArrowRight />
              </button>
            </motion.div>

            {/* Trust micro-strip */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-5 mt-10 justify-center lg:justify-start"
            >
              {[
                { icon: <ShieldIcon />, label: 'FSSAI Certified' },
                { icon: <LeafIcon />,   label: 'No Additives' },
                { icon: <TruckIcon />,  label: 'Farm Direct' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                  <span style={{ color: '#6EE9A8' }}>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Interactive Mockup right side */}
          <motion.div 
            className="hidden lg:flex w-full lg:w-1/2 justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <FloatingJars />
          </motion.div>



        </div>
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



function LeafIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}
