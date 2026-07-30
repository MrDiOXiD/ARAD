import { getAccessToken, setAccessToken, clearAccessToken } from './token-store';
import type { ApiErrorBody } from '@/interfaces/auth/auth';

// ── Config ───────────────────────────────────────────────────────────────
// Point this at your NestJS API. Kept as an env var so it differs
// per-environment without a code change.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// ASSUMPTION — confirm/adjust these three paths against your real routes.
const ENDPOINTS = {
  register: '/user/register',
  me: '/user/me',
  login: '/user/login',
  refresh: '/user/refresh',  // was '/auth/refresh'
  logout: '/user/logout',    // was '/auth/logout'
} as const;


export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

// ── Single-flight refresh ───────────────────────────────────────────────
// If five components each get a 401 at the same moment (e.g. right after
// an access token expires), we must NOT fire five parallel refresh
// requests — that's a race that can invalidate a refresh token mid-swap
// on some rotation schemes, and is just wasteful otherwise. This dedupes
// concurrent callers onto a single in-flight refresh promise.
let refreshInFlight: Promise<string | null> | null = null;

async function performRefresh(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}${ENDPOINTS.refresh}`, {
          method: 'POST',
          // credentials: 'include' is required so the httpOnly refresh
          // cookie is actually sent — it will NOT be attached otherwise,
          // including on same-site requests in some browser configs.
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
          clearAccessToken();
          return null;
        }

        const data = (await res.json()) as { accessToken: string };
        setAccessToken(data.accessToken);
        return data.accessToken;
      } catch {
        clearAccessToken();
        return null;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Set true for endpoints that rely on the httpOnly cookie (login/refresh/logout). */
  withCredentials?: boolean;
  /** Internal — prevents infinite retry loops after a refresh attempt. */
  _isRetry?: boolean;
}

async function parseErrorBody(res: Response): Promise<ApiErrorBody | null> {
  try {
    return (await res.json()) as ApiErrorBody;
  } catch {
    return null;
  }
}

/**
 * Core authenticated request function. Attaches the in-memory access
 * token, and on a 401 makes exactly one attempt to silently refresh and
 * retry before giving up and clearing local auth state.
 */
export async function authFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, withCredentials = false, _isRetry = false } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: withCredentials ? 'include' : 'same-origin',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && !_isRetry) {
    const newToken = await performRefresh();
    if (newToken) {
      return authFetch<T>(path, { ...options, _isRetry: true });
    }
    // Refresh failed — the session is truly over. Let the caller (react
    // query / AuthContext) handle redirecting to /auth; we don't force
    // navigation from inside a low-level fetch helper.
    clearAccessToken();
  }

  if (!res.ok) {
    const errBody = await parseErrorBody(res);
    const message = Array.isArray(errBody?.message)
      ? errBody!.message.join(', ')
      : errBody?.message ?? `Request failed with status ${res.status}`;
    throw new ApiError(res.status, errBody, message);
  }

  // 204 No Content etc.
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export { ENDPOINTS, API_BASE_URL };
