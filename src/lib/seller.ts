import { site } from "./site"

/** "Иванов Иван Иванович, самозанятый, плательщик НПД, ИНН 123456789012" or "" when not configured */
export function sellerLine(): string {
  const { name, inn, status } = site.seller
  if (!name || !inn) return ""
  return `${name}, ${status}, ИНН ${inn}`
}
