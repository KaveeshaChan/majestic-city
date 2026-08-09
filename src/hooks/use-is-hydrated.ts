"use client"

import { useSyncExternalStore } from "react"

/** Nothing to subscribe to — the value flips once and never changes again. */
const subscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * `false` on the server and through hydration, `true` from the first render
 * after it.
 *
 * Use it to hold back anything that must not be baked into the server HTML —
 * a scroll-driven style, for instance, whose starting value would otherwise be
 * serialised into the markup and then never corrected, because React does not
 * patch inline styles when it hydrates.
 *
 * `useSyncExternalStore` rather than a `setState` in an effect: React re-renders
 * on the snapshot mismatch by itself, so there is no extra render pass to
 * schedule and no lint rule to argue with.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
