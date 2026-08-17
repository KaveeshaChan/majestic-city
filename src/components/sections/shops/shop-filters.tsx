"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Check,
  ChevronDown,
  Compass,
  Grid,
  Heart,
  Layers,
  List,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react"

import { shopCategoriesInUse, shopFloorsInUse } from "@/config/shops"
import { EASE_OUT, springSoft } from "@/lib/motion"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list" | "grouped"
export type SortOption = "name-asc" | "name-desc" | "floor-asc" | "category"

const EDGE_FADE = 32

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
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  sortBy: SortOption
  onSortByChange: (sort: SortOption) => void
  bookmarkedOnly: boolean
  onBookmarkedOnlyChange: (active: boolean) => void
  savedCount: number
  resultCount: number
  totalCount: number
  onReset: () => void
}

const POPULAR_QUERIES = [
  "Mobile",
  "Sarees",
  "Cinema",
  "Fashion",
  "Carlo",
  "Hameedia's",
  "Dressport",
]

export function ShopFilters({
  query,
  onQueryChange,
  floor,
  onFloorChange,
  category,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  bookmarkedOnly,
  onBookmarkedOnlyChange,
  savedCount,
  resultCount,
  totalCount,
  onReset,
}: ShopFiltersProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const floorRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)

  const categoryMask = useEdgeFade(categoryRef)
  const floorMask = useEdgeFade(floorRef)

  const hasFilters =
    query.trim() !== "" ||
    floor !== null ||
    category !== null ||
    bookmarkedOnly

  // Keyboard shortcut listener: Press "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        if (sortOpen) setSortOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [sortOpen])

  // Click outside to close sort dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    if (sortOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [sortOpen])

  return (
    <div className="sticky top-[calc(var(--header-height)+0.25rem)] z-30 -mx-2 px-2 py-2">
      <div className="rounded-[1.75rem] border border-black/8 bg-white/95 p-3.5 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.18)] backdrop-blur-2xl transition-all sm:p-5">
        {/* Row 1: Search bar, Saved pill, View switcher & Sort */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <label htmlFor="shop-search" className="sr-only">
              Search stores, categories or floors
            </label>
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={inputRef}
              id="shop-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search store name, category, or floor…"
              autoComplete="off"
              className="h-11.5 w-full rounded-full bg-surface-muted pr-20 pl-11 text-[0.9375rem] text-foreground ring-1 ring-black/5 transition-all duration-200 outline-none placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-brand/40 focus:shadow-sm [&::-webkit-search-cancel-button]:appearance-none"
            />

            {/* Keyboard shortcut hint / clear button */}
            <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1.5">
              {query ? (
                <motion.button
                  type="button"
                  onClick={() => onQueryChange("")}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.15, ease: EASE_OUT }}
                  aria-label="Clear search"
                  className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none"
                >
                  <X className="size-4" />
                </motion.button>
              ) : (
                <kbd className="hidden sm:inline-flex h-5 select-none items-center rounded border border-black/10 bg-white px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-2xs">
                  /
                </kbd>
              )}
            </div>
          </div>

          {/* Controls: Floor switcher + View Toggles + Sort */}
          <div className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap">
            {/* Floor Segmented Control (Desktop / Tablet / Mobile) */}
            <div
              ref={floorRef}
              style={floorMask}
              role="group"
              aria-label="Filter by floor"
              className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full bg-surface-muted p-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                  onClick={() =>
                    onFloorChange(floor === item.id ? null : item.id)
                  }
                  title={`${item.label} (${item.count} shops)`}
                >
                  {item.short}
                </FloorButton>
              ))}
            </div>

            {/* Saved Bookmarks Toggle */}
            <button
              type="button"
              onClick={() => onBookmarkedOnlyChange(!bookmarkedOnly)}
              aria-pressed={bookmarkedOnly}
              className={cn(
                "relative inline-flex h-10 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
                bookmarkedOnly
                  ? "bg-rose-500 text-white shadow-sm shadow-rose-500/25"
                  : "bg-surface-muted text-muted-foreground hover:bg-black/5 hover:text-foreground"
              )}
            >
              <Heart
                className={cn(
                  "size-3.5",
                  bookmarkedOnly ? "fill-white" : savedCount > 0 && "text-rose-500"
                )}
              />
              <span className="hidden sm:inline">Saved</span>
              <span
                className={cn(
                  "ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] tabular-nums",
                  bookmarkedOnly
                    ? "bg-white/20 text-white"
                    : "bg-black/8 text-muted-foreground"
                )}
              >
                {savedCount}
              </span>
            </button>

            {/* View Mode Switcher */}
            <div
              role="group"
              aria-label="View mode"
              className="flex items-center rounded-full bg-surface-muted p-1 ring-1 ring-black/5"
            >
              <button
                type="button"
                onClick={() => onViewModeChange("grid")}
                title="Grid view"
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "relative grid size-8 place-items-center rounded-full transition-colors",
                  viewMode === "grid"
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {viewMode === "grid" ? (
                  <motion.span
                    layoutId="shop-view-pill"
                    transition={springSoft}
                    className="absolute inset-0 rounded-full bg-white shadow-xs"
                  />
                ) : null}
                <Grid className="relative size-4" />
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("list")}
                title="Compact list view"
                aria-pressed={viewMode === "list"}
                className={cn(
                  "relative grid size-8 place-items-center rounded-full transition-colors",
                  viewMode === "list"
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {viewMode === "list" ? (
                  <motion.span
                    layoutId="shop-view-pill"
                    transition={springSoft}
                    className="absolute inset-0 rounded-full bg-white shadow-xs"
                  />
                ) : null}
                <List className="relative size-4" />
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange("grouped")}
                title="Group by floor"
                aria-pressed={viewMode === "grouped"}
                className={cn(
                  "relative grid size-8 place-items-center rounded-full transition-colors",
                  viewMode === "grouped"
                    ? "text-brand"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {viewMode === "grouped" ? (
                  <motion.span
                    layoutId="shop-view-pill"
                    transition={springSoft}
                    className="absolute inset-0 rounded-full bg-white shadow-xs"
                  />
                ) : null}
                <Layers className="relative size-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div ref={sortRef} className="relative">
              <button
                type="button"
                onClick={() => setSortOpen(!sortOpen)}
                aria-expanded={sortOpen}
                aria-label="Sort options"
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-surface-muted px-3 text-xs font-medium text-foreground ring-1 ring-black/5 transition-colors hover:bg-black/5 focus-visible:outline-none"
              >
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <span className="hidden md:inline">Sort: </span>
                <span className="font-semibold text-brand">
                  {sortBy === "name-asc"
                    ? "A–Z"
                    : sortBy === "name-desc"
                    ? "Z–A"
                    : sortBy === "floor-asc"
                    ? "Floor"
                    : "Category"}
                </span>
                <ChevronDown className="size-3 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-40 mt-1.5 min-w-[11rem] overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/10 backdrop-blur-md"
                  >
                    <SortOptionItem
                      active={sortBy === "name-asc"}
                      onClick={() => {
                        onSortByChange("name-asc")
                        setSortOpen(false)
                      }}
                      icon={ArrowDownAZ}
                      label="Store Name (A–Z)"
                    />
                    <SortOptionItem
                      active={sortBy === "name-desc"}
                      onClick={() => {
                        onSortByChange("name-desc")
                        setSortOpen(false)
                      }}
                      icon={ArrowUpAZ}
                      label="Store Name (Z–A)"
                    />
                    <SortOptionItem
                      active={sortBy === "floor-asc"}
                      onClick={() => {
                        onSortByChange("floor-asc")
                        setSortOpen(false)
                      }}
                      icon={Compass}
                      label="Floor (Ground → 5)"
                    />
                    <SortOptionItem
                      active={sortBy === "category"}
                      onClick={() => {
                        onSortByChange("category")
                        setSortOpen(false)
                      }}
                      icon={Layers}
                      label="Category"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Row 2: Category horizontal scroll strip */}
        <div
          ref={categoryRef}
          style={categoryMask}
          className="mt-3.5 -mb-1 flex gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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

        {/* Row 3: Active Filter Chips & Feedback Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-hairline pt-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <p aria-live="polite" className="text-muted-foreground tabular-nums">
              Showing <span className="font-semibold text-foreground">{resultCount}</span>{" "}
              {resultCount === 1 ? "store" : "stores"}
              {hasFilters ? ` of ${totalCount}` : ""}
            </p>

            {/* Active filter badges */}
            {floor ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-0.5 font-medium text-brand">
                Floor: {shopFloorsInUse.find((f) => f.id === floor)?.label ?? floor}
                <button
                  type="button"
                  onClick={() => onFloorChange(null)}
                  aria-label="Remove floor filter"
                  className="hover:text-ink"
                >
                  <X className="size-3" />
                </button>
              </span>
            ) : null}

            {category ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-0.5 font-medium text-brand">
                Category: {shopCategoriesInUse.find((c) => c.id === category)?.label}
                <button
                  type="button"
                  onClick={() => onCategoryChange(null)}
                  aria-label="Remove category filter"
                  className="hover:text-ink"
                >
                  <X className="size-3" />
                </button>
              </span>
            ) : null}

            {bookmarkedOnly ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 font-medium text-rose-600 ring-1 ring-rose-200">
                <Heart className="size-3 fill-rose-600" />
                Saved Only
                <button
                  type="button"
                  onClick={() => onBookmarkedOnlyChange(false)}
                  aria-label="Remove saved filter"
                  className="hover:text-rose-900"
                >
                  <X className="size-3" />
                </button>
              </span>
            ) : null}
          </div>

          {/* Quick Clear Button */}
          <AnimatePresence>
            {hasFilters ? (
              <motion.button
                type="button"
                onClick={onReset}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold text-brand transition-colors hover:bg-brand-tint hover:text-brand-strong focus-visible:outline-none"
              >
                <X className="size-3.5" />
                Clear all filters
              </motion.button>
            ) : (
              /* Quick Popular Searches */
              <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-muted-foreground/70">
                  <Sparkles className="size-3 text-amber-500" />
                  Popular:
                </span>
                {POPULAR_QUERIES.slice(0, 4).map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => onQueryChange(term)}
                    className="rounded-md px-1.5 py-0.5 text-xs transition-colors hover:bg-black/5 hover:text-foreground"
                  >
                    {term}
                  </button>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

interface ToggleProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
}

function FloorButton({ active, onClick, children, title }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "relative grid h-8.5 min-w-8.5 place-items-center rounded-full px-2.5 text-xs font-semibold transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none",
        active ? "text-brand-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {active ? (
        <motion.span
          layoutId="shop-floor-pill"
          transition={springSoft}
          className="absolute inset-0 rounded-full bg-brand shadow-[0_4px_12px_-4px_var(--brand)]"
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
        "relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none",
        active
          ? "text-white"
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
        "text-[11px] tabular-nums transition-colors duration-200",
        active ? "text-white/70" : "text-muted-foreground/60"
      )}
    >
      {children}
    </span>
  )
}

function SortOptionItem({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors hover:bg-surface-muted",
        active ? "bg-brand-tint text-brand font-semibold" : "text-foreground"
      )}
    >
      <span className="flex items-center gap-2">
        <Icon className="size-3.5" />
        {label}
      </span>
      {active && <Check className="size-3 text-brand" />}
    </button>
  )
}
