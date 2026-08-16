import Image from "next/image"

/**
 * The landing hero: one photograph of the building, framed in a large rounded
 * card. Everything else — the description, the numbers, the buttons — lives in
 * the band directly below (`<HomeIntro>`), so this stays image-only.
 *
 * The entrance is CSS (`.hero-frame` / `.hero-image` in globals.css) rather
 * than Motion: this is above the fold, so it must never depend on a
 * `whileInView` check or on hydration having finished.
 */
export function HomeHero() {
  return (
    <section className="bg-white pt-[calc(var(--header-height)+2rem)] pb-10 sm:pb-14">
      <div className="mx-auto w-full max-w-wide px-4 sm:px-6 lg:px-8">
        <div className="hero-frame relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-45px_rgb(0_0_0/0.45)] sm:aspect-[16/9] sm:rounded-[2.5rem]">
          <Image
            src="/front.jpeg"
            alt="The Majestic City building on Galle Road, Bambalapitiya"
            fill
            priority
            sizes="(min-width: 1376px) 1376px, 100vw"
            className="hero-image object-cover object-[50%_62%] sm:object-center"
          />
        </div>
      </div>
    </section>
  )
}
