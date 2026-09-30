"use client"

import Link from "next/link"
import { useState } from "react"

import type { Dictionary } from "@/lib/i18n/dictionaries/ru"
import type { Locale } from "@/lib/i18n/config"
import { formatPrice, monthlyPrice, plans, totalPrice, type Currency, type Period } from "@/lib/plans"

import { Arrow } from "./Arrow"

type Props = {
  locale: Locale
  t: Dictionary["pricing"]
}

export function PricingCards({ locale, t }: Props) {
  const [period, setPeriod] = useState<Period>("month")
  // prices are shown in the currency of the default provider for the language
  const currency: Currency = locale === "ru" ? "RUB" : "USD"

  return (
    <div>
      <div role="radiogroup" className="inline-flex rounded-full p-1 shadow-[inset_0_0_0_1px_var(--color-line)]">
        {(["month", "year"] as const).map((p) => (
          <button
            key={p}
            role="radio"
            aria-checked={period === p}
            onClick={() => setPeriod(p)}
            className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
              period === p ? "bg-paper text-ink" : "text-mute hover:text-paper"
            }`}
          >
            {p === "month" ? t.monthly : t.yearly}
            {p === "year" && <span className="ml-2 opacity-60">{t.yearlyBadge}</span>}
          </button>
        ))}
      </div>

      <div className="mt-12 grid border-t border-line md:grid-cols-3">
        {plans.map((plan, i) => {
          const copy = t.plans[plan.id]
          const isFree = plan.monthly[currency] === 0
          const href =
            plan.id === "trial"
              ? `/${locale}/login?mode=signup`
              : `/${locale}/dashboard?plan=${plan.id}&period=${period}`

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col py-10 md:px-8 ${i > 0 ? "border-t border-line md:border-t-0 md:border-l" : ""} ${i === 0 ? "md:pl-0" : ""}`}
            >
              <span className="absolute -top-1 left-0 h-[7px] w-[7px] rounded-full bg-paper md:left-auto" />
              <div className="flex items-center gap-3">
                <h3 className="font-head text-xl font-medium tracking-[-0.02em]">{copy.name}</h3>
                {plan.popular && (
                  <span className="rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-medium text-ink">{t.popular}</span>
                )}
              </div>
              <p className="mt-2 min-h-[3em] text-sm text-mute">{copy.note}</p>

              <div className="mt-8 font-head text-[clamp(36px,4vw,52px)] font-medium tracking-[-0.04em]">
                {isFree ? t.free : formatPrice(monthlyPrice(plan, currency, period), currency, locale)}
                {!isFree && <span className="ml-1 font-body text-base font-light text-mute">{t.perMonth}</span>}
              </div>
              <p className="mt-1 h-5 text-[13px] text-mute">
                {!isFree && period === "year" && `${formatPrice(totalPrice(plan, currency, period), currency, locale)} ${t.billedYearly}`}
              </p>

              <ul className="mt-8 flex-1 space-y-3 text-[15px]">
                <li>
                  <b className="font-medium">{plan.dailyLimit.toLocaleString(locale)}</b>{" "}
                  <span className="text-mute">{t.perDay}</span>
                </li>
                {t.features.common.map((f) => (
                  <li key={f} className="text-mute">
                    {f}
                  </li>
                ))}
                {plan.id === "premium" && <li className="text-mute">{t.features.priority}</li>}
              </ul>

              <Link href={href} className={`btn mt-10 ${plan.popular ? "" : "btn-ghost"}`}>
                {copy.cta} <Arrow />
              </Link>
            </div>
          )
        })}
      </div>

      <p className="mt-10 text-sm text-mute">
        {t.payWith}: <span className="text-paper">{t.yookassa}</span> · <span className="text-paper">{t.stripe}</span>
      </p>
    </div>
  )
}
