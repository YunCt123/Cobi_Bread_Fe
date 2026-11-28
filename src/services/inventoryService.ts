import { api } from '@/api/axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import type {
  BatchStatus,
  CreateInventoryBatchInput,
  InventoryBatch,
  ProductAvailability,
} from '@/types/inventory';

export const inventoryService = {
  getBatches: async (params?: {
    branchId?: string;
    productId?: string;
    status?: BatchStatus;
    includeExpired?: boolean;
    lang?: string;
  }): Promise<InventoryBatch[]> => {
    const { data } = await api.get<InventoryBatch[]>(API_ENDPOINTS.INVENTORY.BATCHES, { params });
    return data;
  },
  getAvailability: async (
    branchId: string,
    productId?: string,
    lang?: string
  ): Promise<ProductAvailability> => {
    const { data } = await api.get<ProductAvailability>(
      API_ENDPOINTS.INVENTORY.AVAILABILITY,
      {
        params: {
          branchId,
          ...(productId ? { productId } : {}),
          ...(lang ? { lang } : {}),
        },
      }
    );
    return data;
  },
  getBranchAvailability: async (
    branchId: string,
    lang?: string
  ): Promise<ProductAvailability[]> => {
    const { data } = await api.get<ProductAvailability[]>(
      API_ENDPOINTS.INVENTORY.AVAILABILITY,
      {
        params: {
          branchId,
          ...(lang ? { lang } : {}),
        },
      }
    );
    return Array.isArray(data) ? data : [data];
  },
  createBatch: async (payload: CreateInventoryBatchInput): Promise<InventoryBatch> => {
    const { data } = await api.post<InventoryBatch>(API_ENDPOINTS.INVENTORY.BATCHES, payload);
    return data;
  },
  updateBatchStatus: async (id: string, status: BatchStatus): Promise<InventoryBatch> => {
    const { data } = await api.patch<InventoryBatch>(
      `${API_ENDPOINTS.INVENTORY.BATCHES}/${id}/status`,
      { status }
    );
    return data;
  },
};

export const inventoryApi = inventoryService;
