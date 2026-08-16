import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Clock, MapPin } from "lucide-react"

import { Eyebrow } from "@/components/sections/section-heading"

/**
 * The landing hero: copy and CTAs on the left, one photograph of the building
 * on the right in a large rounded frame. A single split card rather than two
 * stacked sections, so the pitch and the proof sit in the same glance.
 *
 * The entrance is CSS (`.hero-frame` / `.hero-image` in globals.css) rather
 * than Motion: this is above the fold, so it must never depend on a
 * `whileInView` check or on hydration having finished.
 */
export function HomeHero() {
  return (
    <section className="bg-white pt-6 pb-10 sm:pt-8 sm:pb-14">
      <div className="mx-auto w-full px-3 sm:px-4 lg:px-6">
        <div className="hero-frame grid overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-45px_rgb(0_0_0/0.45)] sm:rounded-[2.5rem] lg:grid-cols-2">
          <div className="flex flex-col justify-center gap-6 px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <Eyebrow>Open daily · 10:00 – 22:00</Eyebrow>

            <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
              Colombo&apos;s original{" "}
              <span className="text-brand">shopping landmark</span>
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-muted-foreground text-pretty">
              Retail, dining, cinema and everyday essentials across six easy
              levels, right on Galle Road — the mall the city has met at
              since 1991.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shops"
                className="group inline-flex h-13 items-center gap-2 rounded-full bg-ink pr-5 pl-6 text-sm font-medium text-white transition-colors hover:bg-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none"
              >
                Explore the shops
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="#visit"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-ink/15 px-6 text-sm font-medium text-ink transition-colors hover:border-ink/30 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
              >
                <MapPin className="size-4" />
                Plan your visit
              </Link>
            </div>

            <div className="flex items-center gap-2.5 pt-2 text-sm text-muted-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-brand">
                <Clock className="size-3.5" />
              </span>
              Open every day of the week, right on Galle Road
            </div>
          </div>

          <div className="relative min-h-[20rem] sm:min-h-[26rem] lg:min-h-0">
            <Image
              src="/front.jpeg"
              alt="The Majestic City building on Galle Road, Bambalapitiya"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="hero-image object-cover object-[50%_62%] sm:object-center"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
