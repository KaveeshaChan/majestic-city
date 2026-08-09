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
        "relative inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/60",
        isActive ? "text-white" : "text-white/60 hover:text-white"
      )}
    >
      {ownsHighlight && (
        <motion.span
          aria-hidden
          layoutId={NAV_ACTIVE_LAYOUT_ID}
          transition={springSnappy}
          className="absolute inset-0 rounded-full bg-white/12"
        />
      )}
      <span className="relative">{title}</span>
    </Link>
  )
}
