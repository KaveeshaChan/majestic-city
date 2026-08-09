"use client"

import Link from "next/link"
import { motion } from "motion/react"

import { springSnappy } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Shared id for the highlight that slides between desktop nav items. */
export const NAV_ACTIVE_LAYOUT_ID = "majestic-nav-active"

interface DesktopNavLinkProps {
  href: string
  title: string
  isActive: boolean
  /**
   * Whether this link may own the shared highlight. Items hidden by a
   * breakpoint are still in the DOM, and a `display: none` element measures as
   * a zero-sized box — handing it the shared id would make the highlight
   * collapse. Only a link the user can actually see gets it.
   */
  ownsHighlight: boolean
  onNavigate?: () => void
}

export function DesktopNavLink({
  href,
  title,
  isActive,
  ownsHighlight,
  onNavigate,
}: DesktopNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70",
        // Active gets a solid white "you are here" pill (below) with matching
        // text; everything else is translucent white on the brand-red bar, so
        // hover reads as a wash rather than competing with the active state.
        isActive
          ? "text-brand-strong"
          : "text-white/75 hover:bg-white/12 hover:text-white"
      )}
    >
      {ownsHighlight && (
        <motion.span
          aria-hidden
          layoutId={NAV_ACTIVE_LAYOUT_ID}
          transition={springSnappy}
          className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgb(0_0_0/0.12)]"
        />
      )}
      <span className="relative">{title}</span>
    </Link>
  )
}
