"use client"

import { useEffect, useRef, useState } from "react"

import { Arrow } from "@/components/Arrow"
import { api } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"
import {
  formatPrice,
  monthlyPrice,
  plans,
  providerCurrency,
  totalPrice,
  type PaidPlanId,
  type Period,
  type PlanId,
  type Provider,
} from "@/lib/plans"

type Props = {
  locale: Locale
  t: Dictionary
  /** plans the backend allows buying now; never empty */
  purchasable: PaidPlanId[]
  /** the active plan: buying it again is a renewal */
  current: PlanId | null
  initialPlan?: PaidPlanId
  initialPeriod?: Period
}

export function Checkout({ locale, t, purchasable, current, initialPlan, initialPeriod }: Props) {
  const paidPlans = plans.filter((p) => purchasable.includes(p.id as PaidPlanId))
  const [chosenPlan, setPlan] = useState<PaidPlanId | undefined>(initialPlan)
  const plan = chosenPlan && purchasable.includes(chosenPlan) ? chosenPlan : purchasable[0]
  const [period, setPeriod] = useState<Period>(initialPeriod ?? "month")
  // enabled on the backend; null while loading
  const [available, setAvailable] = useState<Provider[] | null>(null)
  const [chosen, setChosen] = useState<Provider | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api
      .providers()
      .then((r) => setAvailable(r.providers))
      .catch(() => setAvailable([]))
  }, [])

  // default: YooKassa for Russian, Stripe for English, whichever is enabled
  const preferred: Provider = locale === "ru" ? "yookassa" : "stripe"
  const provider = chosen ?? (available?.includes(preferred) ? preferred : available?.[0]) ?? preferred

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
      // YooKassa / Stripe hosted page; they return to /dashboard/payment
      window.location.href = confirmation_url
    } catch {
      setError(true)
      setBusy(false)
    }
  }

  return (
    <div ref={ref} className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
      <div className="space-y-9">
        <Group legend={t.dashboard.plan} className={`grid gap-3 ${paidPlans.length > 1 ? "sm:grid-cols-2" : "sm:max-w-[calc(50%-6px)]"}`}>
          {paidPlans.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={plan === p.id}
              onClick={() => setPlan(p.id as PaidPlanId)}
              className="group rounded-2xl p-5 text-left shadow-[inset_0_0_0_1px_var(--color-line)] transition-shadow hover:shadow-[inset_0_0_0_1px_var(--color-mute)] aria-checked:shadow-[inset_0_0_0_1px_var(--color-paper)]"
            >
              <span className="flex items-center justify-between gap-4">
                <span className="font-head text-lg font-medium tracking-[-0.03em]">{t.pricing.plans[p.id].name}</span>
                <Dot />
              </span>
              <span className="mt-1 block h-4 text-[12px] text-mute">
                {p.id === current ? t.dashboard.renew : current && current !== "trial" ? t.dashboard.upgradeNow : ""}
              </span>
              <span className="mt-4 block text-sm text-mute">
                {p.dailyLimit.toLocaleString(locale)} {t.pricing.perDay}
              </span>
              <span className="mt-1 block text-sm">
                {formatPrice(monthlyPrice(p, currency, period), currency, locale)}
                <span className="text-mute">{t.pricing.perMonth}</span>
              </span>
            </button>
          ))}
        </Group>

        <Group legend={t.pricing.monthly + " / " + t.pricing.yearly} className="flex gap-8 border-b border-line">
          {(["month", "year"] as const).map((p) => (
            <button
              key={p}
              role="radio"
              aria-checked={period === p}
              onClick={() => setPeriod(p)}
              className="-mb-px border-b border-transparent pb-3 text-sm text-mute transition-colors hover:text-paper aria-checked:border-paper aria-checked:text-paper"
            >
              {p === "month" ? (
                t.pricing.monthly
              ) : (
                <>
                  {t.pricing.yearly} <span className="ml-1 text-mute">{t.pricing.yearlyBadge}</span>
                </>
              )}
            </button>
          ))}
        </Group>

        <Group legend={t.dashboard.provider} className="grid gap-1">
          {(available ?? []).map((p) => (
            <button
              key={p}
              role="radio"
              aria-checked={provider === p}
              onClick={() => setChosen(p)}
              className="group -mx-3 flex items-center gap-4 rounded-xl px-3 py-3 text-left text-sm text-mute transition-colors hover:bg-deep hover:text-paper aria-checked:text-paper"
            >
              <Dot />
              <span className="flex-1">{p === "yookassa" ? t.pricing.yookassa : t.pricing.stripe}</span>
              <span className="text-[13px] text-mute">{providerCurrency[p]}</span>
            </button>
          ))}
        </Group>
      </div>

      <div className="flex flex-col justify-end border-t border-line pt-8 md:border-t-0 md:border-l md:pt-0 md:pl-10">
        <p className="text-[13px] text-mute">
          {t.pricing.plans[plan].name} · {period === "month" ? t.pricing.monthly : t.pricing.yearly}
        </p>
        <p className="mt-2 font-head text-[clamp(36px,4vw,52px)] font-medium tracking-[-0.04em]">
          {formatPrice(amount, currency, locale)}
        </p>
        {available?.length === 0 ? (
          <p className="mt-8 text-sm text-mute">{t.dashboard.payUnavailable}</p>
        ) : (
          <button onClick={pay} disabled={busy || !available} className="btn mt-8 w-full">
            {t.dashboard.pay} <Arrow />
          </button>
        )}
        {error && (
          <p role="alert" className="mt-4 text-sm text-mute">
            {t.dashboard.payError}
          </p>
        )}
      </div>
    </div>
  )
}

function Group({ legend, className, children }: { legend: string; className: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 text-[13px] text-mute">{legend}</legend>
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </fieldset>
  )
}

/** Radio indicator: an outlined circle, with a dot when the parent is checked */
function Dot() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 rounded-full shadow-[inset_0_0_0_1.5px_var(--color-line)] transition-shadow group-hover:shadow-[inset_0_0_0_1.5px_var(--color-mute)] group-aria-checked:shadow-[inset_0_0_0_1.5px_var(--color-paper),inset_0_0_0_4.5px_var(--color-ink),inset_0_0_0_8px_var(--color-paper)]"
    />
  )
}
