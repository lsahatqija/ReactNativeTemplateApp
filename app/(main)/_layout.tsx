import { Redirect, Tabs } from 'expo-router';

import { LoadingView } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

/** Authenticated route group — guards direct/deep-link access while signed out. */
export default function MainLayout() {
  const { status } = useAuth();
  const theme = useTheme();

  if (status === 'loading') {
    return <LoadingView />;
  }

  if (status === 'signedOut') {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: { backgroundColor: theme.colors.background },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="example" options={{ title: 'Notes', headerShown: false }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
