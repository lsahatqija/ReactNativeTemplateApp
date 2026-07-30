import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/providers/ThemeProvider';

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
}

/** Safe-area + keyboard-avoiding wrapper every route screen should render its content in. */
export function Screen({ children, scroll = false, padded = true }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        styles.content,
        padded && { padding: theme.spacing.md },
        { backgroundColor: theme.colors.background },
      ]}
    >
      {children}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.flex, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.grow} keyboardShouldPersistTaps="handled">
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
  content: { flex: 1 },
});
