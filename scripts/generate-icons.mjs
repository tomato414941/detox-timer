import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets', 'images');

const THEME_COLOR = '#4A90A4';
const BG_COLOR = '#FFFFFF';

// SVG for main icon (timer with clock hands)
function createIconSVG(size) {
  const center = size / 2;
  const radius = size * 0.35;
  const innerRadius = size * 0.30;
  const padding = size * 0.15;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="${BG_COLOR}"/>

  <!-- Outer ring -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${THEME_COLOR}" stroke-width="${size * 0.04}"/>

  <!-- Inner circle -->
  <circle cx="${center}" cy="${center}" r="${innerRadius * 0.15}" fill="${THEME_COLOR}"/>

  <!-- Hour markers -->
  ${[0, 90, 180, 270].map(angle => {
    const rad = (angle - 90) * Math.PI / 180;
    const x1 = center + (radius - size * 0.02) * Math.cos(rad);
    const y1 = center + (radius - size * 0.02) * Math.sin(rad);
    const x2 = center + (radius - size * 0.06) * Math.cos(rad);
    const y2 = center + (radius - size * 0.06) * Math.sin(rad);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${THEME_COLOR}" stroke-width="${size * 0.025}" stroke-linecap="round"/>`;
  }).join('\n  ')}

  <!-- Hour hand (shorter) -->
  <line x1="${center}" y1="${center}" x2="${center + innerRadius * 0.5}" y2="${center - innerRadius * 0.3}" stroke="${THEME_COLOR}" stroke-width="${size * 0.035}" stroke-linecap="round"/>

  <!-- Minute hand (longer) -->
  <line x1="${center}" y1="${center}" x2="${center}" y2="${center - innerRadius * 0.7}" stroke="${THEME_COLOR}" stroke-width="${size * 0.025}" stroke-linecap="round"/>

  <!-- Top button/stem -->
  <rect x="${center - size * 0.025}" y="${center - radius - size * 0.08}" width="${size * 0.05}" height="${size * 0.06}" fill="${THEME_COLOR}" rx="${size * 0.01}"/>
</svg>`;
}

// SVG for adaptive icon (foreground only, transparent background)
function createAdaptiveIconSVG(size) {
  const center = size / 2;
  const radius = size * 0.25;  // Smaller for safe zone
  const innerRadius = size * 0.22;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Transparent background -->
  <rect width="${size}" height="${size}" fill="none"/>

  <!-- Outer ring -->
  <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${THEME_COLOR}" stroke-width="${size * 0.03}"/>

  <!-- Inner circle -->
  <circle cx="${center}" cy="${center}" r="${innerRadius * 0.15}" fill="${THEME_COLOR}"/>

  <!-- Hour markers -->
  ${[0, 90, 180, 270].map(angle => {
    const rad = (angle - 90) * Math.PI / 180;
    const x1 = center + (radius - size * 0.015) * Math.cos(rad);
    const y1 = center + (radius - size * 0.015) * Math.sin(rad);
    const x2 = center + (radius - size * 0.045) * Math.cos(rad);
    const y2 = center + (radius - size * 0.045) * Math.sin(rad);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${THEME_COLOR}" stroke-width="${size * 0.02}" stroke-linecap="round"/>`;
  }).join('\n  ')}

  <!-- Hour hand -->
  <line x1="${center}" y1="${center}" x2="${center + innerRadius * 0.45}" y2="${center - innerRadius * 0.25}" stroke="${THEME_COLOR}" stroke-width="${size * 0.028}" stroke-linecap="round"/>

  <!-- Minute hand -->
  <line x1="${center}" y1="${center}" x2="${center}" y2="${center - innerRadius * 0.6}" stroke="${THEME_COLOR}" stroke-width="${size * 0.02}" stroke-linecap="round"/>

  <!-- Top button -->
  <rect x="${center - size * 0.02}" y="${center - radius - size * 0.06}" width="${size * 0.04}" height="${size * 0.045}" fill="${THEME_COLOR}" rx="${size * 0.008}"/>
</svg>`;
}

// SVG for splash icon
function createSplashIconSVG(size) {
  return createIconSVG(size);
}

// SVG for favicon (simpler design for small size)
function createFaviconSVG(size) {
  const center = size / 2;
  const radius = size * 0.38;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${BG_COLOR}"/>
  <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${THEME_COLOR}" stroke-width="${size * 0.06}"/>
  <circle cx="${center}" cy="${center}" r="${size * 0.08}" fill="${THEME_COLOR}"/>
  <line x1="${center}" y1="${center}" x2="${center + radius * 0.5}" y2="${center - radius * 0.3}" stroke="${THEME_COLOR}" stroke-width="${size * 0.08}" stroke-linecap="round"/>
  <line x1="${center}" y1="${center}" x2="${center}" y2="${center - radius * 0.65}" stroke="${THEME_COLOR}" stroke-width="${size * 0.06}" stroke-linecap="round"/>
</svg>`;
}

// Write SVG files
console.log('Generating icon SVGs...');

writeFileSync(join(assetsDir, 'icon.svg'), createIconSVG(1024));
console.log('Created icon.svg (1024x1024)');

writeFileSync(join(assetsDir, 'adaptive-icon.svg'), createAdaptiveIconSVG(1024));
console.log('Created adaptive-icon.svg (1024x1024)');

writeFileSync(join(assetsDir, 'splash-icon.svg'), createSplashIconSVG(512));
console.log('Created splash-icon.svg (512x512)');

writeFileSync(join(assetsDir, 'favicon.svg'), createFaviconSVG(48));
console.log('Created favicon.svg (48x48)');

console.log('\nSVG files created. Use a tool to convert to PNG:');
console.log('  npx sharp-cli -i icon.svg -o icon.png');
console.log('  or use https://svgtopng.com/');
