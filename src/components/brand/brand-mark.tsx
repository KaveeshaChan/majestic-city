import Image from "next/image"

import { brandLogo, LOGO_ASPECT_RATIO } from "@/config/site"
import { cn } from "@/lib/utils"

interface BrandMarkProps {
  /** Size + positioning. Width drives everything; height comes from the ratio. */
  className?: string
  /** Tailwind-free so it can be tuned per placement (pill vs. card). */
  radius?: number
  /** Set on the copy that is above the fold. */
  eager?: boolean
  sizes?: string
}

/**
 * The wordmark on its white chip. The chip is what keeps the maroon artwork
 * legible wherever it lands — including on the brand-red navbar pill.
 */
export function BrandMark({
  className,
  radius = 999,
  eager = false,
  sizes = "(max-width: 640px) 70vw, 460px",
}: BrandMarkProps) {
  return (
    <span
      style={{ borderRadius: radius, aspectRatio: LOGO_ASPECT_RATIO }}
      className={cn(
        "block overflow-hidden bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_28px_-12px_rgb(0_0_0/0.45)]",
        className
      )}
    >
      {/* `fill` resolves against the padding box, so the padding insets the art. */}
      <span className="relative block size-full p-[5.5%]">
        <Image
          src={brandLogo.src}
          alt={brandLogo.alt}
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="object-contain"
        />
      </span>
    </span>
  )
}
