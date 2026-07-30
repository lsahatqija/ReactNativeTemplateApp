import { secureStorage } from '@/storage/secure';

describe('secureStorage', () => {
  afterEach(async () => {
    await secureStorage.removeAccessToken();
  });

  it('returns null when no token is stored', async () => {
    expect(await secureStorage.getAccessToken()).toBeNull();
  });

  it('round-trips an access token', async () => {
    await secureStorage.setAccessToken('token-123');
    expect(await secureStorage.getAccessToken()).toBe('token-123');
  });

  it('removes the stored token', async () => {
    await secureStorage.setAccessToken('token-123');
    await secureStorage.removeAccessToken();
    expect(await secureStorage.getAccessToken()).toBeNull();
  });
});
