"use client"

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type PointerEvent,
} from "react"
import { LocateFixed, Minus, Plus } from "lucide-react"

import type { MapFloor } from "@/config/floors"
import { cn } from "@/lib/utils"

const MIN_SCALE = 0.6
const MAX_SCALE = 4
/** px of movement before a pointer-down counts as a drag rather than a tap. */
const DRAG_THRESHOLD = 4
const FOCUS_SCALE = 2.2

interface Transform {
  x: number
  y: number
  scale: number
}

const INITIAL: Transform = { x: 0, y: 0, scale: 1 }

function clampScale(scale: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
}

function centroid(points: [number, number][]): [number, number] {
  const [sx, sy] = points.reduce(([ax, ay], [bx, by]) => [ax + bx, ay + by], [0, 0])
  return [sx / points.length, sy / points.length]
}

/** In viewBox user units. The `<g>` transform scales it along with everything else. */
const LABEL_SIZE = 15
const LABEL_LINE_HEIGHT = 17
/** Rough advance width of the heading face at 1em — good enough to wrap on. */
const LABEL_CHAR_WIDTH = 0.54

function boundingBox(points: [number, number][]) {
  const xs = points.map(([x]) => x)
  const ys = points.map(([, y]) => y)
  const minX = Math.min(...xs)
  const minY = Math.min(...ys)
  const maxX = Math.max(...xs)
  const maxY = Math.max(...ys)
  return { cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w: maxX - minX, h: maxY - minY }
}

/**
 * SVG has no text wrapping, so a unit name has to be broken into lines by hand.
 * Greedy fill, capped at two lines — a third would not fit inside a typical unit
 * and the drawer carries the full name anyway.
 */
function wrapLabel(name: string, boxWidth: number): string[] {
  const maxChars = Math.floor((boxWidth * 0.86) / (LABEL_SIZE * LABEL_CHAR_WIDTH))
  if (maxChars < 4) return []
  if (name.length <= maxChars) return [name]

  const lines: string[] = []
  let current = ""
  for (const word of name.split(" ")) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }
  if (current) lines.push(current)

  if (lines.length <= 2) return lines
  return [lines[0], `${lines[1].slice(0, Math.max(1, maxChars - 1))}…`]
}

function parseViewBox(viewBox: string) {
  const [minX, minY, w, h] = viewBox.trim().split(/[\s,]+/).map(Number)
  return { minX, minY, w, h }
}

/**
 * Converts a point in screen coordinates into the SVG's own user coordinate
 * system — the space the viewBox and our pan/zoom transform operate in. This is
 * what lets "zoom under the cursor" land exactly right however the SVG happens
 * to be scaled into its container.
 */
function clientToUserSpace(svg: SVGSVGElement, clientX: number, clientY: number) {
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: clientX, y: clientY }
  const point = svg.createSVGPoint()
  point.x = clientX
  point.y = clientY
  const transformed = point.matrixTransform(ctm.inverse())
  return { x: transformed.x, y: transformed.y }
}

export interface FloorPlanMapHandle {
  focusUnit: (id: string) => void
  reset: () => void
}

interface FloorPlanMapProps {
  floor: MapFloor
  activeUnitId: string | null
  onSelectUnit: (id: string | null) => void
}

/**
 * The pan/zoom floor-plan viewer.
 *
 * Every leasable unit is a closed shape carrying `data-unit-id`, and a single
 * delegated `onClick` on the `<svg>` walks up from `event.target` to find it —
 * one listener for the whole floor, so this stays cheap with hundreds of units.
 * Hover is a CSS `:hover` rule for the same reason: no React state, no re-render
 * per mouse move.
 */
export const FloorPlanMap = forwardRef<FloorPlanMapHandle, FloorPlanMapProps>(
  function FloorPlanMap({ floor, activeUnitId, onSelectUnit }, ref) {
    const [transform, setTransform] = useState<Transform>(INITIAL)
    const svgRef = useRef<SVGSVGElement>(null)
    const drag = useRef<{
      startX: number
      startY: number
      ox: number
      oy: number
      moved: boolean
    } | null>(null)

    /** Re-centres so user-space point (ux, uy) stays put while the scale changes. */
    const zoomBy = useCallback((factor: number, ux: number, uy: number) => {
      setTransform((t) => {
        const scale = clampScale(t.scale * factor)
        const cx = (ux - t.x) / t.scale
        const cy = (uy - t.y) / t.scale
        return { scale, x: ux - cx * scale, y: uy - cy * scale }
      })
    }, [])

    const reset = useCallback(() => setTransform(INITIAL), [])

    // A native listener rather than React's `onWheel`, because React registers
    // wheel handlers passively at the root — `preventDefault()` inside one is
    // ignored and warns.
    useEffect(() => {
      const svg = svgRef.current
      if (!svg) return

      const onWheel = (event: WheelEvent) => {
        // A plain wheel has to keep scrolling the page: a map that swallows it
        // halfway down a long page is a scroll trap. Ctrl/⌘ zooms — and a
        // trackpad pinch arrives as a ctrl-wheel, so pinch-to-zoom works too.
        if (!event.ctrlKey && !event.metaKey) return
        event.preventDefault()
        const { x, y } = clientToUserSpace(svg, event.clientX, event.clientY)
        zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12, x, y)
      }

      svg.addEventListener("wheel", onWheel, { passive: false })
      return () => svg.removeEventListener("wheel", onWheel)
    }, [zoomBy])

    const handlePointerDown = (event: PointerEvent<SVGSVGElement>) => {
      ;(event.target as Element).setPointerCapture?.(event.pointerId)
      drag.current = {
        startX: event.clientX,
        startY: event.clientY,
        ox: transform.x,
        oy: transform.y,
        moved: false,
      }
    }

    const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
      if (!drag.current) return
      const dx = event.clientX - drag.current.startX
      const dy = event.clientY - drag.current.startY
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) drag.current.moved = true
      if (!drag.current.moved) return
      setTransform((t) => ({ ...t, x: drag.current!.ox + dx, y: drag.current!.oy + dy }))
    }

    const handlePointerUp = () => {
      // `moved` has to survive the click event that fires straight after this
      // one, so the flag is cleared a tick later rather than here.
      window.setTimeout(() => (drag.current = null), 0)
    }

    const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
      if (drag.current?.moved) return // this pointer-up ended a pan, not a tap
      const target = (event.target as Element).closest("[data-unit-id]")
      onSelectUnit(target ? target.getAttribute("data-unit-id") : null)
    }

    const zoomFromCentre = (factor: number) => {
      const { minX, minY, w, h } = parseViewBox(floor.viewBox)
      zoomBy(factor, minX + w / 2, minY + h / 2)
    }

    useImperativeHandle(ref, () => ({
      reset,
      focusUnit: (id: string) => {
        const unit = floor.units.find((u) => u.id === id)
        if (!unit) return
        const centre = unit.points ? centroid(unit.points) : unit.labelPoint
        if (!centre) return
        const { minX, minY, w, h } = parseViewBox(floor.viewBox)
        setTransform({
          scale: FOCUS_SCALE,
          x: minX + w / 2 - centre[0] * FOCUS_SCALE,
          y: minY + h / 2 - centre[1] * FOCUS_SCALE,
        })
      },
    }))

    const active = floor.units.find((u) => u.id === activeUnitId)
    const activeCentre = active
      ? active.points
        ? centroid(active.points)
        : active.labelPoint
      : undefined

    return (
      <div className="relative size-full overflow-hidden bg-surface-muted">
        <svg
          ref={svgRef}
          viewBox={floor.viewBox}
          // The shapes are decorative to a screen reader — the unit list under
          // the map is the accessible route to the same information.
          role="img"
          aria-label={`${floor.label} floor plan — ${floor.summary}`}
          // `pan-y` rather than `none`: a vertical swipe still scrolls the page,
          // so the map can never trap a reader on a phone.
          className="size-full cursor-grab touch-pan-y active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={handleClick}
        >
          <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.scale})`}>
            {floor.decorations.map((decoration) => (
              <g key={decoration.id}>
                <path
                  d={decoration.path}
                  fill={decoration.fill ?? "none"}
                  stroke={decoration.stroke ?? "none"}
                  strokeWidth={decoration.strokeWidth ?? 1}
                />
                {decoration.label && decoration.labelPoint && (
                  <text
                    x={decoration.labelPoint[0]}
                    y={decoration.labelPoint[1]}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={13}
                    pointerEvents="none"
                    className="fill-muted-foreground"
                  >
                    {decoration.label}
                  </text>
                )}
              </g>
            ))}

            {floor.units.map((unit) => {
              const isActive = unit.id === activeUnitId
              const box = unit.points ? boundingBox(unit.points) : null
              const anchor = unit.labelPoint ?? (box ? [box.cx, box.cy] : null)
              const lines = box ? wrapLabel(unit.name, box.w) : []

              const shapeProps = {
                "data-unit-id": unit.id,
                strokeWidth: isActive ? 2 : 1,
                className: cn(
                  "cursor-pointer transition-colors duration-150",
                  isActive
                    ? "fill-brand stroke-brand-strong"
                    : "fill-white stroke-ink/15 hover:fill-brand-tint hover:stroke-brand/40"
                ),
              }

              return (
                <g key={unit.id}>
                  {unit.path ? (
                    <path d={unit.path} {...shapeProps} />
                  ) : (
                    <polygon
                      points={unit.points!.map(([x, y]) => `${x},${y}`).join(" ")}
                      {...shapeProps}
                    />
                  )}

                  {/* `pointerEvents="none"` so a click on the name still lands
                      on the shape underneath and resolves to its unit id. */}
                  {anchor && lines.length > 0 && (
                    <text
                      x={anchor[0]}
                      y={anchor[1]}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={LABEL_SIZE}
                      pointerEvents="none"
                      className={cn(
                        "font-medium transition-colors duration-150",
                        isActive ? "fill-white" : "fill-ink"
                      )}
                    >
                      {lines.map((line, index) => (
                        <tspan
                          key={line}
                          x={anchor[0]}
                          dy={
                            index === 0
                              ? (-(lines.length - 1) * LABEL_LINE_HEIGHT) / 2
                              : LABEL_LINE_HEIGHT
                          }
                        >
                          {line}
                        </tspan>
                      ))}
                    </text>
                  )}
                </g>
              )
            })}

            {activeCentre && (
              <g
                transform={`translate(${activeCentre[0]} ${activeCentre[1] - 28})`}
                pointerEvents="none"
              >
                <path
                  d="M0 0 C-10 0 -16 -8 -16 -16 C-16 -25 -9 -32 0 -32 C9 -32 16 -25 16 -16 C16 -8 10 0 0 0 Z"
                  className="fill-ink"
                />
                <circle cx="0" cy="-16" r="6" className="fill-white" />
              </g>
            )}
          </g>
        </svg>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <MapButton onClick={reset} label="Reset view">
            <LocateFixed className="size-4" />
          </MapButton>
          <div className="flex flex-col overflow-hidden rounded-full bg-white shadow-[0_8px_24px_-12px_rgb(0_0_0/0.4)] ring-1 ring-black/5">
            <MapButton onClick={() => zoomFromCentre(1.3)} label="Zoom in" bare>
              <Plus className="size-4" />
            </MapButton>
            <div className="h-px w-full bg-hairline" />
            <MapButton onClick={() => zoomFromCentre(1 / 1.3)} label="Zoom out" bare>
              <Minus className="size-4" />
            </MapButton>
          </div>
        </div>

        <p className="pointer-events-none absolute right-4 bottom-4 hidden rounded-full bg-white/85 px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-black/5 backdrop-blur-sm lg:block">
          Drag to pan · Ctrl + scroll to zoom
        </p>
      </div>
    )
  }
)

function MapButton({
  children,
  onClick,
  label,
  bare = false,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
  bare?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-10 items-center justify-center text-ink transition-colors hover:bg-brand-tint hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none",
        !bare &&
          "rounded-full bg-white shadow-[0_8px_24px_-12px_rgb(0_0_0/0.4)] ring-1 ring-black/5"
      )}
    >
      {children}
    </button>
  )
}
