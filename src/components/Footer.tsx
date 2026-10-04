import Link from "next/link"

import type { Dictionary, Locale } from "@/lib/i18n"
import { sellerLine } from "@/lib/seller"
import { site } from "@/lib/site"

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  // seller details: required by YooKassa, and Google verification asks for contacts
  const seller = sellerLine(locale)

  return (
    <footer className="relative z-[3] border-t border-deep bg-ink px-[clamp(20px,4vw,48px)] py-7 text-[13px] text-line">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <span>
        © {new Date().getFullYear()} {t.footer.rights}
      </span>
      <nav className="flex flex-wrap gap-6">
        <Link href={`/${locale}/privacy`} className="transition-colors hover:text-paper">
          {t.footer.privacy}
        </Link>
        <Link href={`/${locale}/terms`} className="transition-colors hover:text-paper">
          {t.footer.terms}
        </Link>
        {site.supportEmail && (
          <a href={`mailto:${site.supportEmail}`} className="transition-colors hover:text-paper">
            {t.footer.contact}
          </a>
        )}
      </nav>
      <span>{t.footer.notAffiliated}</span>
      </div>
      {seller && (
        <p className="mt-4 border-t border-deep pt-4">
          {seller}
          {site.supportEmail && <> · {site.supportEmail}</>}
        </p>
      )}
    </footer>
  )
}
