import { forwardRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/providers/ThemeProvider';

import { AppText } from './AppText';

export interface TextFieldProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

/** Labeled, accessible text input used by every form in the app (see React Hook Form integration). */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, errorMessage, style, ...rest },
  ref,
) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <AppText weight="medium" nativeID={`${label}-label`}>
        {label}
      </AppText>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        aria-labelledby={`${label}-label`}
        aria-invalid={Boolean(errorMessage)}
        placeholderTextColor={theme.colors.textMuted}
        style={[
          {
            minHeight: 44,
            borderWidth: 1,
            borderColor: errorMessage ? theme.colors.danger : theme.colors.border,
            borderRadius: theme.radii.md,
            paddingHorizontal: theme.spacing.md,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
            fontSize: theme.typography.size.md,
          },
          style,
        ]}
        {...rest}
      />
      {errorMessage ? (
        <AppText size="sm" color={theme.colors.danger} accessibilityRole="alert">
          {errorMessage}
        </AppText>
      ) : null}
    </View>
  );
});
