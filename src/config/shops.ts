import {
  Baby,
  BookOpen,
  Clapperboard,
  Flower2,
  Footprints,
  Gem,
  Gift,
  Lamp,
  Shirt,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from "lucide-react"

/**
 * The store directory.
 *
 * ⚠️ Data provenance — read before launch.
 *
 * The store *names* below were transcribed from the legacy majesticcity.lk
 * directory. Three fields from that listing are deliberately **not** reproduced
 * here: `unit`, `phone` and `email`. They were not legible with enough
 * confidence to republish, and a wrong phone number on a mall directory is
 * worse for a visitor than no phone number at all — the card simply omits any
 * field left undefined, so filling them in later is additive.
 *
 * `floor` follows the mall's published level plan (see `floorGuide` in
 * `./home.ts`) rather than per-store unit numbers, so the two pages agree.
 * Confirm both against the leasing team's master list before launch.
 */

/* -------------------------------------------------------------------------- */
/*  Categories                                                                */
/* -------------------------------------------------------------------------- */

export interface ShopCategory {
  id: string
  label: string
  icon: LucideIcon
}

/**
 * Thirty micro-categories on the legacy site ("Shoe Repair and Key Cutting"
 * sat beside "Cinema") meant no filter ever had more than two shops in it.
 * These twelve are the level a visitor actually browses at.
 */
export const shopCategories: ShopCategory[] = [
  { id: "mobile", label: "Mobile & Electronics", icon: Smartphone },
  { id: "fashion", label: "Fashion & Apparel", icon: Shirt },
  { id: "ethnic", label: "Sarees & Ethnic Wear", icon: Flower2 },
  { id: "footwear", label: "Footwear & Bags", icon: Footprints },
  { id: "beauty", label: "Beauty & Cosmetics", icon: Sparkles },
  { id: "jewellery", label: "Jewellery & Accessories", icon: Gem },
  { id: "books", label: "Books & Stationery", icon: BookOpen },
  { id: "kids", label: "Toys & Kids", icon: Baby },
  { id: "food", label: "Food & Beverage", icon: UtensilsCrossed },
  { id: "entertainment", label: "Entertainment", icon: Clapperboard },
  { id: "home", label: "Home & Living", icon: Lamp },
  { id: "gifts", label: "Gifts & Crafts", icon: Gift },
  { id: "services", label: "Services & Repairs", icon: Wrench },
]

export const shopCategoryMap = new Map(shopCategories.map((c) => [c.id, c]))

/* -------------------------------------------------------------------------- */
/*  Floors                                                                    */
/* -------------------------------------------------------------------------- */

export interface ShopFloor {
  id: string
  /** What the segmented control shows — kept to 1–2 glyphs so it stays even. */
  short: string
  label: string
}

export const shopFloors: ShopFloor[] = [
  { id: "G", short: "G", label: "Ground floor" },
  { id: "01", short: "1", label: "Level 1" },
  { id: "02", short: "2", label: "Level 2" },
  { id: "03", short: "3", label: "Level 3" },
  { id: "04", short: "4", label: "Level 4" },
  { id: "05", short: "5", label: "Level 5" },
]

export const shopFloorMap = new Map(shopFloors.map((f) => [f.id, f]))

/* -------------------------------------------------------------------------- */
/*  Shops                                                                     */
/* -------------------------------------------------------------------------- */

export interface Shop {
  /** Stable slug — the React key, and the anchor if we ever deep-link a store. */
  id: string
  name: string
  category: string
  floor: string
  /** Unit number, e.g. "02-14". Omitted until verified; see the note above. */
  unit?: string
  phone?: string
  email?: string
  web?: string
}

export const shops: Shop[] = [
  // Mobile & electronics — by far the largest cluster in the mall.
  { id: "new-active-mobile", name: "New Active Mobile", category: "mobile", floor: "02" },
  { id: "i-studio", name: "I Studio", category: "mobile", floor: "02" },
  { id: "galaxy", name: "Galaxy", category: "mobile", floor: "02" },
  { id: "aa-mobile-zone", name: "A&A Mobile Zone", category: "mobile", floor: "02" },
  { id: "new-blue-star-mobiles", name: "New Blue Star Mobiles", category: "mobile", floor: "02" },
  { id: "new-blue-grass-cellular", name: "New Blue Grass Cellular", category: "mobile", floor: "02" },
  { id: "ttl-mobile", name: "TTL Mobile", category: "mobile", floor: "02" },
  { id: "dual-star", name: "Dual Star", category: "mobile", floor: "02" },
  { id: "phonez", name: "Phonez", category: "mobile", floor: "02" },
  { id: "nokia-softlogic", name: "Nokia — Softlogic", category: "mobile", floor: "02" },
  { id: "dual-lord", name: "Dual Lord", category: "mobile", floor: "02" },
  { id: "divine-cell-care", name: "Divine Cell Care", category: "mobile", floor: "02" },
  { id: "divine-care", name: "Divine Care", category: "mobile", floor: "02" },
  { id: "mobilefashion-lk", name: "Mobilefashion.lk", category: "mobile", floor: "02" },
  { id: "mobile-expert", name: "Mobile Expert", category: "mobile", floor: "02" },
  { id: "f-one-mobile", name: "F-One Mobile", category: "mobile", floor: "02" },
  { id: "geetee-technology", name: "Geetee Technology", category: "mobile", floor: "02" },
  { id: "cell-power", name: "Cell Power", category: "mobile", floor: "02" },
  { id: "majestic-mobiles", name: "Majestic Mobiles", category: "mobile", floor: "02" },
  { id: "i-arena", name: "I-Arena", category: "mobile", floor: "02" },
  { id: "amgc-communication", name: "AMGC Communication", category: "mobile", floor: "02" },
  { id: "microtek", name: "Microtek", category: "mobile", floor: "02" },
  { id: "iberry", name: "iBerry", category: "mobile", floor: "02" },

  // Repairs & services
  { id: "jj-repair-centre", name: "JJ Repair Centre", category: "services", floor: "02" },

  // Fashion & apparel
  { id: "sheek", name: "Sheek", category: "fashion", floor: "G" },
  { id: "french-city", name: "French City", category: "fashion", floor: "G" },
  { id: "carlo-northstar-holdings", name: "Carlo — Northstar Holdings", category: "fashion", floor: "G" },
  { id: "pull-and-wear", name: "Pull & Wear", category: "fashion", floor: "G" },
  { id: "empire-fashion", name: "Empire Fashion", category: "fashion", floor: "G" },
  { id: "lady-priya", name: "Lady Priya", category: "fashion", floor: "G" },
  { id: "erike", name: "Erike", category: "fashion", floor: "G" },
  { id: "dressport-1", name: "Dressport 1", category: "fashion", floor: "G" },
  { id: "dressport-2", name: "Dressport 2", category: "fashion", floor: "G" },
  { id: "dressport", name: "Dressport", category: "fashion", floor: "G" },
  { id: "carlo", name: "Carlo", category: "fashion", floor: "G" },
  { id: "sarathas", name: "Sarathas", category: "fashion", floor: "G" },
  { id: "fair-deal", name: "Fair Deal", category: "fashion", floor: "G" },
  { id: "el-club", name: "El Club", category: "fashion", floor: "G" },
  { id: "triumph", name: "Triumph", category: "fashion", floor: "G" },
  { id: "new-shyamas", name: "New Shyamas", category: "fashion", floor: "G" },
  { id: "hameedias", name: "Hameedia's", category: "fashion", floor: "G" },
  { id: "grands", name: "Grands", category: "fashion", floor: "G" },
  { id: "field", name: "Field", category: "fashion", floor: "G" },
  { id: "rock-eagle", name: "Rock Eagle", category: "fashion", floor: "G" },
  { id: "laraz", name: "Laraz", category: "fashion", floor: "G" },
  { id: "elys", name: "Elys", category: "fashion", floor: "G" },
  { id: "prestige", name: "Prestige", category: "fashion", floor: "G" },
  { id: "mikito-collection", name: "Mikito Collection", category: "fashion", floor: "G" },
  { id: "dilith-collection", name: "Dilith Collection", category: "fashion", floor: "G" },
  { id: "glow", name: "Glow", category: "fashion", floor: "G" },

  // Sarees & ethnic wear
  { id: "costumes-saree-gallery", name: "Costumes Saree Gallery", category: "ethnic", floor: "01" },
  { id: "new-saree-kingdom", name: "New Saree Kingdom", category: "ethnic", floor: "01" },
  { id: "prasanna-batiks", name: "Prasanna Batiks", category: "ethnic", floor: "01" },
  { id: "rangoli", name: "Rangoli", category: "ethnic", floor: "01" },
  { id: "swethas", name: "Swethas", category: "ethnic", floor: "01" },
  { id: "symphony", name: "Symphony", category: "ethnic", floor: "01" },
  { id: "navavi", name: "Navavi", category: "ethnic", floor: "01" },
  { id: "skyfi-gallery", name: "Skyfi Gallery", category: "ethnic", floor: "01" },

  // Toys & kids
  { id: "kiddos-cupboard", name: "Kiddos Cupboard", category: "kids", floor: "03" },
  { id: "la21", name: "La21", category: "kids", floor: "03" },

  // Books & stationery
  { id: "book-city", name: "Book City", category: "books", floor: "03" },
  { id: "pen-house", name: "Pen House", category: "books", floor: "03" },

  // Gifts & crafts
  { id: "jnik-creations", name: "Jnik Creations", category: "gifts", floor: "03" },

  // Entertainment
  { id: "majestic-cineplex", name: "Majestic Cineplex", category: "entertainment", floor: "05" },
  { id: "game-on", name: "Game On", category: "entertainment", floor: "05" },
]

/* -------------------------------------------------------------------------- */
/*  Derived                                                                   */
/* -------------------------------------------------------------------------- */

/** Categories that actually have a shop, in directory order, with their counts. */
export const shopCategoriesInUse: Array<ShopCategory & { count: number }> =
  shopCategories
    .map((category) => ({
      ...category,
      count: shops.filter((shop) => shop.category === category.id).length,
    }))
    .filter((category) => category.count > 0)

/** Floors that actually have a shop, with their counts. */
export const shopFloorsInUse: Array<ShopFloor & { count: number }> = shopFloors
  .map((floor) => ({
    ...floor,
    count: shops.filter((shop) => shop.floor === floor.id).length,
  }))
  .filter((floor) => floor.count > 0)

/** Initials for a store's monogram — at most two glyphs, so the tile stays even. */
export function shopInitials(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N}\s&-]/gu, " ")
    .split(/[\s&-]+/)
    .filter(Boolean)

  if (words.length === 0) return "?"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}
