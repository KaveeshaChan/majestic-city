"use client"

import { useEffect, useState } from "react"

interface UseScrollStateOptions {
  /** Past this offset the navbar tightens up. */
  scrolledAfter?: number
  /** Below this offset the navbar never hides, so the top of the page is calm. */
  hideAfter?: number
  /** Ignore direction flips smaller than this to avoid jitter. */
  deltaThreshold?: number
  /** Pass `false` while the intro is still running. */
  enabled?: boolean
}

export interface ScrollState {
  isScrolled: boolean
  isHidden: boolean
}

const INITIAL: ScrollState = { isScrolled: false, isHidden: false }

/**
 * Tracks scroll offset and direction on a rAF tick, so the listener never reads
 * layout more than once per frame.
 */
export function useScrollState({
  scrolledAfter = 16,
  hideAfter = 180,
  deltaThreshold = 6,
  enabled = true,
}: UseScrollStateOptions = {}): ScrollState {
  const [state, setState] = useState<ScrollState>(INITIAL)

  useEffect(() => {
    if (!enabled) return

    let lastY = window.scrollY
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      const isScrolled = y > scrolledAfter
      const delta = y - lastY

      // Small movements only update the "scrolled" flag, so the bar does not
      // flicker in and out on trackpad noise.
      if (Math.abs(delta) < deltaThreshold) {
        setState((prev) =>
          prev.isScrolled === isScrolled ? prev : { ...prev, isScrolled }
        )
        return
      }

      lastY = y
      const isHidden = delta > 0 && y > hideAfter
      setState((prev) =>
        prev.isScrolled === isScrolled && prev.isHidden === isHidden
          ? prev
          : { isScrolled, isHidden }
      )
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(read)
    }

    // Measure once after paint to catch restored scroll positions.
    frame = requestAnimationFrame(read)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled, scrolledAfter, hideAfter, deltaThreshold])

  // Derived rather than reset through an effect: while disabled the bar is
  // always shown, whatever the last tracked value was.
  return enabled ? state : { ...state, isHidden: false }
}
