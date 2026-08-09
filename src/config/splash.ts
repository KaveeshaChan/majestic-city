/**
 * Timings for the intro sequence. All values are milliseconds and are kept here
 * so the choreography can be retuned without touching component code.
 *
 * Timeline
 *   0 ──────────── holdMs ──────────── holdMs + mergeMs
 *   │ "Welcome to" + logo settle       │ logo flies into the navbar,
 *   │ on the splash                    │ splash wipes away, nav springs in
 */
export const splashConfig = {
  /** Master switch — set to `false` to boot straight into the site. */
  enabled: true,
  /**
   * Show the intro only on the first page load of a browser session.
   * Left `false` so the sequence is visible on every refresh while the site is
   * being built; flip to `true` before shipping if you want it once per visit.
   */
  oncePerSession: false,
  /** sessionStorage key used when `oncePerSession` is on. */
  storageKey: "mc:splash-seen",

  /** How long the "Welcome to <logo>" state is held. */
  holdMs: 1500,
  /** Length of the hand-off: logo morph + curtain wipe + navbar reveal. */
  mergeMs: 900,
  /** The "Skip intro" affordance fades in after this. */
  skipVisibleAfterMs: 600,
} as const

export type SplashPhase = "welcome" | "merging" | "done"
