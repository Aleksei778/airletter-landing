import { notFound } from "next/navigation"

// unknown paths inside a locale render [lang]/not-found
export default function CatchAll() {
  notFound()
}
