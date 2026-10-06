import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Arrow } from "@/components/Arrow"
import { FlightScene } from "@/components/FlightScene"
import { PricingCards } from "@/components/PricingCards"
import { getDictionary, isLocale } from "@/lib/i18n"
import { pageMetadata } from "@/lib/seo"
import { site } from "@/lib/site"

const pad = "px-[clamp(20px,4vw,48px)]"
const sectionY = "py-[clamp(100px,16vh,180px)]"

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const t = await getDictionary(lang)
  return {
    ...pageMetadata(lang, "", { title: t.meta.title, description: t.meta.description }),
    // the home title already names the product, skip the "– Airletter" template
    title: { absolute: t.meta.title },
  }
}

// lets Google show the site name and logo in search results
function structuredData(lang: string, description: string) {
  const url = new URL(`/${lang}`, site.url).toString()
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${site.url}/#website`, name: site.name, url, inLanguage: lang },
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url,
        logo: new URL("/apple-icon.png", site.url).toString(),
        description,
        ...(site.supportEmail && { email: site.supportEmail }),
      },
    ],
  }
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const t = await getDictionary(lang)

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output is safe here: no user input, "<" is escaped below
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(lang, t.meta.description)).replace(/</g, "\\u003c"),
        }}
      />
      <FlightScene />

      {/* content sits above the fixed scene and vignette */}
      <div className="relative z-[3]">
      {/* hero */}
      <section className={`flex min-h-svh flex-col justify-end ${pad} pb-[clamp(40px,8vh,80px)]`}>
        <p className="mb-6 text-[clamp(14px,1.2vw,17px)] text-mute">{t.hero.eyebrow}</p>
        <h1 className="h-display max-w-[14ch] text-[clamp(44px,10.5vw,168px)] leading-[0.88]">{t.hero.title}</h1>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <p className="max-w-[36ch] text-[clamp(16px,1.4vw,19px)] leading-normal text-mute">{t.hero.text}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={`/${lang}/login?mode=signup`} className="btn btn-ghost">
              {t.hero.start}
            </Link>
            <a href={site.extensionUrl} target="_blank" rel="noopener" className="btn">
              {t.hero.install} <Arrow />
            </a>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className={`panel scroll-mt-10 ${pad} ${sectionY}`}>
        <div className="mx-auto max-w-[1240px]">
          <h2 className="h-section max-w-[16ch]">{t.route.title}</h2>
          <p className="lede mt-6 max-w-[42ch]">{t.route.lede}</p>
          <ol className="mt-20 grid border-t border-line md:grid-cols-3">
            {t.route.legs.map((leg) => (
              <li key={leg.title} className="relative pt-8 pb-10 md:pr-8 md:pb-0">
                <span className="absolute -top-1 left-0 h-[7px] w-[7px] rounded-full bg-paper" />
                <small className="mb-[18px] block text-[13px] text-line">{leg.tag}</small>
                <h3 className="mb-3 font-head text-xl font-medium tracking-[-0.02em]">{leg.title}</h3>
                <p className="max-w-[32ch] text-[15px] leading-relaxed text-mute">{leg.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* features */}
      <section id="features" className={`panel scroll-mt-10 ${pad} ${sectionY}`}>
        <div className="mx-auto max-w-[1240px]">
          <h2 className="h-section max-w-[16ch]">{t.specs.title}</h2>
          <div className="mt-20 grid md:grid-cols-2">
            {t.specs.items.map((item, i) => (
              <div
                key={item.title}
                className={`border-t border-line py-8 md:py-10 ${i % 2 === 0 ? "md:border-r md:pr-10" : "md:pl-10"}`}
              >
                <h3 className="mb-3.5 font-head text-[clamp(22px,2.4vw,32px)] font-light tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="max-w-[40ch] leading-relaxed text-mute">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-8 text-[15px]">
            <span className="rounded-full px-3 py-1 text-xs font-medium shadow-[inset_0_0_0_1px_var(--color-line)]">
              {t.specs.soon}
            </span>
            {t.specs.soonItems.map((s) => (
              <span key={s} className="text-mute">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* pricing */}
      <section id="pricing" className={`panel scroll-mt-10 ${pad} ${sectionY}`}>
        <div className="mx-auto max-w-[1240px]">
          <h2 className="h-section">{t.pricing.title}</h2>
          <p className="lede mt-6 mb-12 max-w-[46ch]">{t.pricing.lede}</p>
          <PricingCards locale={lang} t={t.pricing} />
        </div>
      </section>

      {/* faq */}
      <section id="faq" className={`panel scroll-mt-10 ${pad} ${sectionY}`}>
        <div className="mx-auto grid max-w-[1240px] gap-12 md:grid-cols-[1fr_2fr]">
          <h2 className="h-section">{t.faq.title}</h2>
          <div className="border-t border-line">
            {t.faq.items.map((item) => (
              <details key={item.q} className="group border-b border-line py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-head text-lg font-light tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="mt-1 text-mute transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-[60ch] leading-relaxed text-mute">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* final call to action */}
      <section className={`flex min-h-[90vh] flex-col items-center justify-center text-center ${pad}`}>
        <h2 className="h-display mx-auto max-w-[12ch] text-[clamp(40px,8vw,120px)]">{t.cta.title}</h2>
        <p className="lede mt-7 mb-11">{t.cta.text}</p>
        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href={`/${lang}/login?mode=signup`} className="btn btn-ghost">
            {t.hero.start}
          </Link>
          <a href={site.extensionUrl} target="_blank" rel="noopener" className="btn">
            {t.hero.install} <Arrow />
          </a>
        </div>
      </section>
      </div>
    </>
  )
}
