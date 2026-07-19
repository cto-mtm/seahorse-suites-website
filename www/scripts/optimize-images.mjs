/**
 * Batch image optimizer for public/images/
 * * Recursively finds all .png, .jpg, .jpeg, .svg files
 * and converts them to optimized .webp in place.
 * * Usage: npm run optimize:images -- [--dry-run] [--quality=78] [--max-width=1920]
 */
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname, extname, basename, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, '..', 'public', 'images');

// Parse CLI args
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const getArg = (prefix, fallback) => args.find(a => a.startsWith(prefix))?.split('=')[1] ?? fallback;
const quality = parseInt(getArg('--quality=', '78'), 10);
const maxWidth = parseInt(getArg('--max-width=', '1920'), 10);

const ALLOWED_EXTS = new Set(['.png', '.jpg', '.jpeg', '.svg']);

async function processImage(filePath, outputPath, ext) {
  if (ext === '.svg') {
    const svgData = readFileSync(filePath);
    const resvg = new Resvg(svgData, { fitTo: { mode: 'width', value: maxWidth } });
    const pngBuffer = resvg.render().asPng();
    return sharp(pngBuffer).webp({ quality, effort: 6 }).toFile(outputPath);
  }
  return sharp(filePath, { limitInputPixels: false })
    .resize(maxWidth, null, { withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(outputPath);
}

async function main() {
  console.log(`\n🖼  Image Optimizer | Mode: ${dryRun ? 'DRY RUN' : 'CONVERT'}`);
  console.log(`   Dir: public/images/ | Max width: ${maxWidth}px | Quality: ${quality}\n`);

  let allFiles = [];
  try {
    // Requires Node 20+
    allFiles = readdirSync(imagesDir, { recursive: true })
      .map(f => join(imagesDir, f))
      .filter(f => statSync(f).isFile());
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`   ⚠️ Directory not found: ${imagesDir}`);
      return;
    }
    throw err;
  }

  const processable = allFiles.filter(f => {
    const ext = extname(f).toLowerCase();
    if (!ALLOWED_EXTS.has(ext)) return false;

    const webpSibling = join(dirname(f), `${basename(f, ext)}.webp`);
    return !allFiles.includes(webpSibling);
  });

  if (!processable.length) {
    console.log('   ✨ Nothing to process. All images already have .webp versions.\n');
    return;
  }

  console.log(`   Found ${processable.length} image(s) to optimize:\n`);

  let [totalBefore, totalAfter] = [0, 0];

  for (const filePath of processable) {
    const rel = relative(imagesDir, filePath);
    const ext = extname(filePath).toLowerCase();
    const outputPath = join(dirname(filePath), `${basename(filePath, ext)}.webp`);
    const sizeBefore = statSync(filePath).size;
    totalBefore += sizeBefore;

    if (dryRun) {
      console.log(`   → ${rel} (${(sizeBefore / 1024).toFixed(0)}KB)`);
      continue;
    }

    try {
      await processImage(filePath, outputPath, ext);
      const sizeAfter = statSync(outputPath).size;
      totalAfter += sizeAfter;
      const meta = await sharp(outputPath).metadata();
      const savings = ((1 - sizeAfter / sizeBefore) * 100).toFixed(0);

      console.log(`   ✓ ${rel} → .webp | ${meta.width}x${meta.height} | ${(sizeBefore / 1024).toFixed(0)}KB → ${(sizeAfter / 1024).toFixed(0)}KB (−${savings}%)`);
    } catch (err) {
      console.log(`   ✗ FAILED: ${rel} — ${err.message}`);
    }
  }

  if (!dryRun) {
    console.log(`\n   📊 Total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   💡 Once verified, you can safely delete the original .png/.jpg/.svg files.\n`);
  }
}

main().catch(console.error);
