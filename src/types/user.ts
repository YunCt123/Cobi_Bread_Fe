import type { Role } from './auth';

export type { Role };

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: Role;
  isActive?: boolean;
  branchId?: string | null;
  branch?: {
    id: string;
    name: string;
    nameEn?: string | null;
    city?: string;
    address?: string;
    addressEn?: string | null;
    openHours?: string;
    phone?: string;
  } | null;
  _count?: {
    orders?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: Role;
  branchId?: string | null;
  isActive?: boolean;
}

export interface UpdateUserInput {
  fullName?: string;
  phone?: string;
  role?: Role;
  branchId?: string | null;
  isActive?: boolean;
  password?: string;
}

export type UserPayload = CreateUserInput;
