"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import { Arrow } from "@/components/Arrow"
import { api, ApiError, gmailConnectUrl, type Campaign, type GmailStatus, type Me, type Subscription } from "@/lib/api"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries/ru"
import type { PaidPlanId, Period } from "@/lib/plans"
import { site } from "@/lib/site"

import { Checkout } from "./Checkout"

type Data = { me: Me; sub: Subscription; campaigns: Campaign[]; gmail: GmailStatus }
type LoadResult = Data | "unauthorized" | "error"

async function loadAll(): Promise<LoadResult> {
  try {
    const [me, sub, list, gmail] = await Promise.all([api.me(), api.subscription(), api.campaigns(), api.gmail()])
    return { me, sub, campaigns: list.campaigns, gmail }
  } catch (e) {
    return e instanceof ApiError && e.status === 401 ? "unauthorized" : "error"
  }
}

type Props = {
  locale: Locale
  t: Dictionary
  // preselected from the pricing page: /dashboard?plan=standard&period=year
  initialPlan?: PaidPlanId
  initialPeriod?: Period
  // result of returning from Google's consent screen
  gmailResult?: "connected" | string
}

export function Dashboard({ locale, t, initialPlan, initialPeriod, gmailResult }: Props) {
  const router = useRouter()
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState(false)
  const d = t.dashboard

  const [reloadKey, setReloadKey] = useState(0)
  const reload = () => setReloadKey((k) => k + 1)

  const apply = useCallback(
    (result: LoadResult) => {
      if (result === "unauthorized") {
        const next = `${location.pathname}${location.search}`
        router.replace(`/${locale}/login?next=${encodeURIComponent(next)}`)
      } else if (result === "error") {
        setError(true)
      } else {
        setData(result)
        setError(false)
      }
    },
    [locale, router],
  )

  useEffect(() => {
    let alive = true
    loadAll().then((r) => alive && apply(r))
    return () => {
      alive = false
    }
  }, [apply, reloadKey])

  // refresh progress while something is being sent
  const active = data?.campaigns.some((c) => c.status === "sending" || c.status === "scheduled")
  useEffect(() => {
    if (!active) return
    const id = setInterval(() => loadAll().then(apply), 15_000)
    return () => clearInterval(id)
  }, [active, apply])

  if (error) {
    return (
      <div className="py-20">
        <p className="lede">{d.loadError}</p>
        <button
          onClick={() => {
            setError(false)
            reload()
          }}
          className="btn btn-ghost btn-sm mt-6"
        >
          {d.retry}
        </button>
      </div>
    )
  }
  if (!data) return <p className="lede py-20">{d.loading}</p>

  const { me, sub, campaigns, gmail } = data
  const dateFmt = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", { dateStyle: "medium" })
  const dateTimeFmt = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  })
  const usage = sub.daily_limit > 0 ? Math.min(sub.sent_today / sub.daily_limit, 1) : 0

  const cancel = async (c: Campaign) => {
    if (!confirm(d.cancelConfirm)) return
    await api.cancelCampaign(c.id).catch(() => {})
    reload()
  }

  return (
    <div className="space-y-20">
      {/* profile and plan */}
      <section className="grid gap-10 border-b border-line pb-14 md:grid-cols-[1fr_1fr]">
        <div className="flex items-center gap-5">
          {me.picture_url ? (
            // Google avatar; next/image would need remotePatterns for a single small image
            // eslint-disable-next-line @next/next/no-img-element
            <img src={me.picture_url} alt="" className="h-16 w-16 rounded-full grayscale" referrerPolicy="no-referrer" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-deep font-head text-xl">
              {(me.first_name || me.email || "?")[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-head text-[clamp(24px,3vw,36px)] font-medium tracking-[-0.03em]">
              {[me.first_name, me.last_name].filter(Boolean).join(" ") || me.email}
            </h1>
            <p className="mt-1 text-mute">{me.email}</p>
          </div>
        </div>

        <div>
          <p className="text-[13px] text-mute">{d.plan}</p>
          <p className="mt-2 font-head text-2xl font-medium tracking-[-0.02em]">
            {sub.plan ? t.pricing.plans[sub.plan].name : d.noPlan}
            {sub.end_at && (
              <span className="ml-3 font-body text-base font-light text-mute">
                {d.until} {dateFmt.format(new Date(sub.end_at))}
              </span>
            )}
          </p>
          {sub.plan && (
            <div className="mt-6">
              <div className="flex justify-between text-[13px] text-mute">
                <span>{d.sentToday}</span>
                <span className="tabular-nums">
                  {sub.sent_today} {d.of} {sub.daily_limit}
                </span>
              </div>
              <div className="mt-2 h-px bg-line">
                <div className="h-px bg-paper transition-[width]" style={{ width: `${usage * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gmail integration: emails are sent from the connected account */}
      <GmailCard t={d.gmail} status={gmail} result={gmailResult} onChange={reload} />

      {/* totals */}
      <section className="grid grid-cols-3 border-t border-line">
        {(["campaigns", "recipients", "sent"] as const).map((key, i) => (
          <div key={key} className={`pt-8 ${i > 0 ? "border-l border-line pl-[clamp(12px,3vw,40px)]" : ""}`}>
            <p className="text-[13px] text-mute">{d.totals[key]}</p>
            <p className="mt-3 font-head text-[clamp(28px,5vw,64px)] font-medium tracking-[-0.04em] tabular-nums">
              {me.totals[key].toLocaleString(locale)}
            </p>
          </div>
        ))}
      </section>

      {/* campaigns */}
      <section>
        <h2 className="h-section text-[clamp(28px,4vw,48px)]">{d.campaigns}</h2>
        {campaigns.length === 0 ? (
          <div className="mt-10 border-t border-line pt-10">
            <p className="lede max-w-[52ch]">{d.empty}</p>
            <a href={site.extensionUrl} target="_blank" rel="noopener" className="btn mt-8">
              {d.install} <Arrow />
            </a>
          </div>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="border-b border-line text-[13px] text-mute">
                  <th className="py-3 pr-4 font-normal">{d.columns.subject}</th>
                  <th className="py-3 pr-4 font-normal">{d.columns.status}</th>
                  <th className="py-3 pr-4 font-normal">{d.columns.progress}</th>
                  <th className="py-3 pr-4 font-normal">{d.columns.failed}</th>
                  <th className="py-3 pr-4 font-normal">{d.columns.date}</th>
                  <th className="py-3" />
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const progress = c.stats.total ? c.stats.sent / c.stats.total : 0
                  const cancellable = c.status === "scheduled" || c.status === "sending" || c.status === "paused"
                  return (
                    <tr key={c.id} className="border-b border-deep align-top">
                      <td className="max-w-[320px] py-5 pr-4">
                        <span className="line-clamp-2">{c.subject}</span>
                        {c.status === "paused" && c.pause_reason && (
                          <span className="mt-2 block text-[13px] text-mute">{d.pause[c.pause_reason]}</span>
                        )}
                      </td>
                      <td className="py-5 pr-4 whitespace-nowrap">
                        <StatusBadge status={c.status} label={d.status[c.status]} />
                      </td>
                      <td className="py-5 pr-4 whitespace-nowrap tabular-nums">
                        {c.stats.sent} / {c.stats.total}
                        <div className="mt-2 h-px w-24 bg-line">
                          <div className="h-px bg-paper" style={{ width: `${progress * 100}%` }} />
                        </div>
                      </td>
                      <td className="py-5 pr-4 tabular-nums text-mute">{c.stats.failed || "—"}</td>
                      <td className="py-5 pr-4 whitespace-nowrap text-mute">
                        {dateTimeFmt.format(new Date(c.scheduled_at))}
                      </td>
                      <td className="py-5 text-right">
                        {cancellable && (
                          <button onClick={() => cancel(c)} className="text-sm text-mute underline-offset-4 hover:text-paper hover:underline">
                            {d.cancel}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* payment */}
      <section id="upgrade" className="scroll-mt-24 border-t border-line pt-14">
        <h2 className="h-section text-[clamp(28px,4vw,48px)]">{d.upgradeTitle}</h2>
        <Checkout locale={locale} t={t} initialPlan={initialPlan} initialPeriod={initialPeriod} />
        <p className="mt-8 text-[13px] text-mute">
          <Link href={`/${locale}/pricing`} className="underline underline-offset-2 hover:text-paper">
            {t.pricing.more}
          </Link>
        </p>
      </section>
    </div>
  )
}

function StatusBadge({ status, label }: { status: Campaign["status"]; label: string }) {
  const style =
    status === "sending"
      ? "bg-paper text-ink"
      : status === "completed"
        ? "shadow-[inset_0_0_0_1px_var(--color-paper)]"
        : "text-mute shadow-[inset_0_0_0_1px_var(--color-line)]"
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {status === "sending" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />}
      {label}
    </span>
  )
}

function GmailCard({
  t,
  status,
  result,
  onChange,
}: {
  t: Dictionary["dashboard"]["gmail"]
  status: GmailStatus
  result?: string
  onChange: () => void
}) {
  const [busy, setBusy] = useState(false)
  const message =
    result === "connected" ? t.connected : result ? (t.errors[result as keyof typeof t.errors] ?? t.errors.server_error) : null

  const disconnect = async () => {
    if (!confirm(t.disconnectConfirm)) return
    setBusy(true)
    await api.disconnectGmail().catch(() => {})
    setBusy(false)
    onChange()
  }

  return (
    <section className="flex flex-col gap-6 border-b border-line pb-14 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[13px] text-mute">{t.title}</p>
        {status.connected ? (
          <p className="mt-2 text-lg">
            <span className="text-mute">{t.on} </span>
            {status.email}
          </p>
        ) : (
          <p className="mt-2 max-w-[56ch] text-lg">{t.off}</p>
        )}
        {message && (
          <p role="status" className="mt-3 border-l border-paper pl-4 text-sm">
            {message}
          </p>
        )}
      </div>
      {status.connected ? (
        <button onClick={disconnect} disabled={busy} className="btn btn-ghost btn-sm shrink-0">
          {t.disconnect}
        </button>
      ) : (
        <a href={gmailConnectUrl} className="btn shrink-0">
          {t.connect} <Arrow />
        </a>
      )}
    </section>
  )
}
