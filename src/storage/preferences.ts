import AsyncStorage from '@react-native-async-storage/async-storage';

import { PREFERENCE_KEYS } from './keys';

/**
 * Non-sensitive, small JSON-serializable preferences only. Never store tokens or secrets
 * here — use `secureStorage` for that. This module is the only sanctioned place that
 * imports AsyncStorage directly; the rest of the app should not import it.
 *
 * If a future app needs relational data, complex queries, or large offline datasets,
 * that is the point to introduce `expo-sqlite` behind a similar abstraction — not here.
 */

export type ThemePreference = 'light' | 'dark' | 'system';
export type SortOrder = 'newest' | 'oldest';

async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw == null) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    // Malformed value (e.g. corrupted or from an older schema) — treat as absent.
    return null;
  }
}

async function setJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const preferences = {
  async getTheme(): Promise<ThemePreference> {
    const value = await getJSON<ThemePreference>(PREFERENCE_KEYS.themePreference);
    return value ?? 'system';
  },

  async setTheme(theme: ThemePreference): Promise<void> {
    await setJSON(PREFERENCE_KEYS.themePreference, theme);
  },

  async getExampleSortOrder(): Promise<SortOrder> {
    const value = await getJSON<SortOrder>(PREFERENCE_KEYS.exampleSortOrder);
    return value ?? 'newest';
  },

  async setExampleSortOrder(order: SortOrder): Promise<void> {
    await setJSON(PREFERENCE_KEYS.exampleSortOrder, order);
  },

  /** Clears all preferences managed by this module (not secure storage). */
  async clear(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(PREFERENCE_KEYS));
  },
};
