import Link from "next/link"
import { ArrowLeft } from "lucide-react"

/** Placeholder body for routes whose content has not been built yet. */
export function ComingSoon({ section }: { section: string }) {
  return (
    <section className="mx-auto w-full max-w-[1240px] px-6 py-24 sm:px-8 sm:py-32">
      <p className="font-heading text-2xl font-medium tracking-tight text-balance">
        The {section} content is on its way.
      </p>
      <p className="mt-3 max-w-md text-muted-foreground text-pretty">
        This route exists so the navigation, the active states and the page
        transitions all work end to end. Drop the real content in here.
      </p>
      <Link
        href="/"
        className="group mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-strong"
      >
        <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back home
      </Link>
    </section>
  )
}
