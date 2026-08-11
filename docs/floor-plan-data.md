# Floor-plan data — how the map works, and how to feed it the real DWG

The interactive map at `/map` is SVG plus a click handler plus a data lookup.
No mapping library, no new dependencies — everything it uses (`radix-ui`,
`motion`, `lucide-react`) was already in `package.json`.

Worth knowing before anyone proposes buying a platform: large operators
(Dubai Mall, for instance) license commercial indoor-mapping SaaS such as
Mappedin, which brings a facilities CMS, Bluetooth-beacon blue-dot positioning
and turn-by-turn routing. That is the right tool for a portfolio of malls with
live indoor positioning. For a single property's "tap a shop, see its details"
directory it is overkill and a recurring bill — and the tap-to-open interaction
itself is built the same way underneath either way.

## The pieces

```
src/config/floors.ts                    MapFloor / MapUnit types + the data  ← replace this
src/components/map/floor-plan-map.tsx   pan/zoom SVG viewer, delegated clicks
src/components/map/store-drawer.tsx     bottom sheet (radix Dialog + motion)
src/components/map/mall-map.tsx         search, floor switcher, wiring
src/app/map/page.tsx                    the route
```

Every leasable unit is a **closed shape with a stable `id`** (`data-unit-id`).
One `onClick` on the `<svg>` walks up from `event.target` to the nearest element
carrying that attribute, so a single listener serves every unit on the floor and
this scales to hundreds of shapes. Hover is a CSS `:hover` rule for the same
reason — no React state, no re-render per mouse move.

Pan/zoom is plain state (`x`, `y`, `scale`) applied through the SVG `transform`
attribute, with the cursor position converted into SVG user space via
`getScreenCTM()` so "zoom under the cursor" and "zoom to a searched shop" both
land exactly right however the SVG is scaled into its container.

Two deliberate behaviours, both to avoid trapping a reader mid-page:

- A plain mouse wheel **scrolls the page**. Zoom is Ctrl/⌘ + wheel (a trackpad
  pinch arrives as a ctrl-wheel, so pinch-to-zoom works), or the +/− buttons.
- The SVG is `touch-action: pan-y`, so a vertical swipe on a phone still scrolls
  the page. Multi-touch pinch on the plan itself is **not** implemented yet.

## Replacing the placeholder geometry

`src/config/floors.ts` currently generates each floor with `buildFloor()` — an
even grid of rectangles. It exists purely so the map could be built and reviewed
before the drawings were converted. It is not the shape of the building.

**1. Clean the drawing** in AutoCAD / BricsCAD / DraftSight. Freeze or delete
everything that is not lease-line geometry: dimensions, text, hatch fill,
furniture blocks, grid lines, survey annotations. A web map wants a simplified,
re-drawn plan, not the raw architectural file. Make sure each leasable unit is a
single **closed polyline** (rectilinear is fine — most units are), ideally on its
own dedicated `LEASE-LINES` layer.

**2. Save As → DXF (ASCII).** DWG is Autodesk's proprietary binary format; open
tooling reads DXF, not DWG.

**3. Convert.** Either:

- **Inkscape** (free, GUI): *File → Import* the DXF — CAD layers come through as
  SVG `<g>` groups — then *File → Save As → Plain SVG*. Fastest for a one-off.
- **Scripted** (better if the drawing gets revised): `ezdxf` walks every
  entity's layer, handle and vertex list and dumps JSON in the shape
  `floors.ts` already expects, skipping SVG entirely:

  ```python
  import ezdxf

  doc = ezdxf.readfile("level-03.dxf")
  units = []
  for e in doc.modelspace().query("LWPOLYLINE[layer=='LEASE-LINES']"):
      units.append({
          "id": e.dxf.handle,  # rename to the real unit codes afterwards
          "points": [(round(x, 1), round(y, 1)) for x, y, *_ in e.get_points()],
      })
  ```

**4. Simplify.** Cut the vertex count (Inkscape's `Ctrl+L`, or Shapely's
`.simplify()` when scripting) so the shapes stay light in the browser.

**5. Assign ids.** Each unit's `id` must be the code the leasing/ERP system
already uses (e.g. `G-134`) — that string is how a click resolves to a name and
description. Geometry that must not be clickable (walls, corridors, the atrium,
escalators) gets no id and becomes a `MapDecoration` instead.

**6. Paste into `src/config/floors.ts`.** Drop the `d` string into a unit's
`path`, or use `points` if you extracted plain coordinates. One `MapFloor` per
level; delete that floor's `buildFloor()` call as you go. Nothing else in the map
changes — the components only ever read the `MapFloor` type.

Also replace `viewBox` per floor with the one from the converted SVG, and set
`summary` to what is actually on that level.

## Decisions worth making before this scales up

- **Hundreds of units per floor.** The delegated-click and CSS-hover patterns
  already handle it. Watch the initial parse cost of very heavy paths instead.
- **Keyboard and screen-reader access.** The shapes are intentionally not
  focusable — that would be hundreds of tab stops. The unit list under the plan
  and the search field are the accessible route, so keep both in step with the
  data.
- **Live tenant data.** A static `floors.ts` means a redeploy per change. Once
  store managers need to edit hours and descriptions themselves, move the
  non-geometric fields to a CMS or a table keyed by unit id, and keep only the
  geometry in the repo.
- **Turn-by-turn routing / blue-dot positioning.** This approach gets you "tap
  and see", not "walk me there". That needs pathfinding over a graph of the
  walkways plus beacon or Wi-Fi positioning indoors — the part platforms like
  Mappedin actually sell.
