#!/usr/bin/env node
/**
 * Imports real Agpeya (Book of Hours) prayer content into the database.
 * Reads from data/agpeya/*.json and upserts into AgpeyaHour/AgpeyaPrayer tables.
 *
 * Prerequisites: Run seed.js first to create the 7 AgpeyaHour records.
 *
 * Usage: node src/seeds/import-agpeya.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();
const DATA_DIR = path.join(__dirname, 'data', 'agpeya');

async function main() {
  console.log('=== Agpeya Prayer Import ===\n');

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }

  const dataFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
  console.log(`Found ${dataFiles.length} prayer hour files.\n`);

  let totalPrayers = 0;

  for (const file of dataFiles) {
    const hourData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));

    // Find the hour record
    const hour = await prisma.agpeyaHour.findUnique({
      where: { name: hourData.hourName },
    });

    if (!hour) {
      console.error(`  ✗ Hour "${hourData.hourName}" not found. Run seed.js first.`);
      continue;
    }

    // Delete existing sample prayers for this hour
    await prisma.agpeyaPrayer.deleteMany({ where: { hourId: hour.id } });

    // Insert real prayers
    for (const prayer of hourData.prayers) {
      await prisma.agpeyaPrayer.create({
        data: {
          hourId: hour.id,
          title: prayer.title,
          titleArabic: prayer.titleArabic || null,
          content: prayer.content,
          contentArabic: prayer.contentArabic || null,
          type: prayer.type,
          order: prayer.order,
        },
      });
      totalPrayers++;
    }

    console.log(`  ✓ ${hourData.hourName}: ${hourData.prayers.length} prayers imported`);
  }

  console.log(`\n✓ Import complete! ${totalPrayers} prayers imported.`);
}

main()
  .catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
