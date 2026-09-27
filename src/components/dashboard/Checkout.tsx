"use client"

import { useEffect, useRef, useState } from "react"

import { Arrow } from "@/components/Arrow"
import { api } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"
import {
  formatPrice,
  plans,
  providerCurrency,
  totalPrice,
  type PaidPlanId,
  type Period,
  type Provider,
} from "@/lib/plans"

type Props = {
  locale: Locale
  t: Dictionary
  initialPlan?: PaidPlanId
  initialPeriod?: Period
}

const paidPlans = plans.filter((p) => p.id !== "trial")

export function Checkout({ locale, t, initialPlan, initialPeriod }: Props) {
  const [plan, setPlan] = useState<PaidPlanId>(initialPlan ?? "standard")
  const [period, setPeriod] = useState<Period>(initialPeriod ?? "month")
  const [provider, setProvider] = useState<Provider>(locale === "ru" ? "yookassa" : "paypal")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // coming from the pricing page with a chosen plan: bring the form into view
  useEffect(() => {
    if (initialPlan) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [initialPlan])

  const selected = paidPlans.find((p) => p.id === plan)!
  const currency = providerCurrency[provider]
  const amount = totalPrice(selected, currency, period)

  const pay = async () => {
    setBusy(true)
    setError(false)
    try {
      const { confirmation_url } = await api.createPayment({ plan, period, provider, locale })
      // YooKassa / PayPal hosted page; they return to /dashboard/payment
      window.location.href = confirmation_url
    } catch {
      setError(true)
      setBusy(false)
    }
  }

  const option = (active: boolean) =>
    `rounded-full px-5 py-2.5 text-sm transition-colors ${
      active ? "bg-paper text-ink" : "text-mute shadow-[inset_0_0_0_1px_var(--color-line)] hover:text-paper"
    }`

  return (
    <div ref={ref} className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
      <div className="space-y-8">
        <Fieldset legend={t.dashboard.plan}>
          {paidPlans.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={plan === p.id}
              onClick={() => setPlan(p.id as PaidPlanId)}
              className={option(plan === p.id)}
            >
              {t.pricing.plans[p.id].name} · {p.dailyLimit.toLocaleString(locale)} {t.pricing.perDay}
            </button>
          ))}
        </Fieldset>

        <Fieldset legend={t.pricing.monthly + " / " + t.pricing.yearly}>
          {(["month", "year"] as const).map((p) => (
            <button key={p} role="radio" aria-checked={period === p} onClick={() => setPeriod(p)} className={option(period === p)}>
              {p === "month" ? t.pricing.monthly : `${t.pricing.yearly} ${t.pricing.yearlyBadge}`}
            </button>
          ))}
        </Fieldset>

        <Fieldset legend={t.dashboard.provider}>
          {(["yookassa", "paypal"] as const).map((p) => (
            <button key={p} role="radio" aria-checked={provider === p} onClick={() => setProvider(p)} className={option(provider === p)}>
              {p === "yookassa" ? t.pricing.yookassa : t.pricing.paypal}
            </button>
          ))}
        </Fieldset>
      </div>

      <div className="flex flex-col justify-end border-t border-line pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <p className="text-[13px] text-mute">
          {t.pricing.plans[plan].name} · {period === "month" ? t.pricing.monthly : t.pricing.yearly}
        </p>
        <p className="mt-2 font-head text-[clamp(36px,4vw,52px)] font-medium tracking-[-0.04em]">
          {formatPrice(amount, currency, locale)}
        </p>
        <button onClick={pay} disabled={busy} className="btn mt-8 w-full">
          {t.dashboard.pay} <Arrow />
        </button>
        {error && (
          <p role="alert" className="mt-4 text-sm text-mute">
            {t.dashboard.payError}
          </p>
        )}
      </div>
    </div>
  )
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-[13px] text-mute">{legend}</legend>
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {children}
      </div>
    </fieldset>
  )
}
