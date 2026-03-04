import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fetchHighlights } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function HighlightsScreen({ navigation }) {
  const { colors } = useTheme();
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHighlights();
  }, []);

  async function loadHighlights() {
    try {
      const data = await fetchHighlights();
      setHighlights(data);
    } catch (error) {
      console.error('Error loading highlights:', error);
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

  if (highlights.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="color-palette-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Highlights</Text>
        <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
          Long-press a verse while reading to highlight it
        </Text>
      </View>
    );
  }

  function renderHighlight({ item }) {
    const ref = `${item.verse.chapter.book.name} ${item.verse.chapter.chapterNumber}:${item.verse.verseNumber}`;

    return (
      <TouchableOpacity
        style={[
          styles.highlightItem,
          { backgroundColor: item.color + '20', borderLeftColor: item.color },
        ]}
        onPress={() =>
          navigation.navigate('Reader', {
            abbreviation: item.verse.chapter.book.abbreviation,
            chapter: item.verse.chapter.chapterNumber,
          })
        }
        activeOpacity={0.7}
      >
        <Text style={[styles.highlightRef, { color: colors.primary }]}>{ref}</Text>
        <Text style={[styles.highlightText, { color: colors.text }]} numberOfLines={2}>
          {item.verse.textEnglish}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={highlights}
        renderItem={renderHighlight}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  listContent: { padding: Spacing.md },
  emptyTitle: { fontSize: Typography.sizes.xl, fontWeight: Typography.weights.semibold, marginTop: Spacing.md },
  emptyText: { fontSize: Typography.sizes.base, marginTop: Spacing.xs, textAlign: 'center' },
  highlightItem: {
    borderRadius: BorderRadius.lg,
    borderLeftWidth: 4,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  highlightRef: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, marginBottom: Spacing.xs },
  highlightText: { fontSize: Typography.sizes.base, lineHeight: Typography.sizes.base * 1.5 },
});
