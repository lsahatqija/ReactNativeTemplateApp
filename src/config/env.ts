import Constants from 'expo-constants';
import { z } from 'zod';

/**
 * Typed, validated access to public runtime configuration.
 *
 * Only `EXPO_PUBLIC_*` variables are available here because Expo inlines them into the
 * JS bundle at build time. They are NOT secret — never put API keys, tokens, or
 * credentials in `EXPO_PUBLIC_*` variables or in `.env` files committed to the repo.
 */

const envSchema = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  API_URL: z.string().url(),
});

export type AppEnv = z.infer<typeof envSchema>['APP_ENV'];

function readRawEnv() {
  return {
    APP_ENV: process.env.EXPO_PUBLIC_APP_ENV,
    API_URL: process.env.EXPO_PUBLIC_API_URL,
  };
}

function loadEnv() {
  const result = envSchema.safeParse(readRawEnv());

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    const message = `Invalid environment configuration:\n${issues}\n\nCheck your .env file against .env.example (see EXPO_PUBLIC_APP_ENV / EXPO_PUBLIC_API_URL).`;

    if (__DEV__) {
      throw new Error(message);
    }

    // In production, fail loudly via reporting rather than crashing silently.
    console.error(message);
    throw new Error('Application configuration is invalid.');
  }

  return result.data;
}

export const env = loadEnv();

/** Expo/EAS release channel or update channel, useful for diagnostics. */
export const releaseChannel = Constants.expoConfig?.extra?.releaseChannel ?? 'unknown';

export const isDevelopment = env.APP_ENV === 'development';
export const isStaging = env.APP_ENV === 'staging';
export const isProduction = env.APP_ENV === 'production';
