/** Normalized shape all API failures are converted to, regardless of origin. */
export type ApiError = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
};

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' && value !== null && !(value instanceof Error) && 'message' in value
  );
}

/** Converts any thrown value (fetch rejection, HTTP error body, abort, etc.) into an `ApiError`. */
export function normalizeError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return { message: 'Request was cancelled.', code: 'ABORTED' };
  }

  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return { message: 'Request timed out.', code: 'TIMEOUT' };
    }
    return { message: error.message || 'Something went wrong.', code: 'UNKNOWN' };
  }

  if (typeof error === 'string') {
    return { message: error, code: 'UNKNOWN' };
  }

  return { message: 'An unexpected error occurred.', code: 'UNKNOWN', details: error };
}

/** Safe, user-facing message that never leaks internal details or stack traces. */
export function toUserMessage(error: ApiError): string {
  if (error.status === 401) {
    return 'Your session has expired. Please sign in again.';
  }
  if (error.status && error.status >= 500) {
    return 'Something went wrong on our end. Please try again.';
  }
  if (error.code === 'TIMEOUT') {
    return 'The request took too long. Please check your connection and try again.';
  }
  if (error.code === 'NETWORK') {
    return 'Unable to reach the server. Please check your connection.';
  }
  return error.message || 'Something went wrong.';
}
