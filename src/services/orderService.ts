import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type { CreateOrderInput, Order, OrderStatus } from '@/types/order';

export const orderService = {
  create: async (payload: CreateOrderInput): Promise<Order> => {
    const { data } = await api.post<Order>(API_ENDPOINTS.ORDERS.BASE, payload);
    return data;
  },
  createOrder: async (payload: CreateOrderInput): Promise<Order> => {
    return orderService.create(payload);
  },
  getMyOrders: async (langOrCtx?: string | unknown): Promise<Order[]> => {
    const lang = typeof langOrCtx === 'string' ? langOrCtx : undefined;
    const { data } = await api.get<Order[]>(API_ENDPOINTS.ORDERS.MY_ORDERS, {
      params: lang ? { lang } : undefined,
    });
    return data;
  },
  getAll: async (params?: { branchId?: string; status?: OrderStatus; lang?: string }): Promise<Order[]> => {
    const { data } = await api.get<Order[]>(API_ENDPOINTS.ORDERS.BASE, { params });
    return data;
  },
  getAllOrders: async (params?: { branchId?: string; status?: OrderStatus; lang?: string }): Promise<Order[]> => {
    return orderService.getAll(params);
  },
  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch<Order>(API_ENDPOINTS.ORDERS.STATUS(id), { status });
    return data;
  },
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    return orderService.updateStatus(id, status);
  },
};

export const ordersApi = orderService;
