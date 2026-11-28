import type { StorageType } from './product';

export type BatchStatus = 'AVAILABLE' | 'DEPLETED' | 'EXPIRED';

export interface InventoryBatch {
  id: string;
  branchId: string;
  productId: string;
  batchCode: string;
  quantity: number;
  manufacturedAt: string;
  expiresAt: string;
  expiredAt?: string;
  status?: BatchStatus;
  createdAt?: string;
  updatedAt?: string;
  product?: {
    id: string;
    name: string;
    nameEn?: string | null;
    sku: string;
    storageType: StorageType;
    price: number;
  };
  branch?: {
    id: string;
    name: string;
    nameEn?: string | null;
    city?: string;
  };
}

export interface CreateInventoryBatchInput {
  branchId?: string;
  productId: string;
  batchCode: string;
  quantity: number;
  manufacturedAt: string;
  expiresAt: string;
}

export type CreateBatchPayload = CreateInventoryBatchInput;

export interface ProductAvailability {
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  sku: string;
  totalAvailable: number;
  batchesCount: number;
  earliestExpiry: string | null;
  activeBatches: Array<{
    id: string;
    batchCode: string;
    quantity: number;
    expiresAt: string;
  }>;
}

export type BranchInventoryAvailability = ProductAvailability[];
