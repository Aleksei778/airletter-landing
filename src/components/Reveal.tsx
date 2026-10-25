"use client"

import { useEffect, useRef, useState, type ElementType, type JSX, type ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  as?: keyof JSX.IntrinsicElements
}

/**
 * Fades and slides its content up into place the first time it's on
 * screen — including things already in the viewport on first load (the
 * getBoundingClientRect check below catches those; IntersectionObserver
 * alone can be a frame late for them).
 */
export function Reveal({ children, className = "", delay = 0, duration = 900, as = "div" }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    )
    observer.observe(node)

    const rect = node.getBoundingClientRect()
    if (rect.top < innerHeight && rect.bottom > 0) {
      setVisible(true)
      observer.disconnect()
    }

    return () => observer.disconnect()
  }, [])

  const Comp = as as ElementType

  return (
    <Comp
      ref={ref}
      className={["reveal", visible && "reveal-visible", className].filter(Boolean).join(" ")}
      style={{ transitionDuration: `${duration}ms`, transitionDelay: delay ? `${delay}ms` : undefined }}
    >
      {children}
    </Comp>
  )
}