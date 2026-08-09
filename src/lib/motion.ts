import type { Transition, Variants } from "motion/react"

/**
 * Shared easing + spring tokens. Using a small fixed set keeps every animation
 * on the site feeling like it came from the same hand.
 */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1]
export const EASE_SOFT: [number, number, number, number] = [0.33, 1, 0.68, 1]

/** Weighty, for large elements travelling a long distance. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 190,
  damping: 26,
  mass: 1,
}

/** Quick and tight, for chrome that reacts to input (navbar hide/show). */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 38,
  mass: 0.7,
}

/**
 * The signature entrance: rise + unblur. Used for nav links, hero copy and
 * every scroll reveal, so the whole site shares one reveal language.
 */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(6px)",
    transition: { duration: 0.35, ease: EASE_OUT },
  },
}

/**
 * `riseIn` with a delay baked in. A variant's own `transition` beats the one on
 * the component, so a delay cannot simply be passed alongside `riseIn` — it has
 * to be built into the variant.
 */
export function riseInDelayed(delay = 0, distance = 14): Variants {
  return {
    hidden: { opacity: 0, y: distance, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.65, ease: EASE_OUT, delay },
    },
  }
}

/** Parent wrapper for `riseIn` children. */
export function staggerParent(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
    exit: {
      transition: { staggerChildren: stagger / 2, staggerDirection: -1 },
    },
  }
}

/**
 * One viewport rule for every scroll reveal: fire a little before the element
 * is fully on screen, and never play it twice.
 */
export const REVEAL_VIEWPORT = { once: true, margin: "-12% 0px -8% 0px" } as const
