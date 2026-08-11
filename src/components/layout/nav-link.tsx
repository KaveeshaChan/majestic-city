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
      // The "you are here" pill below is a Motion element, so it does not exist
      // without JavaScript — leaving brand-colored text with no pill behind it.
      // This hook lets the no-script stylesheet paint a plain tint pill instead.
      data-nav-active={isActive || undefined}
      className={cn(
        "relative inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/40",
        isActive
          ? "text-brand-strong"
          : "text-ink/65 hover:bg-surface-muted hover:text-ink"
      )}
    >
      {ownsHighlight && (
        <motion.span
          aria-hidden
          layoutId={NAV_ACTIVE_LAYOUT_ID}
          transition={springSnappy}
          className="absolute inset-0 rounded-full bg-brand-tint"
        />
      )}
      <span className="relative">{title}</span>
    </Link>
  )
}
