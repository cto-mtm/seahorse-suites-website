/**
 * Property photo importer for the raw photographer folders.
 *
 * Reads the raw JPGs from the repo-root photos/ folder
 * (photos/unit_N/{PHOTOS,FLOOR PLAN}, photos/aerial_photos,
 * photos/exterior_photos), converts them to web-optimized .webp under:
 *
 *   public/images/suites/<slug>/<NNN>.webp        (full size, 1920w)
 *   public/images/suites/<slug>/<NNN>-thumb.webp  (960w, for cards/tiles)
 *   public/images/suites/<slug>/floor-plan.webp
 *   public/images/property/{aerial,exterior}/<NN>{,-thumb}.webp
 *
 * and writes a manifest to app/data/property-photos.json that components use
 * to render galleries (photo lists, per-suite hero, named property picks).
 * Every named pick (HEROES, PROPERTY_PICKS) is validated against the photos
 * actually imported — a stale number fails the run instead of writing a path
 * that 404s in production.
 *
 * Notes on the raw folders:
 * - Photos are numbered sequentially by the photographer:
 *   1-32 aerial · 33-53 exterior · 54-95 unit 5 · 96-126 unit 4 ·
 *   127-153 unit 3 · 154-176 unit 2 · 177-197 unit 1.
 * - Every set is filtered by its number range, so stray files copied into
 *   the wrong folder (as in the original delivery) are skipped with a warning.
 *
 * Usage: node scripts/import-property-photos.mjs [--force]
 *   --force  re-convert even if the output .webp already exists
 */
import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rawPhotos = join(__dirname, '..', '..', 'photos')
const publicImages = join(__dirname, '..', 'public', 'images')
const manifestPath = join(__dirname, '..', 'app', 'data', 'property-photos.json')

const force = process.argv.includes('--force')

const MAX_WIDTH = 1920
const QUALITY = 78
const THUMB_WIDTH = 960
const THUMB_QUALITY = 72

/** unit folder → suite slug, plus the photo-number range that belongs to it */
const UNITS = [
  { dir: 'unit_1', slug: 'seahorse-retreat', range: [177, 197] },
  { dir: 'unit_2', slug: 'sunset-haven', range: [154, 176] },
  { dir: 'unit_3', slug: 'coastal-bliss', range: [127, 153] },
  { dir: 'unit_4', slug: 'ocean-breeze', range: [96, 126] },
  { dir: 'unit_5', slug: 'beachside-escape', range: [54, 95] }
]

/**
 * Hero photo per suite (original photographer number), used for the suite
 * cards on the homepage / suites index. Validated against the imported set.
 */
const HEROES = {
  'seahorse-retreat': 178, // living room + kitchen island
  'sunset-haven': 162, // living room, balcony light
  'coastal-bliss': 136, // living room, accent wall
  'ocean-breeze': 113, // living room, blue chairs
  'beachside-escape': 69 // living room, coastal rug
}

/** Named property-photo picks (aerial numbers), validated like HEROES. */
const PROPERTY_PICKS = {
  parallax: 13 // beach coastline aerial behind the homepage attractions band
}

/**
 * Photo band on the /amenities page (photographer numbers from any set),
 * in display order. Validated like HEROES.
 */
const AMENITY_GALLERY = [
  55, // beach gear: wagons, chairs, boards
  186, // fully equipped kitchen (unit 1)
  36, // patio table under the blue shade sail
  37, // backyard with lawn games
  56 // porch adirondack chairs, "gone to the beach" signs
]

/**
 * /explore attraction imagery. Numbers reference photographer photos already
 * imported above (reused in place, no duplicate files); strings reference
 * source files in photos/explore/<slug>/ — e.g. the public-domain USFWS
 * downloads for Ding Darling (see photos/explore/ding-darling/CREDITS.md).
 * `null` = no licensed photo yet; the pages fall back to the gradient tile.
 */
const EXPLORE = {
  'lighthouse': { hero: 10, gallery: [9, 29] }, // aerial tower · lighthouse point · sunset silhouette
  'ding-darling': { hero: 'spoonbills', gallery: ['mangroves', 'pelicans'] },
  'shelling': { hero: 13, gallery: [22, 15] }, // shore aerial · gulf beach · beach access path
  'magic-bus': null,
  'wickies': { hero: 51, gallery: [] }, // their A-frame from the street
  'emocean': null
}

const photoNumber = f => {
  const m = f.match(/LN-(\d+)\.jpe?g$/i)
  return m ? parseInt(m[1], 10) : null
}

let converted = 0
let skipped = 0

/** Convert src → dest webp; returns the output's {width, height}. */
async function convert(src, dest, { width = MAX_WIDTH, quality = QUALITY } = {}) {
  if (!force && existsSync(dest)) {
    skipped++
    const meta = await sharp(dest).metadata()
    return { width: meta.width, height: meta.height }
  }
  mkdirSync(dirname(dest), { recursive: true })
  converted++
  return sharp(src, { limitInputPixels: false })
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(dest)
}

async function importSet(srcDir, urlBase, { pad, keep }) {
  const destDir = join(publicImages, ...urlBase.split('/').filter(Boolean).slice(1))
  const all = readdirSync(srcDir)
  const entries = all.map(f => ({ f, n: photoNumber(f) })).filter(({ n }) => n !== null)
  if (entries.length < all.length) {
    console.log(`   ⚠ ${srcDir}: ${all.length - entries.length} file(s) not matching "…LN-<n>.jpg" ignored`)
  }
  const inRange = entries.filter(({ n }) => n >= keep[0] && n <= keep[1])
  if (inRange.length < entries.length) {
    console.log(`   ⚠ ${srcDir}: ${entries.length - inRange.length} file(s) outside range ${keep[0]}-${keep[1]} skipped`)
  }
  inRange.sort((a, b) => a.n - b.n)

  const out = []
  for (const { f, n } of inRange) {
    const base = String(n).padStart(pad, '0')
    await convert(join(srcDir, f), join(destDir, `${base}.webp`))
    await convert(join(srcDir, f), join(destDir, `${base}-thumb.webp`), { width: THUMB_WIDTH, quality: THUMB_QUALITY })
    out.push({ n, src: `${urlBase}/${base}.webp`, thumb: `${urlBase}/${base}-thumb.webp` })
  }
  return out
}

/** Resolve a named pick to its imported photo, failing loudly if absent. */
function pick(photos, n, label) {
  const photo = photos.find(p => p.n === n)
  if (!photo) {
    throw new Error(`${label}: photo #${n} is not among the ${photos.length} imported photo(s) — update the pick or the raw folder`)
  }
  return { src: photo.src, thumb: photo.thumb }
}

const toRef = ({ src, thumb }) => ({ src, thumb })

async function main() {
  const manifest = { suites: {}, property: {} }
  // Every imported photo by its photographer number (globally unique across sets)
  const allPhotos = []

  for (const { dir, slug, range } of UNITS) {
    const urlBase = `/images/suites/${slug}`
    const photos = await importSet(join(rawPhotos, dir, 'PHOTOS'), urlBase, { pad: 3, keep: range })
    allPhotos.push(...photos)
    if (!photos.length) throw new Error(`${slug}: no photos imported from ${dir}/PHOTOS`)

    // Floor plan (one file per unit folder); dimensions recorded for CLS-free rendering
    const fpDir = join(rawPhotos, dir, 'FLOOR PLAN')
    let floorPlan = null
    if (existsSync(fpDir)) {
      const fp = readdirSync(fpDir).find(f => /\.jpe?g$/i.test(f))
      if (fp) {
        const destDir = join(publicImages, 'suites', slug)
        const { width, height } = await convert(join(fpDir, fp), join(destDir, 'floor-plan.webp'), { width: 1600 })
        floorPlan = { src: `${urlBase}/floor-plan.webp`, width, height }
      }
    }

    manifest.suites[slug] = {
      hero: pick(photos, HEROES[slug] ?? photos[0].n, `${slug} hero`),
      photos: photos.map(toRef),
      floorPlan
    }
    console.log(`✓ ${slug}: ${photos.length} photos${floorPlan ? ' + floor plan' : ''}`)
  }

  const aerial = await importSet(join(rawPhotos, 'aerial_photos'), '/images/property/aerial', { pad: 2, keep: [1, 32] })
  const exterior = await importSet(join(rawPhotos, 'exterior_photos'), '/images/property/exterior', { pad: 2, keep: [33, 53] })
  allPhotos.push(...aerial, ...exterior)
  manifest.property = {
    aerial: aerial.map(toRef),
    exterior: exterior.map(toRef),
    parallax: pick(aerial, PROPERTY_PICKS.parallax, 'property parallax'),
    amenityGallery: AMENITY_GALLERY.map(n => pick(allPhotos, n, 'amenity gallery'))
  }
  console.log(`✓ property: ${aerial.length} aerial + ${exterior.length} exterior photos`)

  manifest.explore = {}
  for (const [slug, cfg] of Object.entries(EXPLORE)) {
    if (!cfg) {
      manifest.explore[slug] = null
      continue
    }
    const resolve = async (ref) => {
      if (typeof ref === 'number') return pick(allPhotos, ref, `explore ${slug}`)
      const srcDir = join(rawPhotos, 'explore', slug)
      const file = readdirSync(srcDir).find(f => f.toLowerCase().replace(/\.jpe?g$/, '') === ref)
      if (!file) throw new Error(`explore ${slug}: source file "${ref}.jpg" not found in photos/explore/${slug}/`)
      const destDir = join(publicImages, 'explore', slug)
      await convert(join(srcDir, file), join(destDir, `${ref}.webp`))
      await convert(join(srcDir, file), join(destDir, `${ref}-thumb.webp`), { width: THUMB_WIDTH, quality: THUMB_QUALITY })
      return { src: `/images/explore/${slug}/${ref}.webp`, thumb: `/images/explore/${slug}/${ref}-thumb.webp` }
    }
    const gallery = []
    for (const ref of cfg.gallery) gallery.push(await resolve(ref))
    manifest.explore[slug] = { hero: await resolve(cfg.hero), gallery }
    console.log(`✓ explore/${slug}: hero + ${gallery.length} gallery`)
  }

  mkdirSync(dirname(manifestPath), { recursive: true })
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`\n📄 Manifest → app/data/property-photos.json`)
  console.log(`📊 Converted ${converted}, skipped ${skipped} (already existed)`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
