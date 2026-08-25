import manifest from '~/data/property-photos.json'

/** One photo in two sizes: `src` is the 1920w original, `thumb` is 960w for cards/tiles. */
export interface PhotoRef {
  src: string
  thumb: string
}

export interface SuitePhotoSet {
  /** Lead photo for cards and the gallery's main tile */
  hero: PhotoRef
  /** All gallery photos, in the photographer's shoot order */
  photos: PhotoRef[]
  /** Dimensions included so templates can reserve space (no layout shift) */
  floorPlan: { src: string, width: number, height: number } | null
}

export interface PropertyPhotos {
  suites: Record<string, SuitePhotoSet>
  property: {
    aerial: PhotoRef[]
    exterior: PhotoRef[]
    /** Named pick: aerial backdrop for the homepage attractions band */
    parallax: PhotoRef
    /** Curated photo band for the /amenities page, in display order */
    amenityGallery: PhotoRef[]
  }
  /**
   * Imagery per /explore attraction slug. `null` = no licensed photo yet
   * (pages fall back to the gradient tile).
   */
  explore: Record<string, { hero: PhotoRef, gallery: PhotoRef[] } | null>
}

/**
 * Web-optimized property photos, generated from the raw photographer
 * folders by `npm run import:photos` (scripts/import-property-photos.mjs).
 * The manifest lives at app/data/property-photos.json — regenerate it via
 * the script rather than editing by hand.
 */
export function usePropertyPhotos(): PropertyPhotos {
  return manifest as PropertyPhotos
}
