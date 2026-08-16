import Link from "next/link"

import { allNavItems } from "@/config/navigation"
import { siteConfig } from "@/config/site"

/**
 * Server Component — no interactivity, so none of this ships to the client.
 * It also guarantees every route is reachable without JavaScript.
 */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/8 bg-ink text-ink-foreground">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-6 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr] md:gap-16 lg:max-w-none">
        <div className="flex flex-col gap-4">
          <p className="font-heading text-2xl font-semibold tracking-tight">
            {siteConfig.name}
          </p>
          <p className="max-w-sm text-sm leading-relaxed text-white/55">
            {siteConfig.description}
          </p>
          <address className="mt-2 flex flex-col gap-1 text-sm not-italic text-white/70">
            <span className="text-white/50">{siteConfig.contact.address}</span>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="w-fit transition-colors hover:text-white"
            >
              {siteConfig.contact.email}
            </a>
            <a
              href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              className="w-fit transition-colors hover:text-white"
            >
              {siteConfig.contact.phone}
            </a>
          </address>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-heading text-xs font-semibold tracking-[0.2em] text-white/40 uppercase">
            Explore
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {allNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/65 transition-colors hover:text-white"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/8">
        <p className="mx-auto w-full max-w-[1240px] px-6 py-6 text-xs text-white/35 sm:px-8 lg:max-w-none">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
