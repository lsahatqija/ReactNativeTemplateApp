import { act, renderHook, waitFor } from '@testing-library/react-native';

import { AuthProvider, useAuth } from '@/providers/AuthProvider';
import { secureStorage } from '@/storage/secure';

describe('AuthProvider / useAuth', () => {
  afterEach(async () => {
    await secureStorage.removeAccessToken();
  });

  it('resolves to signedOut when no token is stored', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.status).toBe('signedOut'));
    expect(result.current.user).toBeNull();
  });

  it('resolves to signedIn when a token is already stored', async () => {
    await secureStorage.setAccessToken('existing-token');
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });

    await waitFor(() => expect(result.current.status).toBe('signedIn'));
  });

  it('transitions to signedIn after signIn and persists a token', async () => {
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.status).toBe('signedOut'));

    await act(async () => {
      await result.current.signIn('user@example.com', 'password');
    });

    expect(result.current.status).toBe('signedIn');
    expect(await secureStorage.getAccessToken()).toBeTruthy();
  });

  it('transitions to signedOut after signOut and clears the token', async () => {
    await secureStorage.setAccessToken('existing-token');
    const { result } = await renderHook(() => useAuth(), { wrapper: AuthProvider });
    await waitFor(() => expect(result.current.status).toBe('signedIn'));

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.status).toBe('signedOut');
    expect(await secureStorage.getAccessToken()).toBeNull();
  });
});
