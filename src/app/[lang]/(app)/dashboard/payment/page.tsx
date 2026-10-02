import { notFound } from "next/navigation"

import { PaymentResult } from "@/components/dashboard/PaymentResult"
import { getDictionary, isLocale } from "@/lib/i18n"

// return_url for YooKassa and Stripe: /{lang}/dashboard/payment?id=<payment id>
export default async function PaymentPage({ params, searchParams }: PageProps<"/[lang]/dashboard/payment">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)
  const { id } = await searchParams

  return <PaymentResult locale={lang} t={t.payment} paymentId={typeof id === "string" ? id : undefined} />
}
