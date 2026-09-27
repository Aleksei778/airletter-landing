import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { getDictionary, isLocale } from "@/lib/i18n"
import { notFound } from "next/navigation"

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)

  return (
    <>
      <Header locale={lang} t={t} />
      <main className="relative z-[3]">{children}</main>
      <Footer locale={lang} t={t} />
    </>
  )
}
