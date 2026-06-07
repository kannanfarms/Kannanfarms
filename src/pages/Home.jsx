import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { useProducts } from '../context/ProductContext'

// SVG icon components
function SeedlingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}
function SunIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}
function GrindIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  )
}
function BoxIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"/>
      <rect x="1" y="3" width="22" height="5"/>
      <line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  )
}
function FarmIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}
function NoAdditiveIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  )
}
function PackIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  )
}

const STEPS = [
  { icon: <SeedlingIcon />, title: 'Grown Naturally',  desc: 'Cultivated on our own farm without chemicals or pesticides.' },
  { icon: <SunIcon />,      title: 'Sun Dried',        desc: 'Traditionally dried under natural sunlight to preserve nutrients.' },
  { icon: <GrindIcon />,    title: 'Stone Ground',     desc: 'Cold-ground using stone mills to retain full flavour and nutrition.' },
  { icon: <BoxIcon />,      title: 'Packed Fresh',     desc: 'Sealed airtight within hours and delivered straight to you.' },
]

const TESTIMONIALS = [
  {
    stars: 5,
    text: 'My kids love the banana powder in their milk every morning. It\'s pure, tasty, and I can see the difference in their energy!',
    name: 'Priya S.',
    location: 'Chennai, Tamil Nadu',
    initials: 'PS',
    color: '#D4F5E2',
    textColor: '#0F5C32',
  },
  {
    stars: 5,
    text: 'I add Moringa powder to my smoothie daily. The quality is unmatched — you can tell it\'s genuinely fresh from the farm.',
    name: 'Ramesh K.',
    location: 'Coimbatore, Tamil Nadu',
    initials: 'RK',
    color: '#FEF3C7',
    textColor: '#92400E',
  },
  {
    stars: 5,
    text: 'Best natural supplement I\'ve tried. No artificial smell, no fillers — just pure goodness. Will always order from Kannan Farms.',
    name: 'Anitha M.',
    location: 'Tiruppur, Tamil Nadu',
    initials: 'AM',
    color: '#EDFAF3',
    textColor: '#1B8A4C',
  },
]

const FEATURES = [
  { icon: <FarmIcon />,       title: 'Farm Sourced',  desc: 'Directly from our own fields — zero middlemen, maximum freshness.' },
  { icon: <NoAdditiveIcon />, title: 'No Additives',  desc: 'Pure powders with no preservatives, colors, or artificial flavors.' },
  { icon: <SunIcon />,        title: 'Sun Dried',     desc: 'Traditional sun-drying retains all natural nutrients and enzymes.' },
  { icon: <PackIcon />,       title: 'Fresh Packed',  desc: 'Sealed within hours of grinding to lock in freshness and aroma.' },
]

const TRUST = [
  { icon: <FarmIcon />,       label: 'Farm Direct'  },
  { icon: <NoAdditiveIcon />, label: 'No Additives' },
  { icon: <SunIcon />,        label: 'Sun Dried'    },
  { icon: <BoxIcon />,        label: 'Fresh Packed' },
  { icon: <NoAdditiveIcon />, label: '100% Pure'    },
]

// Animated connector line component
function ConnectorLine() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  return (
    <div ref={ref} className="hidden md:block absolute top-9 left-[12%] right-[12%] h-[2px] bg-green-light z-0 overflow-hidden">
      <motion.div
        className="h-full bg-green-main origin-left"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

export default function Home() {
  const { products, loading } = useProducts()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const scrollTarget = params.get('scroll')
    if (scrollTarget) {
      const timer = setTimeout(() => {
        const el = document.getElementById(scrollTarget)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
        navigate(location.pathname, { replace: true })
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [location, navigate])

  const visibleProducts = products.filter((p) => !p.hidden)

  return (
    <>
      <SEOHead
        title="Kannan Farms — Natural Health Products"
        description="Farm-fresh natural powders from Kannan Farms. Premium Nendran Banana Powder and Moringa Powder — 100% pure, no additives, stone-ground and delivered direct from our Tamil Nadu farm."
        keywords="Kannan Farms, banana powder, moringa powder, natural supplements, farm fresh powder, Tamil Nadu organic"
        ogTitle="Kannan Farms — From Our Farm To Your Wellness"
        ogDescription="Premium natural powders. 100% pure, no additives, farm-direct from Tamil Nadu."
        canonical="/"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Kannan Farms',
          url: 'https://www.kannanfarms.in',
          logo: 'https://www.kannanfarms.in/assets/Logowoback.png',
          sameAs: [],
          contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', areaServed: 'IN' },
        }}
      />

      <Hero />
      <StatsBar />

      {/* ── PRODUCTS ── */}
      <section className="section-pad bg-offwhite" id="products">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <p className="eyebrow">Our Collection</p>
            <h2 className="font-playfair font-black text-section-title text-text-dark text-center mb-3.5">
              Nature's Finest Powders
            </h2>
            <p className="text-center text-text-muted text-[15px] leading-relaxed max-w-[480px] mx-auto mb-14">
              Handpicked, sun-dried, and stone-ground — every product carries the soul of the farm.
            </p>
          </Reveal>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-10 h-10 border-4 border-green-light border-t-green-main rounded-full animate-spin" />
              <p className="text-xs text-text-muted font-dm tracking-wider font-semibold">Loading Catalog...</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-7 px-4">
              {visibleProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="bg-white border-t border-border-green border-b px-5 md:px-10 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 md:gap-10">
          {TRUST.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <div className="flex items-center gap-2.5 text-green-dark font-semibold text-[13px]">
                <span className="text-green-main">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section-pad bg-white" id="how">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="eyebrow">The Process</p>
            <h2 className="font-playfair font-black text-section-title text-text-dark text-center mb-3.5">
              From Farm to Your Door
            </h2>
            <p className="text-center text-text-muted text-[15px] leading-relaxed max-w-[460px] mx-auto mb-16">
              Every step is handled with care to give you the purest product possible.
            </p>
          </Reveal>

          <div className="relative">
            <ConnectorLine />

            <div className="flex flex-wrap justify-center gap-0">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.1} className="relative z-10 flex-1 min-w-[160px] max-w-[210px] text-center px-5">
                  <motion.div
                    className="w-[72px] h-[72px] rounded-full bg-green-xlight border-[3px] border-green-light flex items-center justify-center mx-auto mb-4 transition-all duration-300 text-green-main"
                    whileHover={{ background: '#1B8A4C', borderColor: '#1B8A4C', scale: 1.1, color: '#ffffff' }}
                  >
                    {step.icon}
                  </motion.div>
                  <h3 className="text-[15px] font-semibold text-text-dark mb-2">{step.title}</h3>
                  <p className="text-[12px] text-text-muted leading-relaxed">{step.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section-pad bg-green-xlight border-t border-border-green border-b">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="eyebrow">What People Say</p>
            <h2 className="font-playfair font-black text-section-title text-text-dark text-center mb-3.5">
              Loved by Families
            </h2>
            <p className="text-center text-text-muted text-[15px] leading-relaxed max-w-[440px] mx-auto mb-14">
              Real customers, real results — here's what they have to say.
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-5">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <motion.div
                  className="bg-white border border-border-green rounded-2xl p-7 w-full max-w-[320px] transition-all duration-300"
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(27,138,76,0.12)', borderColor: '#1B8A4C' }}
                >
                  {/* Avatar + name row */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold flex-shrink-0"
                      style={{ background: t.color, color: t.textColor }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-text-dark">{t.name}</div>
                      <div className="text-[11px] text-text-muted">{t.location}</div>
                    </div>
                    <div className="ml-auto">
                      <span className="text-[10px] bg-green-xlight text-green-dark border border-green-light px-2 py-0.5 rounded-full font-semibold">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="text-amber text-[16px] tracking-[2px] mb-3">
                    {'★'.repeat(t.stars)}
                  </div>
                  <p className="text-[13px] text-text-muted leading-relaxed italic">
                    "{t.text}"
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY KANNAN FARMS ── */}
      <section className="section-pad bg-green-dark" id="features">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <p className="eyebrow" style={{ color: '#6EE9A8' }}>Why Kannan Farms</p>
            <h2 className="font-playfair font-black text-section-title text-white text-center mb-3.5">
              Rooted in Purity
            </h2>
            <p className="text-center text-[15px] leading-relaxed max-w-[440px] mx-auto mb-14" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Every product is a promise — from our farm to your family.
            </p>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-5">
            {FEATURES.map((feat, i) => (
              <Reveal key={feat.title} delay={i * 0.08}>
                <motion.div
                  className="glass-card rounded-[18px] p-7 w-[220px] text-center transition-all duration-300"
                  whileHover={{ y: -8, background: 'rgba(255,255,255,0.12)', borderColor: 'rgba(110,233,168,0.3)' }}
                >
                  <span className="flex justify-center text-mint-glow mb-3.5">{feat.icon}</span>
                  <div className="text-[15px] font-semibold text-white mb-2">{feat.title}</div>
                  <div className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.58)' }}>{feat.desc}</div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-green-main px-5 py-20 text-center">
        <Reveal>
          <h2 className="font-playfair font-black text-fluid-h2 text-white mb-3.5">
            Ready to Live Healthier?
          </h2>
          <p className="text-[15px] leading-relaxed max-w-[440px] mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Join hundreds of happy families across Tamil Nadu who trust Kannan Farms every day.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-white text-green-dark font-dm font-bold text-[15px] px-10 py-4 rounded-xl transition-all duration-300"
              style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}
              whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(0,0,0,0.2)' }}
            >
              Shop Our Products →
            </motion.button>
            <motion.a
              href="https://wa.me/916381594945?text=Hi%20Kannan%20Farms%2C%20I%27d%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white font-dm font-semibold text-[15px] px-10 py-4 rounded-xl transition-all duration-300"
              style={{ border: '1.5px solid rgba(255,255,255,0.4)' }}
              whileHover={{ y: -3, background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.7)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order via WhatsApp
            </motion.a>
          </div>
        </Reveal>
      </section>

      {/* ── CONTACT US ── */}
      <section className="section-pad bg-white border-t border-border-green" id="contact">
        <div className="max-w-4xl mx-auto px-5">
          <Reveal>
            <p className="eyebrow">Get in Touch</p>
            <h2 className="font-playfair font-black text-section-title text-text-dark text-center mb-3.5">
              Contact Us
            </h2>
            <p className="text-center text-text-muted text-[15px] leading-relaxed max-w-[460px] mx-auto mb-14">
              Have questions, feedback, or need bulk ordering? We'd love to hear from you.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-5">
            <Reveal className="space-y-4">
              <div className="flex items-start gap-4 p-5 bg-green-xlight/40 border border-border-green/50 rounded-2xl">
                <span className="text-green-main mt-0.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-text-dark uppercase tracking-wider mb-1">Our Farm Address</h4>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Mavuthampathi, Coimbatore,<br />Tamil Nadu, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-green-xlight/40 border border-border-green/50 rounded-2xl">
                <span className="text-green-main mt-0.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-text-dark uppercase tracking-wider mb-1">WhatsApp Support</h4>
                  <p className="text-text-muted text-sm font-semibold">
                    <a href="https://wa.me/916381594945" target="_blank" rel="noopener noreferrer" className="text-green-dark hover:text-green-main transition-colors no-underline">
                      +91 63815 94945
                    </a>
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal className="space-y-4" delay={0.1}>
              <div className="flex items-start gap-4 p-5 bg-green-xlight/40 border border-border-green/50 rounded-2xl">
                <span className="text-green-main mt-0.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-text-dark uppercase tracking-wider mb-1">Email Address</h4>
                  <p className="text-text-muted text-sm font-semibold">
                    <a href="mailto:kannansfarms@gmail.com" className="text-green-dark hover:text-green-main transition-colors no-underline">
                      kannansfarms@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-green-xlight/40 border border-border-green/50 rounded-2xl">
                <span className="text-green-main mt-0.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </span>
                <div>
                  <h4 className="text-[13px] font-bold text-text-dark uppercase tracking-wider mb-1">Instagram</h4>
                  <p className="text-text-muted text-sm font-semibold">
                    <a href="https://instagram.com/kannan.farms" target="_blank" rel="noopener noreferrer" className="text-green-dark hover:text-green-main transition-colors no-underline">
                      @kannan.farms
                    </a>
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* FSSAI Strip */}
          <Reveal delay={0.2} className="mt-12 text-center border-t border-dashed border-border-green/60 pt-8">
            <div className="inline-flex items-center gap-3 bg-offwhite border border-border-green px-6 py-3.5 rounded-2xl shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1B8A4C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <div className="text-left">
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Food Safety Standard Authority of India</p>
                <p className="text-[14px] font-bold text-text-dark mt-0.5">FSSAI Lic. No. 22424011000074</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
