import type { ReactNode } from "react"

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <article className="px-[clamp(20px,4vw,48px)] pt-[clamp(140px,22vh,220px)] pb-[clamp(100px,16vh,180px)]">
      <div className="mx-auto max-w-[760px]">
        <h1 className="h-display text-[clamp(36px,6vw,80px)]">{title}</h1>
        <p className="mt-6 text-sm text-mute">{updated}</p>
        <div className="prose-legal mt-12">{children}</div>
      </div>
    </article>
  )
}
