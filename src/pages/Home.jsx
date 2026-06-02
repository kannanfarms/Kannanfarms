import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import StatsBar from '../components/StatsBar'
import ProductCard from '../components/ProductCard'
import Reveal from '../components/Reveal'
import { useProducts } from '../context/ProductContext'

// ── How It Works steps ───────────────────────────────────────────────────────
const STEPS = [
  { icon: '🌱', title: 'Grown Naturally',  desc: 'Cultivated on our own farm without chemicals or pesticides.' },
  { icon: '☀️', title: 'Sun Dried',        desc: 'Traditionally dried under natural sunlight to preserve nutrients.' },
  { icon: '⚙️', title: 'Stone Ground',     desc: 'Cold-ground using stone mills to retain full flavour and nutrition.' },
  { icon: '📦', title: 'Packed Fresh',     desc: 'Sealed airtight within hours and delivered straight to you.' },
]

// ── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    stars: 5,
    text: 'My kids love the banana powder in their milk every morning. It\'s pure, tasty, and I can see the difference in their energy!',
    name: 'Priya S.',
    location: 'Chennai, Tamil Nadu',
  },
  {
    stars: 5,
    text: 'I add Moringa powder to my smoothie daily. The quality is unmatched — you can tell it\'s genuinely fresh from the farm.',
    name: 'Ramesh K.',
    location: 'Coimbatore, Tamil Nadu',
  },
  {
    stars: 5,
    text: 'Best natural supplement I\'ve tried. No artificial smell, no fillers — just pure goodness. Will always order from Kannan Farms.',
    name: 'Anitha M.',
    location: 'Tiruppur, Tamil Nadu',
  },
]

// ── Why Kannan Farms features ─────────────────────────────────────────────────
const FEATURES = [
  { icon: '🌾', title: 'Farm Sourced',  desc: 'Directly from our own fields — zero middlemen, maximum freshness.' },
  { icon: '🧪', title: 'No Additives',  desc: 'Pure powders with no preservatives, colors, or artificial flavors.' },
  { icon: '☀️', title: 'Sun Dried',     desc: 'Traditional sun-drying retains all natural nutrients and enzymes.' },
  { icon: '📦', title: 'Fresh Packed',  desc: 'Sealed within hours of grinding to lock in freshness and aroma.' },
]

// ── Trust strip items ─────────────────────────────────────────────────────────
const TRUST = [
  { icon: '🌾', label: 'Farm Direct'  },
  { icon: '🚫', label: 'No Additives' },
  { icon: '☀️', label: 'Sun Dried'   },
  { icon: '📦', label: 'Fresh Packed' },
  { icon: '💯', label: '100% Pure'    },
]

// ── HOME ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { products, loading } = useProducts()

  // Filter out products marked as hidden from consumers
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
            <div className="flex flex-wrap justify-center gap-7">
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
                <span className="text-xl">{item.icon}</span>
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

          {/* Steps with connecting line */}
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-9 left-[12%] right-[12%] h-[2px] bg-green-light z-0" />

            <div className="flex flex-wrap justify-center gap-0">
              {STEPS.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.1} className="relative z-10 flex-1 min-w-[160px] max-w-[210px] text-center px-5">
                  <motion.div
                    className="w-[72px] h-[72px] rounded-full bg-green-xlight border-[3px] border-green-light flex items-center justify-center text-3xl mx-auto mb-4 transition-all duration-300"
                    whileHover={{ background: '#1B8A4C', borderColor: '#1B8A4C', scale: 1.1 }}
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
                  className="bg-white border border-border-green rounded-2xl p-7 w-[280px] transition-all duration-300"
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(27,138,76,0.12)', borderColor: '#1B8A4C' }}
                >
                  <div className="text-amber text-[16px] tracking-[2px] mb-3">
                    {'★'.repeat(t.stars)}
                  </div>
                  <p className="text-[13px] text-text-muted leading-relaxed mb-4 italic">
                    "{t.text}"
                  </p>
                  <div className="text-[13px] font-semibold text-text-dark">{t.name}</div>
                  <div className="text-[11px] text-text-muted">{t.location}</div>
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
                  <span className="text-[36px] block mb-3.5">{feat.icon}</span>
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
          <motion.a
            href="#products"
            className="inline-block bg-white text-green-dark font-dm font-bold text-[15px] px-10 py-4 rounded-xl transition-all duration-300"
            style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}
            whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(0,0,0,0.2)' }}
          >
            Shop Our Products →
          </motion.a>
        </Reveal>
      </section>
    </>
  )
}
