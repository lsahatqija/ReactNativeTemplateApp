import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';

export interface CardProps extends ViewProps {
  children: ReactNode;
}

export function Card({ children, style, ...rest }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
