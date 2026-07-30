import { Platform } from 'react-native';

import * as SecureStore from 'expo-secure-store';

import { SECURE_KEYS } from './keys';

/**
 * Sensitive values only (tokens, credentials). Backed by Keychain/Keystore via
 * `expo-secure-store`. This is the only sanctioned place that imports SecureStore —
 * the rest of the app should go through this module so the implementation stays
 * replaceable (e.g. swapping in a different secure storage library later).
 *
 * `expo-secure-store` has no web implementation. On web we fall back to an
 * in-memory store so the app still runs (tokens won't survive a page refresh);
 * swap this for an appropriate web-safe strategy before shipping a web target.
 */
const webMemoryStore = new Map<string, string>();

export const secureStorage = {
  async getAccessToken(): Promise<string | null> {
    if (Platform.OS === 'web') {
      return webMemoryStore.get(SECURE_KEYS.accessToken) ?? null;
    }
    return SecureStore.getItemAsync(SECURE_KEYS.accessToken);
  },

  async setAccessToken(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      webMemoryStore.set(SECURE_KEYS.accessToken, token);
      return;
    }
    await SecureStore.setItemAsync(SECURE_KEYS.accessToken, token);
  },

  async removeAccessToken(): Promise<void> {
    if (Platform.OS === 'web') {
      webMemoryStore.delete(SECURE_KEYS.accessToken);
      return;
    }
    await SecureStore.deleteItemAsync(SECURE_KEYS.accessToken);
  },
};
