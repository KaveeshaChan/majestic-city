"use client"

import { Children } from "react"
import { motion } from "motion/react"

import { useSplash } from "@/components/splash/splash-provider"
import { riseIn, staggerParent } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface RevealOnMountProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delay?: number
}

/**
 * Staggers its direct children in on mount, holding until the intro has handed
 * over so a first-load page never animates behind the splash.
 *
 * Children are Server Components rendered on the server and passed through as
 * `children`, so wrapping them here does not pull them into the client bundle.
 */
export function RevealOnMount({
  children,
  className,
  stagger = 0.07,
  delay = 0.1,
}: RevealOnMountProps) {
  const { isRevealing } = useSplash()

  return (
    <motion.div
      variants={staggerParent(stagger, delay)}
      initial="hidden"
      animate={isRevealing ? "visible" : "hidden"}
      className={cn(className)}
    >
      {Children.map(children, (child) => (
        <motion.div variants={riseIn}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
