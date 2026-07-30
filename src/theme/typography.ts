import { Platform } from 'react-native';

/** System font stacks avoid bundling custom fonts in a generic template. */
const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

export const typography = {
  fontFamily,
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
  },
} as const;

export type TypographySizeKey = keyof typeof typography.size;
