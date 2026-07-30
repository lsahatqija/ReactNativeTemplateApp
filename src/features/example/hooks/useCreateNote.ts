import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/api/errors';

import type { NoteFormValues } from '../schemas/note';
import { notesApi } from '../api/notesApi';
import type { Note } from '../types';
import { notesKeys } from './useNotes';

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation<Note, ApiError, NoteFormValues>({
    mutationFn: (input: NoteFormValues) => notesApi.create(input),
    onSuccess: () => {
      // Simple invalidation is enough for a list this small; see useUpdateNote for an
      // optimistic-update alternative.
      queryClient.invalidateQueries({ queryKey: notesKeys.all });
    },
  });
}
