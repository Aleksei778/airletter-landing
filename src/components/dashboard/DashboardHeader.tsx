"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { LangSwitch } from "@/components/LangSwitch"
import { Logo } from "@/components/Logo"
import { api } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"

export function DashboardHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)

  const logout = async () => {
    setLeaving(true)
    await api.logout().catch(() => {})
    router.replace(`/${locale}`)
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-deep bg-ink/80 px-[clamp(20px,4vw,48px)] py-[18px] backdrop-blur">
      <div className="flex items-center gap-6">
        <Logo href={`/${locale}`} />
        <span className="hidden text-sm text-mute sm:inline">{t.dashboard.title}</span>
      </div>
      <nav className="flex items-center gap-6 text-sm">
        <LangSwitch locale={locale} label={t.lang.label} text={t.lang.switchTo} />
        <button onClick={logout} disabled={leaving} className="btn btn-ghost btn-sm">
          {t.dashboard.logout}
        </button>
      </nav>
    </header>
  )
}
