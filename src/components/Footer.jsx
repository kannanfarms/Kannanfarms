import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const FOOTER_LINKS = [
  { label: 'Home',          to: '/'                      },
  { label: 'Products',      to: '/?scroll=products'      },
  { label: 'How It Works',  to: '/?scroll=how'           },
  { label: 'Cart',          to: '/cart'                  },
  { label: 'Banana Powder', to: '/product/banana-powder' },
  { label: 'Moringa Powder',to: '/product/moringa-powder'},
]

const TRUST_ITEMS = [
  { label: 'Farm Direct'  },
  { label: 'No Additives' },
  { label: 'Sun Dried'    },
  { label: 'Fresh Packed' },
  { label: '100% Pure'    },
]

function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

export default function Footer() {
  const [ref, inView] = useInView({ threshold: 0.1 })

  return (
    <footer ref={ref} className="bg-text-dark">

      {/* Trust strip */}
      <div className="border-t border-white/5 border-b border-white/5 px-5 md:px-10 py-5">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-6 md:gap-10">
          {TRUST_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-center gap-2.5 text-white/60 font-medium text-[13px]"
            >
              <span className="text-mint-glow"><LeafIcon /></span>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="font-playfair font-black text-2xl text-white mb-2">
              Kannan Farms
            </div>
            <div className="text-[10px] text-white/30 tracking-[2px] uppercase mb-5">
              Natural Products for a Healthier You
            </div>
            <p className="text-white/45 text-[13px] leading-relaxed max-w-xs">
              Family-run farm delivering pure, additive-free powders directly from our soil to your table — the way nature intended.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-white/30 mb-5">
              Quick Links
            </div>
            <div className="flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-white/50 hover:text-green-vivid text-[13px] transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-[11px] font-semibold tracking-[2px] uppercase text-white/30 mb-5">
              Contact
            </div>
            <div className="flex flex-col gap-3 text-[13px] text-white/50">
              <div className="flex items-start gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Mavuthampathi, Coimbatore, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <a href="https://wa.me/916381594945" target="_blank" rel="noopener noreferrer" className="hover:text-green-vivid transition-colors">
                  +91 63815 94945 (WhatsApp)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
                <a href="https://instagram.com/kannan.farms" target="_blank" rel="noopener noreferrer" className="hover:text-green-vivid transition-colors">
                  @kannan.farms
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:kannansfarms@gmail.com" className="hover:text-green-vivid transition-colors">
                  kannansfarms@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                </svg>
                <span>FSSAI Lic. No. 22424011000074</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com/kannan.farms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-white/7 border border-white/10 flex items-center justify-center text-white/40 hover:text-green-vivid hover:border-green-vivid/40 hover:bg-green-vivid/10 transition-all duration-200"
              >
                <SocialIcon name="Instagram" />
              </a>
              {['Facebook', 'YouTube'].map((s) => (
                <a
                  key={s}
                  href="#"
                  aria-label={s}
                  className="w-9 h-9 rounded-lg bg-white/7 border border-white/10 flex items-center justify-center text-white/40 hover:text-green-vivid hover:border-green-vivid/40 hover:bg-green-vivid/10 transition-all duration-200"
                >
                  <SocialIcon name={s} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar — dead policy links removed */}
        <div className="border-t border-white/8 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/18 text-[12px]">
            © {new Date().getFullYear()} Kannan Farms. All rights reserved.
          </p>
          <p className="text-white/18 text-[12px]">
            FSSAI Lic. No. 22424011000074 · Made with love in Tamil Nadu
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }) {
  const icons = {
    Instagram: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    Facebook: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    YouTube: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  }
  return icons[name] || null
}
