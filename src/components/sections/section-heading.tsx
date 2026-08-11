import { cn } from "@/lib/utils"

/**
 * The two typographic atoms every landing section is built from. Keeping them
 * here is what makes the page feel like one document rather than eight blocks.
 */

/** The small capsule label that opens a section. */
export function Eyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode
  tone?: "light" | "dark"
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-medium tracking-[0.14em] uppercase",
        tone === "light"
          ? "bg-brand-tint text-brand-strong ring-1 ring-brand/12"
          // Over a photograph, so it carries its own contrast rather than
          // borrowing whatever happens to be behind it.
          : "bg-ink/45 text-white ring-1 ring-white/25 backdrop-blur-md",
        className
      )}
    >
      <span
        aria-hidden
        className={cn(
          "size-1.5 rounded-full",
          tone === "light" ? "bg-brand" : "bg-white/70"
        )}
      />
      {children}
    </span>
  )
}

/** Section title. `as` keeps the outline honest without changing the look. */
export function SectionTitle({
  children,
  as: Tag = "h2",
  className,
}: {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3"
  className?: string
}) {
  return (
    <Tag
      className={cn(
        "font-heading text-3xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]",
        className
      )}
    >
      {children}
    </Tag>
  )
}
