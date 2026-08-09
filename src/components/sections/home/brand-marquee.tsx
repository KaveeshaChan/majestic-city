import { marqueeItems } from "@/config/home"

/**
 * The category band under the hero.
 *
 * A pure-CSS marquee, so this stays a Server Component and ships no JavaScript:
 * the track holds the list twice and slides by exactly half its width, which
 * makes the loop seamless. `motion-reduce` parks it.
 */
export function BrandMarquee() {
  return (
    <section
      aria-label="What you'll find at Majestic City"
      className="relative border-y border-hairline bg-white py-4"
    >
      {/* Fade the ends so items enter and leave rather than being clipped. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-28"
      />

      <div className="flex overflow-hidden">
        <ul className="flex shrink-0 animate-[marquee-x_46s_linear_infinite] items-center gap-8 pr-8 motion-reduce:animate-none sm:gap-12 sm:pr-12">
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <li
              key={`${item}-${index}`}
              // The duplicate half is decoration, not content, for a screen
              // reader that would otherwise read the whole list twice.
              aria-hidden={index >= marqueeItems.length}
              className="flex shrink-0 items-center gap-8 text-sm font-medium whitespace-nowrap text-muted-foreground sm:gap-12"
            >
              {item}
              <span aria-hidden className="size-1 rounded-full bg-brand/40" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
