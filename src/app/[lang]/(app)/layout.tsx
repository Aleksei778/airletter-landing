import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { getDictionary, isLocale } from "@/lib/i18n"

export const metadata: Metadata = { robots: { index: false } }

export default async function AppLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)

  return (
    <>
      <DashboardHeader locale={lang} t={t} />
      <main className="relative z-[3] px-[clamp(20px,4vw,48px)] pt-[clamp(40px,8vh,80px)] pb-32">
        <div className="mx-auto max-w-[1240px]">{children}</div>
      </main>
    </>
  )
}
