"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

import { BrandMark } from "@/components/brand/brand-mark"
import { ctaNavItem, isNavItemActive } from "@/config/navigation"
import { LOGO_ASPECT_RATIO, siteConfig } from "@/config/site"
import { useScrollState } from "@/hooks/use-scroll-state"
import { EASE_OUT, springSnappy } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { DesktopNav } from "./desktop-nav"
import { MobileNav } from "./mobile-nav"

/**
 * The floating pill navbar.
 *
 * The pill's *background* is its own absolutely positioned layer so it can
 * scale into view without putting a transform on the ancestors of the logo —
 * a transformed ancestor would blur the wordmark mid-animation.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const { isScrolled, isHidden } = useScrollState()

  const ctaIsActive = isNavItemActive(pathname, ctaNavItem.href)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-100 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.div
        data-reveal
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: isHidden ? -140 : 0, opacity: 1 }}
        transition={springSnappy}
        className="mx-auto w-full max-w-[1240px]"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "pointer-events-auto relative flex items-center gap-1.5 rounded-full px-2 py-2 transition-[padding] duration-300 sm:gap-2 sm:px-2.5",
            isScrolled ? "sm:py-2" : "sm:py-2.5"
          )}
        >
          <PillBackground elevated={isScrolled} />

          <Link
            href="/"
            aria-label={`${siteConfig.name} — home`}
            className="relative block w-[120px] shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:w-[132px]"
            style={{ aspectRatio: LOGO_ASPECT_RATIO }}
          >
            <BrandMark
              className="absolute inset-0 w-full"
              radius={999}
              eager
              sizes="(max-width: 640px) 120px, 132px"
            />
          </Link>

          {/* `relative` is load-bearing: the pill background is absolutely
              positioned, so any *static* sibling would paint underneath it —
              which is exactly how the menu trigger disappears. */}
          <div className="relative flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2 lg:justify-center">
            <DesktopNav pathname={pathname} />
          </div>

          <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ContactPill isActive={ctaIsActive} />
            <MobileNav pathname={pathname} />
          </div>
        </nav>
      </motion.div>
    </header>
  )
}

/**
 * The brand-red pill itself. Kept as a sibling of the content so its entrance
 * animation never becomes a transform on the logo's ancestors.
 *
 * Scrolling deepens the hue (`brand` → `brand-strong`) as well as the shadow,
 * so the extra elevation reads through color, not just a bigger shadow.
 */
function PillBackground({ elevated }: { elevated: boolean }) {
  return (
    <motion.div
      aria-hidden
      data-reveal
      initial={{ opacity: 0, scaleX: 0.9, scaleY: 0.75 }}
      animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className={cn(
        "absolute inset-0 rounded-full ring-1 ring-white/15 transition-[background-color,box-shadow] duration-500 supports-[backdrop-filter]:backdrop-blur-xl",
        elevated
          ? "bg-brand-strong/95 shadow-[0_18px_50px_-16px_rgb(0_0_0/0.45)]"
          : "bg-brand/95 shadow-[0_10px_34px_-18px_rgb(0_0_0/0.35)]"
      )}
    />
  )
}

/**
 * The trailing call-to-action.
 *
 * The pill background is brand-red, so the CTA cannot use `brand` to mark
 * "you're here" — it would vanish into the pill. It flips to a solid `ink` pill
 * instead, which reads as clearly against red as white does.
 */
function ContactPill({ isActive }: { isActive: boolean }) {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.3 }}
      // Below `sm` the pill would crowd the wordmark, so Contact lives in the
      // sheet instead — it is the last entry in the mobile list.
      className="hidden sm:block"
    >
      <Link
        href={ctaNavItem.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group inline-flex h-10 items-center gap-1.5 rounded-full pr-3.5 pl-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          isActive
            ? "bg-ink text-white hover:bg-black"
            : "bg-white text-ink hover:bg-white/88"
        )}
      >
        {ctaNavItem.title}
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </motion.div>
  )
}
