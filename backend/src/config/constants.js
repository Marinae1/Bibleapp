// Psalm numbering offset: Septuagint psalms 10–146 are numbered one less than Hebrew
// Septuagint Psalm N = Hebrew Psalm N+1 (for psalms 10–146)
const PSALM_NUMBER_OFFSET_RANGES = [
  { septuagintStart: 1, septuagintEnd: 8, offset: 0 },
  { septuagintStart: 9, septuagintEnd: 9, offset: 0 },   // LXX 9 = Hebrew 9–10 combined
  { septuagintStart: 10, septuagintEnd: 112, offset: 1 }, // LXX N = Hebrew N+1
  { septuagintStart: 113, septuagintEnd: 113, offset: 1 },// LXX 113 = Hebrew 114–115
  { septuagintStart: 114, septuagintEnd: 115, offset: 2 },// LXX 114–115 = Hebrew 116
  { septuagintStart: 116, septuagintEnd: 145, offset: 1 },// LXX N = Hebrew N+1
  { septuagintStart: 146, septuagintEnd: 146, offset: 1 },// LXX 146–147 = Hebrew 147
  { septuagintStart: 147, septuagintEnd: 147, offset: 1 },
  { septuagintStart: 148, septuagintEnd: 150, offset: 0 },
  { septuagintStart: 151, septuagintEnd: 151, offset: 0 },// LXX only
];

function septuagintToHebrew(lxxPsalm) {
  for (const range of PSALM_NUMBER_OFFSET_RANGES) {
    if (lxxPsalm >= range.septuagintStart && lxxPsalm <= range.septuagintEnd) {
      return lxxPsalm + range.offset;
    }
  }
  return lxxPsalm;
}

function hebrewToSeptuagint(hebrewPsalm) {
  for (const range of PSALM_NUMBER_OFFSET_RANGES) {
    const hebrewEquiv = range.septuagintStart + range.offset;
    const hebrewEnd = range.septuagintEnd + range.offset;
    if (hebrewPsalm >= hebrewEquiv && hebrewPsalm <= hebrewEnd) {
      return hebrewPsalm - range.offset;
    }
  }
  return hebrewPsalm;
}

const HIGHLIGHT_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96E6A1', // Green
  '#DDA0DD', // Plum
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
];

const AUDIO_VOICES = {
  male: 'onyx',     // OpenAI TTS voice
  female: 'nova',   // OpenAI TTS voice
};

module.exports = {
  PSALM_NUMBER_OFFSET_RANGES,
  septuagintToHebrew,
  hebrewToSeptuagint,
  HIGHLIGHT_COLORS,
  AUDIO_VOICES,
};
