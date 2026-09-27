import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { FlightScene } from "@/components/FlightScene"
import { LoginPanel } from "@/components/LoginPanel"
import { getDictionary, isLocale } from "@/lib/i18n"

export async function generateMetadata({ params }: PageProps<"/[lang]/login">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await getDictionary(lang)
  return { title: t.auth.title, robots: { index: false } }
}

export default async function LoginPage({ params, searchParams }: PageProps<"/[lang]/login">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)
  const { error, next } = await searchParams

  return (
    <>
      <FlightScene />
      <section className="relative z-[3] flex min-h-svh items-center px-[clamp(20px,4vw,48px)] py-32">
        <div className="panel w-full max-w-[560px] p-[clamp(24px,4vw,56px)]">
          <LoginPanel
            locale={lang}
            t={t.auth}
            error={typeof error === "string" ? error : undefined}
            next={typeof next === "string" ? next : undefined}
          />
        </div>
      </section>
    </>
  )
}
