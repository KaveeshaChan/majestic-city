"use client"

import { useCallback, useDeferredValue, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Compass, Heart, RotateCcw, SearchX, Sparkles, Store } from "lucide-react"

import { ShopCard } from "@/components/sections/shops/shop-card"
import { ShopDetailModal } from "@/components/sections/shops/shop-detail-modal"
import {
  ShopFilters,
  type SortOption,
  type ViewMode,
} from "@/components/sections/shops/shop-filters"
import { ShopListRow } from "@/components/sections/shops/shop-list-row"
import {
  shopCategoryMap,
  shopFloorMap,
  shopFloors,
  shops,
  type Shop,
} from "@/config/shops"
import { floorGuide } from "@/config/home"
import { useShopBookmarks } from "@/hooks/use-shop-bookmarks"
import { EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Fold case and punctuation so "Hameedia's" matches a typed "hameedias". */
function normalise(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "")
}

/**
 * Search index including shop name, category label, floor label, unit and category keywords.
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
        shop.category,
      ].join(" ")
    ),
  ])
)

/** Floor sort order map: G -> 0, 01 -> 1, 02 -> 2, etc. */
const FLOOR_ORDER: Record<string, number> = {
  G: 0,
  "01": 1,
  "02": 2,
  "03": 3,
  "04": 4,
  "05": 5,
}

/** Where the top of the filter bar comes to rest under the floating navbar. */
function stickyOffset() {
  const raw =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement)
          .getPropertyValue("--header-height")
          .trim()
      : "4.5rem"
  const value = Number.parseFloat(raw)
  const px = raw.endsWith("rem") ? value * 16 : value
  return (Number.isFinite(px) ? px : 72) + 24
}

export function ShopDirectory() {
  const [query, setQuery] = useState("")
  const [floor, setFloor] = useState<string | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortBy, setSortBy] = useState<SortOption>("name-asc")
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)

  const { bookmarks, isBookmarked, toggleBookmark, count: savedCount } =
    useShopBookmarks()

  const topRef = useRef<HTMLDivElement>(null)

  const scrollToResults = useCallback(() => {
    const el = topRef.current
    if (!el || typeof window === "undefined") return

    const target =
      el.getBoundingClientRect().top + window.scrollY - stickyOffset()
    if (window.scrollY <= target) return

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
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

  const reset = useCallback(() => {
    setQuery("")
    setFloor(null)
    setCategory(null)
    setBookmarkedOnly(false)
    scrollToResults()
  }, [scrollToResults])

  const deferredQuery = useDeferredValue(query)

  // Filtered & Sorted results
  const results = useMemo(() => {
    const term = normalise(deferredQuery)

    const filtered = shops.filter((shop) => {
      if (bookmarkedOnly && !bookmarks.includes(shop.id)) return false
      if (floor !== null && shop.floor !== floor) return false
      if (category !== null && shop.category !== category) return false
      if (term !== "" && !searchIndex.get(shop.id)?.includes(term)) return false
      return true
    })

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name)
      }
      if (sortBy === "floor-asc") {
        const fa = FLOOR_ORDER[a.floor] ?? 99
        const fb = FLOOR_ORDER[b.floor] ?? 99
        if (fa !== fb) return fa - fb
        return a.name.localeCompare(b.name)
      }
      if (sortBy === "category") {
        const ca = shopCategoryMap.get(a.category)?.label ?? ""
        const cb = shopCategoryMap.get(b.category)?.label ?? ""
        if (ca !== cb) return ca.localeCompare(cb)
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }, [deferredQuery, floor, category, bookmarkedOnly, bookmarks, sortBy])

  // Grouped by floor results for 'grouped' view
  const groupedByFloor = useMemo(() => {
    const groups: Array<{
      floor: (typeof shopFloors)[number]
      guide?: (typeof floorGuide)[number]
      items: Shop[]
    }> = []

    for (const fl of shopFloors) {
      const itemsOnFloor = results.filter((shop) => shop.floor === fl.id)
      if (itemsOnFloor.length > 0) {
        groups.push({
          floor: fl,
          guide: floorGuide.find((g) => g.level === fl.id),
          items: itemsOnFloor,
        })
      }
    }

    return groups
  }, [results])

  return (
    <section className="min-h-screen bg-surface pt-6 pb-24 sm:pt-8 sm:pb-32">
      <div
        ref={topRef}
        className="mx-auto w-full max-w-[1280px] px-4 sm:px-8 lg:max-w-none"
      >
        {/* Sticky Control & Filter Bar */}
        <ShopFilters
          query={query}
          onQueryChange={handleQueryChange}
          floor={floor}
          onFloorChange={handleFloorChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          bookmarkedOnly={bookmarkedOnly}
          onBookmarkedOnlyChange={setBookmarkedOnly}
          savedCount={savedCount}
          resultCount={results.length}
          totalCount={shops.length}
          onReset={reset}
        />

        {/* Directory View Area */}
        <div className="mt-8">
          {/* 1. Standard Grid View */}
          {viewMode === "grid" && (
            <motion.ul
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((shop, index) => (
                  <ShopCard
                    key={shop.id}
                    shop={shop}
                    query={deferredQuery}
                    index={index}
                    isBookmarked={isBookmarked(shop.id)}
                    onToggleBookmark={toggleBookmark}
                    onSelect={setSelectedShop}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}

          {/* 2. Compact List View */}
          {viewMode === "list" && (
            <motion.ul layout className="mx-auto flex max-w-4xl flex-col gap-2.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((shop, index) => (
                  <ShopListRow
                    key={shop.id}
                    shop={shop}
                    query={deferredQuery}
                    index={index}
                    isBookmarked={isBookmarked(shop.id)}
                    onToggleBookmark={toggleBookmark}
                    onSelect={setSelectedShop}
                  />
                ))}
              </AnimatePresence>
            </motion.ul>
          )}

          {/* 3. Grouped by Floor View */}
          {viewMode === "grouped" && (
            <div className="space-y-12">
              {groupedByFloor.map((group) => (
                <div
                  key={group.floor.id}
                  id={`floor-group-${group.floor.id}`}
                  className="scroll-mt-36"
                >
                  {/* Floor Group Header */}
                  <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-hairline pb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-2xl bg-ink font-heading text-lg font-bold text-white shadow-sm">
                        {group.floor.short}
                      </span>
                      <div>
                        <h2 className="font-heading text-xl font-bold tracking-tight text-ink sm:text-2xl">
                          {group.floor.label}
                        </h2>
                        {group.guide ? (
                          <p className="text-xs text-muted-foreground">
                            {group.guide.title} • {group.guide.categories.join(", ")}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-semibold text-brand">
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "store" : "stores"}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleFloorChange(group.floor.id)}
                        className="text-xs text-muted-foreground hover:text-brand transition-colors"
                      >
                        Filter to this level →
                      </button>
                    </div>
                  </div>

                  {/* Floor Cards Grid */}
                  <motion.ul
                    layout
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {group.items.map((shop, index) => (
                        <ShopCard
                          key={shop.id}
                          shop={shop}
                          query={deferredQuery}
                          index={index}
                          isBookmarked={isBookmarked(shop.id)}
                          onToggleBookmark={toggleBookmark}
                          onSelect={setSelectedShop}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.ul>
                </div>
              ))}
            </div>
          )}

          {/* Empty / Zero Results State */}
          <AnimatePresence>
            {results.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="mx-auto mt-8 flex max-w-lg flex-col items-center rounded-3xl border border-black/8 bg-white px-8 py-16 text-center shadow-lg"
              >
                <span className="grid size-16 place-items-center rounded-3xl bg-brand-tint text-brand-strong shadow-xs">
                  {bookmarkedOnly ? (
                    <Heart className="size-7 text-rose-500" />
                  ) : (
                    <SearchX className="size-7" strokeWidth={1.75} />
                  )}
                </span>

                <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-ink">
                  {bookmarkedOnly
                    ? "No saved stores yet"
                    : "No stores match your search"}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {bookmarkedOnly
                    ? "Tap the heart icon on any store card to build your personalized shopping visit list."
                    : `We couldn't find any stores matching your current search or filters. Try adjusting your query or resetting filters.`}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-md shadow-brand/20 transition-all hover:bg-brand-strong hover:shadow-lg focus-visible:outline-none"
                  >
                    <RotateCcw className="size-4" />
                    Reset all filters
                  </button>

                  {bookmarkedOnly && (
                    <button
                      type="button"
                      onClick={() => setBookmarkedOnly(false)}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-surface-muted px-5 text-sm font-medium text-foreground transition-colors hover:bg-black/5"
                    >
                      <Store className="size-4" />
                      Browse all {shops.length} stores
                    </button>
                  )}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Quick Floor Floating Jump Rail (Visible on larger screens) */}
        <div className="hidden 2xl:fixed 2xl:right-6 2xl:top-1/2 2xl:z-30 2xl:-translate-y-1/2 2xl:flex 2xl:flex-col 2xl:gap-1.5 2xl:rounded-2xl 2xl:bg-white/90 2xl:p-2 2xl:shadow-xl 2xl:backdrop-blur-md 2xl:ring-1 2xl:ring-black/10">
          <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground text-center">
            Floor
          </p>
          <button
            type="button"
            onClick={() => handleFloorChange(null)}
            className={cn(
              "grid size-8 place-items-center rounded-xl text-xs font-semibold transition-colors",
              floor === null
                ? "bg-brand text-white"
                : "text-muted-foreground hover:bg-surface-muted"
            )}
          >
            All
          </button>
          {shopFloors.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => handleFloorChange(floor === f.id ? null : f.id)}
              title={f.label}
              className={cn(
                "grid size-8 place-items-center rounded-xl text-xs font-semibold transition-colors",
                floor === f.id
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:bg-surface-muted"
              )}
            >
              {f.short}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Store Detail Modal / Drawer */}
      <ShopDetailModal
        shop={selectedShop}
        onClose={() => setSelectedShop(null)}
        onSelectShop={setSelectedShop}
        isBookmarked={isBookmarked}
        onToggleBookmark={toggleBookmark}
      />
    </section>
  )
}
