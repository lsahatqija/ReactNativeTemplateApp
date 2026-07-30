import NetInfo from '@react-native-community/netinfo';
import {
  focusManager,
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ErrorBoundary } from '@/components/ErrorBoundary';

import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

// Reflect device connectivity into Query's online state so queries pause/resume correctly.
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => setOnline(Boolean(state.isConnected)));
});

function onAppStateChange(status: AppStateStatus) {
  // Refetch stale queries when the app returns to the foreground.
  focusManager.setFocused(status === 'active');
}

/**
 * A single query client for the app's lifetime. The cache is intentionally NOT persisted
 * to disk by default — mutations and query results reset on app restart. To add
 * persistence or offline mutation queuing later, see `@tanstack/query-async-storage-persister`
 * and `@tanstack/react-query-persist-client`, wiring them here.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnReconnect: true,
    },
  },
});

export interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Single composition root for every app-wide provider. Route components should render
 * screen content only — they must not nest additional global providers themselves.
 */
export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>{children}</AuthProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
