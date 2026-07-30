import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { setUnauthorizedHandler } from '@/api/client';
import { secureStorage } from '@/storage/secure';

export interface AuthUser {
  id: string;
  email: string;
}

export type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

export interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  /** MOCK — replace with a real sign-in call against your auth backend. */
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Provider-agnostic authentication seam. No real backend is assumed — `signIn` only
 * validates that a token exists locally after a simulated network call. Replace the
 * body of `signIn`/`signOut` with real API calls when a backend is available; the
 * rest of the app (routes, `useAuth` consumers) does not need to change.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const token = await secureStorage.getAccessToken();
      if (cancelled) return;
      if (token) {
        setUser({ id: 'mock-user', email: 'user@example.com' });
        setStatus('signedIn');
      } else {
        setStatus('signedOut');
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Wire the API client's 401 handling to force a sign-out (session-expired behavior).
    setUnauthorizedHandler(() => {
      secureStorage.removeAccessToken().finally(() => {
        setUser(null);
        setStatus('signedOut');
      });
    });
    return () => setUnauthorizedHandler(undefined);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      async signIn(email: string) {
        // MOCK sign-in — swap for a real API call, then store the returned token.
        await new Promise((resolve) => setTimeout(resolve, 400));
        await secureStorage.setAccessToken('mock-dev-token');
        setUser({ id: 'mock-user', email });
        setStatus('signedIn');
      },
      async signOut() {
        await secureStorage.removeAccessToken();
        setUser(null);
        setStatus('signedOut');
      },
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
