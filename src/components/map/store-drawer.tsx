"use client"

import { Dialog } from "radix-ui"
import { Navigation, Store as StoreIcon, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { CATEGORY_LABELS, type MapUnit } from "@/config/floors"
import { springSoft } from "@/lib/motion"

interface StoreDrawerProps {
  unit: MapUnit | null
  floorLabel: string
  onClose: () => void
  onDirections: (unit: MapUnit) => void
}

/**
 * The bottom sheet that opens when a unit is tapped.
 *
 * Radix's Dialog underneath gives focus trapping, Escape and overlay semantics
 * for free; Motion only drives the slide-up and the swipe-to-dismiss handle.
 * `forceMount` on the portal is what lets `AnimatePresence` play the exit before
 * Radix unmounts it.
 */
export function StoreDrawer({
  unit,
  floorLabel,
  onClose,
  onDirections,
}: StoreDrawerProps) {
  const open = unit !== null

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && unit && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-40 bg-ink/25 supports-backdrop-filter:backdrop-blur-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl rounded-t-[1.5rem] bg-white p-5 pb-7 shadow-[0_-20px_60px_-30px_rgb(0_0_0/0.5)] ring-1 ring-black/5 sm:p-6 sm:pb-8"
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.5 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.y > 80 || info.velocity.y > 500) onClose()
                  }}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={springSoft}
                >
                  <div
                    aria-hidden
                    className="mx-auto mb-4 h-1 w-10 cursor-grab rounded-full bg-ink/15 active:cursor-grabbing"
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-tint text-brand">
                        <StoreIcon className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <Dialog.Title className="truncate font-heading text-lg font-medium tracking-tight text-ink">
                          {unit.name}
                        </Dialog.Title>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                          {floorLabel}
                          <span aria-hidden className="size-1 rounded-full bg-brand/40" />
                          {CATEGORY_LABELS[unit.category]}
                          <span aria-hidden className="size-1 rounded-full bg-brand/40" />
                          <span className="tabular-nums">{unit.id}</span>
                        </p>
                      </div>
                    </div>

                    <Dialog.Close
                      aria-label="Close"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground ring-1 ring-black/8 transition-colors hover:bg-surface hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
                    >
                      <X className="size-4" />
                    </Dialog.Close>
                  </div>

                  {unit.description && (
                    <Dialog.Description className="mt-4 text-sm leading-relaxed text-muted-foreground text-pretty">
                      {unit.description}
                    </Dialog.Description>
                  )}

                  <div className="mt-5 border-t border-hairline pt-5">
                    <button
                      type="button"
                      onClick={() => onDirections(unit)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
                    >
                      <Navigation className="size-4" />
                      Show me on the plan
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
