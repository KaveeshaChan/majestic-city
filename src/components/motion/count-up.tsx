"use client"

import { useEffect, useRef } from "react"
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react"

import { EASE_OUT } from "@/lib/motion"

interface CountUpProps {
  to: number
  suffix?: string
  /** Seconds. Bigger numbers want a little longer to feel deliberate. */
  duration?: number
}

/**
 * A number that counts up the first time it scrolls into view.
 *
 * The final value is what gets server-rendered, so the real figure is in the
 * HTML for crawlers and for anyone without JavaScript. The effect then rewinds
 * to zero and plays — safe here because the counters sit well below the fold, so
 * the rewind is never on screen.
 *
 * The text is written straight to the DOM node from the motion value's
 * subscription rather than through state, so a 1.6s count is one React render
 * rather than a hundred.
 */
export function CountUp({ to, suffix = "", duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" })
  const prefersReducedMotion = useReducedMotion()
  const count = useMotionValue(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    return count.on("change", (value) => {
      node.textContent = Math.round(value).toLocaleString("en-US")
    })
  }, [count])

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(to)
      return
    }
    if (!isInView) {
      count.set(0)
      return
    }
    const controls = animate(count, to, { duration, ease: EASE_OUT })
    return () => controls.stop()
  }, [count, duration, isInView, prefersReducedMotion, to])

  return (
    <span>
      <span ref={ref}>{to.toLocaleString("en-US")}</span>
      {suffix}
    </span>
  )
}
