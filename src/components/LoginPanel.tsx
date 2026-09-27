"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { googleLoginUrl, refreshSession } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"

type Props = {
  locale: Locale
  t: Dictionary["auth"]
  error?: string
  next?: string
}

export function LoginPanel({ locale, t, error, next }: Props) {
  const router = useRouter()
  const [checking, setChecking] = useState(!error)
  // only same-site relative paths are allowed as a return target
  const target = next?.startsWith("/") && !next.startsWith("//") ? next : `/${locale}/dashboard`

  useEffect(() => {
    if (error) return
    // a valid refresh cookie means the user is already signed in
    refreshSession().then((ok) => {
      if (ok) router.replace(target)
      else setChecking(false)
    })
  }, [error, router, target])

  const errorText = error ? (t.errors[error as keyof typeof t.errors] ?? t.errors.server_error) : null

  return (
    <div className="w-full max-w-[440px]">
      <h1 className="h-display text-[clamp(44px,7vw,88px)]">{t.title}</h1>
      <p className="lede mt-6">{t.text}</p>

      {errorText && (
        <p role="alert" className="mt-8 border-l border-paper pl-4 text-sm">
          {errorText}
        </p>
      )}

      <a
        href={googleLoginUrl}
        aria-disabled={checking}
        className={`btn mt-10 w-full ${checking ? "pointer-events-none opacity-50" : ""}`}
      >
        <GoogleMark />
        {checking ? t.checking : t.google}
      </a>

      <p className="mt-6 text-[13px] leading-relaxed text-mute">
        {t.agree}{" "}
        <Link href={`/${locale}/terms`} className="underline underline-offset-2 hover:text-paper">
          {t.terms}
        </Link>{" "}
        {t.and}{" "}
        <Link href={`/${locale}/privacy`} className="underline underline-offset-2 hover:text-paper">
          {t.privacy}
        </Link>
        .
      </p>
    </div>
  )
}

// monochrome "G": the site is black and white
function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M21.35 11.1H12v2.98h5.35c-.23 1.4-1.64 4.1-5.35 4.1-3.22 0-5.85-2.67-5.85-5.96S8.78 6.26 12 6.26c1.83 0 3.06.78 3.76 1.45l2.57-2.47C16.68 3.7 14.54 2.8 12 2.8 6.92 2.8 2.8 6.92 2.8 12s4.12 9.2 9.2 9.2c5.31 0 8.83-3.73 8.83-8.99 0-.6-.07-1.06-.15-1.51Z" />
    </svg>
  )
}
