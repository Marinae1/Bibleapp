# Orthodox Bible

A full-featured mobile Bible application for the Coptic Orthodox Church, built with React Native (Expo) and Node.js. Features the complete 75-book Orthodox canon with Septuagint text, Agpeya prayers, audio narration, and bilingual English/Arabic support.

## Features

- **Full Orthodox Canon** — All 75 books including Deuterocanonical texts (Wisdom, Sirach, Baruch, Maccabees, and more)
- **151 Psalms** — Complete Septuagint psalter with LXX and Hebrew numbering options
- **Agpeya Prayers** — All seven canonical prayer hours with authentic Coptic Orthodox prayers
- **Audio Narration** — Listen to any chapter with AI-generated voices (male/female, adjustable speed)
- **Bilingual** — Full English and Arabic text with instant language switching
- **Personal Study** — Bookmarks, highlights (8 colors), and personal notes synced across devices
- **Daily Readings** — Daily psalm rotation and Orthodox lectionary readings
- **Dark Mode** — Full dark/light theme support with customizable font sizes
- **Search** — Full-text search across all scripture with book filtering

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile App | React Native + Expo SDK 50 |
| Navigation | React Navigation (tabs + stacks) |
| Backend API | Express.js |
| Database | PostgreSQL + Prisma ORM |
| Authentication | JWT + bcrypt |
| Audio | OpenAI Text-to-Speech |
| Storage | Expo SecureStore (tokens) |

## Project Structure

```
├── backend/
│   ├── prisma/schema.prisma      # Database schema
│   └── src/
│       ├── index.js               # Express server entry
│       ├── routes/                 # API endpoints
│       │   ├── bible.js           # Scripture content
│       │   ├── search.js          # Full-text search
│       │   ├── audio.js           # TTS audio generation
│       │   ├── auth.js            # Authentication
│       │   ├── user.js            # Bookmarks/highlights/notes
│       │   ├── daily.js           # Daily readings
│       │   └── prayer.js          # Agpeya prayers
│       └── seeds/                  # Database seeding
│           ├── seed.js            # Book/chapter structure
│           ├── download-bible.js  # Fetch WEB text from API
│           ├── import-bible.js    # Import verses to database
│           └── import-agpeya.js   # Import Agpeya prayers
├── frontend/
│   ├── App.js                     # Root component
│   └── src/
│       ├── screens/               # 14 app screens
│       ├── components/            # Reusable components
│       ├── context/               # Theme, Auth, Audio providers
│       ├── services/api.js        # API client
│       └── constants/             # Theme colors, API config
├── preview.html                   # Interactive web preview
└── server.js                      # Preview server
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device with Expo Go)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL, JWT secret, and OpenAI API key

# Set up database
npx prisma migrate dev --name init

# Seed book structure (75 books, chapters)
npm run db:seed

# Download Bible text (World English Bible — public domain)
npm run db:download-text

# Import downloaded text into database
npm run db:import-bible

# Import Agpeya prayer content
npm run db:import-agpeya

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on specific platform
npx expo start --ios
npx expo start --android
```

### Quick Preview (No Setup Required)

```bash
node server.js
# Open http://localhost:8080 in your browser
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret for JWT token signing | Yes |
| `OPENAI_API_KEY` | OpenAI API key for audio narration | For audio |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## API Endpoints

### Scripture
- `GET /api/bible/books` — All books grouped by testament
- `GET /api/bible/book/:abbrev/chapter/:num` — Chapter with verses
- `GET /api/search?q=...&lang=en&book=Psa` — Full-text search

### Audio
- `GET /api/audio/book/:abbrev/chapter/:num` — Chapter audio (MP3)

### Daily & Prayer
- `GET /api/daily/psalm` — Today's daily psalm
- `GET /api/daily/today` — Today's lectionary reading
- `GET /api/prayer/agpeya` — All Agpeya prayer hours
- `GET /api/prayer/current-hour` — Suggested hour based on time

### User Features (requires authentication)
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `GET/POST/DELETE /api/user/bookmarks` — Bookmark management
- `GET/POST/DELETE /api/user/highlights` — Highlight management
- `GET/POST/PUT/DELETE /api/user/notes` — Note management

## Building for Production

### EAS Build (Expo Application Services)

```bash
cd frontend

# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

### Backend Deployment

The backend is a standard Express.js application. Deploy to any Node.js hosting:

1. Set environment variables on your hosting platform
2. Run `npx prisma migrate deploy` for database migrations
3. Run `npm run db:seed-full` to populate the database
4. Start with `npm start`

## Bible Text Sources

- **English**: World English Bible (WEB) — public domain
- **Arabic**: Smith & Van Dyke translation (1865) — public domain
- **Deuterocanonical**: Brenton's English Septuagint (1851) — public domain

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is provided as-is. Bible text used is from public domain translations.
