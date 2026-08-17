"use client"

import { useState } from "react"
import Link from "next/link"
import { Dialog } from "radix-ui"
import {
  Check,
  Compass,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Phone,
  Share2,
  Sparkles,
  Store,
  X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import {
  shopCategoryMap,
  shopFloorMap,
  shopInitials,
  shops,
  type Shop,
} from "@/config/shops"
import { floorGuide } from "@/config/home"
import { springSoft } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface ShopDetailModalProps {
  shop: Shop | null
  onClose: () => void
  onSelectShop: (shop: Shop) => void
  isBookmarked: (id: string) => boolean
  onToggleBookmark: (id: string) => void
}

export function ShopDetailModal({
  shop,
  onClose,
  onSelectShop,
  isBookmarked,
  onToggleBookmark,
}: ShopDetailModalProps) {
  const [copied, setCopied] = useState(false)
  const open = shop !== null

  if (!shop) return null

  const category = shopCategoryMap.get(shop.category)
  const floor = shopFloorMap.get(shop.floor)
  const floorInfo = floorGuide.find((f) => f.level === shop.floor)
  const Icon = category?.icon ?? Store
  const bookmarked = isBookmarked(shop.id)

  // Find 3 other shops on the same floor for discovery
  const nearbyShops = shops
    .filter((s) => s.floor === shop.floor && s.id !== shop.id)
    .slice(0, 3)

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : ""
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${shop.name} at Majestic City`,
          text: `Check out ${shop.name} on ${floor?.label ?? "Majestic City"}!`,
          url: shareUrl,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(
        `${shop.name} — ${floor?.label ?? "Majestic City"}, Colombo\n${shareUrl}`
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal forceMount>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl ring-1 ring-black/10 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-[2rem] sm:p-8"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "100%", opacity: 0 }}
                  transition={springSoft}
                >
                  {/* Mobile drag handle */}
                  <div
                    aria-hidden
                    className="mx-auto mb-4 h-1.5 w-12 cursor-grab rounded-full bg-ink/15 sm:hidden active:cursor-grabbing"
                  />

                  {/* Header Banner */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Avatar / Monogram with Category Icon Accent */}
                      <div className="relative flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-strong text-2xl font-bold tracking-tight text-white shadow-lg shadow-brand/20">
                        {shopInitials(shop.name)}
                        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-white text-brand shadow ring-2 ring-white">
                          <Icon className="size-3.5" />
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-semibold text-brand">
                            <Sparkles className="size-3" />
                            {category?.label ?? "Retail"}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Open Today
                          </span>
                        </div>
                        <Dialog.Title className="mt-1.5 font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                          {shop.name}
                        </Dialog.Title>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(shop.id)}
                        aria-label={bookmarked ? "Remove from saved" : "Save store"}
                        className={cn(
                          "grid size-10 place-items-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
                          bookmarked
                            ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                            : "bg-surface-muted text-muted-foreground hover:bg-black/5 hover:text-foreground"
                        )}
                      >
                        <Heart
                          className={cn("size-5 transition-transform", bookmarked && "fill-rose-600 scale-110")}
                        />
                      </button>

                      <Dialog.Close
                        aria-label="Close modal"
                        className="grid size-10 place-items-center rounded-full bg-surface-muted text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                      >
                        <X className="size-5" />
                      </Dialog.Close>
                    </div>
                  </div>

                  {/* Location Context Card */}
                  <div className="mt-6 rounded-2xl bg-surface-muted/70 p-4 ring-1 ring-black/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-8 place-items-center rounded-xl bg-ink text-white">
                          <MapPin className="size-4" />
                        </span>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Mall Location
                          </p>
                          <p className="font-heading font-semibold text-ink">
                            {floor?.label ?? "Ground Floor"}
                            {shop.unit ? ` • Unit ${shop.unit}` : ""}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/map`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-brand-strong"
                      >
                        <Compass className="size-3.5" />
                        Floor Plan
                      </Link>
                    </div>

                    {floorInfo ? (
                      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                        {floorInfo.title} — Home to {floorInfo.categories.join(", ")} and customer service desks.
                      </p>
                    ) : null}
                  </div>

                  {/* Contact & Links */}
                  <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {shop.phone ? (
                      <a
                        href={`tel:${shop.phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-3 rounded-xl border border-hairline bg-white p-3.5 text-sm text-foreground transition-colors hover:border-brand/30 hover:bg-brand-tint/20"
                      >
                        <Phone className="size-4 text-brand" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Direct Line</p>
                          <p className="font-medium truncate">{shop.phone}</p>
                        </div>
                      </a>
                    ) : (
                      <a
                        href="tel:+94112595959"
                        className="flex items-center gap-3 rounded-xl border border-hairline bg-white p-3.5 text-sm text-foreground transition-colors hover:border-brand/30 hover:bg-brand-tint/20"
                      >
                        <Phone className="size-4 text-brand" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Information Desk</p>
                          <p className="font-medium truncate">+94 (11) 259 5959</p>
                        </div>
                      </a>
                    )}

                    {shop.web ? (
                      <a
                        href={shop.web}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-hairline bg-white p-3.5 text-sm text-foreground transition-colors hover:border-brand/30 hover:bg-brand-tint/20"
                      >
                        <ExternalLink className="size-4 text-brand" />
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">Official Website</p>
                          <p className="font-medium truncate">Visit website</p>
                        </div>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={handleShare}
                        className="flex items-center gap-3 rounded-xl border border-hairline bg-white p-3.5 text-left text-sm text-foreground transition-colors hover:border-brand/30 hover:bg-brand-tint/20"
                      >
                        {copied ? (
                          <Check className="size-4 text-emerald-600" />
                        ) : (
                          <Share2 className="size-4 text-brand" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground">
                            {copied ? "Copied to clipboard!" : "Share with friends"}
                          </p>
                          <p className="font-medium truncate">
                            {copied ? "Link ready" : "Share Store Details"}
                          </p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Nearby discovery on same floor */}
                  {nearbyShops.length > 0 ? (
                    <div className="mt-6 border-t border-hairline pt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        More on {floor?.label ?? "this floor"}
                      </p>
                      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        {nearbyShops.map((other) => {
                          const otherCategory = shopCategoryMap.get(other.category)
                          const OtherIcon = otherCategory?.icon ?? Store
                          return (
                            <button
                              key={other.id}
                              type="button"
                              onClick={() => onSelectShop(other)}
                              className="group flex items-center gap-3 rounded-xl bg-surface-muted/60 p-2.5 text-left ring-1 ring-black/5 transition-all hover:bg-white hover:ring-brand/30 hover:shadow-md"
                            >
                              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-tint text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                                <OtherIcon className="size-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-xs font-medium text-foreground group-hover:text-brand">
                                  {other.name}
                                </p>
                                <p className="text-[11px] text-muted-foreground truncate">
                                  {otherCategory?.label ?? "Retail"}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}

                  {/* Footer buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
                    <Link
                      href="/map"
                      className="flex-1 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-white transition-colors hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                    >
                      <Compass className="size-4" />
                      View Interactive Map
                    </Link>
                    <button
                      type="button"
                      onClick={() => onToggleBookmark(shop.id)}
                      className={cn(
                        "inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
                        bookmarked
                          ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200 hover:bg-rose-100"
                          : "bg-surface-muted text-foreground ring-1 ring-black/5 hover:bg-black/5"
                      )}
                    >
                      <Heart
                        className={cn("size-4", bookmarked && "fill-rose-600")}
                      />
                      {bookmarked ? "Saved in My List" : "Save Store"}
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
