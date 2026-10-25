"use client"

import type { MouseEvent, ReactNode } from "react"

import { scrollToId } from "@/lib/smoothScroll"

type Props = {
  href: string
  className?: string
  children: ReactNode
}

/**
 * A nav link to an in-page section (e.g. "/en#features"). A plain <a>, not
 * next/link: wrapping this in Link let the router's own hash handling
 * fight with ours. Smooth-scrolls by hand when the target section is
 * already on the current page; otherwise it's a normal link and navigates
 * there (ScrollToHash finishes the job once the new page has loaded).
 */
export function AnchorLink({ href, className, children }: Props) {
  const hashIndex = href.indexOf("#")
  const path = hashIndex === -1 ? href : href.slice(0, hashIndex)
  const id = hashIndex === -1 ? "" : href.slice(hashIndex + 1)

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!id || typeof window === "undefined") return
    if (window.location.pathname !== path) return // different page: let the browser navigate there

    if (scrollToId(id)) {
      e.preventDefault()
      history.pushState(null, "", href)
    }
  }

  return (
    <a href={href} className={className} onClick={handleClick}>
      {children}
    </a>
  )
}