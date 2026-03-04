import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Spacing, BorderRadius, Typography } from '../constants/theme';

export default function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    {
      icon: 'bookmark',
      label: 'Bookmarks',
      screen: 'Bookmarks',
      color: colors.accent,
    },
    {
      icon: 'color-palette',
      label: 'Highlights',
      screen: 'Highlights',
      color: '#4ECDC4',
    },
    {
      icon: 'create',
      label: 'Notes',
      screen: 'Notes',
      color: '#45B7D1',
    },
    {
      icon: 'settings',
      label: 'Settings',
      screen: 'Settings',
      color: colors.textSecondary,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {isAuthenticated && user?.displayName
              ? user.displayName.charAt(0).toUpperCase()
              : '?'}
          </Text>
        </View>

        {isAuthenticated ? (
          <>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.displayName || 'Orthodox Reader'}
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.userName, { color: colors.text }]}>Welcome</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              Sign in to sync bookmarks, highlights, and notes
            </Text>
            <TouchableOpacity
              style={[styles.signInBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.signInBtnText}>Sign In</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Menu Items */}
      <View style={[styles.menuSection, { backgroundColor: colors.surface }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && {
                borderBottomWidth: 0.5,
                borderBottomColor: colors.divider,
              },
            ]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={[styles.appName, { color: colors.textTertiary }]}>
          Orthodox Bible v1.0.0
        </Text>
        <Text style={[styles.appDesc, { color: colors.textTertiary }]}>
          Septuagint · Coptic Canon · English & Arabic
        </Text>
      </View>

      {isAuthenticated && (
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: colors.error }]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  profileCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  userName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  userEmail: {
    fontSize: Typography.sizes.sm,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  signInBtn: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontWeight: Typography.weights.semibold,
    fontSize: Typography.sizes.base,
  },
  menuSection: {
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    marginLeft: Spacing.md,
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  appName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
  },
  appDesc: {
    fontSize: Typography.sizes.xs,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  logoutText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
  },
});
