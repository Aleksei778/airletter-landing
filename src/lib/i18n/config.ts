export const locales = ["ru", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "ru"

// remembers the chosen language for the locale redirect in proxy.ts
export const LOCALE_COOKIE = "NEXT_LOCALE"

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
