import type { Metadata } from "next"
import Link from "next/link"
import { Clock, Compass, Sparkles, Store } from "lucide-react"

import { CountUp } from "@/components/motion/count-up"
import { Reveal, Stagger } from "@/components/motion/reveal"
import { ShopDirectory } from "@/components/sections/shops/shop-directory"
import { shopCategoriesInUse, shopFloorsInUse, shops } from "@/config/shops"

export const metadata: Metadata = {
  title: "Shops & Brands Directory | Majestic City Colombo",
  description:
    "Explore every store and brand at Majestic City Colombo by name, floor or category. Mobile phones, electronics, fashion, sarees, jewelry, cineplex and dining.",
}

const stats = [
  { value: shops.length, suffix: "+", label: "Stores listed", hint: "Verified tenants" },
  { value: shopFloorsInUse.length, suffix: "", label: "Retail floors", hint: "Ground to Level 5" },
  { value: shopCategoriesInUse.length, suffix: "", label: "Categories", hint: "Tech, fashion & more" },
  { value: 1200, suffix: "+", label: "Parking bays", hint: "Covered & secure" },
]

export default function ShopsPage() {
  return (
    <>
      {/* Premium Hero Header */}
      <section className="relative overflow-hidden border-b border-black/10 bg-gradient-to-b from-ink via-ink to-ink/95 text-white">
        {/* Subtle decorative glow accents */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-10 size-96 rounded-full bg-brand/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/4 size-72 rounded-full bg-amber-500/10 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[1280px] px-6 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-20 lg:max-w-none">
          <Stagger stagger={0.08}>
            {/* Live Mall Status & Badge */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 ring-1 ring-white/15 backdrop-blur-md">
                <Store className="size-3.5 text-brand-tint" />
                Store Directory
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30 backdrop-blur-md">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <Clock className="size-3" />
                Open Today: 10:00 AM – 9:30 PM
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-5 max-w-3xl font-heading text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Every brand. Floor by floor.
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70 text-pretty sm:text-lg">
              Search by store name, narrow down by level, or filter by category.
              Explore Sri Lanka&apos;s premier mobile hub, luxury sarees, apparel,
              cinemas and specialty boutiques with real-time directory search.
            </p>

            {/* Quick Action Link to Map */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white hover:text-ink backdrop-blur-sm"
              >
                <Compass className="size-3.5 text-amber-300" />
                Need directions? View Interactive Floor Map →
              </Link>
            </div>

            {/* Live Stat Counters */}
            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8 border-t border-white/10 pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-heading text-3xl sm:text-4xl font-bold tracking-tight tabular-nums text-white">
                    <CountUp to={stat.value} suffix={stat.suffix} duration={1.8} />
                  </dd>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-white/40">
                    {stat.hint}
                  </span>
                </div>
              ))}
            </dl>
          </Stagger>
        </div>
      </section>

      {/* Main Interactive Directory Section */}
      <ShopDirectory />
    </>
  )
}
