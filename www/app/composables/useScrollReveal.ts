/**
 * Scroll-triggered entrance effects.
 * Observes all `.reveal` / `.reveal-scale` elements and adds
 * `.is-visible` when they enter the viewport (once).
 *
 * Usage: call useScrollReveal() in a page/layout setup; add the
 * `reveal` class (plus optional `reveal-delay-1..3`) to elements.
 */
export function useScrollReveal() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    document
      .querySelectorAll('.reveal, .reveal-scale')
      .forEach((el) => observer?.observe(el))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
