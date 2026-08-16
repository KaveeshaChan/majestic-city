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
 * The navbar: logo pinned left, primary links right next to it, Contact Us
 * pinned right. A flat bar that sits directly on the page — no floating pill,
 * no shadow at rest — and only picks up a hairline and a soft backdrop once
 * the page scrolls under it, so content passing beneath stays legible.
 */
export function SiteHeader() {
  const pathname = usePathname()
  const { isScrolled } = useScrollState()

  const ctaIsActive = isNavItemActive(pathname, ctaNavItem.href)

  return (
    <motion.header
      data-reveal
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springSnappy}
      className={cn(
        "sticky top-0 z-100 w-full bg-white/95 backdrop-blur-md transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isScrolled
          ? "border-b border-hairline shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
          : "border-b border-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full items-center gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-10"
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

        <div className="min-w-0 lg:ml-8">
          <DesktopNav pathname={pathname} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
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
