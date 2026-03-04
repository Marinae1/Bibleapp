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
import { fetchNotes, deleteNote } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function NotesScreen({ navigation }) {
  const { colors } = useTheme();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(noteId) {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteNote(noteId);
            setNotes((prev) => prev.filter((n) => n.id !== noteId));
          } catch {
            Alert.alert('Error', 'Could not delete note');
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

  if (notes.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Ionicons name="create-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No Notes</Text>
        <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
          Add notes to verses while reading scripture
        </Text>
      </View>
    );
  }

  function renderNote({ item }) {
    const ref = `${item.verse.chapter.book.name} ${item.verse.chapter.chapterNumber}:${item.verse.verseNumber}`;

    return (
      <View style={[styles.noteItem, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={styles.noteContent}
          onPress={() =>
            navigation.navigate('Reader', {
              abbreviation: item.verse.chapter.book.abbreviation,
              chapter: item.verse.chapter.chapterNumber,
            })
          }
          activeOpacity={0.7}
        >
          <Text style={[styles.noteRef, { color: colors.primary }]}>{ref}</Text>
          <Text style={[styles.noteVerse, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.verse.textEnglish}
          </Text>
          <Text style={[styles.noteText, { color: colors.text }]}>{item.content}</Text>
          <Text style={[styles.noteDate, { color: colors.textTertiary }]}>
            {new Date(item.updatedAt).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={notes}
        renderItem={renderNote}
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
  noteItem: {
    flexDirection: 'row',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  noteContent: { flex: 1 },
  noteRef: { fontSize: Typography.sizes.sm, fontWeight: Typography.weights.semibold, marginBottom: Spacing.xs },
  noteVerse: { fontSize: Typography.sizes.sm, fontStyle: 'italic', marginBottom: Spacing.sm },
  noteText: { fontSize: Typography.sizes.base, lineHeight: Typography.sizes.base * 1.5 },
  noteDate: { fontSize: Typography.sizes.xs, marginTop: Spacing.sm },
  deleteBtn: { justifyContent: 'center', paddingLeft: Spacing.md },
});
