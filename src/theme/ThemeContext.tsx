import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { colorScheme, useColorScheme } from 'nativewind';
import { MD3DarkTheme, MD3LightTheme, type MD3Theme } from 'react-native-paper';

colorScheme.set('dark');

const paperDarkTheme: MD3Theme = { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, primary: '#E50914' } };
const paperLightTheme: MD3Theme = { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: '#E50914' } };

type ThemeContextValue = {
  isDark: boolean;
  toggleTheme: () => void;
  paperTheme: MD3Theme;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme: scheme, toggleColorScheme } = useColorScheme();
  const isDark = scheme === 'dark';

  const value = useMemo<ThemeContextValue>(
    () => ({
      isDark,
      toggleTheme: toggleColorScheme,
      paperTheme: isDark ? paperDarkTheme : paperLightTheme,
    }),
    [isDark, toggleColorScheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
