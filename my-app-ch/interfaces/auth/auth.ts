// interfaces/auth/auth.ts — updated LoginPayload to match the actual
// login form (phone + password), not the earlier "identifier" guess.

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  phoneNumber: string;
  roles: UserRole[];
  createdAt: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  phoneNumber: string;
}

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  user?: AuthUser;
}

export interface ApiErrorBody {
  message: string | string[];
  error?: string;
  statusCode: number;
}
