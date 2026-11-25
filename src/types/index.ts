export type Role = 'ADMIN' | 'BRANCH_MANAGER' | 'CUSTOMER';

export type StorageType = 'FRESH' | 'FROZEN' | 'AMBIENT';

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

export interface Branch {
  id: string;
  name: string;
  nameEn?: string | null;
  address: string;
  addressEn?: string | null;
  city: string;
  cityEn?: string | null;
  openHours: string;
  phone: string;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  branchId?: string | null;
  branch?: {
    id: string;
    name: string;
    nameEn?: string | null;
    city?: string;
    address?: string;
    addressEn?: string | null;
    openHours?: string;
    phone?: string;
  } | null;
  createdAt?: string;
}

export interface AuthLoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthRegisterResponse {
  message: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  parentId?: string | null;
  parent?: Category | null;
  children?: Category[];
  displayOrder: number;
  _count?: {
    products: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface NutritionJson {
  energyKcal?: number;
  carbsG?: number;
  proteinG?: number;
  fatG?: number;
  sodiumMg?: number;
  sugarG?: number;
  [key: string]: any;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  nameEn?: string | null;
  slug: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    nameEn?: string | null;
    slug: string;
    displayOrder?: number;
  };
  price: number;
  netWeightG: number;
  storageType: StorageType;
  shelfLifeFrozenDays?: number | null;
  shelfLifeChilledDays: number;
  isB2b: boolean;
  ingredients: string;
  ingredientsEn?: string | null;
  nutritionJson?: NutritionJson | null;
  images: string[];
  description?: string | null;
  descriptionEn?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface QueryProductParams {
  categorySlug?: string;
  storageType?: StorageType;
  isB2b?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  lang?: 'vi' | 'en';
}

export interface CreateProductInput {
  sku: string;
  name: string;
  nameEn?: string;
  slug?: string;
  categoryId: string;
  price: number;
  netWeightG: number;
  storageType: StorageType;
  shelfLifeFrozenDays?: number | null;
  shelfLifeChilledDays: number;
  isB2b?: boolean;
  ingredients: string;
  ingredientsEn?: string;
  nutritionJson?: NutritionJson | null;
  images?: string[];
  description?: string;
  descriptionEn?: string;
  isActive?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface CreateCategoryInput {
  name: string;
  nameEn?: string;
  slug?: string;
  parentId?: string;
  displayOrder?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export interface InventoryBatch {
  id: string;
  branchId: string;
  productId: string;
  batchCode: string;
  quantity: number;
  manufacturedAt: string;
  expiresAt: string;
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
