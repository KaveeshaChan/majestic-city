import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { Eyebrow, SectionTitle } from "@/components/sections/section-heading"
import { experienceCards, type ExperienceCard } from "@/config/home"
import { cn } from "@/lib/utils"

/**
 * What's inside — an asymmetric grid: a stack of four cards against one tall
 * image. Server Component; the reveal wrappers are the only client code, and
 * every hover state is plain CSS.
 */
export function ExperienceBento() {
  return (
    <section id="explore" className="bg-surface pb-20 sm:pb-28">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>What&apos;s inside</Eyebrow>
            <SectionTitle className="mt-5">
              Everything a day out needs, on one address
            </SectionTitle>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground text-pretty">
            Six levels, laid out so you can park once and get the whole list
            done — with somewhere to eat when you&apos;re finished.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-3 lg:grid-cols-2 lg:gap-4">
          <Stagger
            className="flex flex-col gap-3"
            wrapChildren={false}
            stagger={0.09}
          >
            {experienceCards.map((card) => (
              <StaggerItem key={card.title} className="flex-1">
                <ExperienceTile card={card} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.12} distance={22} className="min-h-[22rem] lg:min-h-0">
            <FloorMapTile />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/**
 * One tile. The featured card inverts to ink so the stack has a centre of
 * gravity — the same trick the reference concept uses.
 */
function ExperienceTile({ card }: { card: ExperienceCard }) {
  return (
    <Link
      href={card.href}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-[1.25rem] p-5 ring-1 transition-all duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none sm:p-6",
        card.featured
          ? "bg-ink text-white ring-ink/10 hover:bg-brand-strong focus-visible:ring-brand/60"
          : "bg-white ring-black/6 hover:ring-brand/25 hover:shadow-[0_22px_50px_-30px_rgb(0_0_0/0.4)] focus-visible:ring-brand/50"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl transition-colors",
            card.featured
              ? "bg-white/12 text-white"
              : "bg-brand-tint text-brand group-hover:bg-brand group-hover:text-brand-foreground"
          )}
        >
          <card.icon className="size-4.5" />
        </span>
        <ArrowUpRight
          className={cn(
            "size-4.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            card.featured ? "text-white/60" : "text-muted-foreground/60"
          )}
        />
      </div>

      <h3 className="mt-auto font-heading text-lg font-medium tracking-tight sm:text-xl">
        {card.title}
      </h3>
      <p
        className={cn(
          "max-w-md text-sm leading-relaxed text-pretty",
          card.featured ? "text-white/65" : "text-muted-foreground"
        )}
      >
        {card.description}
      </p>
    </Link>
  )
}

/** The tall image tile. Desaturated until hover, so it reads as an image of the building rather than competing with the copy. */
function FloorMapTile() {
  return (
    <Link
      href="/map"
      className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-[1.25rem] bg-ink ring-1 ring-ink/10 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none"
    >
      <Image
        src="/front.jpeg"
        alt=""
        aria-hidden
        fill
        sizes="(max-width: 1024px) 100vw, 620px"
        className="object-cover object-center opacity-85 grayscale transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-100 group-hover:grayscale-0"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent"
      />

      <div className="relative flex items-end justify-between gap-6 p-5 sm:p-7">
        <div>
          <p className="text-[0.6875rem] font-medium tracking-[0.14em] text-white/60 uppercase">
            Know before you go
          </p>
          <h3 className="mt-3 max-w-xs font-heading text-2xl leading-tight font-semibold tracking-tight text-white text-balance sm:text-[1.75rem]">
            Find any store, floor by floor
          </h3>
        </div>
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:scale-105">
          <ArrowUpRight className="size-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
