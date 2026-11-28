import type { StorageType } from './product';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'VNPAY' | 'MOMO' | 'BANK_TRANSFER';

export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED';

export type DeliveryType = 'EXPRESS_NOW' | 'SCHEDULED' | 'PICKUP';

export interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  batchId?: string | null;
  quantity: number;
  unitPrice: number;
  createdAt?: string;
  product?: {
    id: string;
    name: string;
    nameEn?: string | null;
    sku: string;
    slug?: string;
    price: number;
    storageType?: StorageType;
    images?: string[] | string;
  };
  batch?: {
    id: string;
    batchCode: string;
    expiresAt: string;
  } | null;
}

export interface Order {
  id: string;
  orderCode: string;
  userId: string;
  branchId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  note?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
  branch?: {
    id: string;
    name: string;
    nameEn?: string | null;
    city?: string;
    address?: string;
    phone?: string;
  };
  user?: {
    id: string;
    email: string;
    fullName: string;
  };
}

export interface CreateOrderInput {
  branchId: string;
  items: Array<{ productId: string; quantity: number }>;
  paymentMethod: PaymentMethod;
  deliveryType: DeliveryType;
  shippingAddress: ShippingAddress;
  note?: string;
}

export type CreateOrderPayload = CreateOrderInput;
