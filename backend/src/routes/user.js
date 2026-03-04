const express = require('express');
const prisma = require('../config/database');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ─── Preferences ──────────────────────────────────────────────────

// GET /api/user/preferences
router.get('/preferences', async (req, res, next) => {
  try {
    let prefs = await prisma.userPreference.findUnique({
      where: { userId: req.userId },
    });

    if (!prefs) {
      prefs = await prisma.userPreference.create({
        data: { userId: req.userId },
      });
    }

    res.json(prefs);
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/preferences
router.put('/preferences', async (req, res, next) => {
  try {
    const { fontSize, theme, language, psalmNumbering, audioVoice, audioSpeed } = req.body;

    const data = {};
    if (fontSize !== undefined) data.fontSize = parseInt(fontSize, 10);
    if (theme !== undefined) data.theme = theme;
    if (language !== undefined) data.language = language;
    if (psalmNumbering !== undefined) data.psalmNumbering = psalmNumbering;
    if (audioVoice !== undefined) data.audioVoice = audioVoice;
    if (audioSpeed !== undefined) data.audioSpeed = parseFloat(audioSpeed);

    const prefs = await prisma.userPreference.upsert({
      where: { userId: req.userId },
      update: data,
      create: { userId: req.userId, ...data },
    });

    res.json(prefs);
  } catch (err) {
    next(err);
  }
});

// ─── Bookmarks ────────────────────────────────────────────────────

// GET /api/user/bookmarks
router.get('/bookmarks', async (req, res, next) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: req.userId },
      include: {
        verse: {
          include: {
            chapter: {
              include: {
                book: { select: { name: true, abbreviation: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = bookmarks.map((b) => ({
      id: b.id,
      verseId: b.verseId,
      reference: `${b.verse.chapter.book.name} ${b.verse.chapter.chapterNumber}:${b.verse.verseNumber}`,
      text: b.verse.textEnglish,
      createdAt: b.createdAt,
    }));

    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

// POST /api/user/bookmarks
router.post('/bookmarks', async (req, res, next) => {
  try {
    const { verseId } = req.body;

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: req.userId,
        verseId: parseInt(verseId, 10),
      },
    });

    res.status(201).json(bookmark);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Verse already bookmarked' });
    }
    next(err);
  }
});

// DELETE /api/user/bookmarks/:verseId
router.delete('/bookmarks/:verseId', async (req, res, next) => {
  try {
    await prisma.bookmark.delete({
      where: {
        userId_verseId: {
          userId: req.userId,
          verseId: parseInt(req.params.verseId, 10),
        },
      },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─── Highlights ───────────────────────────────────────────────────

// GET /api/user/highlights
router.get('/highlights', async (req, res, next) => {
  try {
    const highlights = await prisma.highlight.findMany({
      where: { userId: req.userId },
      include: {
        verse: {
          include: {
            chapter: {
              include: {
                book: { select: { name: true, abbreviation: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(highlights);
  } catch (err) {
    next(err);
  }
});

// POST /api/user/highlights
router.post('/highlights', async (req, res, next) => {
  try {
    const { verseId, color = '#FFD700' } = req.body;

    const highlight = await prisma.highlight.upsert({
      where: {
        userId_verseId: {
          userId: req.userId,
          verseId: parseInt(verseId, 10),
        },
      },
      update: { color },
      create: {
        userId: req.userId,
        verseId: parseInt(verseId, 10),
        color,
      },
    });

    res.json(highlight);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/user/highlights/:verseId
router.delete('/highlights/:verseId', async (req, res, next) => {
  try {
    await prisma.highlight.delete({
      where: {
        userId_verseId: {
          userId: req.userId,
          verseId: parseInt(req.params.verseId, 10),
        },
      },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// ─── Notes ────────────────────────────────────────────────────────

// GET /api/user/notes
router.get('/notes', async (req, res, next) => {
  try {
    const notes = await prisma.note.findMany({
      where: { userId: req.userId },
      include: {
        verse: {
          include: {
            chapter: {
              include: {
                book: { select: { name: true, abbreviation: true } },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(notes);
  } catch (err) {
    next(err);
  }
});

// POST /api/user/notes
router.post('/notes', async (req, res, next) => {
  try {
    const { verseId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const note = await prisma.note.create({
      data: {
        userId: req.userId,
        verseId: parseInt(verseId, 10),
        content: content.trim(),
      },
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
});

// PUT /api/user/notes/:noteId
router.put('/notes/:noteId', async (req, res, next) => {
  try {
    const { content } = req.body;

    const note = await prisma.note.updateMany({
      where: {
        id: req.params.noteId,
        userId: req.userId,
      },
      data: { content: content.trim() },
    });

    if (note.count === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/user/notes/:noteId
router.delete('/notes/:noteId', async (req, res, next) => {
  try {
    await prisma.note.deleteMany({
      where: {
        id: req.params.noteId,
        userId: req.userId,
      },
    });

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
