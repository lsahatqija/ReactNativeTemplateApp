import { Redirect, Stack } from 'expo-router';

import { LoadingView } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';

/** Unauthenticated route group — bounces already-signed-in users back to the app. */
export default function AuthLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingView />;
  }

  if (status === 'signedIn') {
    return <Redirect href="/(main)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
