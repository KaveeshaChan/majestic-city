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
}

/**
 * Inline navigation for `lg` and up.
 *
 * Every link is rendered at every breakpoint — good for crawlers and for
 * users without JavaScript — and the breakpoints only decide what is *shown*:
 * secondary items appear inline from `xl`, and collapse into "More" below it.
 */
export function DesktopNav({ pathname }: DesktopNavProps) {
  const isDesktop = useMediaQuery(screens.lg)
  const isWide = useMediaQuery(screens.xl)

  const secondaryIsActive = secondaryNavItems.some((item) =>
    isNavItemActive(pathname, item.href)
  )

  return (
    <motion.div
      data-reveal
      variants={staggerParent(0.045, 0.2)}
      initial="hidden"
      animate="visible"
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
          "group inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70 data-[state=open]:bg-white data-[state=open]:text-brand-strong",
          isActive
            ? "bg-white text-brand-strong"
            : "text-white/75 hover:bg-white/12 hover:text-white"
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
        {secondaryNavItems.map((item) => {
          const active = isNavItemActive(pathname, item.href)

          return (
            <DropdownMenuItem
              key={item.href}
              asChild
              className={cn(
                "rounded-xl px-2.5 py-2 focus:bg-white/10 focus:text-white",
                active && "bg-white/8"
              )}
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex items-start gap-2.5"
              >
                <item.icon
                  className={cn(
                    "mt-0.5 size-4",
                    active ? "text-white" : "text-white/60"
                  )}
                />
                <span className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    {item.title}
                    {active && (
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-brand ring-1 ring-white/50"
                      />
                    )}
                  </span>
                  <span className="text-xs text-white/50">
                    {item.description}
                  </span>
                </span>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
