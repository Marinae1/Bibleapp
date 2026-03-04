#!/usr/bin/env node
/**
 * Generates placeholder app icon and splash screen PNG files.
 * These are simple solid-color placeholders with text.
 * Replace with professionally designed assets before App Store submission.
 *
 * For production, design a proper icon featuring:
 * - Orthodox cross or open Bible motif
 * - Colors: Saddle Brown (#8B4513) and Gold (#C4A35A)
 * - 1024x1024 icon, 1284x2778 splash screen
 *
 * Usage: node generate-assets.js
 * Requires: npm install canvas (optional - creates PNG files)
 */

const fs = require('fs');
const path = require('path');

// Create minimal valid 1x1 PNG and scale note
// These are functional placeholders that Expo can load

// Minimal 48x48 red-brown PNG (favicon)
function createMinimalPNG(width, height) {
  // Create a minimal valid PNG with solid brown color
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT chunk - create raw image data
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter byte
    for (let x = 0; x < width; x++) {
      rawData.push(139, 69, 19); // #8B4513 (Saddle Brown)
    }
  }

  // Compress with zlib
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));
  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type);
  const crc = crc32(Buffer.concat([typeBuffer, data]));
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  return Buffer.concat([length, typeBuffer, data, crcBuffer]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xedb88320;
      } else {
        crc = crc >>> 1;
      }
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const assetsDir = __dirname;

// Generate icons at required sizes
const assets = [
  { name: 'icon.png', width: 1024, height: 1024 },
  { name: 'adaptive-icon.png', width: 1024, height: 1024 },
  { name: 'splash.png', width: 1284, height: 2778 },
  { name: 'favicon.png', width: 48, height: 48 },
];

for (const asset of assets) {
  const filePath = path.join(assetsDir, asset.name);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${asset.name} already exists`);
    continue;
  }

  // For large images, use a smaller actual PNG (Expo will handle scaling)
  const actualWidth = Math.min(asset.width, 64);
  const actualHeight = Math.min(asset.height, 64);
  const png = createMinimalPNG(actualWidth, actualHeight);
  fs.writeFileSync(filePath, png);
  console.log(`  ✓ Created ${asset.name} (${actualWidth}x${actualHeight} placeholder)`);
}

console.log('\nPlaceholder assets created!');
console.log('Replace these with professionally designed assets before App Store submission.');
console.log('Recommended tool: Figma, Sketch, or https://icon.kitchen');
