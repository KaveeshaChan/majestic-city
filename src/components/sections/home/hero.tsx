"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { Eyebrow } from "@/components/sections/section-heading"
import { heroStats, quickFindItems } from "@/config/home"
import { riseIn, staggerParent } from "@/lib/motion"

/**
 * The landing hero.
 *
 * Composition follows the reference concept: a badge and a live-status chip on
 * one line, an oversized wordmark headline sharing a baseline with a column of
 * proof numbers, then a single wide image with the "quick find" dock resting on
 * its bottom edge. The image is the only dark surface, which is what keeps the
 * page bright while still giving the eye a focal point.
 */
export function HomeHero() {
  const frameRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Scroll-linked, so it is not covered by MotionConfig's reduced-motion
  // handling — it has to be opted out of by hand.
  const { scrollYProgress } = useScroll({
    target: frameRef,
    offset: ["start end", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"])

  return (
    <section className="relative isolate overflow-hidden pt-[calc(var(--header-height)+2rem)] pb-6 sm:pb-10">
      <HeroBackdrop />

      <motion.div
        data-reveal
        variants={staggerParent(0.09, 0.15)}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[1240px] px-4 sm:px-8"
      >
        <motion.div
          variants={riseIn}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <Eyebrow>Since 1991 · Bambalapitiya</Eyebrow>
          <OpeningChip />
        </motion.div>

        <div className="mt-7 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
          <motion.h1
            data-reveal
            variants={riseIn}
            className="font-heading text-[clamp(2.9rem,10.5vw,7.5rem)] leading-[0.9] font-bold tracking-[-0.035em] text-ink uppercase"
          >
            Majestic
            <br />
            <span className="text-brand">City</span>
          </motion.h1>

          <motion.dl
            data-reveal
            variants={riseIn}
            className="grid grid-cols-3 gap-x-6 gap-y-5 border-t border-hairline pt-5 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:text-right"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dd className="font-heading text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-[0.6875rem] tracking-[0.12em] text-muted-foreground uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="mt-8 grid gap-7 sm:mt-10 lg:grid-cols-[minmax(0,32rem)_auto] lg:items-end lg:justify-between">
          <motion.p
            data-reveal
            variants={riseIn}
            className="text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg"
          >
            Colombo&apos;s original shopping landmark — retail, dining, cinema
            and everyday essentials across six easy levels, right on Galle Road.
          </motion.p>

          <motion.div
            data-reveal
            variants={riseIn}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/shops"
              className="group inline-flex h-13 items-center gap-2 rounded-full bg-ink pr-5 pl-6 text-sm font-medium text-white transition-colors hover:bg-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
            >
              Explore the shops
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="#visit"
              className="inline-flex h-13 items-center gap-2 rounded-full border border-ink/15 bg-white/60 px-6 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-white focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
            >
              <MapPin className="size-4" />
              Plan your visit
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={riseIn}
          ref={frameRef}
          className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-ink ring-1 ring-ink/10 sm:mt-10 sm:rounded-[2.25rem]"
        >
          {/* Aspect-driven on small screens; on desktop it switches to a slice
              of the viewport height so the quick-find dock always lands above
              the fold rather than being pushed off a short laptop screen. */}
          <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-auto lg:h-[clamp(19rem,40vh,34rem)]">
            <motion.div
              // Explicit `0` rather than no style at all — see the note in
              // `statement.tsx`: dropping the style would leave the motion
              // value's last write on the node.
              style={{ y: prefersReducedMotion ? 0 : imageY }}
              className="absolute inset-0 scale-110"
            >
              <Image
                src="/front.jpeg"
                alt="The Majestic City building on Galle Road, Bambalapitiya, at dusk"
                fill
                preload
                sizes="(max-width: 1280px) 100vw, 1240px"
                className="object-cover object-center"
              />
            </motion.div>

            {/* Just enough scrim for the caption, nowhere near the darkness of
                a full-bleed dark hero. */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent"
            />

            <p className="absolute top-4 left-4 max-w-[15rem] text-xs leading-relaxed font-medium text-white/85 sm:top-6 sm:left-6 sm:text-sm">
              <span className="rounded-full bg-black/25 px-3 py-1.5 backdrop-blur-md">
                Galle Road, Colombo 04
              </span>
            </p>
          </div>

          <QuickFindDock />
        </motion.div>
      </motion.div>
    </section>
  )
}

/**
 * Two soft brand washes and a hairline grid. The point is depth without
 * darkness — the page should feel lit, not tinted.
 */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-40 -right-24 size-[38rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--brand),transparent_88%)_0%,transparent_70%)]" />
      <div className="absolute -top-24 -left-32 size-[30rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--brand),transparent_93%)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--surface))]" />
    </div>
  )
}

/** Static by design: an "open now" badge that guesses would cost more trust than it buys. */
function OpeningChip() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-ink ring-1 ring-hairline">
      <span aria-hidden className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand/70 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
      </span>
      Open daily · 10:00 – 22:00
    </span>
  )
}

/**
 * The dock. Sits below the image on phones and lifts onto its bottom edge from
 * `sm` up, which is the one place a glass surface earns its keep.
 */
function QuickFindDock() {
  return (
    <div className="p-2 sm:absolute sm:inset-x-3 sm:bottom-3 sm:p-0 lg:inset-x-4 lg:bottom-4">
      <div className="grid gap-1.5 rounded-[1.25rem] bg-white/95 p-1.5 shadow-[0_18px_44px_-28px_rgb(0_0_0/0.45)] ring-1 ring-black/5 sm:grid-cols-2 sm:backdrop-blur-xl lg:grid-cols-4">
        {quickFindItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-brand-tint focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
              <item.icon className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-ink">
                {item.title}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {item.hint}
              </span>
            </span>
            <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand" />
          </Link>
        ))}
      </div>
    </div>
  )
}
