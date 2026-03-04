// Maps the app's Orthodox canon abbreviations to bible-api.com book names
// bible-api.com uses the World English Bible (WEB) translation - public domain
// Deuterocanonical books are NOT available from bible-api.com and need manual data

const BOOK_MAP = {
  // ─── Old Testament (Protocanonical) ──────────────────────────
  Gen: { apiName: 'Genesis', chapters: 50 },
  Exo: { apiName: 'Exodus', chapters: 40 },
  Lev: { apiName: 'Leviticus', chapters: 27 },
  Num: { apiName: 'Numbers', chapters: 36 },
  Deu: { apiName: 'Deuteronomy', chapters: 34 },
  Jos: { apiName: 'Joshua', chapters: 24 },
  Jdg: { apiName: 'Judges', chapters: 21 },
  Rut: { apiName: 'Ruth', chapters: 4 },
  '1Sa': { apiName: '1 Samuel', chapters: 31 },
  '2Sa': { apiName: '2 Samuel', chapters: 24 },
  '1Ki': { apiName: '1 Kings', chapters: 22 },
  '2Ki': { apiName: '2 Kings', chapters: 25 },
  '1Ch': { apiName: '1 Chronicles', chapters: 29 },
  '2Ch': { apiName: '2 Chronicles', chapters: 36 },
  '2Es': { apiName: 'Ezra+Nehemiah', isComposite: true,
    parts: [
      { apiName: 'Ezra', chapters: 10, startChapter: 1 },
      { apiName: 'Nehemiah', chapters: 13, startChapter: 11 },
    ],
  },
  Est: { apiName: 'Esther', chapters: 10 }, // Standard 10 chapters; LXX additions ch 11-16 need manual data
  Job: { apiName: 'Job', chapters: 42 },
  Psa: { apiName: 'Psalms', chapters: 150 }, // Psalm 151 needs manual data
  Pro: { apiName: 'Proverbs', chapters: 31 },
  Ecc: { apiName: 'Ecclesiastes', chapters: 12 },
  Sng: { apiName: 'Song of Solomon', chapters: 8 },
  Isa: { apiName: 'Isaiah', chapters: 66 },
  Jer: { apiName: 'Jeremiah', chapters: 52 },
  Lam: { apiName: 'Lamentations', chapters: 5 },
  Eze: { apiName: 'Ezekiel', chapters: 48 },
  Dan: { apiName: 'Daniel', chapters: 12 }, // Standard 12 chapters; LXX additions ch 13-14 need manual data
  Hos: { apiName: 'Hosea', chapters: 14 },
  Joe: { apiName: 'Joel', chapters: 3 },
  Amo: { apiName: 'Amos', chapters: 9 },
  Oba: { apiName: 'Obadiah', chapters: 1 },
  Jon: { apiName: 'Jonah', chapters: 4 },
  Mic: { apiName: 'Micah', chapters: 7 },
  Nah: { apiName: 'Nahum', chapters: 3 },
  Hab: { apiName: 'Habakkuk', chapters: 3 },
  Zep: { apiName: 'Zephaniah', chapters: 3 },
  Hag: { apiName: 'Haggai', chapters: 2 },
  Zec: { apiName: 'Zechariah', chapters: 14 },
  Mal: { apiName: 'Malachi', chapters: 4 },

  // ─── New Testament ───────────────────────────────────────────
  Mat: { apiName: 'Matthew', chapters: 28 },
  Mar: { apiName: 'Mark', chapters: 16 },
  Luk: { apiName: 'Luke', chapters: 24 },
  Joh: { apiName: 'John', chapters: 21 },
  Act: { apiName: 'Acts', chapters: 28 },
  Rom: { apiName: 'Romans', chapters: 16 },
  '1Co': { apiName: '1 Corinthians', chapters: 16 },
  '2Co': { apiName: '2 Corinthians', chapters: 13 },
  Gal: { apiName: 'Galatians', chapters: 6 },
  Eph: { apiName: 'Ephesians', chapters: 6 },
  Php: { apiName: 'Philippians', chapters: 4 },
  Col: { apiName: 'Colossians', chapters: 4 },
  '1Th': { apiName: '1 Thessalonians', chapters: 5 },
  '2Th': { apiName: '2 Thessalonians', chapters: 3 },
  '1Ti': { apiName: '1 Timothy', chapters: 6 },
  '2Ti': { apiName: '2 Timothy', chapters: 4 },
  Tit: { apiName: 'Titus', chapters: 3 },
  Phm: { apiName: 'Philemon', chapters: 1 },
  Heb: { apiName: 'Hebrews', chapters: 13 },
  Jas: { apiName: 'James', chapters: 5 },
  '1Pe': { apiName: '1 Peter', chapters: 5 },
  '2Pe': { apiName: '2 Peter', chapters: 3 },
  '1Jn': { apiName: '1 John', chapters: 5 },
  '2Jn': { apiName: '2 John', chapters: 1 },
  '3Jn': { apiName: '3 John', chapters: 1 },
  Jud: { apiName: 'Jude', chapters: 1 },
  Rev: { apiName: 'Revelation', chapters: 22 },

  // ─── Deuterocanonical (manual data required) ─────────────────
  '1Es': { apiName: null, chapters: 9, deuterocanonical: true },
  Tob: { apiName: null, chapters: 14, deuterocanonical: true },
  Jdt: { apiName: null, chapters: 16, deuterocanonical: true },
  Wis: { apiName: null, chapters: 19, deuterocanonical: true },
  Sir: { apiName: null, chapters: 51, deuterocanonical: true },
  Bar: { apiName: null, chapters: 5, deuterocanonical: true },
  LJe: { apiName: null, chapters: 1, deuterocanonical: true },
  '1Ma': { apiName: null, chapters: 16, deuterocanonical: true },
  '2Ma': { apiName: null, chapters: 15, deuterocanonical: true },
  '3Ma': { apiName: null, chapters: 7, deuterocanonical: true },
};

// Books that need supplemental LXX-only chapters beyond what the API provides
const LXX_SUPPLEMENTS = {
  Est: { extraChapters: [11, 12, 13, 14, 15, 16] }, // Additions to Esther
  Dan: { extraChapters: [13, 14] },                   // Susanna (13), Bel and the Dragon (14)
  Psa: { extraChapters: [151] },                       // Psalm 151 (LXX only)
};

module.exports = { BOOK_MAP, LXX_SUPPLEMENTS };
