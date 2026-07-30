import type { ColorScheme, ThemeColors } from './colors';
import type { radii, spacing } from './spacing';
import type { typography } from './typography';

export interface Theme {
  scheme: ColorScheme;
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
}

// `useTheme` lives in `@/providers/ThemeProvider` since it depends on the persisted
// theme preference; this module only exports plain, provider-independent tokens.
export * from './colors';
export * from './spacing';
export * from './typography';
