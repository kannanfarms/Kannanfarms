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

          {/* Left: text */}
          <motion.div
            className="flex-1 text-center lg:text-left"
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
              style={{ fontSize: 'clamp(42px, 5.5vw, 80px)' }}
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
              className="text-[17px] leading-relaxed font-light max-w-[520px] mx-auto lg:mx-0 mb-10"
              style={{ color: 'rgba(255,255,255,0.68)' }}
            >
              Premium natural powders from the finest farms — pure, potent, and packed with nature's best nutrition.
            </motion.p>

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
              <a
                href="https://wa.me/916381594945?text=Hi%20Kannan%20Farms%2C%20I%27d%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-white text-[15px] cursor-pointer flex items-center gap-2"
              >
                <WhatsAppIcon />
                Order via WhatsApp
              </a>
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

          {/* Right: product image */}
          <motion.div
            className="flex-shrink-0 w-full max-w-[420px] lg:max-w-[440px] relative"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Glow behind image */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(34,168,92,0.25) 0%, transparent 70%)',
                transform: 'scale(1.2)',
                filter: 'blur(40px)',
              }}
              aria-hidden="true"
            />
            {/* Floating image */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              <img
                src="assets/Banana 1.png"
                alt="Kannan Farms Banana Powder — natural, stone-ground superfood"
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 30px 50px rgba(0,0,0,0.4))' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </motion.div>

            {/* Floating badge: Best Seller */}
            <motion.div
              className="absolute top-6 -left-4 bg-amber text-green-dark text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              ⭐ Best Seller
            </motion.div>

            {/* Floating badge: Pure */}
            <motion.div
              className="absolute bottom-10 -right-4 text-[11px] font-semibold px-3.5 py-2 rounded-xl shadow-lg"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#6EE9A8' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
            >
              100% Pure
            </motion.div>
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

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
