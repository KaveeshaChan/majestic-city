"use client"

import Link from "next/link"

import { cn } from "@/lib/utils"

interface DesktopNavLinkProps {
  href: string
  title: string
  isActive: boolean
  onNavigate?: () => void
}

/**
 * Flat text link, no pill: the current section reads muted/gray, everything
 * else stays full black — the opposite of the usual "highlight what's active"
 * pattern, matched to the reference nav.
 */
export function DesktopNavLink({
  href,
  title,
  isActive,
  onNavigate,
}: DesktopNavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      data-nav-active={isActive || undefined}
      className={cn(
        "relative inline-flex items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-brand/40",
        isActive ? "text-muted-foreground" : "text-ink"
      )}
    >
      {title}
    </Link>
  )
}
