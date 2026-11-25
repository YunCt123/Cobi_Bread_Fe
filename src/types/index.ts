export type Role = 'ADMIN' | 'BRANCH_MANAGER' | 'CUSTOMER';

export type StorageType = 'FRESH' | 'FROZEN' | 'AMBIENT';

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
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
    city?: string;
    address?: string;
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
  slug: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
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
  nutritionJson?: NutritionJson | null;
  images: string[];
  description?: string | null;
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
}

export interface CreateProductInput {
  sku: string;
  name: string;
  slug?: string;
  categoryId: string;
  price: number;
  netWeightG: number;
  storageType: StorageType;
  shelfLifeFrozenDays?: number | null;
  shelfLifeChilledDays: number;
  isB2b?: boolean;
  ingredients: string;
  nutritionJson?: NutritionJson | null;
  images?: string[];
  description?: string;
  isActive?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  parentId?: string;
  displayOrder?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}
