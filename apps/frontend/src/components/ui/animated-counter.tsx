"use client"

import { useEffect, useRef } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  direction?: "up" | "down"
  format?: (value: number) => string
  className?: string
  delay?: number
}

export function AnimatedCounter({
  value,
  direction = "up",
  format = (val) => new Intl.NumberFormat("en-US").format(Math.round(val)),
  className,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  
  // Set initial value
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
    mass: 1,
  })
  
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [motionValue, isInView, value, direction, delay])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = format(latest)
      }
    })
  }, [springValue, format])

  return <span ref={ref} className={className}>{format(direction === "down" ? value : 0)}</span>
}
