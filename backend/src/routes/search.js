const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/search?q=house+of+the+Lord&lang=en&book=Psa&page=1&limit=20
router.get('/', async (req, res, next) => {
  try {
    const { q, lang = 'en', book, page = 1, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    // Build WHERE clause
    const where = {};
    const searchField = lang === 'ar' ? 'textArabic' : 'textEnglish';
    where[searchField] = { contains: q.trim(), mode: 'insensitive' };

    if (book) {
      where.chapter = {
        book: { abbreviation: book },
      };
    }

    const [results, total] = await Promise.all([
      prisma.verse.findMany({
        where,
        include: {
          chapter: {
            include: {
              book: {
                select: { name: true, abbreviation: true },
              },
            },
          },
        },
        orderBy: [
          { chapter: { book: { order: 'asc' } } },
          { chapter: { chapterNumber: 'asc' } },
          { verseNumber: 'asc' },
        ],
        skip: offset,
        take: limitNum,
      }),
      prisma.verse.count({ where }),
    ]);

    const formatted = results.map((v) => ({
      verseId: v.id,
      reference: `${v.chapter.book.name} ${v.chapter.chapterNumber}:${v.verseNumber}`,
      abbreviation: v.chapter.book.abbreviation,
      chapter: v.chapter.chapterNumber,
      verse: v.verseNumber,
      text: lang === 'ar' ? v.textArabic : v.textEnglish,
    }));

    res.json({
      query: q,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      results: formatted,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
