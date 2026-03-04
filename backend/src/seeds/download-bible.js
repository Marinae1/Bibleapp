#!/usr/bin/env node
/**
 * Downloads Bible text from bible-api.com (World English Bible - public domain)
 * Saves each book as a JSON file in data/books/{abbreviation}.json
 *
 * Usage: node src/seeds/download-bible.js
 *
 * Rate-limited to ~500ms between requests to be respectful to the free API.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { BOOK_MAP } = require('./book-mapping');

const DATA_DIR = path.join(__dirname, 'data', 'books');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'OrthodoxBibleApp/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse response from ${url}: ${e.message}`));
        }
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function downloadBook(abbreviation, bookInfo) {
  const outputPath = path.join(DATA_DIR, `${abbreviation}.json`);

  // Skip if already downloaded
  if (fs.existsSync(outputPath)) {
    const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    if (existing.chapters && Object.keys(existing.chapters).length >= bookInfo.chapters) {
      console.log(`  ✓ ${abbreviation} already downloaded (${Object.keys(existing.chapters).length} chapters)`);
      return;
    }
  }

  console.log(`  ↓ Downloading ${abbreviation} (${bookInfo.apiName})...`);

  const bookData = { abbreviation, chapters: {} };

  if (bookInfo.isComposite) {
    // Handle composite books like Ezra+Nehemiah → 2 Esdras
    for (const part of bookInfo.parts) {
      for (let ch = 1; ch <= part.chapters; ch++) {
        const appChapter = part.startChapter + ch - 1;
        const url = `https://bible-api.com/${encodeURIComponent(part.apiName)}+${ch}?translation=web`;
        try {
          const response = await fetchJSON(url);
          if (response.verses) {
            bookData.chapters[appChapter] = response.verses.map((v) => ({
              verse: v.verse,
              text: v.text.trim(),
            }));
          }
        } catch (err) {
          console.error(`    ✗ Error fetching ${part.apiName} ${ch}: ${err.message}`);
        }
        await sleep(500);
      }
    }
  } else {
    for (let ch = 1; ch <= bookInfo.chapters; ch++) {
      const url = `https://bible-api.com/${encodeURIComponent(bookInfo.apiName)}+${ch}?translation=web`;
      try {
        const response = await fetchJSON(url);
        if (response.verses) {
          bookData.chapters[ch] = response.verses.map((v) => ({
            verse: v.verse,
            text: v.text.trim(),
          }));
        }
      } catch (err) {
        console.error(`    ✗ Error fetching ${bookInfo.apiName} ${ch}: ${err.message}`);
      }
      await sleep(500);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(bookData, null, 2));
  const totalVerses = Object.values(bookData.chapters).reduce((sum, ch) => sum + ch.length, 0);
  console.log(`    ✓ Saved ${abbreviation}: ${Object.keys(bookData.chapters).length} chapters, ${totalVerses} verses`);
}

async function main() {
  console.log('=== Orthodox Bible Text Download ===');
  console.log(`Output directory: ${DATA_DIR}\n`);

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const downloadable = Object.entries(BOOK_MAP).filter(([, info]) => info.apiName !== null);
  console.log(`Downloading ${downloadable.length} books from bible-api.com (WEB translation)...\n`);

  let completed = 0;
  for (const [abbrev, info] of downloadable) {
    await downloadBook(abbrev, info);
    completed++;
    if (completed % 10 === 0) {
      console.log(`\n  Progress: ${completed}/${downloadable.length} books\n`);
    }
  }

  console.log(`\n✓ Download complete! ${completed} books saved to ${DATA_DIR}`);
  console.log('\nNote: Deuterocanonical books require manual data files.');
  console.log('Run "node src/seeds/import-bible.js" to import into the database.');
}

main().catch((err) => {
  console.error('Download failed:', err);
  process.exit(1);
});
