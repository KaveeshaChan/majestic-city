/**
 * Single source of truth for brand-level metadata.
 * Anything user-facing that is not a route lives here.
 */
export const siteConfig = {
  name: "Majestic City",
  tagline: "Since 1991",
  description:
    "Colombo's original shopping landmark — retail, dining, cinema and entertainment under one roof since 1991.",
  url: "https://majesticcity.lk",
  contact: {
    email: "info@majesticcity.lk",
    phone: "+94 11 250 0000",
    address: "10 Station Road, Bambalapitiya, Colombo 04, Sri Lanka",
  },
} as const

/**
 * The logo is a wide wordmark (not a square icon), so every box that holds it
 * has to be driven off its intrinsic ratio rather than given a fixed height.
 */
export const brandLogo = {
  src: "/logo.png",
  width: 1861,
  height: 576,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
} as const

export const LOGO_ASPECT_RATIO = brandLogo.width / brandLogo.height
