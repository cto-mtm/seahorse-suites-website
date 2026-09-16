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
  /** Official business website (from app.config → explore.websites); '' hides the link. */
  website: string
}

// Order matters: EmOcean (owned by the property's family) leads, followed by
// the other around-the-corner local spots, then the island's nature stops.
const defs = [
  { slug: 'emocean', key: 'emocean', icon: 'i-lucide-shopping-bag', gradient: 'from-[var(--ss-sand-300)] via-[var(--ss-ocean-400)] to-[var(--ss-ocean-800)]' },
  { slug: 'bel-deli', key: 'belDeli', icon: 'i-lucide-sandwich', gradient: 'from-[var(--ss-sand-200)] via-[var(--ss-ocean-400)] to-[var(--ss-ocean-700)]' },
  { slug: 'wickies', key: 'wickies', icon: 'i-lucide-utensils', gradient: 'from-[var(--ss-ocean-400)] via-[var(--ss-ocean-600)] to-[var(--ss-ocean-900)]' },
  { slug: 'magic-bus', key: 'magicBus', icon: 'i-lucide-ice-cream-cone', gradient: 'from-[var(--ss-ocean-200)] via-[var(--ss-ocean-400)] to-[var(--ss-ocean-700)]' },
  { slug: 'lighthouse', key: 'lighthouse', icon: 'i-lucide-tower-control', gradient: 'from-[var(--ss-ocean-300)] via-[var(--ss-ocean-500)] to-[var(--ss-ocean-800)]' },
  { slug: 'shelling', key: 'shelling', icon: 'i-lucide-shell', gradient: 'from-[var(--ss-sand-200)] via-[var(--ss-ocean-300)] to-[var(--ss-ocean-600)]' },
  { slug: 'ding-darling', key: 'dingDarling', icon: 'i-lucide-bird', gradient: 'from-[var(--ss-ocean-500)] via-[var(--ss-ocean-700)] to-[var(--ss-ocean-950)]' }
] as const

/** Shared location data (homepage list + /explore/[slug] pages). Copy lives in i18n `Explore.*`. */
export function useAttractions() {
  const { t } = useI18n()
  const appConfig = useAppConfig()
  const websites = appConfig.explore?.websites as Record<string, string> | undefined

  return computed<Attraction[]>(() =>
    defs.map(({ slug, key, icon, gradient }) => ({
      slug,
      key,
      icon,
      gradient,
      website: websites?.[slug] ?? '',
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
