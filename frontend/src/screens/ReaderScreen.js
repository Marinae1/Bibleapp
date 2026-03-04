import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { useAuth } from '../context/AuthContext';
import {
  fetchChapter,
  addBookmark,
  removeBookmark,
  addHighlight,
  removeHighlight,
  addNote,
} from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

const HIGHLIGHT_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', '#DDA0DD'];

export default function ReaderScreen({ navigation, route }) {
  const { abbreviation, chapter: initialChapter, bookName } = route.params;
  const { colors, fontSize, language, psalmNumbering, isDark, toggleTheme, adjustFontSize } =
    useTheme();
  const { playChapter, isPlaying, togglePlayPause, currentBook, currentChapter } = useAudio();
  const { isAuthenticated } = useAuth();

  const [chapterData, setChapterData] = useState(null);
  const [currentChapterNum, setCurrentChapterNum] = useState(initialChapter);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [bookmarkedVerses, setBookmarkedVerses] = useState(new Set());
  const [highlightedVerses, setHighlightedVerses] = useState({});

  useEffect(() => {
    loadChapter(currentChapterNum);
  }, [currentChapterNum]);

  async function loadChapter(chNum) {
    setLoading(true);
    try {
      const data = await fetchChapter(abbreviation, chNum, psalmNumbering);
      setChapterData(data);
    } catch (error) {
      console.error('Error loading chapter:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePrevChapter = useCallback(() => {
    if (currentChapterNum > 1) {
      setCurrentChapterNum((prev) => prev - 1);
    }
  }, [currentChapterNum]);

  const handleNextChapter = useCallback(() => {
    if (chapterData && currentChapterNum < chapterData.totalChapters) {
      setCurrentChapterNum((prev) => prev + 1);
    }
  }, [currentChapterNum, chapterData]);

  const handleVersePress = useCallback((verse) => {
    setSelectedVerse(verse);
    setShowActions(true);
  }, []);

  const handleBookmark = useCallback(async () => {
    if (!isAuthenticated || !selectedVerse) return;
    try {
      if (bookmarkedVerses.has(selectedVerse.id)) {
        await removeBookmark(selectedVerse.id);
        setBookmarkedVerses((prev) => {
          const next = new Set(prev);
          next.delete(selectedVerse.id);
          return next;
        });
      } else {
        await addBookmark(selectedVerse.id);
        setBookmarkedVerses((prev) => new Set(prev).add(selectedVerse.id));
      }
    } catch {
      Alert.alert('Error', 'Could not update bookmark');
    }
    setShowActions(false);
  }, [selectedVerse, isAuthenticated, bookmarkedVerses]);

  const handleHighlight = useCallback(
    async (color) => {
      if (!isAuthenticated || !selectedVerse) return;
      try {
        await addHighlight(selectedVerse.id, color);
        setHighlightedVerses((prev) => ({ ...prev, [selectedVerse.id]: color }));
      } catch {
        Alert.alert('Error', 'Could not highlight verse');
      }
      setShowActions(false);
    },
    [selectedVerse, isAuthenticated]
  );

  const handleRemoveHighlight = useCallback(async () => {
    if (!isAuthenticated || !selectedVerse) return;
    try {
      await removeHighlight(selectedVerse.id);
      setHighlightedVerses((prev) => {
        const next = { ...prev };
        delete next[selectedVerse.id];
        return next;
      });
    } catch {
      Alert.alert('Error', 'Could not remove highlight');
    }
    setShowActions(false);
  }, [selectedVerse, isAuthenticated]);

  const handleAddNote = useCallback(async () => {
    if (!isAuthenticated || !selectedVerse || !noteText.trim()) return;
    try {
      await addNote(selectedVerse.id, noteText.trim());
      setNoteText('');
      setShowNoteModal(false);
      Alert.alert('Saved', 'Note saved successfully');
    } catch {
      Alert.alert('Error', 'Could not save note');
    }
  }, [selectedVerse, isAuthenticated, noteText]);

  const handlePlayAudio = useCallback(() => {
    if (currentBook === abbreviation && currentChapter === currentChapterNum) {
      togglePlayPause();
    } else {
      playChapter(abbreviation, currentChapterNum);
    }
  }, [abbreviation, currentChapterNum, currentBook, currentChapter]);

  const isCurrentlyPlaying =
    isPlaying && currentBook === abbreviation && currentChapter === currentChapterNum;

  // Build chapter title
  const chapterTitle = abbreviation === 'Psa' ? 'Psalm' : bookName || abbreviation;
  const chapterLabel =
    abbreviation === 'Psa' && chapterData?.chapter?.hebrewNumber
      ? `${chapterTitle} ${currentChapterNum} (LXX) / ${chapterData.chapter.hebrewNumber} (Hebrew)`
      : `${chapterTitle} ${currentChapterNum}`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.topBarCenter}>
          <Text style={[styles.topBarTitle, { color: colors.text }]} numberOfLines={1}>
            {chapterLabel}
          </Text>
        </View>

        <View style={styles.topBarRight}>
          <TouchableOpacity onPress={handlePlayAudio} style={styles.topBarBtn}>
            <Ionicons
              name={isCurrentlyPlaying ? 'pause' : 'play'}
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.topBarBtn}>
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Verses */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.versesContainer}
          showsVerticalScrollIndicator={false}
        >
          {chapterData?.verses?.map((verse) => {
            const verseText =
              language === 'ar' && verse.textArabic ? verse.textArabic : verse.textEnglish;
            const isBookmarked = bookmarkedVerses.has(verse.id);
            const highlightColor = highlightedVerses[verse.id];

            return (
              <TouchableOpacity
                key={verse.id}
                onPress={() => handleVersePress(verse)}
                activeOpacity={0.6}
                style={[
                  styles.verseRow,
                  highlightColor && {
                    backgroundColor: highlightColor + '30',
                    borderRadius: BorderRadius.sm,
                    marginHorizontal: -Spacing.xs,
                    paddingHorizontal: Spacing.xs,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.verseNumber,
                    { color: colors.primary, fontSize: fontSize * 0.7 },
                  ]}
                >
                  {verse.verseNumber}
                </Text>
                <Text
                  style={[
                    styles.verseText,
                    {
                      color: colors.text,
                      fontSize,
                      lineHeight: fontSize * Typography.lineHeights.relaxed,
                      textAlign: language === 'ar' ? 'right' : 'left',
                    },
                  ]}
                >
                  {verseText}
                  {isBookmarked && ' '}
                  {isBookmarked && (
                    <Ionicons name="bookmark" size={fontSize * 0.7} color={colors.accent} />
                  )}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Chapter Navigation */}
          <View style={styles.chapterNav}>
            <TouchableOpacity
              onPress={handlePrevChapter}
              disabled={currentChapterNum <= 1}
              style={[
                styles.navBtn,
                {
                  backgroundColor: colors.surface,
                  opacity: currentChapterNum <= 1 ? 0.4 : 1,
                },
              ]}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
              <Text style={[styles.navBtnText, { color: colors.text }]}>Previous</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNextChapter}
              disabled={!chapterData || currentChapterNum >= chapterData.totalChapters}
              style={[
                styles.navBtn,
                {
                  backgroundColor: colors.surface,
                  opacity:
                    !chapterData || currentChapterNum >= chapterData.totalChapters ? 0.4 : 1,
                },
              ]}
            >
              <Text style={[styles.navBtnText, { color: colors.text }]}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Verse Actions Modal */}
      <Modal visible={showActions} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActions(false)}
        >
          <View
            style={[styles.actionSheet, { backgroundColor: colors.surface }]}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />

            {selectedVerse && (
              <Text style={[styles.selectedRef, { color: colors.textSecondary }]}>
                {chapterTitle} {currentChapterNum}:{selectedVerse.verseNumber}
              </Text>
            )}

            {/* Highlight Colors */}
            <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>Highlight</Text>
            <View style={styles.colorRow}>
              {HIGHLIGHT_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorDot, { backgroundColor: color }]}
                  onPress={() => handleHighlight(color)}
                />
              ))}
              {selectedVerse && highlightedVerses[selectedVerse.id] && (
                <TouchableOpacity
                  style={[styles.colorDot, { backgroundColor: colors.surfaceVariant }]}
                  onPress={handleRemoveHighlight}
                >
                  <Ionicons name="close" size={16} color={colors.text} />
                </TouchableOpacity>
              )}
            </View>

            {/* Action buttons */}
            <TouchableOpacity style={styles.actionRow} onPress={handleBookmark}>
              <Ionicons
                name={
                  selectedVerse && bookmarkedVerses.has(selectedVerse.id)
                    ? 'bookmark'
                    : 'bookmark-outline'
                }
                size={22}
                color={colors.primary}
              />
              <Text style={[styles.actionText, { color: colors.text }]}>
                {selectedVerse && bookmarkedVerses.has(selectedVerse.id)
                  ? 'Remove Bookmark'
                  : 'Add Bookmark'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => {
                setShowActions(false);
                setShowNoteModal(true);
              }}
            >
              <Ionicons name="create-outline" size={22} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>Add Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => setShowActions(false)}
            >
              <Ionicons name="copy-outline" size={22} color={colors.primary} />
              <Text style={[styles.actionText, { color: colors.text }]}>Copy Verse</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Note Modal */}
      <Modal visible={showNoteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.noteModal, { backgroundColor: colors.surface }]}>
            <Text style={[styles.noteTitle, { color: colors.text }]}>Add Note</Text>
            {selectedVerse && (
              <Text style={[styles.noteRef, { color: colors.textSecondary }]}>
                {chapterTitle} {currentChapterNum}:{selectedVerse.verseNumber}
              </Text>
            )}
            <TextInput
              style={[
                styles.noteInput,
                {
                  color: colors.text,
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Write your note..."
              placeholderTextColor={colors.textTertiary}
              multiline
              value={noteText}
              onChangeText={setNoteText}
            />
            <View style={styles.noteButtons}>
              <TouchableOpacity
                style={[styles.noteBtn, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => {
                  setShowNoteModal(false);
                  setNoteText('');
                }}
              >
                <Text style={[styles.noteBtnText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.noteBtn, { backgroundColor: colors.primary }]}
                onPress={handleAddNote}
              >
                <Text style={[styles.noteBtnText, { color: '#FFFFFF' }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal visible={showSettings} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSettings(false)}
        >
          <View style={[styles.actionSheet, { backgroundColor: colors.surface }]}>
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.settingsTitle, { color: colors.text }]}>Reading Settings</Text>

            {/* Font Size */}
            <View style={styles.settingRow}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Font Size</Text>
              <View style={styles.fontSizeControls}>
                <TouchableOpacity
                  onPress={() => adjustFontSize(fontSize - 2)}
                  style={[styles.fontBtn, { backgroundColor: colors.surfaceVariant }]}
                >
                  <Text style={[styles.fontBtnText, { color: colors.text }]}>A-</Text>
                </TouchableOpacity>
                <Text style={[styles.fontSizeValue, { color: colors.text }]}>{fontSize}</Text>
                <TouchableOpacity
                  onPress={() => adjustFontSize(fontSize + 2)}
                  style={[styles.fontBtn, { backgroundColor: colors.surfaceVariant }]}
                >
                  <Text style={[styles.fontBtnText, { color: colors.text }]}>A+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Theme */}
            <TouchableOpacity style={styles.settingRow} onPress={toggleTheme}>
              <Text style={[styles.settingLabel, { color: colors.textSecondary }]}>Theme</Text>
              <View style={styles.settingValue}>
                <Text style={[styles.settingValueText, { color: colors.text }]}>
                  {isDark ? 'Dark' : 'Light'}
                </Text>
                <Ionicons
                  name={isDark ? 'moon' : 'sunny'}
                  size={18}
                  color={colors.primary}
                  style={{ marginLeft: 8 }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
  },
  topBarBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  topBarRight: {
    flexDirection: 'row',
  },
  versesContainer: {
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  verseRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  verseNumber: {
    fontWeight: Typography.weights.bold,
    marginRight: Spacing.sm,
    marginTop: 3,
    minWidth: 20,
  },
  verseText: {
    flex: 1,
  },
  chapterNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  navBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    marginHorizontal: Spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['2xl'],
    paddingTop: Spacing.md,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  selectedRef: {
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  actionLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  colorRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionText: {
    fontSize: Typography.sizes.base,
    marginLeft: Spacing.md,
  },
  noteModal: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  noteTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  noteRef: {
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: Typography.sizes.base,
  },
  noteButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  noteBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  noteBtnText: {
    fontWeight: Typography.weights.semibold,
  },
  settingsTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  settingLabel: {
    fontSize: Typography.sizes.base,
  },
  fontSizeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontBtn: {
    width: 40,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontBtnText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  fontSizeValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    marginHorizontal: Spacing.md,
    minWidth: 24,
    textAlign: 'center',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: Typography.sizes.base,
  },
});
