import { authFetch, ENDPOINTS } from './authFetch';
import { setAccessToken, clearAccessToken } from './token-store';
import type {
  AuthUser,
  RegisterPayload,
  LoginPayload,
  AuthTokenResponse,
} from '@/interfaces/auth/auth';
/**
 * POST /user/register
 * Creates the account. Per your swagger spec this returns the created
 * user WITHOUT tokens, so it does not authenticate the browser — call
 * login() afterwards (see registerAndLogin in AuthContext) if you want
 * the user signed in immediately after signup.
 */
export async function register(payload: RegisterPayload): Promise<AuthUser> {
  return authFetch<AuthUser>(ENDPOINTS.register, {
    method: 'POST',
    body: payload,
  });
}

/**
 * POST /auth/login
 * ASSUMPTION: body shape and that the backend sets the refresh token as
 * an httpOnly cookie in the response (Set-Cookie), while returning only
 * the short-lived access token in the JSON body. Confirm this against
 * your actual /auth/login controller before relying on it.
 */
export async function login(payload: LoginPayload): Promise<AuthUser> {
  const data = await authFetch<AuthTokenResponse>(ENDPOINTS.login, {
    method: 'POST',
    body: payload,
    withCredentials: true, // so the Set-Cookie refresh token is stored
  });

  setAccessToken(data.accessToken);

  // Some APIs return the user inline with login, others expect a
  // follow-up GET /user/me. Support both without an extra round trip
  // when possible.
  if (data.user) return data.user;
  return me();
}

/**
 * GET /user/me
 * Requires a valid access token (attached automatically by authFetch).
 * This is the single source of truth for "who is logged in" — never
 * trust a locally cached user object without this check on load.
 */
export async function me(): Promise<AuthUser> {
  return authFetch<AuthUser>(ENDPOINTS.me, { method: 'GET' });
}

/**
 * POST /auth/refresh
 * Exchanges the httpOnly refresh cookie for a new access token. Used on
 * app bootstrap (page load/reload) and transparently inside authFetch
 * on a 401. You generally should not need to call this directly from
 * UI code — AuthContext's bootstrap effect does it once on mount.
 */
export async function refresh(): Promise<string | null> {
  try {
    const data = await authFetch<{ accessToken: string }>(ENDPOINTS.refresh, {
      method: 'POST',
      withCredentials: true,
    });
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    clearAccessToken();
    return null;
  }
}

/**
 * POST /auth/logout
 * Tells the server to invalidate/clear the refresh cookie (and ideally
 * revoke the refresh token server-side, not just clear the cookie — a
 * stolen refresh token should not keep working after logout). Clears
 * the local access token regardless of whether the request succeeds,
 * so the client is never left "logged in" locally if the network call
 * fails.
 */
export async function logout(): Promise<void> {
  try {
    await authFetch<void>(ENDPOINTS.logout, {
      method: 'POST',
      withCredentials: true,
    });
  } finally {
    clearAccessToken();
  }
}

/**
 * POST /user/google
 * Sends the ID token Google Identity Services handed the browser to
 * our backend for verification — the frontend never trusts or decodes
 * this token itself, it's opaque here. Backend response shape matches
 * login()'s (access token in body, refresh token set as httpOnly
 * cookie), so this reuses the same handling.
 */
export async function googleAuth(idToken: string): Promise<AuthUser> {
  const data = await authFetch<AuthTokenResponse>('/user/google', {
    method: 'POST',
    body: { idToken },
    withCredentials: true,
  });

  setAccessToken(data.accessToken);
  if (data.user) return data.user;
  return me();
}

