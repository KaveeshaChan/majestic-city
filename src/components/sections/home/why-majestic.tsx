import { CountUp } from "@/components/motion/count-up"
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { Eyebrow, SectionTitle } from "@/components/sections/section-heading"
import { counters, trustPoints } from "@/config/home"

/**
 * The reassurance section: why this mall, in four plain claims and three
 * numbers. It is the part of the page that has to do the trust-building, so the
 * copy stays specific and the decoration stays out of the way.
 */
export function WhyMajestic() {
  return (
    <section className="border-y border-hairline bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:max-w-none">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-[calc(var(--header-height)+2.5rem)] lg:self-start">
            <Reveal>
              <Eyebrow>Why Majestic City</Eyebrow>
              <SectionTitle className="mt-5">
                Thirty-odd years of being the easy choice
              </SectionTitle>
              <p className="mt-5 max-w-md leading-relaxed text-muted-foreground text-pretty">
                Opened in 1991 and still the mall Colombo defaults to — because
                it is central, it is covered, and everything you need is a
                staircase apart.
              </p>
            </Reveal>

            <Stagger
              className="mt-9 grid grid-cols-3 gap-4 border-t border-hairline pt-7"
              wrapChildren={false}
              stagger={0.1}
            >
              {counters.map((counter) => (
                <StaggerItem key={counter.label} className="flex flex-col">
                  <p className="font-heading text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
                    <CountUp to={counter.value} suffix={counter.suffix} />
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-ink">
                    {counter.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{counter.hint}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Stagger
            className="grid gap-3 sm:grid-cols-2"
            wrapChildren={false}
            stagger={0.08}
          >
            {trustPoints.map((point) => (
              <StaggerItem key={point.title}>
                <article className="group h-full rounded-[1.25rem] bg-surface p-6 ring-1 ring-black/5 transition-colors duration-300 hover:bg-brand-tint hover:ring-brand/20">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-white text-brand ring-1 ring-black/5 transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <point.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-medium tracking-tight">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground text-pretty">
                    {point.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
