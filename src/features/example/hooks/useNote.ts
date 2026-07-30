import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '@/api/errors';

import { notesApi } from '../api/notesApi';
import type { Note } from '../types';
import { notesKeys } from './useNotes';

export function useNote(id: string | undefined) {
  return useQuery<Note, ApiError>({
    queryKey: notesKeys.detail(id ?? ''),
    queryFn: () => notesApi.get(id as string),
    enabled: Boolean(id),
  });
}
