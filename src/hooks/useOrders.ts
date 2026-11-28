import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import type { OrderStatus } from '@/types/order';

export function useOrders(params?: { branchId?: string; status?: OrderStatus }) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => orderService.getAll(params),
  });
}

export function useMyOrders(enabled = true) {
  return useQuery({
    queryKey: ['my-orders'],
    queryFn: () => orderService.getMyOrders(),
    enabled,
  });
}
