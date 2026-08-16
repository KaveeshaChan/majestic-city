"use client"

import { Fragment, useRef } from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react"

import { statement } from "@/config/home"
import { useIsHydrated } from "@/hooks/use-is-hydrated"
import { cn } from "@/lib/utils"

const LEAD_WORDS = statement.lead.split(" ")
const TRAIL_WORDS = statement.trail.split(" ")
const TOTAL_WORDS = LEAD_WORDS.length + TRAIL_WORDS.length

/**
 * The last word has to finish *before* the scroll range runs out, so the wave
 * is packed into the leading fraction of it: the final word starts brightening
 * at `RAMP_END` and is solid by `RAMP_END + WORD_RAMP`, both under 1. Spreading
 * the words across the full 0–1 instead would leave the tail of the sentence
 * permanently faint — there is no scroll left to finish it.
 */
const RAMP_END = 0.76
const WORD_RAMP = 0.16

/**
 * The mission statement, read word by word as the section scrolls through.
 *
 * Each word owns a slice of the section's scroll progress and lifts from faint
 * to solid across it, so the sentence appears to be read rather than revealed.
 * Anyone who asked for less motion gets the finished sentence outright.
 */
export function Statement() {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  /**
   * The sentence is served *finished* and only becomes scroll-driven after
   * mount. Two reasons, both of them bugs when it renders faint from the
   * server: React does not patch inline styles during hydration, so a word
   * server-rendered at `opacity:0.16` stays there forever once
   * `useReducedMotion()` resolves to `true`; and with JavaScript off nothing
   * would ever brighten it, leaving the section unreadable.
   */
  const isAnimated = useIsHydrated() && !prefersReducedMotion

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.6"],
  })

  return (
    <section className="bg-surface py-20 sm:py-28 lg:py-36">
      <div ref={ref} className="mx-auto w-full max-w-[1100px] px-6 sm:px-8 lg:max-w-none">
        {/* The spaces between words are real text nodes, not margins: a word
            split into bare `inline-block`s reads as one run-on string to a
            screen reader and copies out of the page the same way. */}
        <p className="font-heading text-2xl leading-[1.28] font-medium tracking-tight text-balance sm:text-4xl lg:text-[2.9rem]">
          {LEAD_WORDS.map((word, index) => (
            <Fragment key={`lead-${index}`}>
              <Word
                progress={scrollYProgress}
                index={index}
                animated={isAnimated}
              >
                {word}
              </Word>{" "}
            </Fragment>
          ))}
          {TRAIL_WORDS.map((word, index) => (
            <Fragment key={`trail-${index}`}>
              <Word
                progress={scrollYProgress}
                index={LEAD_WORDS.length + index}
                animated={isAnimated}
                muted
              >
                {word}
              </Word>{" "}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  )
}

/**
 * One word. Rendered as its own component because each needs its own
 * `useTransform` — hooks cannot be called from inside a map.
 */
function Word({
  children,
  progress,
  index,
  animated,
  muted = false,
}: {
  children: string
  progress: MotionValue<number>
  index: number
  animated: boolean
  muted?: boolean
}) {
  // Each word's ramp is longer than the gap to the next one, so several are
  // brightening at once and the effect reads as a wave rather than a ticker.
  const start = (index / TOTAL_WORDS) * RAMP_END
  const opacity = useTransform(progress, [start, start + WORD_RAMP], [0.16, 1])

  return (
    <motion.span
      // A literal `1` until the scroll effect is live, so the server and the
      // first client render agree on a fully legible sentence.
      style={animated ? { opacity } : { opacity: 1 }}
      className={cn(
        "inline-block",
        muted ? "text-muted-foreground" : "text-ink"
      )}
    >
      {children}
    </motion.span>
  )
}
