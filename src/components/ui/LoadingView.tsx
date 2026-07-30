import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';

import { AppText } from './AppText';

export interface LoadingViewProps {
  label?: string;
}

export function LoadingView({ label = 'Loading…' }: LoadingViewProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="progressbar"
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: theme.spacing.sm }}
    >
      <ActivityIndicator color={theme.colors.primary} />
      <AppText muted>{label}</AppText>
    </View>
  );
}
