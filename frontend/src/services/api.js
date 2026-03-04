import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
let authToken = null;

export function setAuthToken(token) {
  authToken = token;
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

// ─── Bible API ──────────────────────────────────────────────────

export async function fetchBooks() {
  const { data } = await api.get('/bible/books');
  return data;
}

export async function fetchBook(abbreviation) {
  const { data } = await api.get(`/bible/book/${abbreviation}`);
  return data;
}

export async function fetchChapter(abbreviation, chapter, numbering = 'septuagint') {
  const { data } = await api.get(`/bible/book/${abbreviation}/chapter/${chapter}`, {
    params: { numbering },
  });
  return data;
}

export async function fetchVerse(verseId) {
  const { data } = await api.get(`/bible/verse/${verseId}`);
  return data;
}

// ─── Search API ─────────────────────────────────────────────────

export async function searchBible(query, options = {}) {
  const { data } = await api.get('/search', {
    params: {
      q: query,
      lang: options.lang || 'en',
      book: options.book,
      page: options.page || 1,
      limit: options.limit || 20,
    },
  });
  return data;
}

// ─── Audio API ──────────────────────────────────────────────────

export function getAudioUrl(abbreviation, chapter, voice = 'male', speed = 1.0) {
  return `${API_BASE_URL}/audio/book/${abbreviation}/chapter/${chapter}?voice=${voice}&speed=${speed}`;
}

export function getVerseAudioUrl(verseId, voice = 'male', speed = 1.0) {
  return `${API_BASE_URL}/audio/verse/${verseId}?voice=${voice}&speed=${speed}`;
}

// ─── Auth API ───────────────────────────────────────────────────

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}

export async function register(email, password, displayName) {
  const { data } = await api.post('/auth/register', { email, password, displayName });
  return data;
}

// ─── User Features API ─────────────────────────────────────────

export async function fetchBookmarks() {
  const { data } = await api.get('/user/bookmarks');
  return data;
}

export async function addBookmark(verseId) {
  const { data } = await api.post('/user/bookmarks', { verseId });
  return data;
}

export async function removeBookmark(verseId) {
  const { data } = await api.delete(`/user/bookmarks/${verseId}`);
  return data;
}

export async function fetchHighlights() {
  const { data } = await api.get('/user/highlights');
  return data;
}

export async function addHighlight(verseId, color) {
  const { data } = await api.post('/user/highlights', { verseId, color });
  return data;
}

export async function removeHighlight(verseId) {
  const { data } = await api.delete(`/user/highlights/${verseId}`);
  return data;
}

export async function fetchNotes() {
  const { data } = await api.get('/user/notes');
  return data;
}

export async function addNote(verseId, content) {
  const { data } = await api.post('/user/notes', { verseId, content });
  return data;
}

export async function updateNote(noteId, content) {
  const { data } = await api.put(`/user/notes/${noteId}`, { content });
  return data;
}

export async function deleteNote(noteId) {
  const { data } = await api.delete(`/user/notes/${noteId}`);
  return data;
}

// ─── Preferences API ───────────────────────────────────────────

export async function fetchPreferences() {
  const { data } = await api.get('/user/preferences');
  return data;
}

export async function updatePreferences(prefs) {
  const { data } = await api.put('/user/preferences', prefs);
  return data;
}

// ─── Daily & Prayer API ─────────────────────────────────────────

export async function fetchDailyReading() {
  const { data } = await api.get('/daily/today');
  return data;
}

export async function fetchDailyPsalm() {
  const { data } = await api.get('/daily/psalm');
  return data;
}

export async function fetchAgpeyaHours() {
  const { data } = await api.get('/prayer/agpeya');
  return data;
}

export async function fetchAgpeyaHour(hourId) {
  const { data } = await api.get(`/prayer/agpeya/${hourId}`);
  return data;
}

export async function fetchCurrentHour() {
  const { data } = await api.get('/prayer/current-hour');
  return data;
}

export default api;
