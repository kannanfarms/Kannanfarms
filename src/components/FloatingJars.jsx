import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function FloatingJars() {
  // Motion values to track mouse coordinate offsets from window center
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springs for responsive, lagging 3D tilt effects
  const springConfig = { damping: 28, stiffness: 120 }
  
  // Rotation mappings (tilted in opposite directions)
  const rotateX = useSpring(useTransform(mouseY, [-400, 400], [8, -8]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-8, 8]), springConfig)

  // Individual coordinate parallax offsets for depth separation (left jar shifts less than right jar)
  const jar1TranslateX = useSpring(useTransform(mouseX, [-400, 400], [-10, 10]), springConfig)
  const jar1TranslateY = useSpring(useTransform(mouseY, [-400, 400], [-10, 10]), springConfig)

  const jar2TranslateX = useSpring(useTransform(mouseX, [-400, 400], [-22, 22]), springConfig)
  const jar2TranslateY = useSpring(useTransform(mouseY, [-400, 400], [-22, 22]), springConfig)

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX - window.innerWidth / 2
      const y = e.clientY - window.innerHeight / 2
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Custom float configurations (sine wave)
  const floatJar1 = {
    y: [0, -12, 0],
    rotate: [12, 13.5, 12], // Constant tilt to the right + slight drift
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    }
  }

  const floatJar2 = {
    y: [0, -16, 0],
    rotate: [-12, -10.5, -12], // Constant tilt to the left + slight drift
    transition: {
      duration: 5.8,
      repeat: Infinity,
      ease: 'easeInOut',
      delay: 0.4
    }
  }

  return (
    <div className="relative w-full max-w-[480px] h-[340px] md:h-[400px] flex items-center justify-center select-none perspective-1000 mt-6 lg:mt-0">
      
      {/* ── LEFT JAR (Banana Powder) ── */}
      <motion.div
        className="absolute z-20 left-[10%] top-[10%] flex flex-col items-center"
        style={{
          rotateX,
          rotateY,
          x: jar1TranslateX,
          y: jar1TranslateY,
          transformStyle: 'preserve-3d',
        }}
        animate={floatJar1}
      >
        {/* Shadow */}
        <div className="absolute -bottom-8 w-[160px] h-[16px] bg-black/10 rounded-full blur-[6px] scale-x-90 animate-pulse duration-[5000ms]" />

        {/* The Lid */}
        <div 
          className="w-[172px] h-[24px] rounded-t-lg rounded-b-[3px] border-b border-black/80 z-10"
          style={{
            background: 'linear-gradient(90deg, #181818 0%, #3a3a3a 15%, #1a1a1a 45%, #0d0d0d 65%, #303030 85%, #151515 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.3)',
          }}
        />

        {/* Jar Body */}
        <div 
          className="relative w-[166px] h-[155px] rounded-b-[24px] border-[1.5px] border-white/45 overflow-hidden flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -10px 20px rgba(255,255,255,0.08)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Banana Powder Content representation */}
          <div className="absolute inset-0 bg-[#e2dac8] opacity-75 z-0" />

          {/* The Label wrapper */}
          <div 
            className="w-full h-[95px] my-auto z-10 relative overflow-hidden bg-cover bg-center border-t border-b border-black/5"
            style={{
              backgroundImage: 'url("assets/kannan_farms_banana_label.png")',
              boxShadow: 'inset 12px 0 12px -6px rgba(0,0,0,0.16), inset -12px 0 12px -6px rgba(0,0,0,0.16)',
            }}
          />

          {/* Glass glare highlight */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(115deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 36%, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0) 80%)',
            }}
          />
        </div>
      </motion.div>

      {/* ── RIGHT JAR (Moringa Powder) ── */}
      <motion.div
        className="absolute z-10 right-[10%] bottom-[12%] flex flex-col items-center"
        style={{
          rotateX,
          rotateY,
          x: jar2TranslateX,
          y: jar2TranslateY,
          transformStyle: 'preserve-3d',
        }}
        animate={floatJar2}
      >
        {/* Shadow */}
        <div className="absolute -bottom-8 w-[160px] h-[16px] bg-black/10 rounded-full blur-[6px] scale-x-90 animate-pulse duration-[5800ms]" />

        {/* The Lid */}
        <div 
          className="w-[172px] h-[24px] rounded-t-lg rounded-b-[3px] border-b border-black/80 z-10"
          style={{
            background: 'linear-gradient(90deg, #181818 0%, #3a3a3a 15%, #1a1a1a 45%, #0d0d0d 65%, #303030 85%, #151515 100%)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.3)',
          }}
        />

        {/* Jar Body */}
        <div 
          className="relative w-[166px] h-[155px] rounded-b-[24px] border-[1.5px] border-white/45 overflow-hidden flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.08) 100%)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.5), inset 0 -10px 20px rgba(255,255,255,0.08)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {/* Moringa Powder Content representation */}
          <div className="absolute inset-0 bg-[#8fa486] opacity-75 z-0" />

          {/* The Label wrapper */}
          <div 
            className="w-full h-[95px] my-auto z-10 relative overflow-hidden bg-cover bg-center border-t border-b border-black/5"
            style={{
              backgroundImage: 'url("assets/kannan_farms_moringa_label.png")',
              boxShadow: 'inset 12px 0 12px -6px rgba(0,0,0,0.16), inset -12px 0 12px -6px rgba(0,0,0,0.16)',
            }}
          />

          {/* Glass glare highlight */}
          <div 
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              background: 'linear-gradient(115deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 35%, rgba(255,255,255,0) 36%, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0) 80%)',
            }}
          />
        </div>
      </motion.div>

    </div>
  )
}
