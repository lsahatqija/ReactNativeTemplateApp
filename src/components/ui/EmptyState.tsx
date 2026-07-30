import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';

import { AppText } from './AppText';

export interface EmptyStateProps {
  title: string;
  message?: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        padding: theme.spacing.lg,
      }}
    >
      <AppText weight="semibold" style={{ textAlign: 'center' }}>
        {title}
      </AppText>
      {message ? (
        <AppText muted style={{ textAlign: 'center' }}>
          {message}
        </AppText>
      ) : null}
      {action}
    </View>
  );
}
