import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { Eyebrow, SectionTitle } from "@/components/sections/section-heading"
import { floorGuide } from "@/config/home"

/**
 * The floor-by-floor guide — the answer to the only question a first-time
 * visitor actually has: "which level do I need?"
 *
 * The level number is set oversized and translucent behind the copy, which gives
 * each card an identity without needing six photographs we don't have.
 */
export function FloorGuide() {
  return (
    <section className="bg-surface py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:max-w-none">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Eyebrow>Floor guide</Eyebrow>
            <SectionTitle className="mt-5">
              Know which level you&apos;re heading to
            </SectionTitle>
          </div>
          <Link
            href="/map"
            className="group inline-flex items-center gap-2 self-start text-sm font-medium text-brand transition-colors hover:text-brand-strong md:self-end"
          >
            Open the full floor map
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Reveal>

        <Stagger
          className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          wrapChildren={false}
          stagger={0.07}
        >
          {floorGuide.map((floor) => (
            <StaggerItem key={floor.level}>
              <Link
                href="/shops"
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white p-6 ring-1 ring-black/6 transition-all duration-300 hover:-translate-y-1 hover:ring-brand/25 hover:shadow-[0_26px_54px_-32px_rgb(0_0_0/0.4)] focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -top-4 right-3 font-heading text-[5.5rem] leading-none font-bold tracking-tighter text-ink/[0.045] transition-colors duration-500 group-hover:text-brand/10"
                >
                  {floor.level}
                </span>

                <span className="relative inline-flex w-fit items-center rounded-full bg-brand-tint px-2.5 py-1 text-[0.6875rem] font-semibold tracking-[0.1em] text-brand-strong uppercase">
                  {floor.level === "G" ? "Ground" : `Level ${floor.level}`}
                </span>

                <h3 className="relative mt-4 font-heading text-lg font-medium tracking-tight">
                  {floor.title}
                </h3>

                <ul className="relative mt-3 flex flex-wrap gap-1.5">
                  {floor.categories.map((category) => (
                    <li
                      key={category}
                      className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {category}
                    </li>
                  ))}
                </ul>

                <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                  Browse this floor
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
