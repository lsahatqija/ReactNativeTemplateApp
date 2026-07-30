import { normalizeError, toUserMessage, type ApiError } from '@/api/errors';

describe('normalizeError', () => {
  it('passes through an already-normalized ApiError', () => {
    const error: ApiError = { message: 'Not found', status: 404 };
    expect(normalizeError(error)).toBe(error);
  });

  it('maps AbortError to a TIMEOUT code', () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    expect(normalizeError(abortError)).toEqual({
      message: 'Request was cancelled.',
      code: 'ABORTED',
    });
  });

  it('maps a generic Error to an UNKNOWN code', () => {
    expect(normalizeError(new Error('boom'))).toEqual({ message: 'boom', code: 'UNKNOWN' });
  });

  it('maps a plain string to an ApiError', () => {
    expect(normalizeError('oops')).toEqual({ message: 'oops', code: 'UNKNOWN' });
  });

  it('falls back to a generic message for unrecognized values', () => {
    expect(normalizeError(42)).toEqual({
      message: 'An unexpected error occurred.',
      code: 'UNKNOWN',
      details: 42,
    });
  });
});

describe('toUserMessage', () => {
  it('returns a session-expired message for 401s', () => {
    expect(toUserMessage({ message: 'x', status: 401 })).toMatch(/session has expired/i);
  });

  it('returns a generic server error message for 5xx', () => {
    expect(toUserMessage({ message: 'x', status: 500 })).toMatch(/something went wrong/i);
  });

  it('never leaks the raw message for server errors', () => {
    const message = toUserMessage({ message: 'Stack trace: at foo.js:42', status: 500 });
    expect(message).not.toContain('foo.js');
  });
});
