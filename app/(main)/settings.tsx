import { View } from 'react-native';

import { AppText, Button, Screen } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import type { ThemePreference } from '@/storage/preferences';

const THEME_OPTIONS: ThemePreference[] = ['system', 'light', 'dark'];

export default function Settings() {
  const theme = useTheme();
  const { signOut } = useAuth();

  return (
    <Screen>
      <View style={{ gap: theme.spacing.lg }}>
        <View style={{ gap: theme.spacing.sm }}>
          <AppText weight="semibold">Appearance</AppText>
          <AppText muted>Persisted via AsyncStorage (src/storage/preferences.ts).</AppText>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            {THEME_OPTIONS.map((option) => (
              <Button
                key={option}
                title={option}
                variant={theme.preference === option ? 'primary' : 'secondary'}
                onPress={() => theme.setPreference(option)}
              />
            ))}
          </View>
        </View>

        <Button title="Sign out" variant="danger" onPress={signOut} />
      </View>
    </Screen>
  );
}
