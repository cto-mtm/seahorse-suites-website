export interface Attraction {
  slug: string
  key: string
  icon: string
  gradient: string
  label: string
  title: string
  tag: string
  distance: string
  body1: string
  body2: string
  highlights: string[]
}

const defs = [
  { slug: 'lighthouse', key: 'lighthouse', icon: 'i-lucide-tower-control', gradient: 'from-[var(--ss-ocean-300)] via-[var(--ss-ocean-500)] to-[var(--ss-ocean-800)]' },
  { slug: 'ding-darling', key: 'dingDarling', icon: 'i-lucide-bird', gradient: 'from-[var(--ss-ocean-500)] via-[var(--ss-ocean-700)] to-[var(--ss-ocean-950)]' },
  { slug: 'shelling', key: 'shelling', icon: 'i-lucide-shell', gradient: 'from-[var(--ss-sand-200)] via-[var(--ss-ocean-300)] to-[var(--ss-ocean-600)]' },
  { slug: 'magic-bus', key: 'magicBus', icon: 'i-lucide-ice-cream-cone', gradient: 'from-[var(--ss-ocean-200)] via-[var(--ss-ocean-400)] to-[var(--ss-ocean-700)]' },
  { slug: 'wickies', key: 'wickies', icon: 'i-lucide-utensils', gradient: 'from-[var(--ss-ocean-400)] via-[var(--ss-ocean-600)] to-[var(--ss-ocean-900)]' },
  { slug: 'emocean', key: 'emocean', icon: 'i-lucide-shopping-bag', gradient: 'from-[var(--ss-sand-300)] via-[var(--ss-ocean-400)] to-[var(--ss-ocean-800)]' }
] as const

/** Shared location data (homepage list + /explore/[slug] pages). Copy lives in i18n `Explore.*`. */
export function useAttractions() {
  const { t } = useI18n()

  return computed<Attraction[]>(() =>
    defs.map(({ slug, key, icon, gradient }) => ({
      slug,
      key,
      icon,
      gradient,
      label: t(`Explore.${key}Label`),
      title: t(`Explore.${key}Title`),
      tag: t(`Explore.${key}Tag`),
      distance: t(`Explore.${key}Distance`),
      body1: t(`Explore.${key}Body1`),
      body2: t(`Explore.${key}Body2`),
      highlights: [1, 2, 3].map(n => t(`Explore.${key}Highlight${n}`))
    }))
  )
}
