import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { getDictionary, isLocale, locales } from "@/lib/i18n"
import { site } from "@/lib/site"

// link preview in search results, messengers and social networks
export const alt = "Airletter"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

// the landing's colors from globals.css
const ink = "#000"
const paper = "#fff"
const mute = "#8a8a8a"
const line = "#3a3a3a"

// static TTF files: next/og cannot read woff2 or variable fonts, and these
// include Cyrillic
const font = (file: string) => readFile(join(process.cwd(), "src/assets/fonts", file))

export default async function OpengraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const t = await getDictionary(isLocale(lang) ? lang : "ru")
  // "Airletter – personal emails from your own Gmail" -> "Personal emails from your own Gmail"
  const tagline = t.meta.title.split(" – ")[1] ?? ""
  const subtitle = tagline.charAt(0).toUpperCase() + tagline.slice(1)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: ink,
          color: paper,
          fontFamily: "Inter Tight",
        }}
      >
        {/* flight path from the hero, ending with the plane */}
        <svg width="620" height="330" viewBox="0 0 620 330" style={{ position: "absolute", top: 40, right: 40 }}>
          <path d="M40 190 C 210 180, 370 130, 560 50" fill="none" stroke={line} strokeWidth="3" strokeDasharray="4 14" strokeLinecap="round" />
          <g transform="translate(548 18) rotate(8) scale(2.4)">
            <path d="M2 10.4 22 2 9.4 13.3Z" fill={paper} />
            <path d="M22 2 11 14.6 15.6 21.6Z" fill={paper} />
            <path d="M11 14.6 10.2 20.6 13.3 18.1Z" fill={mute} />
          </g>
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <rect width="32" height="32" rx="7" fill={paper} />
            <g transform="translate(3.9 4.3)">
              <path d="M2 10.4 22 2 9.4 13.3Z" fill={ink} />
              <path d="M22 2 11 14.6 15.6 21.6Z" fill={ink} />
              <path d="M11 14.6 10.2 20.6 13.3 18.1Z" fill={mute} />
            </g>
          </svg>
          <span style={{ fontFamily: "Unbounded", fontSize: 34, letterSpacing: "-0.03em" }}>{site.name}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div
            style={{
              fontFamily: "Unbounded",
              fontSize: 116,
              lineHeight: 0.92,
              // looser than the site's -0.055em: next/og renders it tighter than browsers
              letterSpacing: "-0.03em",
              maxWidth: 980,
            }}
          >
            {t.hero.title}
          </div>
          <div style={{ fontSize: 36, color: mute, maxWidth: 900 }}>{subtitle}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Unbounded", data: await font("Unbounded-Bold.ttf"), weight: 700 },
        { name: "Inter Tight", data: await font("InterTight-Regular.ttf"), weight: 400 },
      ],
    },
  )
}
