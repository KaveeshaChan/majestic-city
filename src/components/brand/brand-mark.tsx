"use client"

import Image from "next/image"
import { motion } from "motion/react"

import { brandLogo, LOGO_ASPECT_RATIO } from "@/config/site"
import { springSoft } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * Shared-layout id for the logo. Exactly one `BrandMark` may carry it at a
 * time — the splash owns it during the intro, the navbar takes over the moment
 * the splash releases it, and Motion animates the box between the two.
 */
export const BRAND_MARK_LAYOUT_ID = "majestic-brand-mark"

interface BrandMarkProps {
  /** Size + positioning. Width drives everything; height comes from the ratio. */
  className?: string
  /** Animated by the morph, so pass a number rather than a Tailwind radius. */
  radius?: number
  /** Attach the shared layout id. Off for purely decorative copies. */
  shared?: boolean
  priority?: boolean
  sizes?: string
}

/**
 * The wordmark on its white chip. The chip is what makes the maroon artwork
 * legible on the near-black navbar, and it doubles as the morph target.
 */
export function BrandMark({
  className,
  radius = 999,
  shared = true,
  priority = false,
  sizes = "(max-width: 640px) 70vw, 460px",
}: BrandMarkProps) {
  return (
    <motion.span
      layoutId={shared ? BRAND_MARK_LAYOUT_ID : undefined}
      transition={springSoft}
      style={{ borderRadius: radius, aspectRatio: LOGO_ASPECT_RATIO }}
      className={cn(
        "block overflow-hidden bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_28px_-12px_rgb(0_0_0/0.45)]",
        className
      )}
    >
      {/* `fill` resolves against the padding box, so the padding insets the art. */}
      <span className="relative block size-full p-[5.5%]">
        <Image
          src={brandLogo.src}
          alt={brandLogo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-contain"
        />
      </span>
    </motion.span>
  )
}
