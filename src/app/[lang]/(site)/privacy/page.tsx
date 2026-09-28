import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/LegalPage"
import { privacy } from "@/content/legal"
import { isLocale } from "@/lib/i18n"

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return { title: privacy(lang).title }
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const doc = privacy(lang)

  return (
    <LegalPage title={doc.title} updated={doc.updated}>
      {doc.body}
    </LegalPage>
  )
}
