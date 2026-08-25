/*
 * One-off image optimization pass: converts the source raster images to
 * resized, compressed WebP. Re-run manually whenever a source image in
 * src/images or public/images-src changes.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// { input, output, maxWidth, quality }
const jobs = [
  // Hero image: goes to /public so it can be <link rel="preload">-ed by URL
  // before the JS bundle loads, and referenced by a stable path.
  { input: 'src/images/home.jpg', output: 'public/images/hero.webp', maxWidth: 1600, quality: 72 },

  // Circular "About" avatar, rendered at ~350px -> 700px covers retina.
  { input: 'src/images/about.jpg', output: 'src/images/about.webp', maxWidth: 700, quality: 80 },

  // Founder photo, rendered up to 600px tall in a flexible-width column.
  { input: 'src/images/Elyse.jpg', output: 'src/images/Elyse.webp', maxWidth: 1200, quality: 78 },

  // Page hero banners (~900px wide source, displayed full-bleed).
  { input: 'src/images/course.png', output: 'src/images/course.webp', maxWidth: 1200, quality: 80 },
  { input: 'src/images/service.png', output: 'src/images/service.webp', maxWidth: 1200, quality: 80 },

  // Logo: displayed at max 80px tall; 800px wide is generous for retina.
  { input: 'src/images/logo.png', output: 'src/images/logo.webp', maxWidth: 800, quality: 90 },

  // Payment icons: displayed at max 40px; keep small but crisp.
  { input: 'src/images/z.png', output: 'src/images/z.webp', maxWidth: 160, quality: 90 },
  { input: 'src/images/$.png', output: 'src/images/$.webp', maxWidth: 160, quality: 90 },
  { input: 'src/images/ipay.png', output: 'src/images/ipay.webp', maxWidth: 160, quality: 90 },

  // Tradeline graph image, rendered full-width in a constrained column.
  { input: 'src/images/trandline.jpeg', output: 'src/images/trandline.webp', maxWidth: 900, quality: 80 },
];

(async () => {
  let totalBefore = 0;
  let totalAfter = 0;

  for (const job of jobs) {
    const inputPath = path.join(ROOT, job.input);
    const outputPath = path.join(ROOT, job.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const before = fs.statSync(inputPath).size;

    await sharp(inputPath)
      .resize({ width: job.maxWidth, withoutEnlargement: true })
      .webp({ quality: job.quality })
      .toFile(outputPath);

    const after = fs.statSync(outputPath).size;
    totalBefore += before;
    totalAfter += after;

    console.log(
      `${job.input} -> ${job.output}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB ` +
      `(-${(100 - (after / before) * 100).toFixed(0)}%)`
    );
  }

  console.log(
    `\nTotal: ${(totalBefore / 1024).toFixed(0)}KB -> ${(totalAfter / 1024).toFixed(0)}KB ` +
    `(-${(100 - (totalAfter / totalBefore) * 100).toFixed(0)}%)`
  );
})();
