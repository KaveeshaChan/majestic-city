"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, MapPinned } from "lucide-react"
import { motion } from "motion/react"

import { useSplash } from "@/components/splash/splash-provider"
import { siteConfig } from "@/config/site"
import { riseIn, staggerParent } from "@/lib/motion"

const HIGHLIGHTS = [
  { value: "1991", label: "Trading since" },
  { value: "180+", label: "Stores & outlets" },
  { value: "5", label: "Retail floors" },
  { value: "1,200", label: "Parking bays" },
]

/**
 * Home hero. Its reveal is chained to the intro so the page appears to be
 * uncovered by the curtain rather than to pop in after it.
 */
export function Hero() {
  const { isRevealing } = useSplash()

  return (
    <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink">
      <Image
        src="/front.jpeg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="-z-10 scale-105 object-cover object-center opacity-70"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/45 to-ink"
      />

      <motion.div
        variants={staggerParent(0.09, 0.38)}
        initial="hidden"
        animate={isRevealing ? "visible" : "hidden"}
        className="mx-auto w-full max-w-[1240px] px-6 pt-[calc(var(--header-height)+4rem)] pb-14 sm:px-8 sm:pb-20"
      >
        <motion.p
          variants={riseIn}
          className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-white/55 uppercase"
        >
          <MapPinned className="size-3.5" />
          Bambalapitiya, Colombo 04
        </motion.p>

        <motion.h1
          variants={riseIn}
          className="mt-5 max-w-3xl font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-white text-balance sm:text-6xl lg:text-7xl"
        >
          The city&apos;s original meeting place.
        </motion.h1>

        <motion.p
          variants={riseIn}
          className="mt-6 max-w-xl text-base leading-relaxed text-white/65 text-pretty sm:text-lg"
        >
          {siteConfig.description}
        </motion.p>

        <motion.div variants={riseIn} className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/shops"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-white pr-5 pl-6 text-sm font-medium text-ink transition-colors hover:bg-white/88 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            Explore the shops
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/map"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-colors hover:border-white/45 hover:bg-white/6 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
          >
            View the floor map
          </Link>
        </motion.div>

        <motion.dl
          variants={riseIn}
          className="mt-14 grid max-w-3xl grid-cols-2 gap-x-6 gap-y-8 border-t border-white/12 pt-8 sm:grid-cols-4"
        >
          {HIGHLIGHTS.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <dt className="order-2 text-xs tracking-wide text-white/45">
                {item.label}
              </dt>
              <dd className="order-1 font-heading text-3xl font-semibold tracking-tight text-white">
                {item.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>
    </section>
  )
}
