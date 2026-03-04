const express = require('express');
const prisma = require('../config/database');
const { septuagintToHebrew } = require('../config/constants');

const router = express.Router();

// GET /api/bible/books — List all books grouped by testament
router.get('/books', async (req, res, next) => {
  try {
    const testaments = await prisma.testament.findMany({
      orderBy: { order: 'asc' },
      include: {
        books: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            name: true,
            nameArabic: true,
            abbreviation: true,
            totalChapters: true,
            isSeptuagint: true,
            isDeuterocanon: true,
          },
        },
      },
    });
    res.json(testaments);
  } catch (err) {
    next(err);
  }
});

// GET /api/bible/book/:abbreviation — Get a single book
router.get('/book/:abbreviation', async (req, res, next) => {
  try {
    const book = await prisma.book.findUnique({
      where: { abbreviation: req.params.abbreviation },
      include: {
        testament: { select: { name: true } },
        chapters: {
          orderBy: { chapterNumber: 'asc' },
          select: { id: true, chapterNumber: true },
        },
      },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (err) {
    next(err);
  }
});

// GET /api/bible/book/:abbreviation/chapter/:chapter — Get all verses in a chapter
router.get('/book/:abbreviation/chapter/:chapter', async (req, res, next) => {
  try {
    const { abbreviation, chapter } = req.params;
    const psalmNumbering = req.query.numbering || 'septuagint';

    const book = await prisma.book.findUnique({
      where: { abbreviation },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const chapterNum = parseInt(chapter, 10);

    const chapterData = await prisma.chapter.findUnique({
      where: {
        bookId_chapterNumber: {
          bookId: book.id,
          chapterNumber: chapterNum,
        },
      },
      include: {
        verses: {
          orderBy: { verseNumber: 'asc' },
        },
      },
    });

    if (!chapterData) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    // For Psalms, provide alternate numbering
    let alternateNumber = null;
    if (book.abbreviation === 'Psa' && psalmNumbering === 'septuagint') {
      alternateNumber = septuagintToHebrew(chapterNum);
    }

    res.json({
      book: {
        id: book.id,
        name: book.name,
        abbreviation: book.abbreviation,
      },
      chapter: {
        id: chapterData.id,
        number: chapterData.chapterNumber,
        hebrewNumber: alternateNumber,
      },
      verses: chapterData.verses,
      totalChapters: book.totalChapters,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/bible/verse/:verseId — Get a single verse
router.get('/verse/:verseId', async (req, res, next) => {
  try {
    const verse = await prisma.verse.findUnique({
      where: { id: parseInt(req.params.verseId, 10) },
      include: {
        chapter: {
          include: {
            book: {
              select: { name: true, abbreviation: true },
            },
          },
        },
      },
    });

    if (!verse) {
      return res.status(404).json({ error: 'Verse not found' });
    }

    res.json(verse);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
