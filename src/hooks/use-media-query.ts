"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * SSR-safe media query hook.
 *
 * Server (and the first client render) always report `false`, then React
 * re-renders with the real value — `useSyncExternalStore` makes that hand-off
 * hydration-safe rather than a mismatch.
 *
 * Layout that must exist in the initial HTML (for SEO or no-JS users) should
 * still be done with CSS breakpoints; this hook is for behaviour that CSS
 * cannot express, e.g. deciding which element owns a shared-layout animation.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onStoreChange)
      return () => mql.removeEventListener("change", onStoreChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}

/** Tailwind breakpoints, mirrored so components read intent instead of pixels. */
export const screens = {
  sm: "(min-width: 40rem)",
  md: "(min-width: 48rem)",
  lg: "(min-width: 64rem)",
  xl: "(min-width: 80rem)",
} as const
