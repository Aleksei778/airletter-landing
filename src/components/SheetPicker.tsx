"use client"

import { useEffect, useState } from "react"

import { Arrow } from "@/components/Arrow"
import { api, ApiError } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"
import { site } from "@/lib/site"

type State = "loading" | "open" | "picked" | "cancelled" | "invalid" | "reauth" | "error"

type Session = { access_token: string; api_key: string; app_id: string }

// The parts of the Google Picker API this page uses
type PickerData = { action: string; docs?: { id: string; name: string }[] }
type Picker = { setVisible(v: boolean): void }
type DocsView = { setMode(mode: string): DocsView; setFileIds(ids: string): DocsView }
type PickerBuilder = {
  addView(view: DocsView): PickerBuilder
  setOAuthToken(token: string): PickerBuilder
  setDeveloperKey(key: string): PickerBuilder
  setAppId(id: string): PickerBuilder
  setLocale(locale: string): PickerBuilder
  enableFeature(feature: string): PickerBuilder
  setCallback(cb: (data: PickerData) => void): PickerBuilder
  build(): Picker
}
type PickerNS = {
  Action: { PICKED: string; CANCEL: string }
  ViewId: { SPREADSHEETS: string }
  DocsViewMode: { LIST: string }
  Feature: { SUPPORT_DRIVES: string }
  DocsView: new (viewId: string) => DocsView
  PickerBuilder: new () => PickerBuilder
}

declare global {
  interface Window {
    gapi?: { load(lib: string, cb: () => void): void }
    google?: { picker?: PickerNS }
    // present when the extension lists this site in externally_connectable
    chrome?: { runtime?: { sendMessage(extensionId: string, message: unknown): Promise<unknown> } }
  }
}

function loadPicker(): Promise<PickerNS> {
  return new Promise((resolve, reject) => {
    const ready = () => window.gapi!.load("picker", () => resolve(window.google!.picker!))
    if (window.gapi) return ready()
    const script = document.createElement("script")
    script.src = "https://apis.google.com/js/api.js"
    script.onload = ready
    script.onerror = () => reject(new Error("failed to load the Google API script"))
    document.head.appendChild(script)
  })
}

/** Tells the extension, which opened this window, what the user chose */
function notifyExtension(message: { type: "SHEET_PICKED"; id: string; name: string } | { type: "SHEET_PICK_CANCELLED" }) {
  window.chrome?.runtime?.sendMessage(site.extensionId, message)?.catch(() => {})
}

/**
 * Google Picker for importing recipients. With the drive.file scope, choosing
 * a file here is what lets Airletter read it. Opened by the extension as
 * /{lang}/sheets/pick?id={spreadsheet}#code={one-time code}.
 */
export function SheetPicker({ locale, t }: { locale: Locale; t: Dictionary["sheetsPicker"] }) {
  const [state, setState] = useState<State>("loading")
  const [picked, setPicked] = useState("")
  const [picker, setPicker] = useState<Picker | null>(null)

  useEffect(() => {
    const start = async (code: string, fileId: string) => {
      let session: Session
      try {
        // without a code the window was opened by hand or reloaded
        session = await (code ? api.pickerToken(code) : Promise.reject(new ApiError(401, "no code")))
      } catch (err) {
        const reauth = err instanceof ApiError && err.code === "reauth_required"
        setState(reauth ? "reauth" : err instanceof ApiError && err.status === 401 ? "invalid" : "error")
        return
      }

      let g: PickerNS
      try {
        g = await loadPicker()
      } catch {
        setState("error")
        return
      }

      const view = new g.DocsView(g.ViewId.SPREADSHEETS).setMode(g.DocsViewMode.LIST)
      // a link pasted in the extension opens the Picker on that very file
      if (fileId) view.setFileIds(fileId)

      let builder = new g.PickerBuilder()
        .addView(view)
        .setOAuthToken(session.access_token)
        .setAppId(session.app_id)
        .setLocale(locale)
        .enableFeature(g.Feature.SUPPORT_DRIVES)
        .setCallback((data) => {
          if (data.action === g.Action.PICKED && data.docs?.[0]) {
            const doc = data.docs[0]
            setPicked(doc.name)
            setState("picked")
            notifyExtension({ type: "SHEET_PICKED", id: doc.id, name: doc.name })
          } else if (data.action === g.Action.CANCEL) {
            setState("cancelled")
          }
        })
      if (session.api_key) builder = builder.setDeveloperKey(session.api_key)

      const p = builder.build()
      setPicker(p)
      setState("open")
      p.setVisible(true)
    }

    // the code is single-use: take it out of the address bar and history
    const code = new URLSearchParams(window.location.hash.slice(1)).get("code") ?? ""
    const fileId = new URLSearchParams(window.location.search).get("id") ?? ""
    history.replaceState(null, "", window.location.pathname + window.location.search)
    start(code, fileId)
  }, [locale])

  const message = {
    loading: t.loading,
    open: t.hint,
    picked: t.picked.replace("{name}", picked),
    cancelled: t.cancelled,
    invalid: t.invalid,
    reauth: t.reauth,
    error: t.error,
  }[state]

  return (
    <div>
      <h1 className="h-display text-[clamp(32px,5vw,56px)]">{t.title}</h1>

      <p role="status" className="lede mt-6 break-words">
        {state === "loading" && <span className="mr-3 inline-block h-2 w-2 animate-pulse rounded-full bg-paper" />}
        {message}
      </p>
      {state !== "open" && state !== "loading" && state !== "picked" && (
        <p className="mt-4 text-[13px] text-mute">{t.hint}</p>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        {state === "cancelled" && picker && (
          <button
            onClick={() => {
              setState("open")
              picker.setVisible(true)
            }}
            className="btn"
          >
            {t.reopen} <Arrow />
          </button>
        )}
        {(state === "cancelled" || state === "invalid" || state === "reauth" || state === "error") && (
          <button
            onClick={() => {
              notifyExtension({ type: "SHEET_PICK_CANCELLED" })
              window.close()
            }}
            className="text-[13px] text-mute underline underline-offset-4 hover:text-paper"
          >
            {t.close}
          </button>
        )}
      </div>
    </div>
  )
}
