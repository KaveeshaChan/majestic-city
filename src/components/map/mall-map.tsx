"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Search, X } from "lucide-react"

import {
  CATEGORY_LABELS,
  FLOORS,
  type MapFloor,
  type MapUnit,
} from "@/config/floors"
import { cn } from "@/lib/utils"
import { FloorPlanMap, type FloorPlanMapHandle } from "./floor-plan-map"
import { StoreDrawer } from "./store-drawer"

const MAX_RESULTS = 8

/** Flattened once at module load: search runs across every floor, not just the
 *  one on screen — nobody looking for the cinema knows which level it is on. */
const SEARCH_INDEX: { unit: MapUnit; floor: MapFloor }[] = FLOORS.flatMap((floor) =>
  floor.units.map((unit) => ({ unit, floor }))
)

export function MallMap() {
  const [floorId, setFloorId] = useState(FLOORS[0].id)
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const mapRef = useRef<FloorPlanMapHandle>(null)
  /**
   * Focusing has to wait a render when the pick is on another floor: the map's
   * imperative handle closes over `floor`, so calling it before the switch has
   * rendered would look the unit up in the level we just left. A ref rather than
   * state — this is a one-shot instruction to an imperative child, not something
   * the UI renders from.
   */
  const pendingFocus = useRef<string | null>(null)

  const floor = FLOORS.find((f) => f.id === floorId) ?? FLOORS[0]
  const activeUnit = floor.units.find((u) => u.id === activeUnitId) ?? null

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return SEARCH_INDEX.filter(
      ({ unit }) =>
        unit.name.toLowerCase().includes(q) ||
        unit.id.toLowerCase().includes(q) ||
        CATEGORY_LABELS[unit.category].toLowerCase().includes(q)
    ).slice(0, MAX_RESULTS)
  }, [query])

  // Runs once the switched-to floor has rendered, which is the whole point.
  useEffect(() => {
    const id = pendingFocus.current
    if (!id) return
    pendingFocus.current = null
    mapRef.current?.focusUnit(id)
  }, [floorId])

  const selectUnit = (unit: MapUnit, unitFloor: MapFloor = floor) => {
    setActiveUnitId(unit.id)
    setQuery("")

    if (unitFloor.id === floorId) {
      mapRef.current?.focusUnit(unit.id)
      return
    }
    pendingFocus.current = unit.id
    setFloorId(unitFloor.id)
  }

  const switchFloor = (nextId: string) => {
    if (nextId === floorId) return
    setFloorId(nextId)
    setActiveUnitId(null)
    mapRef.current?.reset()
  }

  return (
    <div className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-black/6">
      <div className="flex flex-col gap-3 border-b border-hairline p-3 lg:flex-row lg:items-center">
        <div className="relative lg:max-w-sm lg:flex-1">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && setQuery("")}
            placeholder="Search a shop, service or unit number…"
            aria-label="Search the directory"
            className="h-11 w-full rounded-full bg-surface pr-10 pl-10 text-sm ring-1 ring-black/6 transition-colors outline-none placeholder:text-muted-foreground focus:bg-white focus:ring-2 focus:ring-brand/40"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <X className="size-3.5" />
            </button>
          )}

          {query.trim() !== "" && (
            <div className="absolute inset-x-0 top-full z-20 mt-2 max-h-72 overflow-auto rounded-2xl bg-white p-1.5 shadow-[0_24px_60px_-30px_rgb(0_0_0/0.5)] ring-1 ring-black/8">
              {results.length === 0 ? (
                <p className="px-3 py-3 text-sm text-muted-foreground">
                  Nothing matches “{query.trim()}”.
                </p>
              ) : (
                results.map(({ unit, floor: unitFloor }) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => selectUnit(unit, unitFloor)}
                    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand-tint focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-ink">
                        {unit.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {CATEGORY_LABELS[unit.category]}
                      </span>
                    </span>
                    <span className="shrink-0 rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted-foreground">
                      {unitFloor.label}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Scrolls rather than wraps, so the row never pushes the plan down. */}
        <div
          role="group"
          aria-label="Choose a floor"
          className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 lg:mx-0 lg:ml-auto lg:px-0"
        >
          {FLOORS.map((entry) => {
            const isActive = entry.id === floorId
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => switchFloor(entry.id)}
                aria-pressed={isActive}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none",
                  isActive
                    ? "bg-ink text-white"
                    : "bg-surface text-muted-foreground ring-1 ring-black/6 hover:bg-brand-tint hover:text-brand-strong"
                )}
              >
                {entry.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-b border-hairline px-4 py-3">
        <p className="font-heading text-sm font-medium tracking-tight text-ink">
          {floor.label}
          <span className="ml-2 font-sans font-normal text-muted-foreground">
            {floor.summary}
          </span>
        </p>
        <p className="shrink-0 text-xs text-muted-foreground tabular-nums">
          {floor.units.length} units
        </p>
      </div>

      <div className="relative h-[58svh] min-h-[380px] lg:h-[560px]">
        <FloorPlanMap
          ref={mapRef}
          floor={floor}
          activeUnitId={activeUnitId}
          onSelectUnit={setActiveUnitId}
        />
      </div>

      {/* The keyboard and screen-reader route to the same units: the SVG shapes
          themselves are not focusable, and with hundreds of them they should not
          be — that would be hundreds of tab stops. */}
      <div className="border-t border-hairline p-4">
        <h3 className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          On this floor
        </h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {floor.units.map((unit) => {
            const isActive = unit.id === activeUnitId
            return (
              <li key={unit.id}>
                <button
                  type="button"
                  onClick={() => selectUnit(unit)}
                  aria-pressed={isActive}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none",
                    isActive
                      ? "bg-brand text-brand-foreground"
                      : "bg-surface text-muted-foreground ring-1 ring-black/6 hover:bg-brand-tint hover:text-brand-strong"
                  )}
                >
                  {unit.name}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <StoreDrawer
        unit={activeUnit}
        floorLabel={floor.label}
        onClose={() => setActiveUnitId(null)}
        // Always the floor on screen — `activeUnit` is looked up in it.
        onDirections={(unit) => mapRef.current?.focusUnit(unit.id)}
      />
    </div>
  )
}
