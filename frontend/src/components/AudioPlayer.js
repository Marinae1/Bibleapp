import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function AudioPlayer() {
  const { colors } = useTheme();
  const {
    isPlaying,
    isLoading,
    currentBook,
    currentChapter,
    position,
    duration,
    togglePlayPause,
    stop,
  } = useAudio();

  if (!currentBook) return null;

  const progress = duration > 0 ? (position / duration) * 100 : 0;
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
      {/* Progress Bar */}
      <View style={[styles.progressTrack, { backgroundColor: colors.surfaceVariant }]}>
        <View
          style={[styles.progressFill, { backgroundColor: colors.primary, width: `${progress}%` }]}
        />
      </View>

      <View style={styles.content}>
        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {currentBook} — Chapter {currentChapter}
          </Text>
          <Text style={[styles.time, { color: colors.textTertiary }]}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity onPress={togglePlayPause} style={styles.controlBtn}>
            {isLoading ? (
              <Ionicons name="hourglass" size={24} color={colors.primary} />
            ) : (
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={24}
                color={colors.primary}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={stop} style={styles.controlBtn}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0.5,
  },
  progressTrack: {
    height: 3,
  },
  progressFill: {
    height: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  time: {
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  controlBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
