import { useCallback } from 'react';
import { FlatList, View } from 'react-native';
import { router } from 'expo-router';

import { AppText, Button, EmptyState, ErrorView, LoadingView, Screen } from '@/components/ui';
import { NoteListItem } from '@/features/example/components/NoteListItem';
import { useNotes } from '@/features/example/hooks/useNotes';
import { useSortOrderPreference } from '@/features/example/hooks/useSortOrderPreference';
import { toUserMessage } from '@/api/errors';
import { useTheme } from '@/providers/ThemeProvider';
import type { Note } from '@/features/example/types';

export default function NotesList() {
  const theme = useTheme();
  const { data, isPending, isError, error, refetch, isRefetching } = useNotes();
  const { sortOrder, setSortOrder } = useSortOrderPreference();

  const notes = data ? sortNotes(data, sortOrder) : [];

  const renderItem = useCallback(
    ({ item }: { item: Note }) => (
      <NoteListItem note={item} onPress={() => router.push(`/(main)/example/${item.id}`)} />
    ),
    [],
  );

  if (isPending) {
    return <LoadingView label="Loading notes…" />;
  }

  if (isError) {
    return <ErrorView message={toUserMessage(error)} onRetry={refetch} />;
  }

  return (
    <Screen>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.md,
        }}
      >
        <AppText size="lg" weight="bold">
          Notes
        </AppText>
        <Button
          title={sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
          variant="secondary"
          onPress={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
        />
      </View>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          message="Create your first note to see it here."
          action={<Button title="New note" onPress={() => router.push('/modal')} />}
        />
      ) : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onRefresh={refetch}
          refreshing={isRefetching}
          ListFooterComponent={<Button title="New note" onPress={() => router.push('/modal')} />}
        />
      )}
    </Screen>
  );
}

function sortNotes(notes: Note[], order: 'newest' | 'oldest'): Note[] {
  const sorted = [...notes].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return order === 'newest' ? sorted.reverse() : sorted;
}
