"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "motion/react"

import { BrandMark } from "@/components/brand/brand-mark"
import { ctaNavItem, isNavItemActive } from "@/config/navigation"
import { LOGO_ASPECT_RATIO, siteConfig } from "@/config/site"
import { useScrollState } from "@/hooks/use-scroll-state"
import { springSnappy } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { CtaButton } from "./cta-button"
import { DesktopNav } from "./desktop-nav"
import { MobileNav } from "./mobile-nav"

/**
 * The navbar: logo pinned left, primary links centered, Contact Us pinned
 * right. Always a fully rounded floating pill, centered in the viewport —
 * `8xl` wide at rest, shrinking to `6xl` and lifting its shadow past
 * `scrolledAfter`. It never hides, only its size changes, so wayfinding is
 * always available.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const { isScrolled } = useScrollState()

  const ctaIsActive = isNavItemActive(pathname, ctaNavItem.href)

  return (
    <motion.header
      data-reveal
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springSnappy}
      className="fixed inset-x-0 top-0 z-100 px-3 pt-3 sm:px-4 sm:pt-4"
    >
      <nav
        aria-label="Primary"
        // Same frame as the hero image below, so the logo starts exactly where
        // the photograph's left edge does.
        className={cn(
          "mx-auto flex w-full items-center gap-3 rounded-full border border-black/8 bg-white px-4 shadow-[0_16px_36px_-24px_rgb(0_0_0/0.25)] transition-[max-width,height,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-6 lg:px-8",
          isScrolled
            ? "h-14 max-w-6xl shadow-[0_28px_60px_-26px_rgb(0_0_0/0.4)] sm:h-16"
            : "h-16 max-w-8xl sm:h-[4.5rem]"
        )}
      >
        <Link
          href="/"
          aria-label={`${siteConfig.name} — home`}
          className="block w-[116px] shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:w-[132px]"
          style={{ aspectRatio: LOGO_ASPECT_RATIO }}
        >
          <BrandMark
            className="w-full shadow-none"
            eager
            sizes="(max-width: 640px) 116px, 132px"
          />
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:gap-2 lg:justify-center">
          <DesktopNav pathname={pathname} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <CtaButton
            href={ctaNavItem.href}
            title={ctaNavItem.title}
            isActive={ctaIsActive}
            className="hidden sm:inline-flex"
          />
          <MobileNav pathname={pathname} />
        </div>
      </nav>
    </motion.header>
  )
}
