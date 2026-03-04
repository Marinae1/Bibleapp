import React, { createContext, useContext, useState, useCallback } from 'react';
import { Colors } from '../constants/theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [psalmNumbering, setPsalmNumbering] = useState('septuagint'); // 'septuagint' | 'hebrew'
  const [language, setLanguage] = useState('en'); // 'en' | 'ar'

  const colors = isDark ? Colors.dark : Colors.light;

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const adjustFontSize = useCallback((size) => {
    setFontSize(Math.max(12, Math.min(32, size)));
  }, []);

  const togglePsalmNumbering = useCallback(() => {
    setPsalmNumbering((prev) => (prev === 'septuagint' ? 'hebrew' : 'septuagint'));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors,
        fontSize,
        psalmNumbering,
        language,
        toggleTheme,
        adjustFontSize,
        setFontSize: adjustFontSize,
        setPsalmNumbering,
        togglePsalmNumbering,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
