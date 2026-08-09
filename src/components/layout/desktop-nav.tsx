"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { motion } from "motion/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  isNavItemActive,
  navItems,
  secondaryNavItems,
} from "@/config/navigation"
import { screens, useMediaQuery } from "@/hooks/use-media-query"
import { riseIn, staggerParent } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { DesktopNavLink } from "./nav-link"

interface DesktopNavProps {
  pathname: string
  /** Drives the staggered entrance once the intro hands over. */
  revealed: boolean
}

/**
 * Inline navigation for `lg` and up.
 *
 * Every link is rendered at every breakpoint — good for crawlers and for
 * users without JavaScript — and the breakpoints only decide what is *shown*:
 * secondary items appear inline from `xl`, and collapse into "More" below it.
 */
export function DesktopNav({ pathname, revealed }: DesktopNavProps) {
  const isDesktop = useMediaQuery(screens.lg)
  const isWide = useMediaQuery(screens.xl)

  const secondaryIsActive = secondaryNavItems.some((item) =>
    isNavItemActive(pathname, item.href)
  )

  return (
    <motion.div
      variants={staggerParent(0.045, 0.2)}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
      className="hidden min-w-0 items-center lg:flex"
    >
      {navItems.map((item) => {
        const isActive = isNavItemActive(pathname, item.href)
        const isInline = item.priority === "primary" || isWide

        return (
          <motion.div
            key={item.href}
            variants={riseIn}
            className={cn(item.priority === "secondary" && "hidden xl:block")}
          >
            <DesktopNavLink
              href={item.href}
              title={item.title}
              isActive={isActive}
              ownsHighlight={isActive && isDesktop && isInline}
            />
          </motion.div>
        )
      })}

      <motion.div variants={riseIn} className="xl:hidden">
        <OverflowMenu isActive={secondaryIsActive} pathname={pathname} />
      </motion.div>
    </motion.div>
  )
}

/** Holds whatever does not fit inline between `lg` and `xl`. */
function OverflowMenu({
  isActive,
  pathname,
}: {
  isActive: boolean
  pathname: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "group inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-white/60 data-[state=open]:text-white",
          isActive ? "bg-white/12 text-white" : "text-white/60 hover:text-white"
        )}
      >
        More
        <ChevronDown className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={14}
        className="w-64 rounded-2xl border-0 bg-ink p-1.5 text-white ring-1 ring-white/12 shadow-2xl"
      >
        {secondaryNavItems.map((item) => (
          <DropdownMenuItem
            key={item.href}
            asChild
            className="rounded-xl px-2.5 py-2 focus:bg-white/10 focus:text-white"
          >
            <Link
              href={item.href}
              aria-current={
                isNavItemActive(pathname, item.href) ? "page" : undefined
              }
              className="flex items-start gap-2.5"
            >
              <item.icon className="mt-0.5 size-4 text-white/60" />
              <span className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{item.title}</span>
                <span className="text-xs text-white/50">{item.description}</span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
