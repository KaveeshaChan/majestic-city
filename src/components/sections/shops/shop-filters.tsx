"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Search, X } from "lucide-react"

import { shopCategoriesInUse, shopFloorsInUse } from "@/config/shops"
import { EASE_OUT, springSoft } from "@/lib/motion"
import { cn } from "@/lib/utils"

/**
 * The directory's control bar.
 *
 * The legacy page split browsing into two mutually exclusive tabs — "Categories"
 * and "Search" — so choosing a category meant giving up the search box. Here
 * search, floor and category are three filters that compose, all visible at
 * once, all narrowing the same grid live.
 *
 * The bar is sticky below the floating navbar, because a filter you have to
 * scroll back up to reach is a filter nobody uses twice.
 */

/** Width of the fade at a scroller's edge, in px. */
const EDGE_FADE = 32

/**
 * Tracks whether a horizontal scroller has content hidden past either edge and
 * returns a mask that fades exactly those edges. A hard cut through the middle
 * of a chip reads as a layout bug; a fade reads as "there is more".
 *
 * Takes the ref rather than creating it, so the caller attaches a plain ref to
 * its element instead of reaching through a returned object during render.
 */
function useEdgeFade<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [edges, setEdges] = useState({ start: false, end: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const read = () => {
      const max = el.scrollWidth - el.clientWidth
      setEdges((prev) => {
        const next = { start: el.scrollLeft > 4, end: el.scrollLeft < max - 4 }
        return prev.start === next.start && prev.end === next.end ? prev : next
      })
    }

    read()
    el.addEventListener("scroll", read, { passive: true })
    const observer = new ResizeObserver(read)
    observer.observe(el)

    return () => {
      el.removeEventListener("scroll", read)
      observer.disconnect()
    }
  }, [ref])

  const from = edges.start ? `transparent 0, black ${EDGE_FADE}px` : "black 0"
  const to = edges.end
    ? `black calc(100% - ${EDGE_FADE}px), transparent 100%`
    : "black 100%"
  const mask = `linear-gradient(to right, ${from}, ${to})`

  return { maskImage: mask, WebkitMaskImage: mask }
}

interface ShopFiltersProps {
  query: string
  onQueryChange: (value: string) => void
  floor: string | null
  onFloorChange: (value: string | null) => void
  category: string | null
  onCategoryChange: (value: string | null) => void
  resultCount: number
  totalCount: number
  onReset: () => void
}

export function ShopFilters({
  query,
  onQueryChange,
  floor,
  onFloorChange,
  category,
  onCategoryChange,
  resultCount,
  totalCount,
  onReset,
}: ShopFiltersProps) {
  const hasFilters = query.trim() !== "" || floor !== null || category !== null
  const categoryRef = useRef<HTMLDivElement>(null)
  const categoryMask = useEdgeFade(categoryRef)

  return (
    <div className="sticky top-[calc(var(--header-height)+0.5rem)] z-30 -mx-2 px-2 py-2">
      {/* Opaque enough that the grid scrolling beneath never reads through the
          copy — a blur alone leaves store names ghosting behind the chips. */}
      <div className="rounded-[1.5rem] bg-white/94 p-3 ring-1 ring-black/8 shadow-[0_20px_50px_-34px_rgb(0_0_0/0.5)] backdrop-blur-2xl sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <label htmlFor="shop-search" className="sr-only">
              Search shops
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search a shop or category…"
              autoComplete="off"
              className="h-11 w-full rounded-full bg-surface-muted pr-11 pl-11 text-[0.9375rem] text-foreground ring-1 ring-transparent transition-[background-color,box-shadow] duration-200 outline-none placeholder:text-muted-foreground focus:bg-white focus:ring-brand/35 [&::-webkit-search-cancel-button]:appearance-none"
            />
            <AnimatePresence>
              {query ? (
                <motion.button
                  type="button"
                  onClick={() => onQueryChange("")}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: EASE_OUT }}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 grid size-7 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
                >
                  <X className="size-4" />
                </motion.button>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Floor — a segmented control, because floors are few and ordered. */}
          <div
            role="group"
            aria-label="Filter by floor"
            className="flex items-center gap-1 self-start rounded-full bg-surface-muted p-1 lg:self-auto"
          >
            <FloorButton
              active={floor === null}
              onClick={() => onFloorChange(null)}
            >
              All
            </FloorButton>
            {shopFloorsInUse.map((item) => (
              <FloorButton
                key={item.id}
                active={floor === item.id}
                onClick={() => onFloorChange(floor === item.id ? null : item.id)}
                title={`${item.label} — ${item.count} shops`}
              >
                {item.short}
              </FloorButton>
            ))}
          </div>
        </div>

        {/* Categories — scrollable rather than a 30-tile wall of icons. */}
        <div
          ref={categoryRef}
          style={categoryMask}
          className="mt-3 -mb-1 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <CategoryChip
            active={category === null}
            onClick={() => onCategoryChange(null)}
          >
            All categories
            <ChipCount active={category === null}>{totalCount}</ChipCount>
          </CategoryChip>

          {shopCategoriesInUse.map((item) => {
            const active = category === item.id
            return (
              <CategoryChip
                key={item.id}
                active={active}
                onClick={() => onCategoryChange(active ? null : item.id)}
              >
                <item.icon className="size-3.5 shrink-0" strokeWidth={1.8} />
                {item.label}
                <ChipCount active={active}>{item.count}</ChipCount>
              </CategoryChip>
            )
          })}
        </div>

        {/* Live result count — the feedback the old page never gave. */}
        <div className="mt-3 flex items-center justify-between gap-4 border-t border-hairline pt-3">
          <p
            aria-live="polite"
            className="text-sm text-muted-foreground tabular-nums"
          >
            <span className="font-medium text-foreground">{resultCount}</span>
            {resultCount === 1 ? " shop" : " shops"}
            {hasFilters ? ` of ${totalCount}` : ""}
          </p>

          <AnimatePresence>
            {hasFilters ? (
              <motion.button
                type="button"
                onClick={onReset}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-medium text-brand transition-colors hover:bg-brand-tint hover:text-brand-strong focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
              >
                <X className="size-3.5" />
                Clear filters
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */

interface ToggleProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}

/**
 * The selected state is a shared `layoutId` element rather than a background
 * colour, so moving between floors slides one pill across instead of blinking
 * two.
 */
function FloorButton({ active, onClick, children, title }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "relative grid h-9 min-w-9 place-items-center rounded-full px-3 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none",
        active ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {active ? (
        <motion.span
          layoutId="shop-floor-pill"
          transition={springSoft}
          className="absolute inset-0 rounded-full bg-brand shadow-[0_6px_16px_-8px_var(--brand)]"
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  )
}

function CategoryChip({ active, onClick, children }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none",
        active
          ? "text-brand-foreground"
          : "bg-surface-muted text-muted-foreground hover:bg-black/[0.06] hover:text-foreground"
      )}
    >
      {active ? (
        <motion.span
          layoutId="shop-category-pill"
          transition={springSoft}
          className="absolute inset-0 rounded-full bg-ink"
        />
      ) : null}
      <span className="relative inline-flex items-center gap-1.5">{children}</span>
    </button>
  )
}

function ChipCount({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "text-xs tabular-nums transition-colors duration-200",
        active ? "text-white/55" : "text-muted-foreground/60"
      )}
    >
      {children}
    </span>
  )
}
