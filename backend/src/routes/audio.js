const express = require('express');
const prisma = require('../config/database');
const { generateAudio } = require('../services/tts');

const router = express.Router();

// GET /api/audio/book/:abbreviation/chapter/:chapter?voice=male&speed=1.0
router.get('/book/:abbreviation/chapter/:chapter', async (req, res, next) => {
  try {
    const { abbreviation, chapter } = req.params;
    const voice = req.query.voice || 'male';
    const speed = parseFloat(req.query.speed) || 1.0;

    const book = await prisma.book.findUnique({
      where: { abbreviation },
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const chapterData = await prisma.chapter.findUnique({
      where: {
        bookId_chapterNumber: {
          bookId: book.id,
          chapterNumber: parseInt(chapter, 10),
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

    // Combine verses into readable text with verse markers
    const fullText = chapterData.verses
      .map((v) => `Verse ${v.verseNumber}. ${v.textEnglish}`)
      .join('\n');

    const audioBuffer = await generateAudio(fullText, voice, speed);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=86400',
    });
    res.send(audioBuffer);
  } catch (err) {
    next(err);
  }
});

// GET /api/audio/verse/:verseId — Audio for a single verse
router.get('/verse/:verseId', async (req, res, next) => {
  try {
    const voice = req.query.voice || 'male';
    const speed = parseFloat(req.query.speed) || 1.0;

    const verse = await prisma.verse.findUnique({
      where: { id: parseInt(req.params.verseId, 10) },
    });

    if (!verse) {
      return res.status(404).json({ error: 'Verse not found' });
    }

    const audioBuffer = await generateAudio(verse.textEnglish, voice, speed);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=86400',
    });
    res.send(audioBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
