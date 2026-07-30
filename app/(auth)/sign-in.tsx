import { useState } from 'react';
import { View } from 'react-native';

import { AppText, Button, Screen, TextField } from '@/components/ui';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';

/** Placeholder sign-in screen — see src/providers/AuthProvider.tsx for the mock auth seam. */
export default function SignIn() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email || 'user@example.com', password);
    } catch {
      setError('Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll>
      <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.xl }}>
        <AppText size="xl" weight="bold">
          Sign in
        </AppText>
        <AppText muted>
          This is a mock, provider-agnostic sign-in — any email and password combination works.
        </AppText>
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />
        {error ? <AppText color={theme.colors.danger}>{error}</AppText> : null}
        <Button title="Sign in" onPress={handleSignIn} loading={submitting} />
      </View>
    </Screen>
  );
}
