import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AppProviders } from '@/providers/AppProviders';
import { useAuth } from '@/providers/AuthProvider';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignore — happens if already hidden (e.g. fast refresh).
});

function RootNavigator() {
  const { status } = useAuth();

  useEffect(() => {
    if (status !== 'loading') {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [status]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
      <Stack.Screen
        name="modal"
        options={{ presentation: 'modal', headerShown: true, title: 'Note' }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
