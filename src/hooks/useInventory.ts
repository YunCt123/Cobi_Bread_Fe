import { useQuery } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventoryService';
import type { BatchStatus } from '@/types/inventory';

export function useInventoryBatches(params?: {
  branchId?: string;
  productId?: string;
  status?: BatchStatus;
  includeExpired?: boolean;
  lang?: 'vi' | 'en';
}) {
  return useQuery({
    queryKey: ['inventory-batches', params],
    queryFn: () => inventoryService.getBatches(params),
  });
}

export function useBranchAvailability(branchId?: string, lang?: 'vi' | 'en') {
  return useQuery({
    queryKey: ['inventory-availability', branchId, lang],
    queryFn: () => inventoryService.getAvailability(branchId!, lang),
    enabled: Boolean(branchId),
  });
}
