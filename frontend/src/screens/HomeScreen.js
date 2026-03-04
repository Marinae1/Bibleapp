import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fetchDailyPsalm } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function HomeScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const [dailyVerse, setDailyVerse] = useState({
    text: '"The Lord is my shepherd; I shall not want. He makes me to lie down in green pastures."',
    ref: '— Psalm 22:1-2 (LXX)',
  });

  useEffect(() => {
    fetchDailyPsalm()
      .then((data) => {
        if (data?.verses?.length > 0) {
          const verse = data.verses[0];
          setDailyVerse({
            text: `"${verse.textEnglish}"`,
            ref: `— Psalm ${data.psalmNumber}:1 (LXX)`,
          });
        }
      })
      .catch(() => {});
  }, []);

  const quickActions = [
    {
      title: 'Old Testament',
      icon: 'book',
      subtitle: 'Septuagint (LXX)',
      onPress: () => navigation.navigate('Books', { testament: 'Old Testament' }),
    },
    {
      title: 'New Testament',
      icon: 'book-outline',
      subtitle: '27 Books',
      onPress: () => navigation.navigate('Books', { testament: 'New Testament' }),
    },
    {
      title: 'Psalms',
      icon: 'musical-notes',
      subtitle: '151 Psalms (LXX)',
      onPress: () => navigation.navigate('Chapters', { abbreviation: 'Psa', bookName: 'Psalms' }),
    },
    {
      title: 'Gospels',
      icon: 'sunny',
      subtitle: 'Matthew · Mark · Luke · John',
      onPress: () => navigation.navigate('Books', { testament: 'New Testament', filter: 'gospels' }),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Glory to God
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Orthodox Bible
            </Text>
            <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
              Septuagint · Coptic Canon
            </Text>
          </View>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeBtn, { backgroundColor: colors.surfaceVariant }]}
          >
            <Ionicons
              name={isDark ? 'sunny' : 'moon'}
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Daily Verse Card */}
        <TouchableOpacity
          style={[styles.dailyCard, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('Daily')}
          activeOpacity={0.85}
        >
          <Text style={styles.dailyLabel}>VERSE OF THE DAY</Text>
          <Text style={styles.dailyVerse}>
            {dailyVerse.text}
          </Text>
          <Text style={styles.dailyRef}>{dailyVerse.ref}</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Browse Scripture
        </Text>

        <View style={styles.actionsGrid}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.title}
              style={[styles.actionCard, { backgroundColor: colors.surface, shadowColor: colors.shadow }]}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name={action.icon} size={24} color={colors.primary} />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>
                {action.title}
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.textTertiary }]}>
                {action.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Reading */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Quick Access
        </Text>

        <TouchableOpacity
          style={[styles.continueCard, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Reader', { abbreviation: 'Gen', chapter: 1 })}
          activeOpacity={0.7}
        >
          <View style={styles.continueContent}>
            <Ionicons name="bookmark" size={20} color={colors.accent} />
            <View style={styles.continueText}>
              <Text style={[styles.continueTitle, { color: colors.text }]}>
                Start Reading
              </Text>
              <Text style={[styles.continueSubtitle, { color: colors.textSecondary }]}>
                Genesis 1 — In the beginning...
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.continueCard, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate('Reader', { abbreviation: 'Joh', chapter: 1 })}
          activeOpacity={0.7}
        >
          <View style={styles.continueContent}>
            <Ionicons name="star" size={20} color={colors.accent} />
            <View style={styles.continueText}>
              <Text style={[styles.continueTitle, { color: colors.text }]}>
                Gospel of John
              </Text>
              <Text style={[styles.continueSubtitle, { color: colors.textSecondary }]}>
                John 1 — In the beginning was the Word...
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingTop: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.sm,
    marginTop: 2,
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  dailyLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
    letterSpacing: 1.5,
    marginBottom: Spacing.sm,
  },
  dailyVerse: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.medium,
    lineHeight: Typography.sizes.lg * Typography.lineHeights.relaxed,
    fontStyle: 'italic',
  },
  dailyRef: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.md,
    fontWeight: Typography.weights.medium,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
    marginBottom: Spacing.lg,
  },
  actionCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  actionSubtitle: {
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  continueText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  continueTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  continueSubtitle: {
    fontSize: Typography.sizes.sm,
    marginTop: 2,
  },
});
