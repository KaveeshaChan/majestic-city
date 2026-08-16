import Link from "next/link"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { Eyebrow, SectionTitle } from "@/components/sections/section-heading"
import { visitInfo } from "@/config/home"
import { siteConfig } from "@/config/site"

/**
 * Plan your visit — hours, directions and how to reach a human.
 *
 * The hero's "Plan your visit" button lands here, so the anchor id is part of
 * the contract.
 */
export function VisitInfo() {
  return (
    <section id="visit" className="border-t border-hairline bg-white py-20 sm:py-28">
      <div className="mx-auto w-full max-w-[1240px] px-6 sm:px-8 lg:max-w-none">
        <Reveal className="max-w-xl">
          <Eyebrow>Plan your visit</Eyebrow>
          <SectionTitle className="mt-5">
            Open every day, right on Galle Road
          </SectionTitle>
        </Reveal>

        <Stagger
          className="mt-10 grid gap-3 lg:grid-cols-3"
          wrapChildren={false}
          stagger={0.09}
        >
          <StaggerItem>
            <InfoCard title="Opening hours">
              <dl className="flex flex-col">
                {visitInfo.hours.map((entry) => (
                  <div
                    key={entry.days}
                    className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 last:border-b-0"
                  >
                    <dt className="text-sm text-muted-foreground">
                      {entry.days}
                    </dt>
                    <dd className="font-heading text-sm font-medium tracking-tight text-ink tabular-nums">
                      {entry.time}
                    </dd>
                  </div>
                ))}
              </dl>

              <ul className="mt-5 flex flex-col gap-2.5">
                {visitInfo.access.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
                      <item.icon className="size-3.5" />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </InfoCard>
          </StaggerItem>

          <StaggerItem>
            <InfoCard title="Getting here">
              <ul className="flex flex-col gap-3">
                {visitInfo.gettingHere.map((line) => (
                  <li
                    key={line}
                    className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground text-pretty"
                  >
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-brand/50"
                    />
                    {line}
                  </li>
                ))}
              </ul>

              <Link
                href="/map"
                className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-strong"
              >
                <MapPin className="size-4" />
                See the floor map
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </InfoCard>
          </StaggerItem>

          <StaggerItem>
            <InfoCard title="Talk to us">
              <address className="flex flex-col gap-4 text-sm not-italic">
                <span className="leading-relaxed text-muted-foreground text-pretty">
                  {siteConfig.contact.address}
                </span>

                <a
                  href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="group flex items-center gap-2.5 font-medium text-ink transition-colors hover:text-brand"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <Phone className="size-3.5" />
                  </span>
                  {siteConfig.contact.phone}
                </a>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex items-center gap-2.5 font-medium text-ink transition-colors hover:text-brand"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                    <Mail className="size-3.5" />
                  </span>
                  {siteConfig.contact.email}
                </a>
              </address>

              <Link
                href="/contact"
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
              >
                Contact the team
              </Link>
            </InfoCard>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

function InfoCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col rounded-[1.25rem] bg-surface p-6 ring-1 ring-black/5">
      <h3 className="font-heading text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="mt-5 flex flex-1 flex-col">{children}</div>
    </div>
  )
}
