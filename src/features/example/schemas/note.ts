import { z } from 'zod';

/** Validation lives with the feature that owns it, not centrally. */
export const noteFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title is too long'),
  body: z.string().max(2000, 'Note is too long'),
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;
