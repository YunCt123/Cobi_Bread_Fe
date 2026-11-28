import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types/product';

export const categoryService = {
  getAll: async (lang?: string): Promise<Category[]> => {
    const { data } = await api.get<Category[]>(API_ENDPOINTS.CATEGORIES.BASE, {
      params: lang ? { lang } : undefined,
    });
    return data;
  },
  getCategories: async (lang?: string): Promise<Category[]> => {
    return categoryService.getAll(lang);
  },
  create: async (payload: CreateCategoryInput): Promise<Category> => {
    const { data } = await api.post<Category>(API_ENDPOINTS.CATEGORIES.BASE, payload);
    return data;
  },
  update: async (id: string, payload: UpdateCategoryInput): Promise<Category> => {
    const { data } = await api.patch<Category>(API_ENDPOINTS.CATEGORIES.BY_ID(id), payload);
    return data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(API_ENDPOINTS.CATEGORIES.BY_ID(id));
    return data;
  },
};

export const categoriesApi = categoryService;
