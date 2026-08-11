import Link from "next/link"
import { ArrowUpRight, MapPin } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/sections/section-heading"
import { heroStats } from "@/config/home"

/**
 * The band directly under the full-screen hero — the copy the hero used to
 * carry: what this place is, the numbers behind it, and the two things a visitor
 * most likely wants to do next.
 *
 * Deliberately the first bright surface after the photograph, so the page turns
 * light the moment it is scrolled.
 */
export function HomeIntro() {
  return (
    <section className="border-b border-hairline bg-surface py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <div className="grid gap-11 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <Reveal>
            <Eyebrow>Open daily · 10:00 – 22:00</Eyebrow>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty sm:text-xl">
              <span className="text-ink">
                Colombo&apos;s original shopping landmark.
              </span>{" "}
              Retail, dining, cinema and everyday essentials across six easy
              levels, right on Galle Road — the mall the city has met at since
              1991.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shops"
                className="group inline-flex h-13 items-center gap-2 rounded-full bg-ink pr-5 pl-6 text-sm font-medium text-white transition-colors hover:bg-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
              >
                Explore the shops
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="#visit"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-ink/15 bg-white px-6 text-sm font-medium text-ink transition-colors hover:border-ink/30 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
              >
                <MapPin className="size-4" />
                Plan your visit
              </Link>
            </div>
          </Reveal>

          <Stagger
            className="grid grid-cols-3 gap-x-6 gap-y-5 border-t border-hairline pt-6 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 lg:text-right"
            wrapChildren={false}
            stagger={0.09}
            delay={0.12}
          >
            {heroStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <p className="font-heading text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
