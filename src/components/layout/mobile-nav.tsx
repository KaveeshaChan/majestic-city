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
  SheetTrigger,
} from "@/components/ui/sheet"
import { BrandMark } from "@/components/brand/brand-mark"
import { allNavItems, isNavItemActive } from "@/config/navigation"
import { siteConfig } from "@/config/site"
import { EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  pathname: string
}

/**
 * Full navigation for anything below `lg`.
 *
 * Radix's Dialog underneath the sheet gives focus trapping, scroll locking and
 * Escape handling for free; Motion only handles the staggered reveal of the
 * list, which mounts fresh on every open.
 */
export function MobileNav({ pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false)

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
    <Sheet open={open} onOpenChange={setOpen}>
      <motion.div
        data-reveal
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.24 }}
        className="lg:hidden"
      >
        <SheetTrigger
          aria-label="Open navigation menu"
          className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/18 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <Menu className="size-5" />
        </SheetTrigger>
      </motion.div>

      {/* Light, like the page it covers — a dark sheet dropping over a bright
          landing page reads as a different site for a moment. */}
      <SheetContent
        side="top"
        showCloseButton={false}
        className="max-h-[92dvh] gap-0 overflow-y-auto rounded-b-3xl border-0 bg-white p-0 text-ink ring-1 ring-black/8"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Browse every section of {siteConfig.name}.
          </SheetDescription>
        </SheetHeader>

        <div className="flex items-center justify-between gap-4 px-4 pt-4 sm:px-6">
          <SheetClose asChild>
            <Link href="/" className="block w-[124px] shrink-0">
              <BrandMark className="w-full shadow-none" sizes="124px" />
            </Link>
          </SheetClose>

          <SheetClose
            aria-label="Close navigation menu"
            className="inline-flex size-10 items-center justify-center rounded-full bg-surface-muted text-ink transition-colors hover:bg-brand-tint hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
          >
            <X className="size-5" />
          </SheetClose>
        </div>

        <nav className="px-2.5 pt-5 pb-4 sm:px-4">
          <ul className="flex flex-col">
            {allNavItems.map((item, index) => {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.5 }}
          className="mt-auto flex flex-col gap-1 border-t border-hairline px-5 py-5 text-sm sm:px-7"
        >
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="w-fit font-medium text-ink transition-colors hover:text-brand"
          >
            {siteConfig.contact.email}
          </a>
          <a
            href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
            className="w-fit font-medium text-ink transition-colors hover:text-brand"
          >
            {siteConfig.contact.phone}
          </a>
          <p className="mt-2 text-xs text-muted-foreground">
            {siteConfig.contact.address}
          </p>
        </motion.div>
      </SheetContent>
    </Sheet>
  )
}
