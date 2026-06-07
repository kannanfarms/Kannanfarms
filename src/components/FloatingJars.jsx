import { useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function FloatingJars() {
  // Motion values to track mouse coordinate offsets from window center
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for laggy 3D tilt effects
  const springConfig = { damping: 30, stiffness: 100 }
  
  // Transform mouse movement into 3D rotations
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [6, -6]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-6, 6]), springConfig)
  
  // Transform mouse movement into translation parallax shifts
  const x = useSpring(useTransform(mouseX, [-400, 400], [-12, 12]), springConfig)
  const y = useSpring(useTransform(mouseY, [-400, 400], [-12, 12]), springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const offsetX = e.clientX - window.innerWidth / 2
      const offsetY = e.clientY - window.innerHeight / 2
      mouseX.set(offsetX)
      mouseY.set(offsetY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px] h-[260px] sm:h-[320px] lg:h-[420px] flex items-center justify-center select-none perspective-1000 mt-4 lg:mt-0">
      {/* Floating and tilting container for the high-fidelity mockup image */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        style={{
          rotateX,
          rotateY,
          x,
          y,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -14, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src="assets/floating_jars_mockup.png"
          alt="Kannan Farms Banana Powder and Moringa Powder Jars Mockup"
          className="w-[90%] md:w-full h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.18)]"
          draggable="false"
          onError={(e) => {
            // Fallback placeholder in case asset fails to load
            e.target.src = "https://placehold.co/500x380/EDFAF3/1B8A4C?text=Kannan+Farms+Mockup"
          }}
        />
      </motion.div>
    </div>
  )
}
