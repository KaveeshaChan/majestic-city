import { Stagger } from "@/components/motion/reveal"

interface PageHeaderProps {
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}

/**
 * Shared masthead for inner routes. Server Component; only the small reveal
 * wrapper crosses into the client bundle.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="border-b border-black/8 bg-ink text-ink-foreground">
      <div className="mx-auto w-full max-w-[1240px] px-6 pt-[calc(var(--header-height)+4.5rem)] pb-16 sm:px-8 sm:pb-20">
        <Stagger stagger={0.07}>
          <p className="text-xs font-medium tracking-[0.2em] text-white/45 uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 text-pretty">
            {description}
          </p>
          {children}
        </Stagger>
      </div>
    </section>
  )
}
