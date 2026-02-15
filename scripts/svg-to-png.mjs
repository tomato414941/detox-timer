import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = join(__dirname, '..', 'assets', 'images');

const conversions = [
  { input: 'icon.svg', output: 'icon.png', width: 1024, height: 1024 },
  { input: 'adaptive-icon.svg', output: 'adaptive-icon.png', width: 1024, height: 1024 },
  { input: 'splash-icon.svg', output: 'splash-icon.png', width: 512, height: 512 },
  { input: 'favicon.svg', output: 'favicon.png', width: 48, height: 48 },
];

for (const { input, output, width, height } of conversions) {
  const inputPath = join(assetsDir, input);
  const outputPath = join(assetsDir, output);

  await sharp(inputPath)
    .resize(width, height)
    .png()
    .toFile(outputPath);

  console.log(`Converted ${input} -> ${output} (${width}x${height})`);
}

console.log('\nAll icons converted successfully!');
