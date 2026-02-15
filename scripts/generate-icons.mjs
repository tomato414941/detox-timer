import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets', 'images');

const THEME_COLOR = '#4A90A4';
const BG_COLOR = '#FFFFFF';
const LUCIDE_TIMER_VIEWBOX_SIZE = 24;

function createLucideTimerIconSVG({
  size,
  bgColor,
  strokeColor,
  strokeWidth,
  iconRatio,
}) {
  const iconSize = Math.round(size * iconRatio);
  const offset = Math.round((size - iconSize) / 2);
  const scale = iconSize / LUCIDE_TIMER_VIEWBOX_SIZE;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Based on Lucide 'timer' icon (ISC License): https://lucide.dev/icons/timer -->
  ${bgColor === null ? '' : `<rect width="${size}" height="${size}" fill="${bgColor}"/>`}
  <g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">
    <line x1="10" x2="14" y1="2" y2="2" />
    <line x1="12" x2="15" y1="14" y2="11" />
    <circle cx="12" cy="14" r="8" />
  </g>
</svg>`;
}

// SVG for main icon (App Store: must be opaque)
function createIconSVG(size) {
  return createLucideTimerIconSVG({
    size,
    bgColor: THEME_COLOR,
    strokeColor: BG_COLOR,
    strokeWidth: 1,
    iconRatio: 720 / 1024,
  });
}

// SVG for adaptive icon (foreground only, transparent background)
function createAdaptiveIconSVG(size) {
  // Keep it slightly smaller to avoid clipping with different adaptive masks.
  return createLucideTimerIconSVG({
    size,
    bgColor: null,
    strokeColor: THEME_COLOR,
    strokeWidth: 1,
    iconRatio: 0.62,
  });
}

// SVG for splash icon
function createSplashIconSVG(size) {
  return createLucideTimerIconSVG({
    size,
    bgColor: BG_COLOR,
    strokeColor: THEME_COLOR,
    strokeWidth: 1,
    iconRatio: 720 / 1024,
  });
}

// SVG for favicon (simpler design for small size)
function createFaviconSVG(size) {
  return createLucideTimerIconSVG({
    size,
    bgColor: BG_COLOR,
    strokeColor: THEME_COLOR,
    strokeWidth: 2,
    iconRatio: 0.78,
  });
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
