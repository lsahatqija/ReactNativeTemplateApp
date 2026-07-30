import AsyncStorage from '@react-native-async-storage/async-storage';

import { preferences } from '@/storage/preferences';

describe('preferences', () => {
  afterEach(async () => {
    await AsyncStorage.clear();
  });

  it('defaults theme preference to system when nothing is stored', async () => {
    expect(await preferences.getTheme()).toBe('system');
  });

  it('round-trips a stored theme preference', async () => {
    await preferences.setTheme('dark');
    expect(await preferences.getTheme()).toBe('dark');
  });

  it('treats malformed stored JSON as absent instead of throwing', async () => {
    await AsyncStorage.setItem('@app/preferences/theme', 'not-json{');
    await expect(preferences.getTheme()).resolves.toBe('system');
  });

  it('clears all managed preference keys', async () => {
    await preferences.setTheme('dark');
    await preferences.setExampleSortOrder('oldest');
    await preferences.clear();
    expect(await preferences.getTheme()).toBe('system');
    expect(await preferences.getExampleSortOrder()).toBe('newest');
  });
});
