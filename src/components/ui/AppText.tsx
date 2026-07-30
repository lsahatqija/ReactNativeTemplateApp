import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';
import type { TypographySizeKey } from '@/theme/typography';

export interface AppTextProps extends TextProps {
  size?: TypographySizeKey;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  color?: string;
  muted?: boolean;
}

/** Base text component so font scale, family, and color come from theme tokens everywhere. */
export function AppText({
  size = 'md',
  weight = 'regular',
  color,
  muted,
  style,
  ...rest
}: AppTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.size[size],
          lineHeight: theme.typography.lineHeight[size],
          fontWeight: theme.typography.weight[weight],
          color: color ?? (muted ? theme.colors.textMuted : theme.colors.text),
        },
        style,
      ]}
      // Respect the user's OS font-scaling preference; never disable it.
      allowFontScaling
      {...rest}
    />
  );
}
