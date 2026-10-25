import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Arrow } from "@/components/Arrow"
import { FlightScene } from "@/components/FlightScene"
import { PricingCards } from "@/components/PricingCards"
import { Reveal } from "@/components/Reveal"
import { ScrollToHash } from "@/components/ScrollToHash"
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
      <ScrollToHash />

      {/* content sits above the fixed scene and vignette */}
      <div className="relative z-[3]">
      {/* hero */}
      <section className={`flex min-h-svh flex-col justify-end ${pad} pb-[clamp(40px,8vh,80px)]`}>
        <Reveal as="p" className="mb-6 text-[clamp(14px,1.2vw,17px)] text-mute">
          {t.hero.eyebrow}
        </Reveal>
        <Reveal
          as="h1"
          delay={80}
          className="h-display max-w-[14ch] text-[clamp(44px,10.5vw,168px)] leading-[0.88]"
        >
          {t.hero.title}
        </Reveal>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-8">
          <Reveal
            as="p"
            delay={160}
            className="max-w-[36ch] text-[clamp(16px,1.4vw,19px)] leading-normal text-mute"
          >
            {t.hero.text}
          </Reveal>
          <Reveal as="div" delay={220} className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href={`/${lang}/login?mode=signup`} className="btn btn-ghost">
              {t.hero.start}
            </Link>
            <a href={site.extensionUrl} target="_blank" rel="noopener" className="btn">
              {t.hero.install} <Arrow />
            </a>
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className={`panel scroll-mt-20 ${pad} ${sectionY}`}>
        <div className="mx-auto max-w-[1240px]">
          <Reveal as="h2" className="h-section max-w-[16ch]">
            {t.route.title}
          </Reveal>
          <Reveal as="p" delay={80} className="lede mt-6 max-w-[42ch]">
            {t.route.lede}
          </Reveal>
          <ol className="mt-20 grid border-t border-line md:grid-cols-3">
            {t.route.legs.map((leg, i) => (
              <Reveal
                key={leg.title}
                as="li"
                delay={i * 100}
                className="relative pt-8 pb-10 md:pr-8 md:pb-0"
              >
                <span className="absolute -top-1 left-0 h-[7px] w-[7px] rounded-full bg-paper" />
                <small className="mb-[18px] block text-[13px] text-line">{leg.tag}</small>
                <h3 className="mb-3 font-head text-xl font-medium tracking-[-0.02em]">{leg.title}</h3>
                <p className="max-w-[32ch] text-[15px] leading-relaxed text-mute">{leg.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* features */}
      <section id="features" className={`panel scroll-mt-20 ${pad} ${sectionY}`}>
        <div className="mx-auto max-w-[1240px]">
          <Reveal as="h2" className="h-section mx-auto max-w-[16ch] text-center">
            {t.specs.title}
          </Reveal>
          <div className="mt-20 grid md:grid-cols-2">
            {t.specs.items.map((item, i) => (
              <Reveal
                key={item.title}
                as="div"
                delay={(i % 2) * 100}
                className={`border-t border-line py-8 md:py-10 ${i % 2 === 0 ? "md:border-r md:pr-10" : "md:pl-10"}`}
              >
                <h3 className="mb-3.5 font-head text-[clamp(22px,2.4vw,32px)] font-light tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="max-w-[40ch] leading-relaxed text-mute">{item.text}</p>
              </Reveal>
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
      <section id="pricing" className={`panel scroll-mt-20 ${pad} ${sectionY}`}>
        <div className="mx-auto max-w-[1240px]">
          <Reveal as="h2" className="h-section text-center">
            {t.pricing.title}
          </Reveal>
          <Reveal as="p" delay={80} className="lede mx-auto mt-6 mb-12 max-w-[46ch] text-center">
            {t.pricing.lede}
          </Reveal>
          <PricingCards locale={lang} t={t.pricing} />
        </div>
      </section>

      {/* faq */}
      <section id="faq" className={`panel scroll-mt-20 ${pad} ${sectionY}`}>
        <div className="mx-auto grid max-w-[1240px] gap-12 md:grid-cols-[1fr_2fr]">
          <Reveal as="h2" className="h-section text-center">
            {t.faq.title}
          </Reveal>
          <div className="border-t border-line">
            {t.faq.items.map((item, i) => (
              <Reveal
                key={item.q}
                as="details"
                delay={Math.min(i, 4) * 60}
                className="group border-b border-line py-6"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-head text-lg font-light tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="mt-1 text-mute transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 max-w-[60ch] leading-relaxed text-mute">{item.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* final call to action */}
      <section className={`flex min-h-[90vh] flex-col items-center justify-center text-center ${pad}`}>
        <Reveal as="h2" className="h-display mx-auto max-w-[12ch] text-[clamp(40px,8vw,120px)]">
          {t.cta.title}
        </Reveal>
        <Reveal as="p" delay={80} className="lede mt-7 mb-11">
          {t.cta.text}
        </Reveal>
        <Reveal as="div" delay={160} className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href={`/${lang}/login?mode=signup`} className="btn btn-ghost">
            {t.hero.start}
          </Link>
          <a href={site.extensionUrl} target="_blank" rel="noopener" className="btn">
            {t.hero.install} <Arrow />
          </a>
        </Reveal>
      </section>
      </div>
    </>
  )
}