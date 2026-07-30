// Deterministic mocks for native modules that don't run in the Jest (Node) environment.

// Tests never load a real .env file — pin known-valid values for src/config/env.ts.
process.env.EXPO_PUBLIC_APP_ENV = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
process.env.EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.example.test';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('expo-secure-store', () => {
  const store = new Map();
  return {
    getItemAsync: jest.fn((key) => Promise.resolve(store.has(key) ? store.get(key) : null)),
    setItemAsync: jest.fn((key, value) => {
      store.set(key, value);
      return Promise.resolve();
    }),
    deleteItemAsync: jest.fn((key) => {
      store.delete(key);
      return Promise.resolve();
    }),
  };
});

jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => () => {}),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true })),
}));

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
