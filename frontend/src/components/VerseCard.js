import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

function VerseCard({ verse, reference, onPress, showBookmark = false }) {
  const { colors, fontSize } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress?.(verse)}
      activeOpacity={0.7}
    >
      {reference && (
        <Text style={[styles.reference, { color: colors.primary }]}>{reference}</Text>
      )}
      <Text
        style={[
          styles.text,
          { color: colors.text, fontSize, lineHeight: fontSize * Typography.lineHeights.relaxed },
        ]}
        numberOfLines={3}
      >
        {verse.textEnglish}
      </Text>
      {showBookmark && (
        <View style={styles.bookmarkIcon}>
          <Ionicons name="bookmark" size={14} color={colors.accent} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default memo(VerseCard);

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  reference: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.xs,
  },
  text: {
    flex: 1,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
});
