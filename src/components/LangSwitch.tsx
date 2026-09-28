"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"

export function LangSwitch({ locale, label, text }: { locale: Locale; label: string; text: string }) {
  const pathname = usePathname()
  const target: Locale = locale === "ru" ? "en" : "ru"
  const href = pathname.replace(/^\/(ru|en)(?=\/|$)/, `/${target}`)

  return (
    <Link
      href={href}
      aria-label={label}
      onClick={() => {
        document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`
      }}
      className="text-[13px] font-medium tracking-wide opacity-70 transition-opacity hover:opacity-100"
    >
      {text}
    </Link>
  )
}
