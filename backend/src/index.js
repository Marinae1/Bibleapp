require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const bibleRoutes = require('./routes/bible');
const searchRoutes = require('./routes/search');
const audioRoutes = require('./routes/audio');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dailyRoutes = require('./routes/daily');
const prayerRoutes = require('./routes/prayer');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Routes ───────────────────────────────────────────────────────
app.use('/api/bible', bibleRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/daily', dailyRoutes);
app.use('/api/prayer', prayerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// ─── Error handler ────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`Orthodox Bible API running on port ${PORT}`);
});

module.exports = app;
