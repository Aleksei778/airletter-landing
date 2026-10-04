import type { Locale } from "./i18n/config"
import { site } from "./site"

/**
 * "Иванов Иван Иванович, самозанятый, плательщик НПД, ИНН 123456789012", its
 * English version, or "" when not configured
 */
export function sellerLine(locale: Locale = "ru"): string {
  const { name, nameEn, inn, status } = site.seller
  if (!name || !inn) return ""
  if (locale === "en") return `${nameEn || name}, self-employed (Russian Federation), taxpayer ID ${inn}`
  return `${name}, ${status}, ИНН ${inn}`
}
