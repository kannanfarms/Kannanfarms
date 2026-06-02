import { motion } from 'framer-motion'

/**
 * Wraps children in a fade-up scroll-reveal animation.
 * Uses Framer Motion's whileInView for a clean implementation.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.7,
  y = 32,
  className = '',
  once = true,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
