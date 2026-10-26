import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { SheetPicker } from "@/components/SheetPicker"
import { getDictionary, isLocale } from "@/lib/i18n"

export async function generateMetadata({ params }: PageProps<"/[lang]/sheets/pick">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await getDictionary(lang)
  return { title: t.sheetsPicker.title, robots: { index: false } }
}

// opened by the extension in a popup window to choose a spreadsheet in Google Drive
export default async function SheetPickerPage({ params }: PageProps<"/[lang]/sheets/pick">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)

  return (
    <section className="flex min-h-svh items-center px-[clamp(20px,4vw,48px)] py-16">
      <div className="panel w-full max-w-[640px] p-[clamp(24px,4vw,56px)]">
        <SheetPicker locale={lang} t={t.sheetsPicker} />
      </div>
    </section>
  )
}
