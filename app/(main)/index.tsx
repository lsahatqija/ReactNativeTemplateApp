import { View } from 'react-native';

import { AppText, Screen } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();

  return (
    <Screen>
      <View style={{ gap: theme.spacing.sm }}>
        <AppText size="xl" weight="bold">
          Welcome{user ? `, ${user.email}` : ''}
        </AppText>
        <AppText muted>
          This is the (main) authenticated route group. Open the Notes tab for the example feature,
          or Settings to try the persisted theme preference.
        </AppText>
      </View>
    </Screen>
  );
}
