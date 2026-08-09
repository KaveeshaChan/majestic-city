"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { MotionConfig, useReducedMotion } from "motion/react"

import { splashConfig, type SplashPhase } from "@/config/splash"

interface SplashContextValue {
  phase: SplashPhase
  /** `true` from the moment the hand-off starts — the navbar reveals on this. */
  isRevealing: boolean
  /** `true` once the intro is fully out of the way. */
  isDone: boolean
  /** Jump straight to the hand-off (skip button, click, or keypress). */
  skip: () => void
}

const SplashContext = createContext<SplashContextValue | null>(null)

/**
 * Whether the intro should play out or be collapsed to nothing.
 *
 * Rather than branching to a different phase, the skip paths run the *same*
 * state machine with zero-length steps. Fewer code paths, and the header's
 * reveal logic never has to special-case them.
 *
 * Only called from effects, so the `sessionStorage` read is client-only.
 */
function shouldRunInstantly(prefersReducedMotion: boolean | null): boolean {
  if (prefersReducedMotion) return true
  return (
    splashConfig.oncePerSession &&
    window.sessionStorage.getItem(splashConfig.storageKey) === "1"
  )
}

export function useSplash(): SplashContextValue {
  const value = useContext(SplashContext)
  if (!value) {
    throw new Error("useSplash must be used inside <SplashProvider>")
  }
  return value
}

/**
 * Owns the intro state machine so the splash and the navbar stay in lockstep.
 *
 * The phase transition is a single state update, which is what lets the logo's
 * shared layout animation work: the splash's copy unmounts and the navbar's
 * copy mounts in the same commit, so Motion sees one element that moved.
 */
export function SplashProvider({ children }: { children: React.ReactNode }) {
  // The master switch is a module constant, so the server and the first client
  // render always agree — no hydration mismatch, and no effect needed for it.
  const [phase, setPhase] = useState<SplashPhase>(() =>
    splashConfig.enabled ? "welcome" : "done"
  )
  // `null` on the first render, which is why it is only ever read in effects.
  const prefersReducedMotion = useReducedMotion()

  const skip = useCallback(() => {
    setPhase((current) => (current === "welcome" ? "merging" : current))
  }, [])

  // welcome -> merging
  useEffect(() => {
    if (phase !== "welcome") return
    const hold = shouldRunInstantly(prefersReducedMotion) ? 0 : splashConfig.holdMs
    const timer = window.setTimeout(() => setPhase("merging"), hold)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  // merging -> done
  useEffect(() => {
    if (phase !== "merging") return
    const merge = shouldRunInstantly(prefersReducedMotion) ? 0 : splashConfig.mergeMs
    const timer = window.setTimeout(() => setPhase("done"), merge)
    return () => window.clearTimeout(timer)
  }, [phase, prefersReducedMotion])

  useEffect(() => {
    if (phase !== "done" || !splashConfig.oncePerSession) return
    window.sessionStorage.setItem(splashConfig.storageKey, "1")
  }, [phase])

  // Lock the page while the overlay is up so a stray scroll can't desync the
  // logo's flight path.
  useEffect(() => {
    if (phase === "done") return
    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = "hidden"
    return () => {
      body.style.overflow = previous
    }
  }, [phase])

  // Any key dismisses the intro, matching the click-to-skip affordance.
  useEffect(() => {
    if (phase !== "welcome") return
    window.addEventListener("keydown", skip, { once: true })
    return () => window.removeEventListener("keydown", skip)
  }, [phase, skip])

  const value = useMemo<SplashContextValue>(
    () => ({
      phase,
      isRevealing: phase !== "welcome",
      isDone: phase === "done",
      skip,
    }),
    [phase, skip]
  )

  return (
    <SplashContext.Provider value={value}>
      {/* One place to honour prefers-reduced-motion for every animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SplashContext.Provider>
  )
}
