// Browser client for the Go API, proxied through /api on this origin.
// Auth lives in httpOnly cookies set by the backend; on 401 the access
// token is refreshed once (shared by concurrent requests) and the request retried.

import type { Period, PlanId, Provider } from "./plans"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message)
  }
}

let refreshing: Promise<boolean> | null = null

/** Refreshes the session using the refresh cookie. Returns false if the user must sign in again. */
export function refreshSession(): Promise<boolean> {
  refreshing ??= fetch("/api/auth/refresh", { method: "POST", credentials: "same-origin" })
    .then((res) => res.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const doFetch = () =>
    fetch(`/api${path}`, {
      ...init,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...init.headers },
    })

  let res = await doFetch()
  if (res.status === 401 && (await refreshSession())) {
    res = await doFetch()
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, body.error ?? res.statusText, body.code)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// ---- types mirror backend responses ----

export type Me = {
  email: string
  first_name: string
  last_name: string
  picture_url: string
  totals: { campaigns: number; recipients: number; sent: number }
}

export type Subscription = {
  plan: PlanId | null
  end_at: string | null
  daily_limit: number
  sent_today: number
}

export type CampaignStatus = "scheduled" | "sending" | "completed" | "paused" | "cancelled"

export type Campaign = {
  id: number
  subject: string
  status: CampaignStatus
  pause_reason?: "reauth_required" | "no_subscription"
  scheduled_at: string
  started_at: string | null
  finished_at: string | null
  created_at: string
  stats: { total: number; pending: number; sent: number; failed: number }
}

export type PaymentStatus = "pending" | "succeeded" | "canceled"

export type CreatedPayment = { payment_id: string; confirmation_url: string }

export const api = {
  me: () => request<Me>("/me"),
  subscription: () => request<Subscription>("/subscription/current"),
  campaigns: (limit = 50) => request<{ campaigns: Campaign[] }>(`/campaigns?limit=${limit}`),
  cancelCampaign: (id: number) => request<void>(`/campaigns/${id}/cancel`, { method: "POST" }),
  logout: () => request<void>("/auth/logout", { method: "POST" }),

  createPayment: (body: { plan: Exclude<PlanId, "trial">; period: Period; provider: Provider; locale: string }) =>
    request<CreatedPayment>("/payments", { method: "POST", body: JSON.stringify(body) }),
  payment: (id: string) => request<{ status: PaymentStatus; plan: PlanId; period: Period }>(`/payments/${id}`),
}

/** Google sign-in starts with a full-page navigation, not fetch */
export const googleLoginUrl = "/api/auth/google/login?source=website"
