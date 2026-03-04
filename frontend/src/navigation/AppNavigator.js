import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import BooksScreen from '../screens/BooksScreen';
import ChaptersScreen from '../screens/ChaptersScreen';
import ReaderScreen from '../screens/ReaderScreen';
import SearchScreen from '../screens/SearchScreen';
import DailyScreen from '../screens/DailyScreen';
import PrayerScreen from '../screens/PrayerScreen';
import PrayerHourScreen from '../screens/PrayerHourScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookmarksScreen from '../screens/BookmarksScreen';
import HighlightsScreen from '../screens/HighlightsScreen';
import NotesScreen from '../screens/NotesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BibleStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Books" component={BooksScreen} options={{ title: 'Books' }} />
      <Stack.Screen name="Chapters" component={ChaptersScreen} />
      <Stack.Screen name="Reader" component={ReaderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen name="Reader" component={ReaderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function DailyStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="DailyMain" component={DailyScreen} options={{ title: 'Daily Reading' }} />
      <Stack.Screen name="Reader" component={ReaderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function PrayerStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="PrayerMain" component={PrayerScreen} options={{ title: 'Agpeya' }} />
      <Stack.Screen name="PrayerHour" component={PrayerHourScreen} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.headerBackground },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileScreen} options={{ title: 'Profile' }} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} options={{ title: 'Bookmarks' }} />
      <Stack.Screen name="Highlights" component={HighlightsScreen} options={{ title: 'Highlights' }} />
      <Stack.Screen name="Notes" component={NotesScreen} options={{ title: 'Notes' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign In' }} />
      <Stack.Screen name="Reader" component={ReaderScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: 4,
          height: 56,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Bible') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Daily') {
            iconName = focused ? 'sunny' : 'sunny-outline';
          } else if (route.name === 'Prayer') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Bible" component={BibleStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Daily" component={DailyStack} />
      <Tab.Screen name="Prayer" component={PrayerStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
