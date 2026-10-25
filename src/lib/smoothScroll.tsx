function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/** Animates window.scrollY to targetY by hand, instead of relying on the
 *  browser's native smooth scroll (CSS `scroll-behavior` / `scrollIntoView`),
 *  which Next's client-side router doesn't always hand off to cleanly. */
export function smoothScrollTo(targetY: number, duration = 700) {
  const startY = window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    window.scrollTo(0, startY + distance * easeInOutCubic(progress))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

// the fixed header covers roughly this much of the viewport
const HEADER_OFFSET = 90

/** Scrolls to the element with this id, clearing the fixed header.
 *  Returns false (and does nothing) if no such element exists. */
export function scrollToId(id: string, headerOffset = HEADER_OFFSET): boolean {
  const el = document.getElementById(id)
  if (!el) return false
  const targetY = el.getBoundingClientRect().top + window.scrollY - headerOffset
  smoothScrollTo(targetY)
  return true
}