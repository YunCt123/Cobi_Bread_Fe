import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { Branch, CreateBranchInput, UpdateBranchInput } from '@/types/branch';

export const branchService = {
  getAll: async (lang?: string, includeInactive?: boolean): Promise<Branch[]> => {
    const { data } = await api.get<Branch[]>(API_ENDPOINTS.BRANCHES.BASE, {
      params: {
        ...(lang ? { lang } : {}),
        ...(includeInactive ? { includeInactive: 'true' } : {}),
      },
    });
    return data;
  },
  getBranches: async (lang?: string, includeInactive?: boolean): Promise<Branch[]> => {
    return branchService.getAll(lang, includeInactive);
  },
  getBranchById: async (id: string, lang?: string): Promise<Branch> => {
    try {
      const { data } = await api.get<Branch>(API_ENDPOINTS.BRANCHES.BY_ID(id), {
        params: lang ? { lang } : undefined,
      });
      if (data && data.id) return data;
    } catch {
      // Fallback to list lookup
    }
    const list = await branchService.getAll(lang, true);
    const found = list.find((b) => b.id === id);
    if (!found) throw new Error('Branch not found');
    return found;
  },
  create: async (payload: CreateBranchInput): Promise<Branch> => {
    const { data } = await api.post<Branch>(API_ENDPOINTS.BRANCHES.BASE, payload);
    return data;
  },
  update: async (id: string, payload: UpdateBranchInput): Promise<Branch> => {
    const { data } = await api.patch<Branch>(API_ENDPOINTS.BRANCHES.BY_ID(id), payload);
    return data;
  },
  toggleActive: async (id: string, isActive?: boolean): Promise<Branch> => {
    try {
      const { data } = await api.patch<Branch>(API_ENDPOINTS.BRANCHES.STATUS(id), { isActive });
      return data;
    } catch {
      const { data } = await api.patch<Branch>(API_ENDPOINTS.BRANCHES.BY_ID(id), { isActive });
      return data;
    }
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(API_ENDPOINTS.BRANCHES.BY_ID(id));
    return data;
  },
};

export const branchesApi = branchService;
