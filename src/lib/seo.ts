import type { Metadata } from "next"

import { locales, type Locale } from "@/lib/i18n/config"
import { site } from "@/lib/site"

// public pages, without the locale prefix; "" is the home page
export const publicPaths = ["", "/pricing", "/privacy", "/terms"] as const
export type PublicPath = (typeof publicPaths)[number]

const ogLocale: Record<Locale, string> = { ru: "ru_RU", en: "en_US" }

/**
 * Every language version of a page. x-default is the unprefixed path:
 * proxy.ts redirects it by the browser language.
 */
export function languageAlternates(path: PublicPath): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
    "x-default": path || "/",
  }
}

/**
 * Canonical URL, hreflang alternates and Open Graph for a public page.
 * Next replaces alternates and openGraph of the layout as a whole, so every
 * page has to set them itself: otherwise all pages point to the home page.
 */
export function pageMetadata(
  lang: Locale,
  path: PublicPath,
  { title, description }: { title?: string; description?: string },
): Metadata {
  return {
    ...(title && { title }),
    ...(description && { description }),
    alternates: { canonical: `/${lang}${path}`, languages: languageAlternates(path) },
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      url: `/${lang}${path}`,
      siteName: site.name,
      type: "website",
      locale: ogLocale[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => ogLocale[l]),
    },
  }
}
