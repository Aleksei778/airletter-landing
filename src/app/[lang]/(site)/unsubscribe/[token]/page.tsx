import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { UnsubscribePanel } from "@/components/UnsubscribePanel"
import { getDictionary, isLocale } from "@/lib/i18n"

export async function generateMetadata({ params }: PageProps<"/[lang]/unsubscribe/[token]">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await getDictionary(lang)
  return { title: t.unsubscribe.title, robots: { index: false } }
}

// the footer link of every email: /{lang}/unsubscribe/{token}
export default async function UnsubscribePage({ params }: PageProps<"/[lang]/unsubscribe/[token]">) {
  const { lang, token } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)

  return (
    <section className="flex min-h-svh items-center px-[clamp(20px,4vw,48px)] py-32">
      <div className="panel w-full max-w-[640px] p-[clamp(24px,4vw,56px)]">
        <UnsubscribePanel locale={lang} t={t.unsubscribe} token={token} />
      </div>
    </section>
  )
}
