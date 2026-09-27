import Link from "next/link"

/** Wordmark: "airletter" in Unbounded with a folded paper plane */
export function Logo({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`} aria-label="Airletter">
      <PlaneMark className="h-[18px] w-[18px]" />
      <span className="font-head text-[15px] font-medium tracking-[-0.02em]">airletter</span>
    </Link>
  )
}

export function PlaneMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      {/* same drawing as app/icon.svg: two wings split by the fold, keel in shadow */}
      <path d="M2 10.4 22 2 9.4 13.3Z" />
      <path d="M22 2 11 14.6 15.6 21.6Z" />
      <path d="M11 14.6 10.2 20.6 13.3 18.1Z" opacity="0.55" />
    </svg>
  )
}
