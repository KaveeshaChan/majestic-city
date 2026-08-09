"use client"

import { Children } from "react"
import { motion } from "motion/react"

import {
  REVEAL_VIEWPORT,
  riseIn,
  riseInDelayed,
  staggerParent,
} from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Scroll-reveal primitives.
 *
 * These are the *only* client components most sections need: the markup itself
 * stays a Server Component and is passed through as `children`, so a section
 * built out of `Reveal`/`Stagger` ships its content as static HTML and only
 * these wrappers as JavaScript.
 *
 * `prefers-reduced-motion` is handled globally by `<MotionProvider>`, which
 * flattens every transform here to a plain opacity change.
 */

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Seconds to hold before playing — for hand-tuning a pair of siblings. */
  delay?: number
  /** Travel distance in px. Larger elements read better with more of it. */
  distance?: number
}

/** Reveals one block when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 14,
}: RevealProps) {
  return (
    <motion.div
      data-reveal
      variants={riseInDelayed(delay, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
  /**
   * Wrap each direct child automatically. Turn this off when the children need
   * their own layout classes and should carry `<StaggerItem>` themselves.
   */
  wrapChildren?: boolean
}

/**
 * Reveals its children one after another. The parent owns the viewport trigger,
 * so the whole group is timed off a single intersection rather than each child
 * racing its own.
 */
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delay = 0.05,
  wrapChildren = true,
}: StaggerProps) {
  return (
    <motion.div
      data-reveal
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={REVEAL_VIEWPORT}
      className={cn(className)}
    >
      {wrapChildren
        ? Children.map(children, (child) => (
            <motion.div variants={riseIn}>{child}</motion.div>
          ))
        : children}
    </motion.div>
  )
}

/** A child of `<Stagger wrapChildren={false}>`. */
export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div data-reveal variants={riseIn} className={cn(className)}>
      {children}
    </motion.div>
  )
}
