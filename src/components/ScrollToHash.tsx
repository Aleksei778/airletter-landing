"use client"

import { useEffect } from "react"

import { scrollToId } from "@/lib/smoothScroll"

/**
 * When the page first loads with a #hash in the URL (a direct link, or a
 * navigation from another page via AnchorLink), the browser jumps to it
 * instantly before any JS runs. This cancels that jump and redoes it with
 * the same hand-rolled smooth scroll the header uses.
 */
export function ScrollToHash() {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return

    window.scrollTo(0, 0)
    requestAnimationFrame(() => scrollToId(id))
  }, [])

  return null
}