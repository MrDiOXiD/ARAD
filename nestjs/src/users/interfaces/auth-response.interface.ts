// src/users/interfaces/auth-response.interface.ts
// Exported here so both users.service and users.controller can reference it
// without TypeScript raising TS4053 "cannot be named from external module".

export interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
