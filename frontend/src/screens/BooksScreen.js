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
import { fetchBooks } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function BooksScreen({ navigation, route }) {
  const { colors, language } = useTheme();
  const [testaments, setTestaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const filterTestament = route.params?.testament;

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      const data = await fetchBooks();
      setTestaments(data);
    } catch (error) {
      console.error('Error loading books:', error);
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

  const filteredTestaments = filterTestament
    ? testaments.filter((t) => t.name === filterTestament)
    : testaments;

  function renderBook({ item: book }) {
    const displayName = language === 'ar' && book.nameArabic ? book.nameArabic : book.name;

    return (
      <TouchableOpacity
        style={[styles.bookItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() =>
          navigation.navigate('Chapters', {
            abbreviation: book.abbreviation,
            bookName: book.name,
          })
        }
        activeOpacity={0.7}
      >
        <View style={styles.bookInfo}>
          <View style={[styles.bookIcon, { backgroundColor: colors.surfaceVariant }]}>
            <Text style={[styles.bookAbbrev, { color: colors.primary }]}>
              {book.abbreviation}
            </Text>
          </View>
          <View style={styles.bookText}>
            <Text style={[styles.bookName, { color: colors.text }]}>{displayName}</Text>
            <Text style={[styles.bookChapters, { color: colors.textTertiary }]}>
              {book.totalChapters} chapters
              {book.isDeuterocanon ? '  ·  Deuterocanon' : ''}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
      </TouchableOpacity>
    );
  }

  function renderTestament({ item: testament }) {
    return (
      <View style={styles.testamentSection}>
        <Text style={[styles.testamentTitle, { color: colors.primary }]}>
          {testament.name}
        </Text>
        <Text style={[styles.testamentCount, { color: colors.textTertiary }]}>
          {testament.books.length} books
        </Text>
        {testament.books.map((book) => (
          <View key={book.id}>{renderBook({ item: book })}</View>
        ))}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredTestaments}
        renderItem={renderTestament}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  listContent: {
    padding: Spacing.md,
  },
  testamentSection: {
    marginBottom: Spacing.lg,
  },
  testamentTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  testamentCount: {
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.xs,
    borderWidth: 0.5,
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookAbbrev: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  bookText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  bookName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
  bookChapters: {
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
});
