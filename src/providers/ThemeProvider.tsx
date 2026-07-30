import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { preferences, type ThemePreference } from '@/storage/preferences';
import { colorsByScheme, radii, spacing, typography, type ColorScheme, type Theme } from '@/theme';

export interface ThemeContextValue extends Theme {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Structural light/dark support: the effective scheme follows the system by default,
 * but a persisted user preference (see `src/storage/preferences.ts`) can override it —
 * this is the "theme handling" concern `AppProviders` composes globally.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    preferences.getTheme().then(setPreferenceState);
  }, []);

  const scheme: ColorScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({
      scheme,
      colors: colorsByScheme[scheme],
      spacing,
      radii,
      typography,
      preference,
      setPreference: async (next) => {
        setPreferenceState(next);
        await preferences.setTheme(next);
      },
    }),
    [scheme, preference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
