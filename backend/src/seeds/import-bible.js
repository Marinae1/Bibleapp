#!/usr/bin/env node
/**
 * Imports downloaded Bible text into the database.
 * Reads JSON files from data/books/ and upserts verses into existing book/chapter structure.
 *
 * Prerequisites:
 *   1. Run seed.js first to create books and chapters
 *   2. Run download-bible.js to fetch text data (or provide manual JSON files)
 *
 * Usage: node src/seeds/import-bible.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, 'data', 'books');

async function importBook(abbreviation) {
  const filePath = path.join(DATA_DIR, `${abbreviation}.json`);

  if (!fs.existsSync(filePath)) {
    return { skipped: true };
  }

  const bookData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!bookData.chapters || Object.keys(bookData.chapters).length === 0) {
    return { skipped: true };
  }

  // Find the book in the database
  const book = await prisma.book.findUnique({
    where: { abbreviation },
    include: { chapters: true },
  });

  if (!book) {
    console.error(`  ✗ Book ${abbreviation} not found in database. Run seed.js first.`);
    return { skipped: true };
  }

  let versesImported = 0;
  let chaptersProcessed = 0;

  for (const [chapterNumStr, verses] of Object.entries(bookData.chapters)) {
    const chapterNumber = parseInt(chapterNumStr, 10);

    // Find or create chapter
    let chapter = book.chapters.find((c) => c.chapterNumber === chapterNumber);
    if (!chapter) {
      chapter = await prisma.chapter.upsert({
        where: {
          bookId_chapterNumber: { bookId: book.id, chapterNumber },
        },
        update: {},
        create: { bookId: book.id, chapterNumber },
      });
    }

    // Batch upsert verses
    for (const verseData of verses) {
      const verseNumber = verseData.verse;
      const textEnglish = verseData.text;
      const textArabic = verseData.textArabic || null;

      await prisma.verse.upsert({
        where: {
          chapterId_verseNumber: {
            chapterId: chapter.id,
            verseNumber,
          },
        },
        update: {
          textEnglish,
          ...(textArabic ? { textArabic } : {}),
        },
        create: {
          chapterId: chapter.id,
          verseNumber,
          textEnglish,
          textArabic,
        },
      });

      versesImported++;
    }

    chaptersProcessed++;
  }

  return { versesImported, chaptersProcessed };
}

async function main() {
  console.log('=== Orthodox Bible Text Import ===\n');

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    console.error('Run download-bible.js first or provide manual JSON files.');
    process.exit(1);
  }

  const dataFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  console.log(`Found ${dataFiles.length} data files to import.\n`);

  let totalVerses = 0;
  let totalChapters = 0;
  let booksImported = 0;

  for (const file of dataFiles) {
    const abbreviation = file.replace('.json', '');
    process.stdout.write(`  Importing ${abbreviation}...`);

    const result = await importBook(abbreviation);

    if (result.skipped) {
      console.log(' skipped (no data or book not found)');
    } else {
      console.log(` ✓ ${result.chaptersProcessed} chapters, ${result.versesImported} verses`);
      totalVerses += result.versesImported;
      totalChapters += result.chaptersProcessed;
      booksImported++;
    }
  }

  console.log(`\n✓ Import complete!`);
  console.log(`  Books: ${booksImported}`);
  console.log(`  Chapters: ${totalChapters}`);
  console.log(`  Verses: ${totalVerses}`);
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
