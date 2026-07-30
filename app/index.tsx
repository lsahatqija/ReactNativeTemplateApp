import { Redirect } from 'expo-router';

import { LoadingView } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';

/** Single redirect point based on session state — never redirects while still loading. */
export default function Index() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <LoadingView label="Preparing your session…" />;
  }

  return <Redirect href={status === 'signedIn' ? '/(main)' : '/(auth)/sign-in'} />;
}
