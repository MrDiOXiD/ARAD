'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as authApi from '@/lib/auth/auth.api';

import { AuthUser, LoginPayload, RegisterPayload } from '@/interfaces/auth/auth';

const ME_QUERY_KEY = ['auth', 'me'] as const;

interface AuthContextValue {
  user: AuthUser | null;
  /** True until the initial silent-refresh + /user/me bootstrap resolves. */
  isBootstrapping: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  registerAndLogin: (payload: RegisterPayload) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Manually re-pull the profile, e.g. after the user edits their profile. */
  refetchUser: () => Promise<AuthUser | null>;
  isLoginPending: boolean;
  isRegisterPending: boolean;
  loginWithGoogle: (idToken: string) => Promise<AuthUser>;
  isGoogleLoginPending: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Gate the /user/me query behind an explicit bootstrap step: on every
  // fresh page load the in-memory access token is gone (that's the
  // whole point of not persisting it), so we must first redeem the
  // httpOnly refresh cookie for a new access token before /user/me can
  // succeed. Without this gate, `me()` would fire immediately on mount
  // with no Authorization header and fail every single reload — which
  // is exactly the "profile forgotten on refresh" bug this fixes.
  const [hasBootstrapped, setHasBootstrapped] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let cancelled = false;

    authApi.refresh().then((token) => {
      if (cancelled) return;
      setHasSession(Boolean(token));
      setHasBootstrapped(true);
    });

    return () => {
      cancelled = true;
    };
    // Runs once per app load, intentionally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: user, refetch } = useQuery<AuthUser | null>({
    queryKey: ME_QUERY_KEY,
    queryFn: authApi.me,
    enabled: hasBootstrapped && hasSession,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (loggedInUser) => {
      setHasSession(true);
      queryClient.setQueryData(ME_QUERY_KEY, loggedInUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear regardless of whether the network call to /auth/logout
      // succeeded — we never want the client to *appear* logged in
      // once the user has asked to log out.
      setHasSession(false);
      queryClient.setQueryData(ME_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    },
  });
const registerAndLogin = useCallback(
  async (payload: RegisterPayload) => {
    await authApi.register(payload);
    return loginMutation.mutateAsync({
      phoneNumber: payload.phoneNumber,
      password: payload.password,
    });
  },
  [loginMutation],
);
  const googleLoginMutation = useMutation({
    mutationFn: authApi.googleAuth,
    onSuccess: (loggedInUser) => {
      setHasSession(true);
      queryClient.setQueryData(ME_QUERY_KEY, loggedInUser);
    },
  });

  const refetchUser = useCallback(async () => {
    if (!hasSession) return null;
    const result = await refetch();
    return result.data ?? null;
  }, [hasSession, refetch]);

  const value: AuthContextValue = {
    user: user ?? null,
    isBootstrapping: !hasBootstrapped,
    isAuthenticated: Boolean(user),
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    registerAndLogin,
    logout: logoutMutation.mutateAsync,
    refetchUser,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth() must be used inside <AuthProvider>');
  return ctx;
}

// Re-exported so form components can surface backend validation
// messages (400s) without importing from the low-level fetch module.


export {ApiError} from '@/lib/auth/authFetch';