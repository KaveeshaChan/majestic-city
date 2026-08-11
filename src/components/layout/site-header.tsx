"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

import { BrandMark } from "@/components/brand/brand-mark"
import { ctaNavItem, isNavItemActive } from "@/config/navigation"
import { LOGO_ASPECT_RATIO, siteConfig } from "@/config/site"
import { useScrollState } from "@/hooks/use-scroll-state"
import { springSnappy } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { DesktopNav } from "./desktop-nav"
import { MobileNav } from "./mobile-nav"

/**
 * The flat top navbar: logo pinned left, primary links centered, Contact Us
 * pinned right. A plain white bar rather than a floating pill, so it reads as
 * one surface with the rest of the (white) page.
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
      className={cn(
        "fixed inset-x-0 top-0 z-100 border-b bg-white/95 backdrop-blur-md transition-[border-color,box-shadow] duration-300 supports-[backdrop-filter]:bg-white/80",
        isScrolled
          ? "border-hairline shadow-[0_12px_30px_-24px_rgb(0_0_0/0.3)]"
          : "border-transparent"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[4.5rem] w-full max-w-8xl items-center gap-3 px-4 sm:px-6 lg:px-8"
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
          <ContactButton isActive={ctaIsActive} />
          <MobileNav pathname={pathname} />
        </div>
      </nav>
    </motion.header>
  )
}

/** The trailing call-to-action, matching the CTA style used in `<HomeIntro>`. */
function ContactButton({ isActive }: { isActive: boolean }) {
  return (
    <Link
      href={ctaNavItem.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group hidden h-10 items-center gap-1.5 rounded-full pr-3.5 pl-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:inline-flex",
        isActive ? "bg-brand text-white" : "bg-ink text-white hover:bg-brand"
      )}
    >
      {ctaNavItem.title}
      <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  )
}
