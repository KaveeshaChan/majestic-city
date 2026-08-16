import type { Transition, Variants } from "motion/react"

/**
 * Shared easing + spring tokens. Using a small fixed set keeps every animation
 * on the site feeling like it came from the same hand.
 *
 * The curves are Apple's: almost all of the distance is covered in the first
 * third of the duration, then the element glides to a stop. That front-loading
 * is what makes a long (0.8s+) transition still feel immediate rather than
 * sluggish — the opposite of a linear or symmetric ease.
 */

/** Expo-out. The reveal curve: fast departure, very long settle. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** apple.com's workhorse — a touch of ease-in before the same long glide. */
export const EASE_APPLE: [number, number, number, number] = [0.32, 0.72, 0, 1]

/** Symmetric, for things that move and come back (drawers, accordions). */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

/** Gentler than `EASE_OUT`, for small state changes that shouldn't snap. */
export const EASE_SOFT: [number, number, number, number] = [0.25, 1, 0.5, 1]

/**
 * Weighty, for large elements travelling a long distance.
 *
 * Damped just short of critical, so it arrives without a visible bounce —
 * overshoot reads as "toy", and this site is meant to read as "building".
 */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 24,
  mass: 1.05,
}

/** For chrome that reacts to input (navbar, the active-nav highlight). */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.85,
}

/**
 * The signature entrance: rise + unblur. Used for nav links, hero copy and
 * every scroll reveal, so the whole site shares one reveal language.
 *
 * Long and low: 0.9s of travel over 24px. Because `EASE_OUT` front-loads the
 * motion, the element is visually *there* within ~300ms and spends the rest of
 * the duration easing the last few pixels — read as poise, not as waiting.
 */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: EASE_OUT,
      // Opacity leads the transform slightly, so nothing fades in already
      // parked — the eye catches it mid-move.
      opacity: { duration: 0.6, ease: EASE_SOFT },
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(8px)",
    transition: { duration: 0.4, ease: EASE_APPLE },
  },
}

/**
 * `riseIn` with a delay baked in. A variant's own `transition` beats the one on
 * the component, so a delay cannot simply be passed alongside `riseIn` — it has
 * to be built into the variant.
 */
export function riseInDelayed(delay = 0, distance = 24): Variants {
  return {
    hidden: { opacity: 0, y: distance, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: EASE_OUT,
        delay,
        opacity: { duration: 0.65, ease: EASE_SOFT, delay },
      },
    },
  }
}

/** Parent wrapper for `riseIn` children. */
export function staggerParent(stagger = 0.09, delay = 0): Variants {
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
 *
 * The bottom margin is small on purpose. The reveals run for ~1s, so a section
 * that only triggers once it is well inside the viewport would still be
 * animating after the reader has arrived at it.
 */
export const REVEAL_VIEWPORT = { once: true, margin: "-8% 0px -4% 0px" } as const
