export interface Amenity {
  key: string
  icon: string
  title: string
  desc: string
  long: string
}

/** Shared amenity data (homepage teaser + /amenities page). Copy lives in i18n `Amenities.*`. */
export function useAmenities() {
  const { t } = useI18n()

  const defs = [
    { key: 'wifi', icon: 'i-lucide-wifi' },
    { key: 'bikes', icon: 'i-lucide-bike' },
    { key: 'laundry', icon: 'i-lucide-washing-machine' },
    { key: 'beach', icon: 'i-lucide-umbrella' },
    { key: 'pets', icon: 'i-lucide-paw-print' },
    { key: 'patio', icon: 'i-lucide-flame' },
    { key: 'kitchen', icon: 'i-lucide-utensils' },
    { key: 'parking', icon: 'i-lucide-car' }
  ]

  return computed<Amenity[]>(() =>
    defs.map(({ key, icon }) => ({
      key,
      icon,
      title: t(`Amenities.${key}Title`),
      desc: t(`Amenities.${key}Desc`),
      long: t(`Amenities.${key}Long`)
    }))
  )
}
