import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { fetchAgpeyaHour } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

const TYPE_ICONS = {
  psalm: 'musical-notes',
  gospel: 'book',
  prayer: 'heart',
  litany: 'megaphone',
};

const TYPE_LABELS = {
  psalm: 'Psalm',
  gospel: 'Gospel',
  prayer: 'Prayer',
  litany: 'Litany',
};

export default function PrayerHourScreen({ navigation, route }) {
  const { colors, fontSize, language } = useTheme();
  const { hourId, hourName } = route.params;
  const [hour, setHour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({ title: hourName });
    loadHour();
  }, [hourId]);

  async function loadHour() {
    try {
      const data = await fetchAgpeyaHour(hourId);
      setHour(data);
    } catch (error) {
      console.error('Error loading prayer hour:', error);
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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.hourTitle, { color: colors.text }]}>
          {language === 'ar' && hour?.nameArabic ? hour.nameArabic : hour?.name}
        </Text>
      </View>

      {/* Prayers */}
      {hour?.prayers?.map((prayer, index) => {
        const title =
          language === 'ar' && prayer.titleArabic ? prayer.titleArabic : prayer.title;
        const content =
          language === 'ar' && prayer.contentArabic ? prayer.contentArabic : prayer.content;

        return (
          <View
            key={prayer.id}
            style={[styles.prayerCard, { backgroundColor: colors.surface }]}
          >
            {/* Prayer type badge */}
            <View style={styles.prayerHeader}>
              <View style={[styles.typeBadge, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons
                  name={TYPE_ICONS[prayer.type] || 'document'}
                  size={14}
                  color={colors.primary}
                />
                <Text style={[styles.typeText, { color: colors.primary }]}>
                  {TYPE_LABELS[prayer.type] || prayer.type}
                </Text>
              </View>
              <Text style={[styles.prayerOrder, { color: colors.textTertiary }]}>
                {index + 1} / {hour.prayers.length}
              </Text>
            </View>

            <Text style={[styles.prayerTitle, { color: colors.text }]}>{title}</Text>

            <Text
              style={[
                styles.prayerContent,
                {
                  color: colors.text,
                  fontSize,
                  lineHeight: fontSize * Typography.lineHeights.loose,
                  textAlign: language === 'ar' ? 'right' : 'left',
                },
              ]}
            >
              {content}
            </Text>
          </View>
        );
      })}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.footerBtnText}>Complete Hour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing['2xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  hourTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  prayerCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  prayerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  typeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  prayerOrder: {
    fontSize: Typography.sizes.xs,
  },
  prayerTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    marginBottom: Spacing.md,
  },
  prayerContent: {
    whiteSpace: 'pre-wrap',
  },
  footer: {
    marginTop: Spacing.lg,
    alignItems: 'center',
  },
  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    gap: Spacing.sm,
  },
  footerBtnText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
});
