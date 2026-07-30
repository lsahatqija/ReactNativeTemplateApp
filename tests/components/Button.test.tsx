import { fireEvent } from '@testing-library/react-native';

import { Button } from '@/components/ui';

import { renderWithTheme } from '../test-utils';

describe('Button', () => {
  it('renders its title and exposes an accessible button role', async () => {
    const { getByRole } = await renderWithTheme(<Button title="Save" onPress={() => {}} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('calls onPress when tapped', async () => {
    const onPress = jest.fn();
    const { getByRole } = await renderWithTheme(<Button title="Save" onPress={onPress} />);
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    const { getByRole } = await renderWithTheme(<Button title="Save" onPress={onPress} disabled />);
    fireEvent.press(getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('marks the button as busy while loading', async () => {
    const { getByRole } = await renderWithTheme(<Button title="Save" onPress={() => {}} loading />);
    expect(getByRole('button').props.accessibilityState.busy).toBe(true);
  });
});
