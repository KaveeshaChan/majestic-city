"use client"

import { useCallback, useDeferredValue, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { SearchX } from "lucide-react"

import { ShopCard } from "@/components/sections/shops/shop-card"
import { ShopFilters } from "@/components/sections/shops/shop-filters"
import { shopCategoryMap, shopFloorMap, shops } from "@/config/shops"
import { EASE_OUT } from "@/lib/motion"

/**
 * The store directory: three composable filters over one animated grid.
 *
 * All 60-odd stores ship in the initial payload — the list is small enough that
 * filtering in memory beats a round trip, and it means the grid can animate
 * between states instead of blanking out and re-fetching.
 */

/** Fold case and punctuation so "Hameedia's" matches a typed "hameedias". */
function normalise(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "")
}

/**
 * Each store's searchable text, built once. Includes the category and floor
 * labels, so typing "mobile" or "level 2" finds stores whose own name says
 * neither.
 */
const searchIndex = new Map(
  shops.map((shop) => [
    shop.id,
    normalise(
      [
        shop.name,
        shopCategoryMap.get(shop.category)?.label ?? "",
        shopFloorMap.get(shop.floor)?.label ?? "",
        shop.unit ?? "",
      ].join(" ")
    ),
  ])
)

/** Where the top of the filter bar comes to rest under the floating navbar. */
function stickyOffset() {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-height")
    .trim()
  const value = Number.parseFloat(raw)
  const px = raw.endsWith("rem") ? value * 16 : value
  return (Number.isFinite(px) ? px : 72) + 24
}

export function ShopDirectory() {
  const [query, setQuery] = useState("")
  const [floor, setFloor] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const topRef = useRef<HTMLDivElement>(null)

  /**
   * Narrowing the grid from 65 cards to 8 while the reader sits halfway down
   * leaves them staring at the footer — the document shrinks and the browser
   * clamps the scroll below the results. Pull the filter bar back to its
   * resting position instead.
   *
   * Only ever upward: the early return means that once the bar is in place a
   * repeat call does nothing, so typing scrolls at most once per search rather
   * than yanking the page on every keystroke.
   */
  const scrollToResults = useCallback(() => {
    const el = topRef.current
    if (!el) return

    const target = el.getBoundingClientRect().top + window.scrollY - stickyOffset()
    if (window.scrollY <= target) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" })
  }, [])

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      scrollToResults()
    },
    [scrollToResults]
  )

  const handleFloorChange = useCallback(
    (value: string | null) => {
      setFloor(value)
      scrollToResults()
    },
    [scrollToResults]
  )

  const handleCategoryChange = useCallback(
    (value: string | null) => {
      setCategory(value)
      scrollToResults()
    },
    [scrollToResults]
  )

  // The input stays perfectly responsive while the 60-card grid re-renders and
  // re-flows behind it.
  const deferredQuery = useDeferredValue(query)

  const results = useMemo(() => {
    const term = normalise(deferredQuery)

    return shops.filter((shop) => {
      if (floor !== null && shop.floor !== floor) return false
      if (category !== null && shop.category !== category) return false
      if (term !== "" && !searchIndex.get(shop.id)?.includes(term)) return false
      return true
    })
  }, [deferredQuery, floor, category])

  const reset = useCallback(() => {
    setQuery("")
    setFloor(null)
    setCategory(null)
    scrollToResults()
  }, [scrollToResults])

  return (
    <section className="bg-surface pt-6 pb-20 sm:pt-8 sm:pb-28">
      <div ref={topRef} className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:max-w-none">
        <ShopFilters
          query={query}
          onQueryChange={handleQueryChange}
          floor={floor}
          onFloorChange={handleFloorChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          resultCount={results.length}
          totalCount={shops.length}
          onReset={reset}
        />

        <motion.ul
          layout
          className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((shop, index) => (
              <ShopCard
                key={shop.id}
                shop={shop}
                query={deferredQuery}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.ul>

        <AnimatePresence>
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="mx-auto mt-6 flex max-w-md flex-col items-center rounded-[1.5rem] bg-white px-6 py-16 text-center ring-1 ring-black/6"
            >
              <span className="grid size-12 place-items-center rounded-full bg-brand-tint text-brand-strong">
                <SearchX className="size-5" strokeWidth={1.6} />
              </span>
              <p className="mt-5 font-heading text-lg font-medium tracking-tight">
                No shops match that yet
              </p>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">
                Try a shorter search, or clear the floor and category filters to
                see all {shops.length} stores.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-strong focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Reset filters
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
