// Plans must match backend limits (internal/subscription/model.go)

export type PlanId = "trial" | "standard" | "premium"
export type PaidPlanId = Exclude<PlanId, "trial">
export type Period = "month" | "year"
export type Provider = "yookassa" | "stripe"
export type Currency = "RUB" | "USD"

export const YEARLY_DISCOUNT = 0.2

export const providerCurrency: Record<Provider, Currency> = {
  yookassa: "RUB",
  stripe: "USD",
}

export type Plan = {
  id: PlanId
  dailyLimit: number
  // monthly price per currency; yearly is derived with the discount
  monthly: Record<Currency, number>
  popular?: boolean
}

export const plans: Plan[] = [
  { id: "trial", dailyLimit: 30, monthly: { RUB: 0, USD: 0 } },
  { id: "standard", dailyLimit: 500, monthly: { RUB: 990, USD: 12 }, popular: true },
  { id: "premium", dailyLimit: 2000, monthly: { RUB: 1990, USD: 22 } },
]

export const TRIAL_DAYS = 10

/** Price per month shown on the card for the chosen period */
export function monthlyPrice(plan: Plan, currency: Currency, period: Period): number {
  const base = plan.monthly[currency]
  return period === "year" ? round(base * (1 - YEARLY_DISCOUNT), currency) : base
}

/** Total charged for the period */
export function totalPrice(plan: Plan, currency: Currency, period: Period): number {
  return period === "year" ? round(monthlyPrice(plan, currency, period) * 12, currency) : plan.monthly[currency]
}

function round(value: number, currency: Currency): number {
  return currency === "RUB" ? Math.round(value) : Math.round(value * 100) / 100
}

export function formatPrice(value: number, currency: Currency, locale: string): string {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    // whole amounts without decimals, otherwise always two: 12 $, 9,60 $
    maximumFractionDigits: currency === "RUB" ? 0 : 2,
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}
