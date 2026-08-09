import {
  Building2,
  ConciergeBell,
  House,
  Mail,
  MapPinned,
  Newspaper,
  Store,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"

/**
 * `primary` items stay inline in the desktop pill from `lg` upwards.
 * `secondary` items only go inline at `xl`; below that they collapse into the
 * "More" dropdown so the pill never has to wrap or overflow.
 */
export type NavPriority = "primary" | "secondary"

export interface NavItem {
  title: string
  href: string
  /** Shown in the mobile sheet and the desktop "More" dropdown. */
  description: string
  icon: LucideIcon
  priority: NavPriority
}

export const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/",
    description: "Back to the start",
    icon: House,
    priority: "primary",
  },
  {
    title: "About Us",
    href: "/about",
    description: "Three decades of Colombo retail",
    icon: Building2,
    priority: "primary",
  },
  {
    title: "Facilities",
    href: "/facilities",
    description: "Parking, cinema, food court and more",
    icon: ConciergeBell,
    priority: "primary",
  },
  {
    title: "Shops",
    href: "/shops",
    description: "Every brand, floor by floor",
    icon: Store,
    priority: "primary",
  },
  {
    title: "News & Articles",
    href: "/news",
    description: "Events, offers and announcements",
    icon: Newspaper,
    priority: "primary",
  },
  {
    title: "Investor Relations",
    href: "/investor-relations",
    description: "Reports, filings and governance",
    icon: TrendingUp,
    priority: "secondary",
  },
  {
    title: "Map",
    href: "/map",
    description: "Find your way around",
    icon: MapPinned,
    priority: "secondary",
  },
]

/** Rendered as the trailing pill button, mirroring the reference concept. */
export const ctaNavItem: NavItem = {
  title: "Contact Us",
  href: "/contact",
  description: "Talk to the Majestic City team",
  icon: Mail,
  priority: "primary",
}

export const primaryNavItems = navItems.filter(
  (item) => item.priority === "primary"
)

export const secondaryNavItems = navItems.filter(
  (item) => item.priority === "secondary"
)

/** Everything the mobile sheet lists, in reading order. */
export const allNavItems: NavItem[] = [...navItems, ctaNavItem]

/**
 * `/` must match exactly, every other route also matches its descendants.
 */
export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}
