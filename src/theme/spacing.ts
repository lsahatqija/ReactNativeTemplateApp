/** Base spacing unit is 4px; scale multiplies from there for consistent rhythm. */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;

export const radii = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radii;

/** Minimum touch target size recommended by iOS/Android accessibility guidelines. */
export const minTouchTarget = 44;
