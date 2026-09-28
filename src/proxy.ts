import { NextResponse, type NextRequest } from "next/server"

import { isLocale, LOCALE_COOKIE, type Locale } from "@/lib/i18n/config"

// Languages whose speakers most likely prefer the Russian version
const RU_LIKE = ["ru", "uk", "be", "kk"]

function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value
  if (saved && isLocale(saved)) return saved

  const header = request.headers.get("accept-language") ?? ""
  const primary = header.split(",")[0]?.trim().slice(0, 2).toLowerCase()
  return RU_LIKE.includes(primary) ? "ru" : "en"
}

/** Adds the locale prefix to paths that don't have one: /pricing -> /ru/pricing */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const first = pathname.split("/")[1] ?? ""
  if (isLocale(first)) return

  const locale = detectLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  url.search = search
  return NextResponse.redirect(url)
}

export const config = {
  // skip API proxy, Next internals and files with an extension
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
