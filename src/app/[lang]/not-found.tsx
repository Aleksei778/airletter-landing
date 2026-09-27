import Link from "next/link"

import { Arrow } from "@/components/Arrow"
import { PlaneMark } from "@/components/Logo"

// not-found has no params; the text is bilingual on purpose
export default function NotFound() {
  return (
    <main className="relative z-[3] flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <PlaneMark className="mb-10 h-10 w-10 rotate-[140deg] opacity-80" />
      <h1 className="h-display text-[clamp(40px,8vw,112px)]">404</h1>
      <p className="lede mt-6">Сбились с курса · Off course</p>
      <Link href="/" className="btn mt-10">
        airletter <Arrow />
      </Link>
    </main>
  )
}
