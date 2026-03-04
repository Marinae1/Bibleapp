import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fetchBookmarks, removeBookmark } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function BookmarksScreen({ navigation }) {
  const { colors } = useTheme();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  async function loadBookmarks() {
    try {
      const data = await fetchBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(verseId) {
    Alert.alert('Remove Bookmark', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeBookmark(verseId);
            setBookmarks((prev) => prev.filter((b) => b.verseId !== verseId));
          } catch {
            Alert.alert('Error', 'Could not remove bookmark');
          }
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="bookmark-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Bookmarks</Text>
        <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
          Tap a verse while reading to bookmark it
        </Text>
      </View>
    );
  }

  function renderBookmark({ item }) {
    return (
      <TouchableOpacity
        style={[styles.bookmarkItem, { backgroundColor: colors.surface }]}
        onPress={() => {
          const parts = item.reference.split(' ');
          navigation.navigate('Reader', {
            abbreviation: parts[0].substring(0, 3),
            chapter: parseInt(parts[1]?.split(':')[0] || '1', 10),
          });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.bookmarkContent}>
          <View style={styles.bookmarkHeader}>
            <Ionicons name="bookmark" size={18} color={colors.accent} />
            <Text style={[styles.bookmarkRef, { color: colors.primary }]}>{item.reference}</Text>
          </View>
          <Text style={[styles.bookmarkText, { color: colors.text }]} numberOfLines={2}>
            {item.text}
          </Text>
          <Text style={[styles.bookmarkDate, { color: colors.textTertiary }]}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleRemove(item.verseId)} style={styles.removeBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={bookmarks}
        renderItem={renderBookmark}
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
  bookmarkItem: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  bookmarkContent: { flex: 1 },
  bookmarkHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xs },
  bookmarkRef: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold },
  bookmarkText: { fontSize: Typography.sizes.base, lineHeight: Typography.sizes.base * 1.5 },
  bookmarkDate: { fontSize: Typography.sizes.xs, marginTop: Spacing.xs },
  removeBtn: { justifyContent: 'center', paddingLeft: Spacing.md },
});
