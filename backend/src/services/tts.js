const OpenAI = require('openai');
const { AUDIO_VOICES } = require('../config/constants');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate audio from text using OpenAI TTS API.
 * Falls back to a placeholder if API key is not configured.
 *
 * @param {string} text - The text to convert to speech
 * @param {'male'|'female'} voiceType - Voice gender preference
 * @param {number} speed - Playback speed (0.25 to 4.0)
 * @returns {Promise<Buffer>} MP3 audio buffer
 */
async function generateAudio(text, voiceType = 'male', speed = 1.0) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY in your environment.');
  }

  const voice = AUDIO_VOICES[voiceType] || AUDIO_VOICES.male;

  const response = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
    speed: Math.max(0.25, Math.min(4.0, speed)),
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer;
}

module.exports = { generateAudio };
