"use client"

import Link from "next/link"
import { useSyncExternalStore } from "react"

import { SESSION_MARKER_COOKIE } from "@/lib/api"

const hasSession = () => document.cookie.split("; ").some((c) => c.startsWith(`${SESSION_MARKER_COOKIE}=`))

// cookies have no change event: read once on the client, "signed out" on the server
const subscribe = () => () => {}

/** "Sign in" for guests, a person icon + "Dashboard" once signed in */
export function AccountLink({ locale, login, dashboard }: { locale: string; login: string; dashboard: string }) {
  const signedIn = useSyncExternalStore(subscribe, hasSession, () => false)

  if (!signedIn) {
    return <Link href={`/${locale}/login`}>{login}</Link>
  }

  return (
    <Link href={`/${locale}/dashboard`} className="inline-flex items-center gap-2" aria-label={dashboard}>
      <PersonIcon />
      <span className="hidden sm:inline">{dashboard}</span>
    </Link>
  )
}

function PersonIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="13" cy="13" r="12.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="10.5" r="4" fill="currentColor" />
      <path d="M5.5 21.2c1.6-3.3 4.4-5 7.5-5s5.9 1.7 7.5 5" fill="currentColor" />
    </svg>
  )
}
