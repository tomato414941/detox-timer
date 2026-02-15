import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets', 'images');
const OPAQUE_BG_COLOR = '#FFFFFF';

const conversions = [
  { input: 'icon.svg', output: 'icon.png', width: 1024, height: 1024 },
  { input: 'adaptive-icon.svg', output: 'adaptive-icon.png', width: 1024, height: 1024 },
  { input: 'splash-icon.svg', output: 'splash-icon.png', width: 512, height: 512 },
  { input: 'favicon.svg', output: 'favicon.png', width: 48, height: 48 },
];

for (const { input, output, width, height } of conversions) {
  const inputPath = join(assetsDir, input);
  const outputPath = join(assetsDir, output);

  let pipeline = sharp(inputPath).resize(width, height);

  // App Store icons must not contain an alpha channel. Also keep splash/favicon opaque.
  if (output === 'icon.png' || output === 'splash-icon.png' || output === 'favicon.png') {
    pipeline = pipeline.flatten({ background: OPAQUE_BG_COLOR }).removeAlpha();
  }

  await pipeline.png().toFile(outputPath);

  console.log(`Converted ${input} -> ${output} (${width}x${height})`);
}

console.log('\nAll icons converted successfully!');
