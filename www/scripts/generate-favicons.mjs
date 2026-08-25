/**
 * Favicon generator — builds the tab/home-screen icon set from the seahorse
 * logo original (repo-root logos/color.png, 2000×2000 with alpha).
 *
 * The filigree mark is too delicate to read as bare lines at 16-32px, so
 * every icon places it on a dark-ocean badge (brand --ss-ocean-950):
 *
 *   public/favicon.ico            16+32+48 (PNG-compressed ICO)
 *   public/favicon-16.png         rounded badge
 *   public/favicon-32.png         rounded badge
 *   public/apple-touch-icon.png   180×180, full-bleed square (iOS rounds it)
 *   public/icon-512.png           rounded badge (PWA/share targets)
 *
 * Usage: node scripts/generate-favicons.mjs
 */
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const logoPath = join(__dirname, '..', '..', 'logos', 'color.png')
const publicDir = join(__dirname, '..', 'public')

const BG = '#0b333a' // --ss-ocean-950, the site's dark ocean band

/** Render one square icon: badge background + centered trimmed mark. */
async function renderIcon(mark, size, { rounded = true } = {}) {
  const radius = rounded ? Math.round(size * 0.22) : 0
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${BG}"/></svg>`
  )
  // The mark is tall; give it ~78% of the badge height
  const markHeight = Math.round(size * 0.78)
  const markPng = await mark.clone().resize(null, markHeight, { fit: 'inside' }).png().toBuffer()
  return sharp(bg)
    .composite([{ input: markPng, gravity: 'center' }])
    .png()
    .toBuffer()
}

/** Wrap PNG buffers into a .ico container (PNG-in-ICO, supported everywhere modern). */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)

  const dir = Buffer.alloc(16 * entries.length)
  let offset = 6 + dir.length
  entries.forEach(({ size, png }, i) => {
    const o = i * 16
    dir.writeUInt8(size >= 256 ? 0 : size, o) // width
    dir.writeUInt8(size >= 256 ? 0 : size, o + 1) // height
    dir.writeUInt8(0, o + 2) // palette
    dir.writeUInt8(0, o + 3) // reserved
    dir.writeUInt16LE(1, o + 4) // color planes
    dir.writeUInt16LE(32, o + 6) // bits per pixel
    dir.writeUInt32LE(png.length, o + 8)
    dir.writeUInt32LE(offset, o + 12)
    offset += png.length
  })
  return Buffer.concat([header, dir, ...entries.map(e => e.png)])
}

async function main() {
  // Trim the transparent padding so the mark fills the badge
  const mark = sharp(await sharp(logoPath).trim().png().toBuffer())

  const out = async (name, buf) => {
    writeFileSync(join(publicDir, name), buf)
    console.log(`✓ ${name} (${(buf.length / 1024).toFixed(1)}KB)`)
  }

  await out('favicon-16.png', await renderIcon(mark, 16))
  await out('favicon-32.png', await renderIcon(mark, 32))
  await out('apple-touch-icon.png', await renderIcon(mark, 180, { rounded: false }))
  await out('icon-512.png', await renderIcon(mark, 512))

  const ico = buildIco(await Promise.all(
    [16, 32, 48].map(async size => ({ size, png: await renderIcon(mark, size) }))
  ))
  await out('favicon.ico', ico)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
