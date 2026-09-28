import "server-only"

import type { Locale } from "./config"
import type { Dictionary } from "./dictionaries/ru"

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import("./dictionaries/ru").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
}

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}

export type { Dictionary }
export * from "./config"
