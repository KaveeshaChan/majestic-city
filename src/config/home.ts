import {
  Accessibility,
  Building2,
  Car,
  Clapperboard,
  Clock,
  Layers,
  Map,
  Newspaper,
  ShieldCheck,
  Store,
  TrainFront,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

/**
 * Every piece of copy on the landing page.
 *
 * Sections read from here rather than hard-coding strings, so the whole page can
 * be re-worded — or handed to whoever owns the content — without opening a
 * component.
 *
 * ⚠️ The figures and opening hours below were carried over from the first pass
 * at the site and are still placeholders. Confirm them with mall management
 * before launch; they are the numbers a visitor is most likely to trust.
 */

export interface StatItem {
  value: string
  label: string
}

/** Three, not four: the fourth sits in the hero's badge as "Since 1991". */
export const heroStats: StatItem[] = [
  { value: "180+", label: "Stores & outlets" },
  { value: "5", label: "Retail floors" },
  { value: "1,200", label: "Parking bays" },
]

export interface QuickFindItem {
  title: string
  hint: string
  href: string
  icon: LucideIcon
}

/**
 * The dock that sits on the hero image. Deliberately four real routes rather
 * than a search box — a search field that cannot search is the fastest way to
 * lose a first-time visitor's trust.
 */
export const quickFindItems: QuickFindItem[] = [
  {
    title: "Shops & brands",
    hint: "180+ stores",
    href: "/shops",
    icon: Store,
  },
  {
    title: "Facilities",
    hint: "Dining, cinema, parking",
    href: "/facilities",
    icon: UtensilsCrossed,
  },
  {
    title: "Floor map",
    hint: "Find your way",
    href: "/map",
    icon: Map,
  },
  {
    title: "What's on",
    hint: "Events & offers",
    href: "/news",
    icon: Newspaper,
  },
]

/** The scrolling band under the hero — proof of range, in one glance. */
export const marqueeItems: string[] = [
  "Fashion & apparel",
  "Footwear",
  "Mobile & electronics",
  "Beauty & cosmetics",
  "Jewellery & gifting",
  "Supermarket",
  "Food court",
  "Cinema",
  "Toys & kids",
  "Home & living",
  "Books & stationery",
  "Salons & wellness",
  "Pharmacy",
  "Cafés & desserts",
]

/**
 * The statement section, split so the trailing clause can be typeset in the
 * muted weight while the opening clause lands in full ink.
 */
export const statement = {
  lead: "Five floors of shopping, eating and everything in between —",
  trail:
    "the Colombo landmark generations have met at, minutes from the sea at Bambalapitiya.",
}

export interface ExperienceCard {
  title: string
  description: string
  href: string
  icon: LucideIcon
  /** One card in the stack is inverted, so the eye has somewhere to land. */
  featured?: boolean
}

export const experienceCards: ExperienceCard[] = [
  {
    title: "Shops & brands",
    description:
      "Over 180 stores across five floors, from long-standing local names to the labels you came for.",
    href: "/shops",
    icon: Store,
  },
  {
    title: "Dining & food court",
    description:
      "A food court built for a whole family plus cafés, desserts and quick lunches between floors.",
    href: "/facilities",
    icon: UtensilsCrossed,
    featured: true,
  },
  {
    title: "Cinema & entertainment",
    description:
      "Big-screen releases, an arcade for the kids and school-holiday events under the same roof.",
    href: "/facilities",
    icon: Clapperboard,
  },
  {
    title: "Parking & access",
    description:
      "1,200 covered bays, lifts to every level and a drop-off right at the Galle Road entrance.",
    href: "/facilities",
    icon: Car,
  },
]

export interface FloorEntry {
  level: string
  title: string
  categories: string[]
}

export const floorGuide: FloorEntry[] = [
  {
    level: "G",
    title: "Fashion & footwear",
    categories: ["Apparel", "Shoes", "Accessories"],
  },
  {
    level: "01",
    title: "Beauty & jewellery",
    categories: ["Cosmetics", "Jewellery", "Gifting"],
  },
  {
    level: "02",
    title: "Mobile & electronics",
    categories: ["Phones", "Computers", "Repairs"],
  },
  {
    level: "03",
    title: "Home, kids & books",
    categories: ["Homeware", "Toys", "Stationery"],
  },
  {
    level: "04",
    title: "Food court & dining",
    categories: ["Food court", "Cafés", "Desserts"],
  },
  {
    level: "05",
    title: "Cinema & entertainment",
    categories: ["Cineplex", "Arcade", "Events"],
  },
]

export interface TrustPoint {
  title: string
  description: string
  icon: LucideIcon
}

export const trustPoints: TrustPoint[] = [
  {
    title: "A landmark since 1991",
    description:
      "Three decades as Colombo's first stop for shopping — the mall a generation grew up meeting at.",
    icon: Building2,
  },
  {
    title: "One trip, everything done",
    description:
      "Groceries, gadgets, gifting, a haircut, lunch and a film without ever moving the car.",
    icon: Layers,
  },
  {
    title: "Easy to reach",
    description:
      "On Galle Road at Bambalapitiya, a short walk from the coastal railway line and every major bus route.",
    icon: TrainFront,
  },
  {
    title: "Safe and family-friendly",
    description:
      "Staffed entrances, lift and ramp access on every floor, and supervised parking after dark.",
    icon: ShieldCheck,
  },
]

/** Counted up as the section scrolls in — hence numbers, not strings. */
export interface CounterItem {
  value: number
  suffix?: string
  label: string
  hint: string
}

export const counters: CounterItem[] = [
  {
    value: 180,
    suffix: "+",
    label: "Stores & outlets",
    hint: "Across six levels",
  },
  { value: 5, label: "Retail floors", hint: "Plus a cinema level" },
  {
    value: 1200,
    label: "Parking bays",
    hint: "Covered and staffed",
  },
]

export const visitInfo = {
  hours: [
    { days: "Monday – Thursday", time: "10:00 – 21:30" },
    { days: "Friday – Sunday", time: "10:00 – 22:00" },
    { days: "Public holidays", time: "10:00 – 22:00" },
  ],
  gettingHere: [
    "On Galle Road, Bambalapitiya — opposite the coastal railway line.",
    "Bambalapitiya station and the 100/101/154 bus routes are a few minutes' walk.",
    "Covered parking entered from Station Road, with a drop-off at the main doors.",
  ],
  access: [
    { label: "Lifts & escalators to every floor", icon: Accessibility },
    { label: "Open every day of the week", icon: Clock },
    { label: "Staffed security at all entrances", icon: ShieldCheck },
  ],
} as const
