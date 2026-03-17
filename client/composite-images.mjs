/**
 * composite-images.mjs
 * Downloads 4K HD backgrounds, blurs them heavily, composites with school photos.
 * Run: node composite-images.mjs
 */

import sharp from 'sharp';
import { createWriteStream, existsSync } from 'fs';
import { pipeline } from 'stream/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ARTIFACTS_DIR = 'C:/Users/HI/.gemini/antigravity/brain/6bb4e15c-f089-4c96-ac59-354aa6457c0f';
const PUBLIC_DIR = path.join(__dirname, 'public');

// Source photos from artifacts
const PHOTO_1 = path.join(ARTIFACTS_DIR, 'media__1773735755759.jpg'); // science lab
const PHOTO_2 = path.join(ARTIFACTS_DIR, 'media__1773735755842.jpg'); // library

// Science lab background (chemistry/microscope lab)
// Unsplash: science lab equipment with microscopes and beakers
const BG_LAB_URL  = 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=2400&q=90';
const BG_LAB_URL2 = 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=2400&q=90';

// Library background (bookshelves and reading area)
const BG_LIB_URL  = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2400&q=90';
const BG_LIB_URL2 = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2400&q=90';

const TMP_BG_LAB = path.join(__dirname, 'tmp_bg_lab.jpg');
const TMP_BG_LIB = path.join(__dirname, 'tmp_bg_lib.jpg');

const OUT_1 = path.join(PUBLIC_DIR, 'hero-science-lab.jpg');
const OUT_2 = path.join(PUBLIC_DIR, 'hero-library.jpg');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        // follow redirect
        import('fs').then(fs => fs.promises.unlink(dest).catch(()=>{}))
          .then(() => download(res.headers.location, dest))
          .then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    });
    request.on('error', (err) => { file.close(); reject(err); });
  });
}

async function downloadWithFallback(url1, url2, dest) {
  try {
    await download(url1, dest);
  } catch (e) {
    console.warn(`Primary URL failed (${e.message}), trying fallback...`);
    await download(url2, dest);
  }
}

async function composite(photoPath, bgPath, outPath, label) {
  console.log(`\n[${label}] Loading photo: ${photoPath}`);

  // Get dimensions of the original photo
  const photoMeta = await sharp(photoPath).metadata();
  const W = photoMeta.width;
  const H = photoMeta.height;
  console.log(`[${label}] Photo size: ${W}x${H}`);

  // Step 1: Resize & crop background to match photo size, then blur it heavily
  console.log(`[${label}] Processing background...`);
  const blurredBg = await sharp(bgPath)
    .resize(W, H, { fit: 'cover', position: 'center' })
    .blur(35)           // heavy bokeh-style blur
    .modulate({ brightness: 0.85, saturation: 1.2 })  // slightly darker, more vivid
    .jpeg({ quality: 95 })
    .toBuffer();

  // Step 2: The photo already has the people in it — we'll blend the blurred background
  // behind the photo by using a gradient mask: top ~60% show blurred bg, bottom show original
  // For a realistic studio look, we overlay the photo on the blurred bg with center-weighted mask
  
  // Create a vignette/mask: extract just the center subject from photo by creating
  // a soft ellipse mask that keeps center sharp, edges blend into blurred bg

  // Mask: white=keep photo, black=show blurred bg
  // We create an elliptical gradient mask
  const maskSvg = `
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="mask" cx="50%" cy="40%" rx="48%" ry="52%">
          <stop offset="0%"   stop-color="white" stop-opacity="1"/>
          <stop offset="60%"  stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="black" stop-opacity="1"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#mask)"/>
    </svg>`;

  const maskBuffer = Buffer.from(maskSvg);
  const mask = await sharp(maskBuffer).png().toBuffer();

  // Apply mask to extract photo subject
  const maskedPhoto = await sharp(photoPath)
    .resize(W, H)
    .composite([{
      input: mask,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // Step 3: Composite: blurred background + masked photo on top
  console.log(`[${label}] Compositing...`);
  await sharp(blurredBg)
    .composite([{
      input: maskedPhoto,
      blend: 'over',
      gravity: 'center'
    }])
    .jpeg({ quality: 95, chromaSubsampling: '4:4:4' })
    .toFile(outPath);

  console.log(`[${label}] ✅ Saved to: ${outPath}`);
}

async function run() {
  try {
    console.log('=== Downloading 4K HD backgrounds from Unsplash ===');
    
    if (!existsSync(TMP_BG_LAB)) {
      console.log('Downloading science lab background...');
      await downloadWithFallback(BG_LAB_URL, BG_LAB_URL2, TMP_BG_LAB);
      console.log('Downloaded lab background ✓');
    } else {
      console.log('Lab background already cached ✓');
    }

    if (!existsSync(TMP_BG_LIB)) {
      console.log('Downloading library background...');
      await downloadWithFallback(BG_LIB_URL, BG_LIB_URL2, TMP_BG_LIB);
      console.log('Downloaded library background ✓');
    } else {
      console.log('Library background already cached ✓');
    }

    await composite(PHOTO_1, TMP_BG_LAB, OUT_1, 'Science Lab');
    await composite(PHOTO_2, TMP_BG_LIB, OUT_2, 'Library');

    console.log('\n=== All done! ===');
    console.log(`Output 1: ${OUT_1}`);
    console.log(`Output 2: ${OUT_2}`);

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
