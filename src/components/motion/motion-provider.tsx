"use client"

import { MotionConfig } from "motion/react"

/**
 * One place to honour `prefers-reduced-motion` for every animation on the site.
 *
 * `reducedMotion="user"` keeps opacity fades — so nothing ever disappears for
 * these users — while dropping transforms and layout animation.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
