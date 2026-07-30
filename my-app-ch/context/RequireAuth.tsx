'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

/**
 * Wrap any page/layout that requires a logged-in user. Waits for the
 * bootstrap (silent refresh + /user/me) to resolve before deciding —
 * without this wait, an authenticated user would flash-redirect to
 * /auth on every reload before their session has had a chance to load.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isBootstrapping && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isBootstrapping, isAuthenticated, router]);

  if (isBootstrapping) {
    return <div className="auth-gate__loading" aria-busy="true" />;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
