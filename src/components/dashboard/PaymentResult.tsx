"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Arrow } from "@/components/Arrow"
import { api, type PaymentStatus } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"

const POLL_MS = 2_000
const MAX_POLLS = 60

/** Polls the payment after returning from YooKassa/Stripe until the webhook settles it */
export function PaymentResult({ locale, t, paymentId }: { locale: Locale; t: Dictionary["payment"]; paymentId?: string }) {
  const [status, setStatus] = useState<PaymentStatus | "unknown">(paymentId ? "pending" : "unknown")

  useEffect(() => {
    if (!paymentId) return
    let polls = 0
    let timer: ReturnType<typeof setTimeout>

    const check = async () => {
      try {
        const res = await api.payment(paymentId)
        if (res.status !== "pending") return setStatus(res.status)
      } catch {
        return setStatus("unknown")
      }
      if (++polls >= MAX_POLLS) return setStatus("unknown")
      timer = setTimeout(check, POLL_MS)
    }
    check()
    return () => clearTimeout(timer)
  }, [paymentId])

  return (
    <div className="py-20">
      <h1 className="h-display text-[clamp(40px,7vw,96px)]">{t.title}</h1>
      <p role="status" className="lede mt-8 max-w-[44ch]">
        {status === "pending" && <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-paper" />}
        {t[status]}
      </p>
      {status !== "pending" && (
        <Link href={`/${locale}/dashboard`} className="btn mt-10">
          {t.back} <Arrow />
        </Link>
      )}
    </div>
  )
}
