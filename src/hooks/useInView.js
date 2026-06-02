import { useEffect, useRef, useState } from 'react'

/**
 * Returns a ref and a boolean indicating if the element
 * is in the viewport. Uses IntersectionObserver.
 */
export function useInView(options = {}) {
  const ref              = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          // Once visible, stop observing (one-shot reveal)
          if (options.once !== false) observer.unobserve(el)
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin, options.once])

  return [ref, inView]
}
