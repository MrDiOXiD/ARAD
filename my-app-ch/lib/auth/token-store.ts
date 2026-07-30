// ── In-memory access token store ────────────────────────────────────────
//
// SECURITY: the access token lives ONLY in a module-level JS variable —
// never in localStorage/sessionStorage. Those are readable by any script
// on the page, so a single XSS bug anywhere in the app (a dependency, a
// dangerouslySetInnerHTML, a third-party widget) would hand an attacker
// a durable, stealable session token. An in-memory value is invisible to
// devtools' Application/Storage tab and disappears automatically on tab
// close or reload — which is exactly why we pair it with an httpOnly
// refresh cookie (see auth.ts) to survive reloads instead.
//
// This is intentionally NOT React state: fetch interceptors, and other
// non-component code need synchronous read/write access without prop
// drilling or hooks. AuthContext wraps this with React state for
// re-renders; this module is the single source of truth underneath it.

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearAccessToken(): void {
  accessToken = null;
}
