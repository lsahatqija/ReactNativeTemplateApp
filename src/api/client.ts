import { env } from '@/config/env';
import { secureStorage } from '@/storage/secure';

import { normalizeError, type ApiError } from './errors';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: QueryParams;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Milliseconds before the request is aborted. Defaults to 15s. */
  timeoutMs?: number;
  /** Set to false for endpoints that don't require the auth header. */
  auth?: boolean;
}

/** Invoked once when any request receives a 401, so `AuthProvider` can react (e.g. sign out). */
type UnauthorizedHandler = () => void;
let onUnauthorized: UnauthorizedHandler | undefined;
export function setUnauthorizedHandler(handler: UnauthorizedHandler | undefined) {
  onUnauthorized = handler;
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(path, env.API_URL);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/** Combines a caller-provided signal with an internal timeout abort. */
function combineSignals(
  timeoutMs: number,
  external?: AbortSignal,
): { signal: AbortSignal; cleanup: () => void } {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const onExternalAbort = () => controller.abort();
  external?.addEventListener('abort', onExternalAbort);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeout);
      external?.removeEventListener('abort', onExternalAbort);
    },
  };
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }
  const text = await response.text();
  if (!text) {
    return undefined;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', body, query, headers, signal, timeoutMs = 15000, auth = true } = options;

  const url = buildUrl(path, query);
  const { signal: combinedSignal, cleanup } = combineSignals(timeoutMs, signal);

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  };
  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = await secureStorage.getAccessToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  if (__DEV__) {
    console.log(`[api] -> ${method} ${url}`);
  }

  try {
    const response = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: combinedSignal,
    });

    const data = await parseBody(response);

    if (!response.ok) {
      const apiError: ApiError = {
        message: (data as { message?: string })?.message ?? response.statusText,
        status: response.status,
        code: (data as { code?: string })?.code,
        details: data,
      };

      if (response.status === 401) {
        onUnauthorized?.();
      }

      if (__DEV__) {
        console.warn(`[api] <- ${method} ${url} failed`, apiError);
      }

      throw apiError;
    }

    if (__DEV__) {
      console.log(`[api] <- ${method} ${url} ${response.status}`);
    }

    return data as TResponse;
  } catch (error) {
    const normalized = normalizeError(error);
    if (__DEV__ && normalized.code !== undefined) {
      // Network/timeout/abort errors don't hit the !response.ok branch above.
      console.warn(`[api] <- ${method} ${url} error`, normalized);
    }
    throw normalized;
  } finally {
    cleanup();
  }
}

export const apiClient = { request };
