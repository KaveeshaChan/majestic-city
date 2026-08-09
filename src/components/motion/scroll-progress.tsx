"use client"

import { motion, useScroll, useSpring } from "motion/react"

/**
 * A hairline reading-progress bar across the very top of the window.
 *
 * Spring-smoothed so it glides rather than tracking the wheel exactly, and it
 * sits above the navbar so it reads as part of the window chrome. Scroll
 * position is information rather than decoration, so it is not suppressed for
 * reduced motion — the spring is what would be, and Motion handles that.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-brand"
    />
  )
}
