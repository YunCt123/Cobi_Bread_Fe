import type { PaginatedMeta } from './api';

export type StorageType = 'FRESH' | 'FROZEN' | 'AMBIENT';

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

export interface CreateCategoryInput {
  name: string;
  nameEn?: string;
  slug?: string;
  parentId?: string | null;
  displayOrder?: number;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CategoryPayload = CreateCategoryInput;

export interface NutritionJson {
  energyKcal?: number;
  carbsG?: number;
  proteinG?: number;
  fatG?: number;
  sodiumMg?: number;
  sugarG?: number;
  [key: string]: number | string | undefined;
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
  meta: PaginatedMeta;
}

export interface QueryProductParams {
  categorySlug?: string;
  categoryId?: string;
  storageType?: StorageType;
  isB2b?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  lang?: string;
}

export type ProductsFilterParams = QueryProductParams;

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

export type UpdateProductInput = Partial<CreateProductInput>;

export type ProductPayload = CreateProductInput;
