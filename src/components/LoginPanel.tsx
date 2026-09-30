"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { api, ApiError, refreshSession } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"

type Mode = "signin" | "signup"

type Props = {
  locale: Locale
  t: Dictionary["auth"]
  initialMode?: Mode
  next?: string
}

export function LoginPanel({ locale, t, initialMode = "signin", next }: Props) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>(initialMode)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // only same-site relative paths are allowed as a return target
  const target = next?.startsWith("/") && !next.startsWith("//") ? next : `/${locale}/dashboard`
  const fromExtension = target.startsWith("/api/auth/extension/")

  // backend paths (the extension sign-in flow) need a full page load
  const go = () => (target.startsWith("/api/") ? window.location.assign(target) : router.replace(target))

  useEffect(() => {
    // a valid refresh cookie means the user is already signed in
    refreshSession().then((ok) => {
      if (ok) go()
      else setChecking(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const login = String(form.get("login") ?? "")
    const password = String(form.get("password") ?? "")

    setBusy(true)
    setError(null)
    try {
      if (mode === "signup") await api.register({ login, password, name: String(form.get("name") ?? "") })
      else await api.login({ login, password })
      go()
    } catch (err) {
      const code = err instanceof ApiError ? err.code : undefined
      setError(t.errors[code as keyof typeof t.errors] ?? t.errors.server_error)
      setBusy(false)
    }
  }

  const switchMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setError(null)
  }

  const field = "mt-2 w-full rounded-xl bg-deep px-4 py-3.5 text-[15px] shadow-[inset_0_0_0_1px_var(--color-line)] outline-none transition-shadow placeholder:text-line focus:shadow-[inset_0_0_0_1px_var(--color-paper)]"

  return (
    <div className="w-full max-w-[440px]">
      <h1 className="h-display text-[clamp(44px,7vw,88px)]">{mode === "signin" ? t.signInTitle : t.signUpTitle}</h1>
      <p className="lede mt-6">{fromExtension ? t.extension : mode === "signin" ? t.signInText : t.signUpText}</p>

      <form onSubmit={submit} className="mt-10 space-y-5" noValidate={false}>
        {mode === "signup" && (
          <label className="block">
            <span className="text-[13px] text-mute">{t.name}</span>
            <input name="name" autoComplete="given-name" placeholder={t.namePlaceholder} className={field} />
          </label>
        )}
        <label className="block">
          <span className="text-[13px] text-mute">{t.login}</span>
          <input
            name="login"
            required
            autoComplete="username"
            inputMode="email"
            placeholder={t.loginPlaceholder}
            className={field}
          />
        </label>
        <label className="block">
          <span className="text-[13px] text-mute">{t.password}</span>
          <input
            name="password"
            type="password"
            required
            minLength={mode === "signup" ? 8 : undefined}
            maxLength={72}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder={mode === "signup" ? t.passwordHint : undefined}
            className={field}
          />
        </label>

        {error && (
          <p role="alert" className="border-l border-paper pl-4 text-sm">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy || checking} className="btn w-full">
          {checking ? t.checking : mode === "signin" ? t.submitSignIn : t.submitSignUp}
        </button>
      </form>

      <button onClick={switchMode} className="mt-6 text-sm text-mute underline-offset-4 hover:text-paper hover:underline">
        {mode === "signin" ? t.toSignUp : t.toSignIn}
      </button>

      <p className="mt-8 text-[13px] leading-relaxed text-mute">
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
