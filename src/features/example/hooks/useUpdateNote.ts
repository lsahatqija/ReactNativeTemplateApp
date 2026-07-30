import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { ApiError } from '@/api/errors';

import type { Note } from '../types';
import type { NoteFormValues } from '../schemas/note';
import { notesApi } from '../api/notesApi';
import { notesKeys } from './useNotes';

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient();

  return useMutation<Note, ApiError, NoteFormValues, { previous: Note | undefined }>({
    mutationFn: (input: NoteFormValues) => notesApi.update(id, input),
    // Optimistic update: the details screen reflects the edit immediately, then
    // reconciles with the server response (or rolls back on error).
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: notesKeys.detail(id) });
      const previous = queryClient.getQueryData<Note>(notesKeys.detail(id));
      if (previous) {
        queryClient.setQueryData<Note>(notesKeys.detail(id), {
          ...previous,
          title: input.title,
          body: input.body ?? '',
        });
      }
      return { previous };
    },
    onError: (_error, _input, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notesKeys.detail(id), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: notesKeys.all });
    },
  });
}
