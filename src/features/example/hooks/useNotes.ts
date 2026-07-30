import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/errors';

import { notesApi } from '../api/notesApi';
import type { Note } from '../types';

export const notesKeys = {
  all: ['notes'] as const,
  detail: (id: string) => ['notes', id] as const,
};

export function useNotes() {
  return useQuery<Note[], ApiError>({
    queryKey: notesKeys.all,
    queryFn: () => notesApi.list(),
  });
}
