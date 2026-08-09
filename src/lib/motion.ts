import type { Transition, Variants } from "motion/react"

/**
 * Shared easing + spring tokens. Using a small fixed set keeps every animation
 * on the site feeling like it came from the same hand.
 */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
export const EASE_IN_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1]
export const EASE_SOFT: [number, number, number, number] = [0.33, 1, 0.68, 1]

/** Weighty, for large elements travelling a long distance (the logo morph). */
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
 * The signature entrance: rise + unblur. Used for splash copy, nav links and
 * page content so the whole site shares one reveal language.
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
