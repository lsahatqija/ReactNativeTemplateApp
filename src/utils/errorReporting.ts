/**
 * Provider-agnostic error reporting seam. Swap the implementation for Sentry, Bugsnag,
 * etc. by editing this file only — nothing else in the app should call a reporting SDK
 * directly.
 */
export interface ErrorReporter {
  reportError(error: unknown, context?: Record<string, unknown>): void;
}

const devErrorReporter: ErrorReporter = {
  reportError(error, context) {
    if (__DEV__) {
      console.error('[error-report]', error, context);
    }
    // Production wiring point: send `error`/`context` to Sentry/Bugsnag/etc. here.
  },
};

export const errorReporter: ErrorReporter = devErrorReporter;
