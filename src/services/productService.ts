import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type {
  CreateProductInput,
  Product,
  ProductsResponse,
  QueryProductParams,
  UpdateProductInput,
} from '@/types/product';

export const productService = {
  getAll: async (params?: QueryProductParams): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse | Product[]>(API_ENDPOINTS.PRODUCTS.BASE, {
      params,
    });
    if (Array.isArray(data)) {
      return {
        data,
        meta: {
          total: data.length,
          page: params?.page || 1,
          limit: params?.limit || data.length || 12,
          totalPages: 1,
        },
      };
    }
    return data;
  },
  getProducts: async (params?: QueryProductParams): Promise<ProductsResponse> => {
    return productService.getAll(params);
  },
  getBySlug: async (slug: string, lang?: string): Promise<Product> => {
    const { data } = await api.get<Product>(API_ENDPOINTS.PRODUCTS.BY_SLUG(slug), {
      params: lang ? { lang } : undefined,
    });
    return data;
  },
  create: async (payload: CreateProductInput): Promise<Product> => {
    const { data } = await api.post<Product>(API_ENDPOINTS.PRODUCTS.BASE, payload);
    return data;
  },
  update: async (id: string, payload: UpdateProductInput): Promise<Product> => {
    const { data } = await api.patch<Product>(API_ENDPOINTS.PRODUCTS.BY_ID(id), payload);
    return data;
  },
  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(API_ENDPOINTS.PRODUCTS.BY_ID(id));
    return data;
  },
};

export const productsApi = productService;
