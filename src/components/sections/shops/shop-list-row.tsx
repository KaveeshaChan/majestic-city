"use client"

import { Fragment } from "react"
import Link from "next/link"
import { Compass, Heart, Phone, Sparkles, Store } from "lucide-react"
import { motion } from "motion/react"

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

interface ShopListRowProps {
  shop: Shop
  query: string
  index: number
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
  onSelect: (shop: Shop) => void
}

export function ShopListRow({
  shop,
  query,
  index,
  isBookmarked,
  onToggleBookmark,
  onSelect,
}: ShopListRowProps) {
  const category = shopCategoryMap.get(shop.category)
  const floor = shopFloorMap.get(shop.floor)
  const Icon = category?.icon ?? Store

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.15 } }}
      transition={{
        duration: 0.28,
        ease: EASE_OUT,
        delay: Math.min(index * 0.015, 0.2),
      }}
      className="group relative flex flex-col gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-black/6 transition-all duration-200 hover:ring-brand/30 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-4"
    >
      <div
        onClick={() => onSelect(shop)}
        className="flex flex-1 cursor-pointer items-center gap-3.5"
      >
        {/* Monogram Badge */}
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-tint font-heading text-sm font-bold text-brand-strong ring-1 ring-brand/10 transition-colors group-hover:bg-brand group-hover:text-white">
          {shopInitials(shop.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-medium tracking-tight text-foreground transition-colors group-hover:text-brand truncate">
              {highlight(shop.name, query).map((part, idx) => (
                <Fragment key={idx}>
                  {part.match ? (
                    <mark className="rounded-[3px] bg-brand/15 px-0.5 font-semibold text-brand-strong">
                      {part.text}
                    </mark>
                  ) : (
                    part.text
                  )}
                </Fragment>
              ))}
            </h3>
            {shop.category === "entertainment" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                <Sparkles className="size-2.5" /> Featured
              </span>
            ) : null}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Icon className="size-3.5 text-brand" />
              {category?.label ?? "Retail"}
            </span>
            <span aria-hidden className="size-1 rounded-full bg-black/20" />
            <span>{floor?.label ?? shop.floor}</span>
            {shop.unit ? (
              <>
                <span aria-hidden className="size-1 rounded-full bg-black/20" />
                <span className="font-mono">{shop.unit}</span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 border-t border-hairline pt-2.5 sm:border-t-0 sm:pt-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelect(shop)}
            className="inline-flex h-8 items-center rounded-full bg-surface-muted px-3 text-xs font-medium text-foreground transition-colors hover:bg-brand hover:text-white"
          >
            Details
          </button>

          <Link
            href="/map"
            title="Locate on floor map"
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-brand"
          >
            <Compass className="size-4" />
          </Link>

          {shop.phone ? (
            <a
              href={`tel:${shop.phone.replace(/\s+/g, "")}`}
              title={`Call ${shop.name}`}
              className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-brand"
            >
              <Phone className="size-4" />
            </a>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(shop.id)}
          aria-label={isBookmarked ? "Remove from bookmarks" : "Bookmark store"}
          className={cn(
            "grid size-8 place-items-center rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
            isBookmarked
              ? "bg-rose-50 text-rose-600"
              : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
          )}
        >
          <Heart
            className={cn(
              "size-4 transition-transform",
              isBookmarked && "fill-rose-600 scale-110"
            )}
          />
        </button>
      </div>
    </motion.li>
  )
}
