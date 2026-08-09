"use client"

import { AnimatePresence, motion } from "motion/react"

import { BrandMark } from "@/components/brand/brand-mark"
import { splashConfig } from "@/config/splash"
import { LOGO_ASPECT_RATIO } from "@/config/site"
import { EASE_IN_OUT, EASE_OUT, riseIn, staggerParent } from "@/lib/motion"
import { useSplash } from "./splash-provider"

const WELCOME_WORDS = ["Welcome", "to"]

/**
 * The intro overlay.
 *
 * Two details make the hand-off work:
 *
 * 1. It sits *below* the header in the stacking order (z-90 vs z-100). By the
 *    time the curtain wipes, the logo already belongs to the header, so it has
 *    to fly over the curtain rather than under it. The header renders nothing
 *    visible until the hand-off starts, so nothing leaks through beforehand.
 *
 * 2. The logo lives outside every `AnimatePresence` subtree. Exiting children
 *    are snapshotted, so a logo inside one would keep rendering after the
 *    header mounted its own — two elements sharing a `layoutId` at once, which
 *    breaks the morph. Its slot keeps its size so nothing shifts when it goes.
 */
export function SplashScreen() {
  const { phase, skip } = useSplash()

  if (phase === "done") return null

  const isMerging = phase === "merging"

  return (
    <motion.div
      data-splash
      onClick={skip}
      initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
      animate={{
        clipPath: isMerging ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)",
      }}
      transition={{
        duration: 0.85,
        ease: EASE_IN_OUT,
        delay: isMerging ? 0.08 : 0,
      }}
      className="fixed inset-0 z-90 flex items-center justify-center overflow-hidden bg-ink select-none"
    >
      <SplashBackdrop />

      <div className="relative flex w-full flex-col items-center gap-7 px-6 sm:gap-9">
        <AnimatePresence>
          {!isMerging && (
            <motion.p
              key="welcome-copy"
              variants={staggerParent(0.08, 0.15)}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-[0.32em] font-heading text-xl font-medium tracking-tight text-white/85 sm:text-3xl"
            >
              {WELCOME_WORDS.map((word) => (
                <motion.span key={word} variants={riseIn} className="inline-block">
                  {word}
                </motion.span>
              ))}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Reserved slot — the mark leaves, the space does not. */}
        <div
          className="w-[min(78vw,460px)]"
          style={{ aspectRatio: LOGO_ASPECT_RATIO }}
        >
          {!isMerging && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.34 }}
              className="size-full"
            >
              <BrandMark
                className="w-full"
                radius={22}
                priority
                sizes="(max-width: 640px) 78vw, 460px"
              />
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {!isMerging && <SplashProgress key="welcome-progress" />}
        </AnimatePresence>
      </div>

      <SkipIntroButton onSkip={skip} visible={!isMerging} />
    </motion.div>
  )
}

/** Depth without noise: a brand glow plus one slow sheen sweep. */
function SplashBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,color-mix(in_oklch,var(--brand),transparent_55%)_0%,transparent_65%)]" />
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
        animate={{ opacity: 0.55, scale: 1, rotate: 80 }}
        transition={{ duration: 6, ease: EASE_OUT }}
        className="absolute top-1/2 left-1/2 aspect-square w-[min(150vw,1100px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_180deg,transparent_0deg,color-mix(in_oklch,var(--brand-strong),transparent_70%)_120deg,transparent_260deg)] blur-3xl"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
    </div>
  )
}

/** A hairline that fills over the hold, so the wait reads as intentional. */
function SplashProgress() {
  return (
    <motion.span
      variants={riseIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: 0.5 }}
      className="mt-1 block h-px w-[min(60vw,220px)] overflow-hidden bg-white/15"
    >
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: splashConfig.holdMs / 1000, ease: "linear" }}
        className="block h-full origin-left bg-white/70"
      />
    </motion.span>
  )
}

function SkipIntroButton({
  onSkip,
  visible,
}: {
  onSkip: () => void
  visible: boolean
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onSkip}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{
            duration: 0.4,
            ease: EASE_OUT,
            delay: splashConfig.skipVisibleAfterMs / 1000,
          }}
          className="absolute right-5 bottom-5 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/60 transition-colors hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none sm:right-8 sm:bottom-8"
        >
          Skip intro
        </motion.button>
      )}
    </AnimatePresence>
  )
}
