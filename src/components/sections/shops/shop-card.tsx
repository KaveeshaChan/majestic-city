"use client"

import { Fragment } from "react"
import { motion } from "motion/react"
import { Globe, Mail, Phone } from "lucide-react"

import {
  shopCategoryMap,
  shopFloorMap,
  shopInitials,
  type Shop,
} from "@/config/shops"
import { EASE_OUT } from "@/lib/motion"

/**
 * One store in the directory.
 *
 * The legacy page printed the same maroon logo on sixty tiles, so nothing on the
 * page carried information — the eye had no reason to stop anywhere. Here the
 * artwork is replaced by the store's own initials, set oversized and translucent
 * behind the copy (the same device the floor guide uses for its level numbers),
 * with the category icon as the one solid mark. Every card then looks different
 * *because its content is different*, which is the only kind of variety worth
 * having.
 */

/** Splits a name around the search term so the match can be marked. */
function highlight(name: string, query: string) {
  const term = query.trim()
  if (term.length < 1) return [{ text: name, match: false }]

  const parts: Array<{ text: string; match: boolean }> = []
  const haystack = name.toLowerCase()
  const needle = term.toLowerCase()
  let cursor = 0

  for (;;) {
    const at = haystack.indexOf(needle, cursor)
    if (at === -1) break
    if (at > cursor) parts.push({ text: name.slice(cursor, at), match: false })
    parts.push({ text: name.slice(at, at + needle.length), match: true })
    cursor = at + needle.length
  }

  if (cursor < name.length) parts.push({ text: name.slice(cursor), match: false })
  return parts
}

interface ShopCardProps {
  shop: Shop
  /** The live search term, so the matched run can be marked in the name. */
  query: string
  /** Position in the current result set, used to stagger the entrance. */
  index: number
}

export function ShopCard({ shop, query, index }: ShopCardProps) {
  const category = shopCategoryMap.get(shop.category)
  const floor = shopFloorMap.get(shop.floor)
  const Icon = category?.icon

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      // Exit carries its own transition so removals stay instant while
      // arrivals ripple: capped, or a wide result set would crawl.
      exit={{
        opacity: 0,
        scale: 0.97,
        transition: { duration: 0.18, ease: EASE_OUT },
      }}
      transition={{
        duration: 0.36,
        ease: EASE_OUT,
        delay: Math.min(index * 0.022, 0.28),
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white p-5 ring-1 ring-black/6 transition-[box-shadow,transform,--tw-ring-color] duration-300 hover:-translate-y-1 hover:ring-brand/25 hover:shadow-[0_26px_54px_-32px_rgb(0_0_0/0.4)]"
    >
      {/* The store's own initials, doing the job sixty identical logos used to. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-3 right-2 font-heading text-[4.5rem] leading-none font-bold tracking-tighter text-ink/[0.04] transition-colors duration-500 group-hover:text-brand/[0.08]"
      >
        {shopInitials(shop.name)}
      </span>

      <span className="relative flex size-11 items-center justify-center rounded-xl bg-brand-tint text-brand-strong ring-1 ring-brand/10 transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-foreground group-hover:ring-brand">
        {Icon ? <Icon className="size-5" strokeWidth={1.6} /> : null}
      </span>

      <h3 className="relative mt-4 font-heading text-base leading-snug font-medium tracking-tight text-pretty">
        {highlight(shop.name, query).map((part, index) => (
          <Fragment key={index}>
            {part.match ? (
              <mark className="rounded-[3px] bg-brand/12 px-0.5 text-brand-strong">
                {part.text}
              </mark>
            ) : (
              part.text
            )}
          </Fragment>
        ))}
      </h3>

      {category ? (
        <p className="relative mt-1.5 text-sm text-muted-foreground">
          {category.label}
        </p>
      ) : null}

      {/* Pushed to the bottom so cards of unequal height still line up. */}
      <div className="relative mt-auto flex flex-wrap items-center gap-1.5 pt-5">
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/70">
          {floor?.label ?? shop.floor}
        </span>
        {shop.unit ? (
          <span className="rounded-full bg-surface-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
            {shop.unit}
          </span>
        ) : null}
      </div>

      {shop.phone || shop.email || shop.web ? (
        <div className="relative mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-hairline pt-3 text-sm">
          {shop.phone ? (
            <a
              href={`tel:${shop.phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-brand"
            >
              <Phone className="size-3.5" />
              {shop.phone}
            </a>
          ) : null}
          {shop.email ? (
            <a
              href={`mailto:${shop.email}`}
              aria-label={`Email ${shop.name}`}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-brand"
            >
              <Mail className="size-3.5" />
              Email
            </a>
          ) : null}
          {shop.web ? (
            <a
              href={shop.web}
              target="_blank"
              rel="noreferrer"
              aria-label={`Visit ${shop.name} online`}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-brand"
            >
              <Globe className="size-3.5" />
              Website
            </a>
          ) : null}
        </div>
      ) : null}
    </motion.li>
  )
}
