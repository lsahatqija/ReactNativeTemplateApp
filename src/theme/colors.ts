/**
 * Neutral color tokens for light/dark appearance. Replace these values when
 * rebranding a new application off of this template — nothing else should
 * need to change.
 */

const palette = {
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  blue500: '#3B82F6',
  blue600: '#2563EB',
  red500: '#EF4444',
  red600: '#DC2626',
  green500: '#22C55E',
  amber500: '#F59E0B',
} as const;

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryText: string;
  danger: string;
  success: string;
  warning: string;
  disabled: string;
}

export const lightColors: ThemeColors = {
  background: palette.white,
  surface: palette.gray50,
  text: palette.gray900,
  textMuted: palette.gray500,
  border: palette.gray200,
  primary: palette.blue600,
  primaryText: palette.white,
  danger: palette.red600,
  success: palette.green500,
  warning: palette.amber500,
  disabled: palette.gray300,
};

export const darkColors: ThemeColors = {
  background: palette.gray900,
  surface: palette.gray800,
  text: palette.gray50,
  textMuted: palette.gray400,
  border: palette.gray700,
  primary: palette.blue500,
  primaryText: palette.white,
  danger: palette.red500,
  success: palette.green500,
  warning: palette.amber500,
  disabled: palette.gray600,
};

export const colorsByScheme: Record<ColorScheme, ThemeColors> = {
  light: lightColors,
  dark: darkColors,
};
