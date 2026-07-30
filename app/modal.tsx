import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import type { ApiError } from '@/api/errors';
import { LoadingView, Screen } from '@/components/ui';
import { NoteForm } from '@/features/example/components/NoteForm';
import { useCreateNote } from '@/features/example/hooks/useCreateNote';
import { useNote } from '@/features/example/hooks/useNote';
import { useUpdateNote } from '@/features/example/hooks/useUpdateNote';
import type { NoteFormValues } from '@/features/example/schemas/note';

/**
 * Create/edit form for the example feature, presented as the app's modal route.
 * Editing is signaled with an `id` param; creating omits it.
 */
export default function NoteModal() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const { data: existingNote, isPending } = useNote(id);
  const createNote = useCreateNote();
  const updateNote = useUpdateNote(id ?? '');
  const [serverError, setServerError] = useState<ApiError | null>(null);

  if (isEditing && isPending) {
    return <LoadingView label="Loading note…" />;
  }

  async function handleSubmit(values: NoteFormValues) {
    setServerError(null);
    try {
      if (isEditing && id) {
        await updateNote.mutateAsync(values);
      } else {
        await createNote.mutateAsync(values);
      }
      router.back();
    } catch (error) {
      setServerError(error as ApiError);
    }
  }

  return (
    <Screen scroll>
      <NoteForm
        submitLabel={isEditing ? 'Save changes' : 'Create note'}
        defaultValues={
          existingNote ? { title: existingNote.title, body: existingNote.body } : undefined
        }
        onSubmit={handleSubmit}
        serverError={serverError}
      />
    </Screen>
  );
}
