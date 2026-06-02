import { useState, useEffect } from 'react'

/**
 * Tracks the window scroll position.
 * Returns { scrollY, isScrolled, scrollDirection }.
 */
export function useScrollY(threshold = 60) {
  const [scrollY, setScrollY]           = useState(0)
  const [isScrolled, setIsScrolled]     = useState(false)
  const [scrollDir, setScrollDir]       = useState('up')
  const [prevY, setPrevY]               = useState(0)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          setScrollY(y)
          setIsScrolled(y > threshold)
          setScrollDir(y > prevY ? 'down' : 'up')
          setPrevY(y)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [prevY, threshold])

  return { scrollY, isScrolled, scrollDir }
}
