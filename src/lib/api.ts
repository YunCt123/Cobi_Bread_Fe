import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore, COOKIE_TOKEN_KEY } from '@/stores/auth.store';
import {
  Branch,
  User,
  AuthLoginResponse,
  AuthRegisterResponse,
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  Product,
  ProductsResponse,
  QueryProductParams,
  CreateProductInput,
  UpdateProductInput,
  InventoryBatch,
  CreateInventoryBatchInput,
  ProductAvailability,
  Order,
  OrderStatus,
  CreateOrderInput,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Tự động gắn Authorization Bearer Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    let token = useAuthStore.getState().accessToken;
    if (!token && typeof window !== 'undefined') {
      token = Cookies.get(COOKIE_TOKEN_KEY) || null;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Xử lý lỗi 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const { logout, accessToken } = useAuthStore.getState();
      if (accessToken) {
        logout();
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }): Promise<AuthLoginResponse> => {
    const { data } = await api.post<AuthLoginResponse>('/auth/login', credentials);
    return data;
  },

  register: async (payload: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthRegisterResponse> => {
    const { data } = await api.post<AuthRegisterResponse>('/auth/register', payload);
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};

// Branches API
export const branchesApi = {
  getBranches: async (lang?: 'vi' | 'en'): Promise<Branch[]> => {
    const { data } = await api.get<Branch[]>('/branches', {
      params: lang ? { lang } : undefined,
    });
    return data;
  },

  getBranchById: async (id: string, lang?: 'vi' | 'en'): Promise<Branch> => {
    const { data } = await api.get<Branch>(`/branches/${id}`, {
      params: lang ? { lang } : undefined,
    });
    return data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async (lang?: 'vi' | 'en'): Promise<Category[]> => {
    const { data } = await api.get<Category[]>('/categories', {
      params: lang ? { lang } : undefined,
    });
    return data;
  },

  getById: async (id: string, lang?: 'vi' | 'en'): Promise<Category> => {
    const { data } = await api.get<Category>(`/categories/${id}`, {
      params: lang ? { lang } : undefined,
    });
    return data;
  },

  create: async (payload: CreateCategoryInput): Promise<Category> => {
    const { data } = await api.post<Category>('/categories', payload);
    return data;
  },

  update: async (id: string, payload: UpdateCategoryInput): Promise<Category> => {
    const { data } = await api.patch<Category>(`/categories/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/categories/${id}`);
    return data;
  },
};

// Products API
export const productsApi = {
  getAll: async (params?: QueryProductParams): Promise<ProductsResponse> => {
    const { data } = await api.get<ProductsResponse>('/products', { params });
    return data;
  },

  getBySlug: async (slug: string, lang?: 'vi' | 'en'): Promise<Product> => {
    const { data } = await api.get<Product>(`/products/${slug}`, {
      params: lang ? { lang } : undefined,
    });
    return data;
  },

  create: async (payload: CreateProductInput): Promise<Product> => {
    const { data } = await api.post<Product>('/products', payload);
    return data;
  },

  update: async (id: string, payload: UpdateProductInput): Promise<Product> => {
    const { data } = await api.patch<Product>(`/products/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const { data } = await api.delete<{ message: string }>(`/products/${id}`);
    return data;
  },
};

// Inventory API (Milestone 3 FEFO)
export const inventoryApi = {
  getAvailability: async (branchId: string, productId: string): Promise<ProductAvailability> => {
    const { data } = await api.get<ProductAvailability>('/inventory/availability', {
      params: { branchId, productId },
    });
    return data;
  },

  getBatches: async (params?: { branchId?: string; productId?: string }): Promise<InventoryBatch[]> => {
    const { data } = await api.get<InventoryBatch[]>('/inventory/batches', { params });
    return data;
  },

  createBatch: async (payload: CreateInventoryBatchInput): Promise<InventoryBatch> => {
    const { data } = await api.post<InventoryBatch>('/inventory/batches', payload);
    return data;
  },
};

// Orders API (Milestone 3)
export const ordersApi = {
  create: async (payload: CreateOrderInput): Promise<Order> => {
    const { data } = await api.post<Order>('/orders', payload);
    return data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/orders/my-orders');
    return data;
  },

  getAll: async (params?: { branchId?: string; status?: OrderStatus }): Promise<Order[]> => {
    const { data } = await api.get<Order[]>('/orders', { params });
    return data;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch<Order>(`/orders/${id}/status`, { status });
    return data;
  },
};

export default api;
