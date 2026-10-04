import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { LegalPage } from "@/components/LegalPage"
import { terms } from "@/content/legal"
import { isLocale } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  return pageMetadata(lang, "/terms", { title: terms(lang).title })
}

export default async function TermsPage({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const doc = terms(lang)

  return (
    <LegalPage title={doc.title} updated={doc.updated}>
      {doc.body}
    </LegalPage>
  )
}
