import { Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

import { AppProviders } from '@/providers/AppProviders';

// Full file-based route rendering needs a router-aware test harness; this exercises the
// provider composition every route mounts under, which is what actually wires up at startup.
describe('AppProviders startup', () => {
  it('mounts the full provider tree and renders children without throwing', async () => {
    const { getByText } = await render(
      <AppProviders>
        <Text>ready</Text>
      </AppProviders>,
    );

    await waitFor(() => expect(getByText('ready')).toBeTruthy());
  });
});
