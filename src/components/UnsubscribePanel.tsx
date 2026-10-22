"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { Arrow } from "@/components/Arrow"
import { api, ApiError, type UnsubscribeInfo } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"

type State = "loading" | "ask" | "busy" | "done" | "invalid" | "error"

/** Confirms before unsubscribing: link scanners open every URL, so a GET must not unsubscribe */
export function UnsubscribePanel({ locale, t, token }: { locale: Locale; t: Dictionary["unsubscribe"]; token: string }) {
  const [state, setState] = useState<State>("loading")
  const [info, setInfo] = useState<UnsubscribeInfo | null>(null)

  useEffect(() => {
    api
      .unsubscribeInfo(token)
      .then((res) => {
        setInfo(res)
        setState(res.unsubscribed ? "done" : "ask")
      })
      .catch((err) => setState(err instanceof ApiError && err.status === 404 ? "invalid" : "error"))
  }, [token])

  const confirm = async () => {
    setState("busy")
    try {
      await api.unsubscribe(token)
      setState("done")
    } catch (err) {
      setState(err instanceof ApiError && err.status === 404 ? "invalid" : "error")
    }
  }

  const fill = (text: string) =>
    text.replace("{email}", info?.email ?? "").replace("{sender}", info?.sender || t.unknownSender)

  return (
    <div>
      <h1 className="h-display text-[clamp(40px,6vw,72px)]">{t.title}</h1>

      <p role="status" className="lede mt-6 break-words">
        {state === "loading" && <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-paper" />}
        {(state === "ask" || state === "busy") && fill(t.question)}
        {state === "done" && fill(t.done)}
        {state === "invalid" && t.invalid}
        {state === "error" && (info ? t.error : t.invalid)}
      </p>

      {(state === "ask" || state === "busy" || (state === "error" && info)) && (
        <button onClick={confirm} disabled={state === "busy"} className="btn mt-10 disabled:opacity-60">
          {t.confirm} <Arrow />
        </button>
      )}

      <p className="mt-10 text-[13px] text-mute">{t.note}</p>
      <Link href={`/${locale}`} className="mt-3 inline-block text-[13px] text-mute underline underline-offset-4 hover:text-paper">
        {t.home}
      </Link>
    </div>
  )
}
