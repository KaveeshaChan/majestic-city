import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/motion/reveal"
import { Eyebrow } from "@/components/sections/section-heading"

/**
 * The closing panel. The only large field of brand maroon on the page, placed
 * here on purpose: it signs the page off and hands over to the dark footer
 * instead of the footer arriving out of nowhere.
 */
export function ClosingCta() {
  return (
    <section className="bg-white px-4 pt-4 pb-16 sm:px-8 sm:pb-24">
      <Reveal distance={24}>
        <div className="relative isolate mx-auto w-full max-w-[1240px] overflow-hidden rounded-[1.75rem] bg-brand px-6 py-14 sm:rounded-[2.25rem] sm:px-12 sm:py-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(90%_120%_at_85%_10%,color-mix(in_oklch,white,transparent_86%)_0%,transparent_60%)]"
          />

          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow tone="dark">See you at MC</Eyebrow>
              <h2 className="mt-5 font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-white text-balance sm:text-4xl lg:text-5xl">
                Come for the list. Stay for the afternoon.
              </h2>
              <p className="mt-5 max-w-lg leading-relaxed text-white/70 text-pretty">
                Park once, take the lift, and work your way down — shops, lunch
                and a film without stepping back into the traffic.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/shops"
                className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-white pr-5 pl-6 text-sm font-medium text-brand-strong transition-colors hover:bg-white/90 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
              >
                Browse the directory
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-13 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-medium text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
