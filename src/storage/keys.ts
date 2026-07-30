/** Centralized, namespaced keys so every storage read/write goes through one source of truth. */
export const PREFERENCE_KEYS = {
  themePreference: '@app/preferences/theme',
  exampleSortOrder: '@app/preferences/example-sort-order',
} as const;

export const SECURE_KEYS = {
  accessToken: 'app.secure.accessToken',
} as const;
