import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '../dist');

const JPEG_QUALITY = 78;
const JPEG_MAX_EDGE = 8192;
const PNG_QUALITY = 82;

async function loadSharp() {
  try {
    const sharp = (await import('sharp')).default;
    return sharp;
  } catch {
    console.warn('[optimize] sharp not installed — skipping image compression');
    return null;
  }
}

async function optimizeJpeg(sharp, filePath) {
  const before = fs.statSync(filePath).size;
  const image = sharp(filePath, { failOn: 'none' });
  const meta = await image.metadata();

  let pipeline = image.rotate();
  const maxEdge = Math.max(meta.width || 0, meta.height || 0);
  if (maxEdge > JPEG_MAX_EDGE) {
    pipeline = pipeline.resize({
      width: meta.width >= meta.height ? JPEG_MAX_EDGE : undefined,
      height: meta.height > meta.width ? JPEG_MAX_EDGE : undefined,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const tempPath = `${filePath}.opt.tmp`;
  await pipeline
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(tempPath);

  const after = fs.statSync(tempPath).size;
  if (after < before) {
    fs.rmSync(filePath, { force: true });
    fs.renameSync(tempPath, filePath);
    return { before, after };
  }

  fs.rmSync(tempPath, { force: true });
  return { before, after: before, skipped: true };
}

async function optimizePng(sharp, filePath) {
  const before = fs.statSync(filePath).size;
  const tempPath = `${filePath}.opt.tmp`;

  await sharp(filePath, { failOn: 'none' })
    .png({ quality: PNG_QUALITY, compressionLevel: 9, effort: 7 })
    .toFile(tempPath);

  const after = fs.statSync(tempPath).size;
  if (after < before) {
    fs.rmSync(filePath, { force: true });
    fs.renameSync(tempPath, filePath);
    return { before, after };
  }

  fs.rmSync(tempPath, { force: true });
  return { before, after: before, skipped: true };
}

function walk(dir, ext, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, ext, files);
    else if (entry.name.toLowerCase().endsWith(ext)) files.push(full);
  }
  return files;
}

function formatMb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  if (!fs.existsSync(DIST)) {
    console.warn('[optimize] dist/ not found — run vite build first');
    process.exit(0);
  }

  const sharp = await loadSharp();
  if (!sharp) process.exit(0);

  const jpegs = walk(DIST, '.jpg');
  const pngs = walk(DIST, '.png');

  let saved = 0;
  let processed = 0;

  for (const file of jpegs) {
    try {
      const result = await optimizeJpeg(sharp, file);
      processed += 1;
      if (!result.skipped) saved += result.before - result.after;
      console.log(
        `[optimize] ${path.relative(DIST, file)}: ${formatMb(result.before)} → ${formatMb(result.after)}`
      );
    } catch (err) {
      console.warn(`[optimize] skip ${path.relative(DIST, file)}:`, err.message);
    }
  }

  for (const file of pngs) {
    try {
      const result = await optimizePng(sharp, file);
      processed += 1;
      if (!result.skipped) saved += result.before - result.after;
      console.log(
        `[optimize] ${path.relative(DIST, file)}: ${formatMb(result.before)} → ${formatMb(result.after)}`
      );
    } catch (err) {
      console.warn(`[optimize] skip ${path.relative(DIST, file)}:`, err.message);
    }
  }

  console.log(
    `[optimize] Done: ${processed} files, saved ${formatMb(saved)} total`
  );
}

main().catch((err) => {
  console.error('[optimize] failed:', err);
  process.exit(1);
});
