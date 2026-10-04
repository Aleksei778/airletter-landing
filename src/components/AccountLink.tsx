"use client"

import Link from "next/link"
import { useEffect, useState, useSyncExternalStore } from "react"

import { api, SESSION_MARKER_COOKIE } from "@/lib/api"

const hasSession = () => document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_MARKER_COOKIE}=`))

// cookies have no change event: read once on the client, "signed out" on the server
const subscribe = () => () => {}

type Props = { locale: string; login: string; dashboard: string; sentToday: string }
type Info = { initial: string; sent: number; limit: number }

/**
 * "Sign in" for guests. Signed-in users get their monogram inside a ring that
 * fills up with today's sending, like a fuel gauge for the daily limit.
 */
export function AccountLink({ locale, login, dashboard, sentToday }: Props) {
  const signedIn = useSyncExternalStore(subscribe, hasSession, () => false)
  const [info, setInfo] = useState<Info | null>(null)

  useEffect(() => {
    if (!signedIn) return
    Promise.all([api.me(), api.subscription()])
      .then(([me, sub]) =>
        setInfo({
          initial: (me.first_name || me.email).trim().charAt(0).toUpperCase(),
          sent: sub.sent_today,
          limit: sub.daily_limit,
        }),
      )
      .catch(() => {})
  }, [signedIn])

  if (!signedIn) {
    return <Link href={`/${locale}/login`}>{login}</Link>
  }

  const share = info && info.limit > 0 ? Math.min(info.sent / info.limit, 1) : 0
  const title = info && info.limit > 0 ? `${dashboard} · ${sentToday} ${info.sent}/${info.limit}` : dashboard

  return (
    <Link
      href={`/${locale}/dashboard`}
      aria-label={title}
      title={title}
      className="group relative inline-grid size-9 place-items-center transition-transform duration-300 hover:scale-110"
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="16.5" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
        <circle
          cx="18"
          cy="18"
          r="16.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${share} 1`}
          className="transition-[stroke-dasharray] duration-700"
        />
      </svg>
      <span className="grid size-[26px] place-items-center rounded-full bg-paper font-head text-[12px] font-medium leading-none text-ink">
        {info?.initial ?? <PlaneMark />}
      </span>
    </Link>
  )
}

/** shown until the name loads */
function PlaneMark() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
      <path d="M2 10.4 22 2 9.4 13.3Z" />
      <path d="M22 2 11 14.6 15.6 21.6Z" />
    </svg>
  )
}
