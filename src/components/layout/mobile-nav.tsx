"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { motion } from "motion/react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ctaNavItem, isNavItemActive, navItems } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { EASE_OUT, springSnappy } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { CtaButton } from "./cta-button"

interface MobileNavProps {
  pathname: string
}

/**
 * Full navigation for anything below `lg`.
 *
 * The trigger is a single controlled button rather than `SheetTrigger` +
 * `SheetClose`, so the hamburger can morph into a close glyph in place
 * instead of the sheet owning a second, duplicate control. The real navbar
 * sits above the sheet (`z-100` vs. the sheet's `z-50`), so it stays visible
 * — logo and toggle both — while the panel drops in beneath it.
 */
export function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const ctaIsActive = isNavItemActive(pathname, ctaNavItem.href)

  // Every link is wrapped in `SheetClose`, but browser back/forward can also
  // change the route with the sheet open. Adjusting during render (React's
  // documented pattern for state derived from a changing prop) closes it
  // without an effect and without a wasted paint.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setOpen(false)
  }

  return (
    // Non-modal: Radix's modal dialog blocks pointer events on everything
    // outside its content (via a `body { pointer-events: none }` it injects
    // and `aria-hidden` on siblings like this header), which would make the
    // toggle button itself unclickable the moment the sheet opens — since the
    // button lives in the header, not inside `SheetContent`. Non-modal keeps
    // the header interactive so the same button can close what it opened.
    <Sheet open={open} onOpenChange={setOpen} modal={false}>
      <motion.div
        data-reveal
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.24 }}
        className="lg:hidden"
      >
        <button
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="relative inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-surface-muted text-ink transition-colors hover:bg-brand-tint hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
        >
          <motion.span
            aria-hidden
            initial={false}
            animate={{
              opacity: open ? 0 : 1,
              rotate: open ? 90 : 0,
              scale: open ? 0.6 : 1,
            }}
            transition={springSnappy}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Menu className="size-5" />
          </motion.span>
          <motion.span
            aria-hidden
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              rotate: open ? 0 : -90,
              scale: open ? 1 : 0.6,
            }}
            transition={springSnappy}
            className="absolute inset-0 flex items-center justify-center"
          >
            <X className="size-5" />
          </motion.span>
        </button>
      </motion.div>

      {/* Light, like the page it covers — a dark sheet dropping over a bright
          landing page reads as a different site for a moment. */}
      <SheetContent
        side="top"
        showCloseButton={false}
        className="max-h-[92dvh] gap-0 overflow-y-auto rounded-b-3xl border-0 bg-white pt-[var(--header-height)] text-ink ring-1 ring-black/8"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Browse every section of {siteConfig.name}.
          </SheetDescription>
        </SheetHeader>

        <nav className="px-2.5 pt-5 pb-4 sm:px-4">
          <ul className="flex flex-col">
            {navItems.map((item, index) => {
              const isActive = isNavItemActive(pathname, item.href)

              return (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.42,
                    ease: EASE_OUT,
                    delay: 0.06 + index * 0.045,
                  }}
                >
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3.5 rounded-2xl px-3 py-3 transition-colors",
                        // "You are here" is a brand-tinted row with a solid
                        // maroon icon chip — the same language as the pill.
                        isActive ? "bg-brand-tint" : "hover:bg-surface-muted"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                          isActive
                            ? "bg-brand text-brand-foreground"
                            : "bg-surface-muted text-brand group-hover:bg-white"
                        )}
                      >
                        <item.icon className="size-4.5" />
                      </span>

                      <span className="flex min-w-0 flex-col">
                        <span className="font-heading text-base font-medium">
                          {item.title}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </span>

                      <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" />
                    </Link>
                  </SheetClose>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.5 }}
          className="border-t border-hairline px-5 py-5 sm:px-7"
        >
          <SheetClose asChild>
            <CtaButton
              href={ctaNavItem.href}
              title={ctaNavItem.title}
              isActive={ctaIsActive}
              className="w-full justify-center"
            />
          </SheetClose>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
