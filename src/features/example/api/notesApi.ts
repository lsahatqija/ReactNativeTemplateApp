import type { NoteFormValues } from '../schemas/note';
import type { Note } from '../types';

export interface NotesApi {
  list(): Promise<Note[]>;
  get(id: string): Promise<Note>;
  create(input: NoteFormValues): Promise<Note>;
  update(id: string, input: NoteFormValues): Promise<Note>;
  remove(id: string): Promise<void>;
}

/*
 * No real backend exists for this template. This in-memory mock adapter implements the
 * same `NotesApi` interface a real implementation would (built on `apiClient.request`
 * from `src/api/client.ts`), so screens/hooks never need to change when a backend
 * becomes available — only this file (or a sibling module) is swapped out.
 *
 * Example real implementation sketch:
 *   list: () => apiClient.request<Note[]>('/notes'),
 *   get: (id) => apiClient.request<Note>(`/notes/${id}`),
 *   create: (input) => apiClient.request<Note>('/notes', { method: 'POST', body: input }),
 */
function createMockNotesApi(): NotesApi {
  let notes: Note[] = [
    {
      id: '1',
      title: 'Welcome to the example feature',
      body: 'This note list is backed by an in-memory mock API. Edit src/features/example/api/notesApi.ts to connect a real backend.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

  return {
    async list() {
      await delay();
      return [...notes].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    },
    async get(id) {
      await delay();
      const note = notes.find((n) => n.id === id);
      if (!note) {
        throw { message: 'Note not found', status: 404 };
      }
      return note;
    },
    async create(input) {
      await delay();
      const now = new Date().toISOString();
      const note: Note = {
        id: String(Date.now()),
        title: input.title,
        body: input.body ?? '',
        createdAt: now,
        updatedAt: now,
      };
      notes = [note, ...notes];
      return note;
    },
    async update(id, input) {
      await delay();
      const index = notes.findIndex((n) => n.id === id);
      if (index === -1) {
        throw { message: 'Note not found', status: 404 };
      }
      const updated: Note = {
        ...notes[index],
        title: input.title,
        body: input.body ?? '',
        updatedAt: new Date().toISOString(),
      };
      notes = [...notes.slice(0, index), updated, ...notes.slice(index + 1)];
      return updated;
    },
    async remove(id) {
      await delay();
      notes = notes.filter((n) => n.id !== id);
    },
  };
}

export const notesApi: NotesApi = createMockNotesApi();
