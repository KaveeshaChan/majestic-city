"use client"

import { Fragment } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { Compass, Globe, Heart, Mail, Phone, Sparkles, Store } from "lucide-react"

import {
  shopCategoryMap,
  shopFloorMap,
  shopInitials,
  type Shop,
} from "@/config/shops"
import { EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

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
  query: string
  index: number
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
  onSelect: (shop: Shop) => void
}

export function ShopCard({
  shop,
  query,
  index,
  isBookmarked,
  onToggleBookmark,
  onSelect,
}: ShopCardProps) {
  const category = shopCategoryMap.get(shop.category)
  const floor = shopFloorMap.get(shop.floor)
  const Icon = category?.icon ?? Store

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0.97,
        transition: { duration: 0.18, ease: EASE_OUT },
      }}
      transition={{
        duration: 0.36,
        ease: EASE_OUT,
        delay: Math.min(index * 0.02, 0.28),
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] bg-white p-5 ring-1 ring-black/6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:ring-brand/35 hover:shadow-[0_20px_45px_-20px_rgba(123,20,22,0.18)]"
    >
      {/* Background Watermark Initials */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-4 -right-1 font-heading text-[5.2rem] leading-none font-extrabold tracking-tighter text-ink/[0.035] select-none transition-colors duration-500 group-hover:text-brand/[0.08]"
      >
        {shopInitials(shop.name)}
      </span>

      {/* Top Bar: Category Icon & Bookmark Heart */}
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-tint text-brand-strong ring-1 ring-brand/10 transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:shadow-md group-hover:shadow-brand/25">
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
          {category?.id === "entertainment" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200/50">
              <Sparkles className="size-3" /> Cineplex
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onToggleBookmark(shop.id)
          }}
          aria-label={isBookmarked ? "Remove from bookmarks" : "Save store to bookmarks"}
          className={cn(
            "grid size-9 place-items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
            isBookmarked
              ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200 shadow-xs"
              : "bg-surface-muted/80 text-muted-foreground hover:bg-black/5 hover:text-foreground"
          )}
        >
          <Heart
            className={cn(
              "size-4 transition-transform duration-200",
              isBookmarked && "fill-rose-600 scale-110"
            )}
          />
        </button>
      </div>

      {/* Clickable Area for Quick View */}
      <div
        onClick={() => onSelect(shop)}
        className="relative mt-4 flex-1 cursor-pointer"
      >
        <h3 className="font-heading text-lg leading-snug font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand text-pretty">
          {highlight(shop.name, query).map((part, idx) => (
            <Fragment key={idx}>
              {part.match ? (
                <mark className="rounded-[3px] bg-brand/15 px-0.5 font-bold text-brand-strong">
                  {part.text}
                </mark>
              ) : (
                part.text
              )}
            </Fragment>
          ))}
        </h3>

        {category ? (
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {category.label}
          </p>
        ) : null}
      </div>

      {/* Floor & Unit Tag Row */}
      <div className="relative mt-auto flex flex-wrap items-center gap-1.5 pt-5">
        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground/80 ring-1 ring-black/5">
          {floor?.label ?? shop.floor}
        </span>
        {shop.unit ? (
          <span className="rounded-full bg-surface-muted px-2.5 py-1 font-mono text-xs text-muted-foreground ring-1 ring-black/5">
            Unit {shop.unit}
          </span>
        ) : null}
      </div>

      {/* Card Action Strip */}
      <div className="relative mt-3 flex items-center justify-between border-t border-hairline pt-3">
        <button
          type="button"
          onClick={() => onSelect(shop)}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-colors hover:text-brand-strong focus-visible:outline-none"
        >
          View details →
        </button>

        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/map"
            onClick={(e) => e.stopPropagation()}
            title="Locate on floor map"
            className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brand-tint hover:text-brand"
          >
            <Compass className="size-3.5" />
          </Link>

          {shop.phone ? (
            <a
              href={`tel:${shop.phone.replace(/\s+/g, "")}`}
              onClick={(e) => e.stopPropagation()}
              title={`Call ${shop.name}`}
              className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brand-tint hover:text-brand"
            >
              <Phone className="size-3.5" />
            </a>
          ) : null}

          {shop.web ? (
            <a
              href={shop.web}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Visit website`}
              className="grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-brand-tint hover:text-brand"
            >
              <Globe className="size-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </motion.li>
  )
}
