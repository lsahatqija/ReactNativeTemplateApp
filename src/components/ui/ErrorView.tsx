import { View } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';

import { AppText } from './AppText';
import { Button } from './Button';

export interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
}

/** Consistent, non-technical error presentation — never surface raw stack traces here. */
export function ErrorView({ message, onRetry }: ErrorViewProps) {
  const theme = useTheme();

  return (
    <View
      accessibilityRole="alert"
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.md,
        padding: theme.spacing.lg,
      }}
    >
      <AppText weight="semibold" style={{ textAlign: 'center' }}>
        {message}
      </AppText>
      {onRetry ? <Button title="Try again" onPress={onRetry} /> : null}
    </View>
  );
}
