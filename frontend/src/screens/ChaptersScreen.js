import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { fetchBook } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function ChaptersScreen({ navigation, route }) {
  const { colors, psalmNumbering } = useTheme();
  const { abbreviation, bookName } = route.params;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: bookName || abbreviation });
    loadBook();
  }, [abbreviation]);

  async function loadBook() {
    try {
      const data = await fetchBook(abbreviation);
      setBook(data);
    } catch (error) {
      console.error('Error loading book:', error);
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

  const chapters = book?.chapters || [];

  function renderChapter({ item }) {
    const isPsalm = abbreviation === 'Psa';
    let label = item.chapterNumber.toString();

    if (isPsalm && psalmNumbering === 'septuagint') {
      label = `${item.chapterNumber}`;
    }

    return (
      <TouchableOpacity
        style={[styles.chapterBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() =>
          navigation.navigate('Reader', {
            abbreviation,
            chapter: item.chapterNumber,
            bookName: book.name,
          })
        }
        activeOpacity={0.7}
      >
        <Text style={[styles.chapterNum, { color: colors.text }]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.bookTitle, { color: colors.text }]}>{book?.name}</Text>
        <Text style={[styles.bookMeta, { color: colors.textSecondary }]}>
          {chapters.length} chapters
          {abbreviation === 'Psa' ? ` · ${psalmNumbering === 'septuagint' ? 'LXX' : 'Hebrew'} numbering` : ''}
        </Text>
      </View>

      <FlatList
        data={chapters}
        renderItem={renderChapter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={5}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
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
  header: {
    padding: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  bookTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  bookMeta: {
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.xs,
  },
  grid: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  row: {
    justifyContent: 'flex-start',
  },
  chapterBtn: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderWidth: 0.5,
  },
  chapterNum: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
  },
});
