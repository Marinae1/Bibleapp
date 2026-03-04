import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAudio } from '../context/AudioContext';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function SettingsScreen() {
  const {
    colors,
    isDark,
    fontSize,
    psalmNumbering,
    language,
    toggleTheme,
    adjustFontSize,
    togglePsalmNumbering,
    toggleLanguage,
  } = useTheme();
  const { voice, setVoice, speed, setPlaybackSpeed } = useAudio();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Display Settings */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>DISPLAY</Text>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        {/* Theme Toggle */}
        <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.settingLeft}>
            <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ true: colors.primary }}
          />
        </View>

        {/* Font Size */}
        <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="text" size={20} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Font Size</Text>
          </View>
          <View style={styles.fontControls}>
            <TouchableOpacity
              style={[styles.fontBtn, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => adjustFontSize(fontSize - 2)}
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.fontValue, { color: colors.text }]}>{fontSize}</Text>
            <TouchableOpacity
              style={[styles.fontBtn, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => adjustFontSize(fontSize + 2)}
            >
              <Ionicons name="add" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language Toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="language" size={20} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Language</Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={toggleLanguage}
          >
            <Text style={[styles.toggleBtnText, { color: colors.primary }]}>
              {language === 'en' ? 'English' : 'العربية'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bible Settings */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>BIBLE</Text>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        {/* Psalm Numbering */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="musical-notes" size={20} color={colors.primary} />
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Psalm Numbering</Text>
              <Text style={[styles.settingDesc, { color: colors.textTertiary }]}>
                {psalmNumbering === 'septuagint'
                  ? 'Septuagint (LXX) numbering'
                  : 'Hebrew (Masoretic) numbering'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.toggleBtn, { backgroundColor: colors.surfaceVariant }]}
            onPress={togglePsalmNumbering}
          >
            <Text style={[styles.toggleBtnText, { color: colors.primary }]}>
              {psalmNumbering === 'septuagint' ? 'LXX' : 'Hebrew'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio Settings */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>AUDIO</Text>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        {/* Voice Selection */}
        <View style={[styles.settingRow, { borderBottomColor: colors.divider }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="mic" size={20} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Voice</Text>
          </View>
          <View style={styles.voiceOptions}>
            <TouchableOpacity
              style={[
                styles.voiceBtn,
                {
                  backgroundColor: voice === 'male' ? colors.primary : colors.surfaceVariant,
                },
              ]}
              onPress={() => setVoice('male')}
            >
              <Text
                style={[
                  styles.voiceBtnText,
                  { color: voice === 'male' ? '#FFFFFF' : colors.text },
                ]}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.voiceBtn,
                {
                  backgroundColor: voice === 'female' ? colors.primary : colors.surfaceVariant,
                },
              ]}
              onPress={() => setVoice('female')}
            >
              <Text
                style={[
                  styles.voiceBtnText,
                  { color: voice === 'female' ? '#FFFFFF' : colors.text },
                ]}
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Speed Control */}
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Ionicons name="speedometer" size={20} color={colors.primary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Speed</Text>
          </View>
          <View style={styles.speedOptions}>
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.speedBtn,
                  {
                    backgroundColor: speed === s ? colors.primary : colors.surfaceVariant,
                  },
                ]}
                onPress={() => setPlaybackSpeed(s)}
              >
                <Text
                  style={[
                    styles.speedBtnText,
                    { color: speed === s ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {s}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* About */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ABOUT</Text>
      <View style={[styles.section, { backgroundColor: colors.surface }]}>
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Version</Text>
          <Text style={[styles.aboutValue, { color: colors.text }]}>1.0.0</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Translation</Text>
          <Text style={[styles.aboutValue, { color: colors.text }]}>Septuagint (LXX) English</Text>
        </View>
        <View style={styles.aboutRow}>
          <Text style={[styles.aboutLabel, { color: colors.textSecondary }]}>Canon</Text>
          <Text style={[styles.aboutValue, { color: colors.text }]}>Coptic Orthodox</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing['2xl'] },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  section: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'transparent',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
  settingDesc: {
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  fontBtn: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fontValue: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    minWidth: 24,
    textAlign: 'center',
  },
  toggleBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  toggleBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  voiceOptions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  voiceBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  voiceBtnText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  speedOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  speedBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    minWidth: 36,
    alignItems: 'center',
  },
  speedBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  aboutLabel: {
    fontSize: Typography.sizes.sm,
  },
  aboutValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
});
