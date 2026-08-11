import Image from "next/image"

/**
 * The landing hero: one photograph of the building, framed in a large rounded
 * card. Everything else — the description, the numbers, the buttons — lives in
 * the band directly below (`<HomeIntro>`), so this stays image-only.
 *
 * Rendered plainly (no scroll-reveal wrapper): it's on screen at first paint,
 * so it must never depend on a `whileInView` check firing after hydration.
 */
export function HomeHero() {
  return (
    <section className="bg-white pt-[calc(var(--header-height)+2rem)] pb-10 sm:pb-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[0_24px_60px_-30px_rgb(0_0_0/0.35)] sm:aspect-[16/9] sm:rounded-[2.5rem]">
          <Image
            src="/front.jpeg"
            alt="The Majestic City building on Galle Road, Bambalapitiya"
            fill
            priority
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover object-[50%_62%] sm:object-center"
          />
        </div>
      </div>
    </section>
  )
}
