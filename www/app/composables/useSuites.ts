export interface Suite {
  slug: string
  title: string
  specs: string
  desc: string
  long: string
  icon: string
  gradient: string
  features: string[]
  /** Keys into the shared Amenities namespace (see useAmenities) */
  amenityKeys: string[]
  /** Bedroom count (from the real specs strings) */
  bedrooms: number
  /** Whether pets are welcome (mirrors the 'pets' amenity) */
  petFriendly: boolean
  /**
   * Soft cap on total guests, used by the reservation form's guest counter.
   * NOTE: these are conservative ESTIMATES (≈ sleeping capacity) — confirm the
   * real max occupancy per suite and update. Not shown as marketing copy.
   */
  maxGuests: number
}

const SHARED_AMENITIES = ['wifi', 'bikes', 'laundry', 'beach', 'patio', 'kitchen', 'parking']

const defs = [
  { n: 1, slug: 'seahorse-retreat', icon: 'i-lucide-shell', gradient: 'from-[var(--ss-ocean-300)] via-[var(--ss-ocean-500)] to-[var(--ss-ocean-800)]', amenityKeys: [...SHARED_AMENITIES, 'pets'], bedrooms: 2, maxGuests: 6 },
  { n: 2, slug: 'sunset-haven', icon: 'i-lucide-sunset', gradient: 'from-[var(--ss-sand-200)] via-[var(--ss-ocean-300)] to-[var(--ss-ocean-600)]', amenityKeys: SHARED_AMENITIES, bedrooms: 1, maxGuests: 4 },
  { n: 3, slug: 'coastal-bliss', icon: 'i-lucide-waves', gradient: 'from-[var(--ss-ocean-200)] via-[var(--ss-ocean-400)] to-[var(--ss-ocean-700)]', amenityKeys: [...SHARED_AMENITIES, 'pets'], bedrooms: 2, maxGuests: 6 },
  { n: 4, slug: 'ocean-breeze', icon: 'i-lucide-flame', gradient: 'from-[var(--ss-ocean-400)] via-[var(--ss-ocean-600)] to-[var(--ss-ocean-900)]', amenityKeys: SHARED_AMENITIES, bedrooms: 2, maxGuests: 6 },
  { n: 5, slug: 'beachside-escape', icon: 'i-lucide-umbrella', gradient: 'from-[var(--ss-ocean-500)] via-[var(--ss-ocean-700)] to-[var(--ss-ocean-950)]', amenityKeys: SHARED_AMENITIES, bedrooms: 2, maxGuests: 6 }
] as const

/** Shared suite data (homepage teaser + /suites pages + booking modal). Copy lives in i18n `Suites.*`. */
export function useSuites() {
  const { t } = useI18n()

  return computed<Suite[]>(() =>
    defs.map(({ n, slug, icon, gradient, amenityKeys, bedrooms, maxGuests }) => ({
      slug,
      icon,
      gradient,
      amenityKeys: [...amenityKeys],
      bedrooms,
      maxGuests,
      petFriendly: amenityKeys.includes('pets'),
      title: t(`Suites.suite${n}Title`),
      specs: t(`Suites.suite${n}Specs`),
      desc: t(`Suites.suite${n}Desc`),
      long: t(`Suites.suite${n}Long`),
      features: [1, 2, 3, 4].map(m => t(`Suites.suite${n}Feat${m}`))
    }))
  )
}
