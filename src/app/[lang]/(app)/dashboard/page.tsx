import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { Dashboard } from "@/components/dashboard/Dashboard"
import { getDictionary, isLocale } from "@/lib/i18n"
import type { PaidPlanId, Period } from "@/lib/plans"

export async function generateMetadata({ params }: PageProps<"/[lang]/dashboard">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await getDictionary(lang)
  return { title: t.dashboard.title }
}

export default async function DashboardPage({ params, searchParams }: PageProps<"/[lang]/dashboard">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)
  const { plan, period, gmail, gmail_error } = await searchParams

  return (
    <Dashboard
      locale={lang}
      t={t}
      initialPlan={plan === "standard" || plan === "premium" ? (plan as PaidPlanId) : undefined}
      initialPeriod={period === "year" || period === "month" ? (period as Period) : undefined}
      gmailResult={gmail === "connected" ? "connected" : typeof gmail_error === "string" ? gmail_error : undefined}
    />
  )
}
