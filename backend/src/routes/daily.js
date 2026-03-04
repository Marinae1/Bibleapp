const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/daily/today — Get today's reading
router.get('/today', async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reading = await prisma.dailyReading.findUnique({
      where: { date: today },
      include: {
        readings: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!reading) {
      // Fall back to daily psalm based on day of year
      const dayOfYear = Math.floor(
        (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
      );
      const psalmNumber = ((dayOfYear - 1) % 151) + 1;

      return res.json({
        date: today.toISOString().split('T')[0],
        title: `Daily Psalm`,
        description: `Today's psalm reading`,
        readings: [
          {
            bookAbbrev: 'Psa',
            chapterStart: psalmNumber,
            verseStart: 1,
            chapterEnd: psalmNumber,
            verseEnd: 999,
            order: 1,
          },
        ],
        isFallback: true,
      });
    }

    res.json(reading);
  } catch (err) {
    next(err);
  }
});

// GET /api/daily/psalm — Get daily psalm
router.get('/psalm', async (req, res, next) => {
  try {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );
    const psalmNumber = ((dayOfYear - 1) % 151) + 1;

    const chapter = await prisma.chapter.findFirst({
      where: {
        book: { abbreviation: 'Psa' },
        chapterNumber: psalmNumber,
      },
      include: {
        verses: { orderBy: { verseNumber: 'asc' } },
        book: { select: { name: true, abbreviation: true } },
      },
    });

    if (!chapter) {
      return res.status(404).json({ error: 'Psalm not found' });
    }

    res.json({
      psalmNumber,
      book: chapter.book,
      verses: chapter.verses,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/daily/reading-plan — Orthodox reading plan schedule
router.get('/reading-plan', async (req, res, next) => {
  try {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
    );

    // Simple Orthodox reading plan: cycle through key readings
    const readingPlan = [
      { book: 'Gen', chapters: [1, 2, 3] },
      { book: 'Psa', chapters: [1] },
      { book: 'Pro', chapters: [1] },
      { book: 'Isa', chapters: [1] },
      { book: 'Mat', chapters: [1] },
      { book: 'Mar', chapters: [1] },
      { book: 'Luk', chapters: [1] },
      { book: 'Joh', chapters: [1] },
      { book: 'Act', chapters: [1] },
      { book: 'Rom', chapters: [1] },
    ];

    const todaysPlan = readingPlan[dayOfYear % readingPlan.length];

    res.json({
      date: today.toISOString().split('T')[0],
      dayOfYear,
      reading: todaysPlan,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
