import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const FOOTER_LINKS = [
  { label: 'Home',         to: '/'                     },
  { label: 'Products',     to: '/?scroll=products'     },
  { label: 'How It Works', to: '/?scroll=how'          },
  { label: 'Cart',         to: '/cart'                 },
  { label: 'Banana Powder',to: '/product/banana-powder'},
  { label: 'Moringa Powder',to: '/product/moringa-powder'},
]

const TRUST_ITEMS = [
  { icon: '🌾', label: 'Farm Direct'   },
  { icon: '🚫', label: 'No Additives'  },
  { icon: '☀️', label: 'Sun Dried'    },
  { icon: '📦', label: 'Fresh Packed'  },
  { icon: '💯', label: '100% Pure'     },
]

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
              <span className="text-xl">{item.icon}</span>
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
                <span className="text-base mt-0.5">📍</span>
                <span>Tiruppur, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base">📱</span>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-green-vivid transition-colors">
                  +91 98765 43210 (WhatsApp Support)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base">📸</span>
                <a href="https://instagram.com/kannanfarms" target="_blank" rel="noopener noreferrer" className="hover:text-green-vivid transition-colors">
                  @kannanfarms (Instagram)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base">✉️</span>
                <a href="mailto:info@kannanfarms.in" className="hover:text-green-vivid transition-colors">
                  info@kannanfarms.in
                </a>
              </div>
            </div>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com/kannanfarms"
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

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/18 text-[12px]">
            © {new Date().getFullYear()} Kannan Farms. All rights reserved.
          </p>
          <div className="flex gap-5 text-[12px] text-white/18">
            <a href="#" className="hover:text-white/40 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/40 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/40 transition-colors">Shipping Policy</a>
          </div>
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
