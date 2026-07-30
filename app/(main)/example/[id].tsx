import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { toUserMessage } from '@/api/errors';
import { AppText, Button, ErrorView, LoadingView, Screen } from '@/components/ui';
import { useNote } from '@/features/example/hooks/useNote';
import { useTheme } from '@/providers/ThemeProvider';

export default function NoteDetails() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: note, isPending, isError, error, refetch } = useNote(id);

  if (isPending) {
    return <LoadingView label="Loading note…" />;
  }

  if (isError || !note) {
    return (
      <ErrorView message={error ? toUserMessage(error) : 'Note not found.'} onRetry={refetch} />
    );
  }

  return (
    <Screen scroll>
      <View style={{ gap: theme.spacing.md }}>
        <AppText size="lg" weight="bold">
          {note.title}
        </AppText>
        {note.body ? (
          <AppText>{note.body}</AppText>
        ) : (
          <AppText muted>No additional details.</AppText>
        )}
        <Button
          title="Edit note"
          onPress={() => router.push({ pathname: '/modal', params: { id: note.id } })}
        />
      </View>
    </Screen>
  );
}
