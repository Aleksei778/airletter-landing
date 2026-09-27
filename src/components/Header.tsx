import Link from "next/link"

import type { Dictionary, Locale } from "@/lib/i18n"

import { LangSwitch } from "./LangSwitch"
import { Logo } from "./Logo"

export function Header({ locale, t }: { locale: Locale; t: Dictionary }) {
  const home = `/${locale}`

  return (
    <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-[clamp(20px,4vw,48px)] py-[22px] mix-blend-difference">
      <Logo href={home} />
      <nav className="flex items-center gap-7 text-sm">
        <Link href={`${home}#how`} className="hidden opacity-70 transition-opacity hover:opacity-100 md:inline">
          {t.nav.how}
        </Link>
        <Link href={`${home}#features`} className="hidden opacity-70 transition-opacity hover:opacity-100 md:inline">
          {t.nav.features}
        </Link>
        <Link href={`${home}/pricing`} className="hidden opacity-70 transition-opacity hover:opacity-100 md:inline">
          {t.nav.pricing}
        </Link>
        <Link href={`${home}#faq`} className="hidden opacity-70 transition-opacity hover:opacity-100 lg:inline">
          {t.nav.faq}
        </Link>
        <LangSwitch locale={locale} label={t.lang.label} text={t.lang.switchTo} />
        <Link href={`${home}/login`} className="opacity-100">
          {t.nav.login}
        </Link>
      </nav>
    </header>
  )
}
