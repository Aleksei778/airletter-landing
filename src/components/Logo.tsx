import Link from "next/link"

/** Wordmark: "quicksend" in Unbounded with a folded paper plane */
export function Logo({ href, className = "" }: { href: string; className?: string }) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`} aria-label="QuickSend">
      <PlaneMark className="h-[18px] w-[18px]" />
      <span className="font-head text-[15px] font-medium tracking-[-0.02em]">quicksend</span>
    </Link>
  )
}

export function PlaneMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* wing */}
      <path d="M2.5 10.8 21.5 3 15.2 20.5l-4.3-6.4L2.5 10.8Z" fill="currentColor" />
      {/* inner fold shown as a cut */}
      <path d="M21.5 3 10.9 14.1" stroke="var(--color-ink, #000)" strokeWidth="1.3" />
      <path d="m10.9 14.1-.7 5.2 3-3.3" fill="currentColor" />
    </svg>
  )
}
