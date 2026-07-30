import { noteFormSchema } from '@/features/example/schemas/note';

describe('noteFormSchema', () => {
  it('accepts a valid note', () => {
    const result = noteFormSchema.safeParse({ title: 'Groceries', body: 'Milk, eggs' });
    expect(result.success).toBe(true);
  });

  it('accepts an empty body string', () => {
    const result = noteFormSchema.safeParse({ title: 'Groceries', body: '' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty title', () => {
    const result = noteFormSchema.safeParse({ title: '', body: '' });
    expect(result.success).toBe(false);
  });

  it('rejects an overly long title', () => {
    const result = noteFormSchema.safeParse({ title: 'a'.repeat(121) });
    expect(result.success).toBe(false);
  });
});
