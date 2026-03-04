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
import { fetchAgpeyaHours, fetchCurrentHour } from '../services/api';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

const HOUR_ICONS = {
  'First Hour': 'sunny-outline',
  'Third Hour': 'sunny',
  'Sixth Hour': 'partly-sunny',
  'Ninth Hour': 'cloudy',
  'Eleventh Hour': 'moon-outline',
  'Twelfth Hour': 'moon',
  'Midnight Hour': 'star',
};

const HOUR_TIMES = {
  'First Hour': '6:00 AM — Prime',
  'Third Hour': '9:00 AM — Terce',
  'Sixth Hour': '12:00 PM — Sext',
  'Ninth Hour': '3:00 PM — None',
  'Eleventh Hour': '5:00 PM — Vespers',
  'Twelfth Hour': '7:00 PM — Compline',
  'Midnight Hour': '12:00 AM — Midnight',
};

export default function PrayerScreen({ navigation }) {
  const { colors, language } = useTheme();
  const [hours, setHours] = useState([]);
  const [currentHour, setCurrentHour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [hoursData, currentData] = await Promise.all([
        fetchAgpeyaHours().catch(() => []),
        fetchCurrentHour().catch(() => null),
      ]);
      setHours(hoursData);
      setCurrentHour(currentData?.suggestedHour);
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

  function renderHour({ item }) {
    const isCurrent = currentHour === item.name;
    const displayName = language === 'ar' && item.nameArabic ? item.nameArabic : item.name;

    return (
      <TouchableOpacity
        style={[
          styles.hourCard,
          {
            backgroundColor: isCurrent ? colors.primary : colors.surface,
            borderColor: isCurrent ? colors.primary : colors.border,
          },
        ]}
        onPress={() => navigation.navigate('PrayerHour', { hourId: item.id, hourName: item.name })}
        activeOpacity={0.7}
      >
        <View style={styles.hourHeader}>
          <View
            style={[
              styles.hourIcon,
              {
                backgroundColor: isCurrent ? 'rgba(255,255,255,0.2)' : colors.surfaceVariant,
              },
            ]}
          >
            <Ionicons
              name={HOUR_ICONS[item.name] || 'time'}
              size={24}
              color={isCurrent ? '#FFFFFF' : colors.primary}
            />
          </View>
          {isCurrent && (
            <View style={styles.currentBadge}>
              <Text style={styles.currentBadgeText}>NOW</Text>
            </View>
          )}
        </View>

        <Text
          style={[
            styles.hourName,
            { color: isCurrent ? '#FFFFFF' : colors.text },
          ]}
        >
          {displayName}
        </Text>

        <Text
          style={[
            styles.hourTime,
            { color: isCurrent ? 'rgba(255,255,255,0.8)' : colors.textTertiary },
          ]}
        >
          {HOUR_TIMES[item.name] || ''}
        </Text>

        <Text
          style={[
            styles.hourPrayers,
            { color: isCurrent ? 'rgba(255,255,255,0.7)' : colors.textTertiary },
          ]}
        >
          {item._count?.prayers || 0} prayers
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <Ionicons name="heart" size={24} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Agpeya</Text>
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          The Coptic Book of Hours — seven canonical hours of prayer
        </Text>
      </View>

      <FlatList
        data={hours}
        renderItem={renderHour}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
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
  headerInfo: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    marginTop: Spacing.sm,
  },
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  grid: {
    padding: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  hourCard: {
    width: '48%',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 0.5,
  },
  hourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  hourIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  currentBadgeText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  hourName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    marginBottom: 2,
  },
  hourTime: {
    fontSize: Typography.sizes.xs,
    marginBottom: Spacing.xs,
  },
  hourPrayers: {
    fontSize: Typography.sizes.xs,
  },
});
