import type { User } from './user';

export type Role = 'ADMIN' | 'BRANCH_MANAGER' | 'CUSTOMER';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthRegisterResponse {
  message?: string;
  accessToken?: string;
  user: User;
}

export type AuthResponse = AuthLoginResponse;
