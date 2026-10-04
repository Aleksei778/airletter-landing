import type { Metadata, Viewport } from "next"
import { Inter_Tight, Unbounded } from "next/font/google"
import { notFound } from "next/navigation"

import { getDictionary, isLocale, locales } from "@/lib/i18n"
import { site } from "@/lib/site"

import "../globals.css"

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "500", "700"],
  variable: "--font-unbounded",
})

const interTight = Inter_Tight({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-inter-tight",
})

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await getDictionary(lang)

  return {
    metadataBase: new URL(site.url),
    title: { default: t.meta.title, template: `%s – ${site.name}` },
    description: t.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { ru: "/ru", en: "/en" },
    },
    openGraph: { title: t.meta.title, description: t.meta.description, siteName: site.name, type: "website" },
  }
}

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()

  return (
    <html lang={lang} className={`${unbounded.variable} ${interTight.variable}`}>
      <body>
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
