import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { CreateUserInput, UpdateUserInput, User } from '@/types/user';

export const userService = {
  getAll: async (params?: { role?: string; branchId?: string; search?: string }): Promise<User[]> => {
    const { data } = await api.get<User[]>(API_ENDPOINTS.USERS.BASE, { params });
    return data;
  },
  create: async (payload: CreateUserInput): Promise<User> => {
    const { data } = await api.post<User>(API_ENDPOINTS.USERS.BASE, payload);
    return data;
  },
  update: async (id: string, payload: UpdateUserInput): Promise<User> => {
    const { data } = await api.patch<User>(API_ENDPOINTS.USERS.BY_ID(id), payload);
    return data;
  },
  toggleActive: async (id: string, isActive?: boolean): Promise<User> => {
    try {
      const { data } = await api.patch<User>(API_ENDPOINTS.USERS.STATUS(id), { isActive });
      return data;
    } catch {
      const { data } = await api.patch<User>(API_ENDPOINTS.USERS.BY_ID(id), { isActive });
      return data;
    }
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(API_ENDPOINTS.USERS.BY_ID(id));
    return data;
  },
};

export const usersApi = userService;
