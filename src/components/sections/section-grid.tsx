import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { navItems } from "@/config/navigation"

/**
 * Secondary entry point into every section — Server Component, so the whole
 * grid is static HTML.
 */
export function SectionGrid() {
  const items = navItems.filter((item) => item.href !== "/")

  return (
    <section className="mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 sm:py-28">
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        Everything under one roof
      </h2>
      <p className="mt-3 max-w-lg text-muted-foreground text-pretty">
        Six floors of retail, dining and entertainment in the heart of
        Bambalapitiya.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full flex-col gap-3 rounded-3xl border border-black/8 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_20px_46px_-24px_rgb(0_0_0/0.35)] focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
            >
              <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/8 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                <item.icon className="size-5" />
              </span>
              <span className="mt-1 flex items-center gap-1.5 font-heading text-lg font-medium">
                {item.title}
                <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
              <span className="text-sm text-muted-foreground">
                {item.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
