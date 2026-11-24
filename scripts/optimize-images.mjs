#!/usr/bin/env node
/**
 * Photo pipeline: originals in `photos/` → optimized masters in `src/assets/images/`.
 *
 * Drop any photo into `photos/<folder>/` (jpg, png, webp, avif, tiff, heic) and run
 * `npm run dev` or `npm run build`: this script runs first and, for every new or
 * changed photo,
 *   - shrinks huge photos to at most MAX_WIDTH (fast to load, fast to process),
 *   - upscales small ones (< SMALL_WIDTH) 2× and cleans up their JPEG blockiness,
 *   - lightly sharpens, lifts colour a touch and strips metadata (GPS etc.),
 *   - writes a compressed JPEG master with the same folder and base name.
 * Vite (vite-imagetools) then turns each master into AVIF/WebP at several widths.
 *
 * A content fingerprint per photo is kept in `src/assets/images/.manifest.json`,
 * so unchanged photos are skipped (including on Vercel, where file dates are reset).
 * Bump PIPELINE_VERSION to re-process everything after changing the settings.
 */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const PIPELINE_VERSION = 2;
const MAX_WIDTH = 2400;
const SMALL_WIDTH = 1000;
const UPSCALE_TARGET = 1600;
const JPEG_QUALITY = 82;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC_DIR = path.join(root, "photos");
const OUT_DIR = path.join(root, "src/assets/images");
const MANIFEST = path.join(OUT_DIR, ".manifest.json");
const INPUT_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff", ".heic", ".heif"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (INPUT_EXT.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

const fingerprint = (buffer) => createHash("sha1").update(`v${PIPELINE_VERSION}:`).update(buffer).digest("hex");

/** Builds the optimized master for one photo. */
async function optimize(input, meta, fileName) {
  // EXIF orientations 5–8 are rotated 90°, so the visible width is the stored height.
  const width = (meta.orientation ?? 1) >= 5 ? meta.height : meta.width;
  let image = sharp(input, { failOn: "none" }).rotate();
  let action;

  if (width < SMALL_WIDTH) {
    // Small web photos: 2× (or up to UPSCALE_TARGET) with Lanczos, then smooth JPEG blocks and restore edges.
    const target = Math.min(width * 2, Math.max(UPSCALE_TARGET, width));
    image = image.resize({ width: target, kernel: "lanczos3" }).median(3).sharpen({ sigma: 1.1, m1: 0.8, m2: 2.0, x1: 2 });
    action = `upscaled ${width} → ${target}px`;
  } else if (width > MAX_WIDTH) {
    image = image.resize({ width: MAX_WIDTH, kernel: "lanczos3" }).sharpen({ sigma: 0.6, m1: 0.5, m2: 1.0 });
    action = `downscaled ${width} → ${MAX_WIDTH}px`;
  } else {
    image = image.sharpen({ sigma: 0.6, m1: 0.5, m2: 1.0 });
    action = `kept ${width}px`;
  }

  image = image.modulate({ saturation: 1.04 }).linear(1.03, -3);

  // Only real .png files keep transparency; photos saved with an alpha channel become JPEG.
  if (meta.hasAlpha && path.extname(fileName).toLowerCase() === ".png") {
    return { buffer: await image.png({ compressionLevel: 9 }).toBuffer(), ext: ".png", action };
  }
  image = image.flatten({ background: "#ffffff" });
  return { buffer: await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer(), ext: ".jpg", action };
}

async function main() {
  if (!existsSync(SRC_DIR)) return;
  const manifest = existsSync(MANIFEST) ? JSON.parse(await readFile(MANIFEST, "utf8")) : {};
  let processed = 0;
  let skipped = 0;
  let savedBytes = 0;

  for await (const file of walk(SRC_DIR)) {
    const rel = path.relative(SRC_DIR, file);
    const buffer = await readFile(file);
    const hash = fingerprint(buffer);
    const entry = manifest[rel];
    if (entry && entry.hash === hash && existsSync(path.join(OUT_DIR, entry.output))) {
      skipped++;
      continue;
    }

    const meta = await sharp(buffer, { failOn: "none" }).metadata();
    const { buffer: out, ext, action } = await optimize(buffer, meta, file);
    const output = rel.slice(0, -path.extname(rel).length) + ext;
    await mkdir(path.dirname(path.join(OUT_DIR, output)), { recursive: true });
    await writeFile(path.join(OUT_DIR, output), out);
    manifest[rel] = { hash, output };
    processed++;
    savedBytes += buffer.length - out.length;
    console.log(`  ✓ ${rel} (${action}, ${(buffer.length / 1024).toFixed(0)} KB → ${(out.length / 1024).toFixed(0)} KB)`);
  }

  // Forget photos that were removed from photos/ (their masters stay until deleted by hand).
  for (const rel of Object.keys(manifest)) if (!existsSync(path.join(SRC_DIR, rel))) delete manifest[rel];

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  const sizeNote = savedBytes >= 0 ? `${(savedBytes / 1024 / 1024).toFixed(1)} MB smaller` : `${(-savedBytes / 1024 / 1024).toFixed(1)} MB larger, small photos were upscaled`;
  if (processed) console.log(`images: ${processed} optimized, ${skipped} unchanged (${sizeNote})`);
  else console.log(`images: all ${skipped} photos up to date`);
}

main().catch((error) => {
  console.error("images: optimization failed:", error);
  process.exit(1);
});
