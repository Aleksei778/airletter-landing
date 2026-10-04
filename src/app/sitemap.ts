import type { MetadataRoute } from "next"

import { locales } from "@/lib/i18n/config"
import { languageAlternates, publicPaths } from "@/lib/seo"
import { site } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const abs = (path: string) => new URL(path, site.url).toString()

  return publicPaths.flatMap((path) =>
    locales.map((lang) => ({
      url: abs(`/${lang}${path}`),
      changeFrequency: path === "" || path === "/pricing" ? "weekly" : "yearly",
      priority: path === "" ? 1 : path === "/pricing" ? 0.8 : 0.3,
      alternates: {
        languages: Object.fromEntries(Object.entries(languageAlternates(path)).map(([l, p]) => [l, abs(p)])),
      },
    })),
  )
}
