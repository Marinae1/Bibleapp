const express = require('express');
const prisma = require('../config/database');

const router = express.Router();

// GET /api/prayer/agpeya — List all Agpeya hours
router.get('/agpeya', async (req, res, next) => {
  try {
    const hours = await prisma.agpeyaHour.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        nameArabic: true,
        order: true,
        _count: { select: { prayers: true } },
      },
    });

    res.json(hours);
  } catch (err) {
    next(err);
  }
});

// GET /api/prayer/agpeya/:hourId — Get prayers for a specific hour
router.get('/agpeya/:hourId', async (req, res, next) => {
  try {
    const hour = await prisma.agpeyaHour.findUnique({
      where: { id: parseInt(req.params.hourId, 10) },
      include: {
        prayers: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!hour) {
      return res.status(404).json({ error: 'Agpeya hour not found' });
    }

    res.json(hour);
  } catch (err) {
    next(err);
  }
});

// GET /api/prayer/current-hour — Suggest the appropriate hour based on time of day
router.get('/current-hour', async (req, res, next) => {
  try {
    const now = new Date();
    const hour = now.getHours();

    // Map time of day to Agpeya hours
    let agpeyaHourName;
    if (hour >= 6 && hour < 9) agpeyaHourName = 'First Hour';       // Prime (6 AM)
    else if (hour >= 9 && hour < 12) agpeyaHourName = 'Third Hour';  // Terce (9 AM)
    else if (hour >= 12 && hour < 15) agpeyaHourName = 'Sixth Hour'; // Sext (12 PM)
    else if (hour >= 15 && hour < 17) agpeyaHourName = 'Ninth Hour'; // None (3 PM)
    else if (hour >= 17 && hour < 19) agpeyaHourName = 'Eleventh Hour'; // Vespers (5 PM)
    else if (hour >= 19 && hour < 22) agpeyaHourName = 'Twelfth Hour';  // Compline (7 PM)
    else agpeyaHourName = 'Midnight Hour'; // Midnight prayers

    const agpeyaHour = await prisma.agpeyaHour.findFirst({
      where: { name: agpeyaHourName },
      include: {
        prayers: { orderBy: { order: 'asc' } },
      },
    });

    res.json({
      currentTime: now.toISOString(),
      suggestedHour: agpeyaHourName,
      hour: agpeyaHour || null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
