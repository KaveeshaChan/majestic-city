"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"

import { Eyebrow } from "@/components/sections/section-heading"
import { quickFindItems } from "@/config/home"
import { EASE_OUT, riseIn, staggerParent } from "@/lib/motion"

/**
 * The landing hero: one full-height photograph of the building, with only the
 * wordmark on it and the quick-find dock resting on its bottom edge.
 *
 * Everything else — the description, the numbers, the buttons — lives in the
 * bright band directly below (`<HomeIntro>`), so the first thing a visitor meets
 * is the place itself rather than a paragraph about it.
 */
export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()

  // Scroll-linked, so it sits outside MotionConfig's reduced-motion handling
  // and has to be opted out of by hand.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"])
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      ref={sectionRef}
      // A hair under full height on phones: `object-cover` crops a 16:9 photo
      // hard into a tall box, and every row of viewport the hero gives back is
      // more of the building actually visible.
      className="relative isolate flex min-h-[88svh] flex-col overflow-hidden bg-ink sm:min-h-[100svh]"
    >
      {/* The photo drifts at a third of the scroll speed. `scale` gives it the
          overscan that drift needs, and settles on load so the building appears
          to be arrived at. */}
      <motion.div
        aria-hidden
        initial={{ scale: 1.14 }}
        animate={{ scale: 1.04 }}
        transition={{ duration: 2.2, ease: EASE_OUT }}
        style={{ y: prefersReducedMotion ? 0 : imageY }}
        className="absolute inset-0 -z-10"
      >
        <Image
          src="/front.jpeg"
          alt="The Majestic City building on Galle Road, Bambalapitiya, at dusk"
          fill
          preload
          sizes="100vw"
          // Biased downwards on phones so the tight crop lands on the lit
          // entrance and shopfronts rather than on empty upper facade.
          className="object-cover object-[50%_62%] sm:object-center"
        />
      </motion.div>

      {/* Three shaped scrims rather than one flat blanket — the facade behind
          the wordmark is the brightest part of the photograph, so the darkening
          is concentrated where type actually sits and the glass stays lit. */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-56 bg-gradient-to-b from-ink/65 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(58%_46%_at_50%_46%,color-mix(in_oklch,var(--ink),transparent_38%)_0%,transparent_72%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-[58%] bg-gradient-to-t from-ink/85 via-ink/35 to-transparent"
      />

      <motion.div
        style={
          prefersReducedMotion ? undefined : { y: contentY, opacity: contentOpacity }
        }
        className="flex flex-1 flex-col justify-center"
      >
        <motion.div
          data-reveal
          variants={staggerParent(0.1, 0.35)}
          initial="hidden"
          animate="visible"
          className="mx-auto flex w-full max-w-[1240px] flex-col items-center px-6 pt-[calc(var(--header-height)+2.5rem)] pb-10 text-center sm:px-8"
        >
          <motion.div data-reveal variants={riseIn}>
            <Eyebrow tone="dark">Since 1991 · Bambalapitiya, Colombo 04</Eyebrow>
          </motion.div>

          <motion.h1
            data-reveal
            variants={riseIn}
            // The drop shadow is what keeps the counters of the letterforms
            // legible where they cross the lit glass behind them.
            className="mt-7 font-heading text-[clamp(2.9rem,10.5vw,7.5rem)] leading-[0.9] font-bold tracking-[-0.035em] text-white uppercase [text-shadow:0_2px_40px_rgb(0_0_0/0.5)]"
          >
            Majestic
            <br />
            <span className="text-white/80">City</span>
          </motion.h1>

          <motion.p
            data-reveal
            variants={riseIn}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-medium text-white sm:text-base"
          >
            Colombo&apos;s original meeting place
            <span aria-hidden className="hidden size-1 rounded-full bg-white/50 sm:block" />
            <span className="text-white/70">Open daily · 10:00 – 22:00</span>
          </motion.p>
        </motion.div>
      </motion.div>

      <QuickFindDock />
    </section>
  )
}

/**
 * The dock: four real routes rather than a search box, because a search field
 * that cannot search is the fastest way to lose a first-time visitor.
 *
 * It is the one bright surface in the hero, which is what stops the photograph
 * from reading as a dead end and points at the rest of the site.
 */
function QuickFindDock() {
  return (
    <motion.div
      data-reveal
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.75 }}
      className="relative mx-auto w-full max-w-[1240px] px-4 pb-4 sm:px-8 sm:pb-6"
    >
      {/* Two-up on phones — stacked, the four rows push the dock off the bottom
          of the screen, which is the one thing it must never do. The hint and
          the arrow only appear once there is room for them. */}
      <div className="grid grid-cols-2 gap-1.5 rounded-[1.5rem] bg-white/95 p-1.5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.6)] ring-1 ring-black/5 backdrop-blur-xl lg:grid-cols-4">
        {quickFindItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group flex items-center gap-2.5 rounded-2xl px-2.5 py-2.5 transition-colors hover:bg-brand-tint focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none sm:gap-3 sm:px-3 sm:py-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
              <item.icon className="size-4" />
            </span>
            <span className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-medium text-ink">
                {item.title}
              </span>
              <span className="hidden truncate text-xs text-muted-foreground sm:block">
                {item.hint}
              </span>
            </span>
            <ArrowRight className="ml-auto hidden size-4 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand sm:block" />
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
