import { waitFor } from '@testing-library/react-native';

import { notesApi } from '@/features/example/api/notesApi';
import { useNotes } from '@/features/example/hooks/useNotes';
import type { Note } from '@/features/example/types';

import { renderHookWithQueryClient } from '../../test-utils';

jest.mock('@/features/example/api/notesApi', () => ({
  notesApi: { list: jest.fn() },
}));

const mockedList = notesApi.list as jest.Mock;

const sampleNote: Note = {
  id: '1',
  title: 'Sample',
  body: 'Body',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

describe('useNotes', () => {
  beforeEach(() => {
    mockedList.mockReset();
  });

  it('reports a loading state before the query resolves', async () => {
    mockedList.mockReturnValue(new Promise(() => {}));
    const { result } = await renderHookWithQueryClient(() => useNotes());
    expect(result.current.isPending).toBe(true);
  });

  it('reports a success state with the fetched notes', async () => {
    mockedList.mockResolvedValue([sampleNote]);
    const { result } = await renderHookWithQueryClient(() => useNotes());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([sampleNote]);
  });

  it('reports an empty success state when there are no notes', async () => {
    mockedList.mockResolvedValue([]);
    const { result } = await renderHookWithQueryClient(() => useNotes());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it('reports an error state when the request fails', async () => {
    mockedList.mockRejectedValue({ message: 'Network down' });
    const { result } = await renderHookWithQueryClient(() => useNotes());
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
