import { useState, useEffect, useRef } from 'react'
import { useInView } from '../hooks/useInView'

const STATS = [
  { id: 'c1', target: 500,  suffix: '+',  label: 'Happy Customers' },
  { id: 'c2', target: 2,    suffix: '+',  label: 'Products'         },
  { id: 'c3', target: null, suffix: '+',  label: 'Years of Purity', dynamic: () => new Date().getFullYear() - 2023 || 1 },
  { id: 'c4', target: 100,  suffix: '%',  label: 'Natural'          },
]

function Counter({ target, suffix }) {
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)
  const [ref, inView] = useInView({ threshold: 0.4 })

  useEffect(() => {
    if (inView && !started) {
      setStarted(true)
      const duration = 1400
      const startTime = performance.now()
      const tick = (now) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.floor(eased * target))
        if (progress < 1) requestAnimationFrame(tick)
        else setValue(target)
      }
      requestAnimationFrame(tick)
    }
  }, [inView, started, target])

  return (
    <span ref={ref}>
      {value}{suffix}
    </span>
  )
}

export default function StatsBar() {
  return (
    <div className="flex flex-wrap justify-center bg-white border-b border-border-green">
      {STATS.map((stat, i) => {
        const finalTarget = stat.dynamic ? stat.dynamic() : stat.target
        return (
          <div
            key={stat.id}
            className={`
              flex-1 min-w-[140px] max-w-[220px] py-7 px-5 text-center
              transition-colors duration-200 hover:bg-green-xlight
              ${i < STATS.length - 1 ? 'border-r border-border-green' : ''}
            `}
          >
            <div className="font-playfair font-black text-[34px] text-green-main leading-none mb-1.5">
              <Counter target={finalTarget} suffix={stat.suffix} />
            </div>
            <div className="text-[11px] text-text-muted tracking-[1.5px] uppercase">
              {stat.label}
            </div>
          </div>
        )
      })}
    </div>
  )
}
