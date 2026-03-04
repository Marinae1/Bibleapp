import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { fetchDailyPsalm, fetchDailyReading } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function DailyScreen({ navigation }) {
  const { colors, fontSize } = useTheme();
  const { playChapter } = useAudio();
  const [psalm, setPsalm] = useState(null);
  const [dailyReading, setDailyReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDaily();
  }, []);

  async function loadDaily() {
    try {
      const [psalmData, readingData] = await Promise.all([
        fetchDailyPsalm().catch(() => null),
        fetchDailyReading().catch(() => null),
      ]);
      setPsalm(psalmData);
      setDailyReading(readingData);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <Ionicons name="sunny" size={28} color={colors.accent} />
        <Text style={[styles.dateText, { color: colors.text }]}>{today}</Text>
      </View>

      {/* Daily Psalm */}
      {psalm && (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>DAILY PSALM</Text>
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                Psalm {psalm.psalmNumber} (LXX)
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.playBtn, { backgroundColor: colors.primary }]}
              onPress={() => playChapter('Psa', psalm.psalmNumber)}
            >
              <Ionicons name="play" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {psalm.verses?.slice(0, 5).map((verse) => (
            <View key={verse.id} style={styles.verseRow}>
              <Text style={[styles.verseNum, { color: colors.primary, fontSize: fontSize * 0.7 }]}>
                {verse.verseNumber}
              </Text>
              <Text
                style={[
                  styles.verseText,
                  {
                    color: colors.text,
                    fontSize,
                    lineHeight: fontSize * Typography.lineHeights.relaxed,
                  },
                ]}
              >
                {verse.textEnglish}
              </Text>
            </View>
          ))}

          {psalm.verses?.length > 5 && (
            <TouchableOpacity
              style={styles.readMore}
              onPress={() =>
                navigation.navigate('Reader', {
                  abbreviation: 'Psa',
                  chapter: psalm.psalmNumber,
                  bookName: 'Psalms',
                })
              }
            >
              <Text style={[styles.readMoreText, { color: colors.primary }]}>
                Read full psalm
              </Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Daily Reading */}
      {dailyReading && (
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>TODAY'S READING</Text>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {dailyReading.title}
          </Text>

          {dailyReading.readings?.map((reading, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.readingItem, { borderColor: colors.border }]}
              onPress={() =>
                navigation.navigate('Reader', {
                  abbreviation: reading.bookAbbrev,
                  chapter: reading.chapterStart,
                })
              }
            >
              <Ionicons name="book-outline" size={18} color={colors.primary} />
              <Text style={[styles.readingText, { color: colors.text }]}>
                {reading.bookAbbrev} {reading.chapterStart}
                {reading.verseStart > 1 ? `:${reading.verseStart}` : ''}
                {reading.chapterEnd !== reading.chapterStart
                  ? ` — ${reading.chapterEnd}`
                  : reading.verseEnd < 999
                  ? `-${reading.verseEnd}`
                  : ''}
              </Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Orthodox Calendar note */}
      <View style={[styles.card, { backgroundColor: colors.surfaceVariant }]}>
        <Ionicons name="calendar" size={24} color={colors.primary} />
        <Text style={[styles.calendarNote, { color: colors.textSecondary }]}>
          Daily readings follow the Coptic Orthodox lectionary cycle. Connect to
          the server for the full Orthodox reading plan.
        </Text>
      </View>
    </ScrollView>
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
  content: {
    padding: Spacing.md,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  dateText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
  },
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  cardLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  cardTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  verseNum: {
    fontWeight: Typography.weights.bold,
    marginRight: Spacing.sm,
    minWidth: 18,
  },
  verseText: {
    flex: 1,
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  readMoreText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  readingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    gap: Spacing.sm,
  },
  readingText: {
    fontSize: Typography.sizes.base,
    flex: 1,
  },
  calendarNote: {
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.sm,
    lineHeight: Typography.sizes.sm * Typography.lineHeights.relaxed,
  },
});
