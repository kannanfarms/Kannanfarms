import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import SEOHead from '../components/SEOHead'

export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist. Return to Kannan Farms home."
      />
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-5 text-center bg-offwhite">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="text-[80px] mb-4">🌿</div>
          <h1 className="font-playfair font-black text-[56px] text-green-dark mb-2">404</h1>
          <h2 className="font-playfair font-bold text-[24px] text-text-dark mb-3">Page Not Found</h2>
          <p className="text-text-muted text-[15px] max-w-sm mx-auto mb-8 leading-relaxed">
            Looks like this page wandered off into the fields. Let's get you back to nature's goodness.
          </p>
          <Link to="/" className="btn-primary no-underline">
            Return Home →
          </Link>
        </motion.div>
      </div>
    </>
  )
}
