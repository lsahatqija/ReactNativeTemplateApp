import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';

import { AppText } from './AppText';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export function Button({ title, variant = 'primary', loading, disabled, ...rest }: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'danger'
        ? theme.colors.danger
        : theme.colors.surface;
  const textColor = variant === 'secondary' ? theme.colors.text : theme.colors.primaryText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isDisabled ? theme.colors.disabled : backgroundColor,
          borderRadius: theme.radii.md,
          paddingVertical: theme.spacing.sm,
          paddingHorizontal: theme.spacing.md,
          opacity: pressed ? 0.8 : 1,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: theme.colors.border,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText weight="semibold" color={textColor}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
