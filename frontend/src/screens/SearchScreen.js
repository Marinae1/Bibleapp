import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { searchBible } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function SearchScreen({ navigation }) {
  const { colors, language } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (pageNum = 1) => {
      if (!query.trim() || query.trim().length < 2) return;

      setLoading(true);
      setHasSearched(true);
      try {
        const data = await searchBible(query.trim(), {
          lang: language,
          page: pageNum,
        });
        if (pageNum === 1) {
          setResults(data.results);
        } else {
          setResults((prev) => [...prev, ...data.results]);
        }
        setTotal(data.total);
        setPage(pageNum);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    },
    [query, language]
  );

  const handleLoadMore = useCallback(() => {
    if (!loading && results.length < total) {
      handleSearch(page + 1);
    }
  }, [loading, results.length, total, page, handleSearch]);

  function renderResult({ item }) {
    return (
      <TouchableOpacity
        style={[styles.resultItem, { backgroundColor: colors.surface }]}
        onPress={() =>
          navigation.navigate('Reader', {
            abbreviation: item.abbreviation,
            chapter: item.chapter,
            bookName: item.reference.split(' ')[0],
          })
        }
        activeOpacity={0.7}
      >
        <Text style={[styles.resultRef, { color: colors.primary }]}>{item.reference}</Text>
        <Text style={[styles.resultText, { color: colors.text }]} numberOfLines={3}>
          {item.text}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={20} color={colors.textTertiary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search scripture..."
          placeholderTextColor={colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => handleSearch(1)}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setHasSearched(false); }}>
            <Ionicons name="close-circle" size={20} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {loading && page === 1 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : hasSearched && results.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="search-outline" size={48} color={colors.textTertiary} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No results found for "{query}"
          </Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderResult}
          keyExtractor={(item, index) => `${item.verseId}-${index}`}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            hasSearched && total > 0 ? (
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                {total} result{total !== 1 ? 's' : ''} found
              </Text>
            ) : null
          }
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator style={styles.footerLoader} color={colors.primary} />
            ) : null
          }
        />
      )}

      {!hasSearched && (
        <View style={styles.centered}>
          <Ionicons name="book-outline" size={64} color={colors.textTertiary} />
          <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
            Search Scripture
          </Text>
          <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
            Search across the entire Orthodox Bible
          </Text>
        </View>
      )}
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
    padding: Spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    height: 48,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    marginLeft: Spacing.sm,
  },
  listContent: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  resultCount: {
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.md,
  },
  resultItem: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.sm,
  },
  resultRef: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.xs,
  },
  resultText: {
    fontSize: Typography.sizes.base,
    lineHeight: Typography.sizes.base * Typography.lineHeights.normal,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.sizes.base,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  footerLoader: {
    paddingVertical: Spacing.lg,
  },
});
