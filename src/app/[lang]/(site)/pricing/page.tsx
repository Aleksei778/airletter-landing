import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { PricingCards } from "@/components/PricingCards"
import { getDictionary, isLocale } from "@/lib/i18n"

export async function generateMetadata({ params }: PageProps<"/[lang]/pricing">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await getDictionary(lang)
  return { title: t.pricing.title, description: t.pricing.lede }
}

export default async function PricingPage({ params }: PageProps<"/[lang]/pricing">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)

  return (
    <section className="px-[clamp(20px,4vw,48px)] pt-[clamp(140px,22vh,220px)] pb-[clamp(100px,16vh,180px)]">
      <div className="mx-auto max-w-[1240px]">
        <h1 className="h-display text-[clamp(44px,8vw,120px)]">{t.pricing.title}</h1>
        <p className="lede mt-8 mb-14 max-w-[46ch]">{t.pricing.lede}</p>
        <PricingCards locale={lang} t={t.pricing} />
      </div>
    </section>
  )
}
