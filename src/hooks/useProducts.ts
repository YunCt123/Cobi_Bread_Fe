import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { branchService } from '@/services/branchService';
import type { ProductsFilterParams } from '@/types/product';

export function useProducts(params?: ProductsFilterParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
  });
}

export function useProductBySlug(slug: string, lang?: 'vi' | 'en') {
  return useQuery({
    queryKey: ['product', slug, lang],
    queryFn: () => productService.getBySlug(slug, lang),
    enabled: Boolean(slug),
  });
}

export function useCategories(lang?: 'vi' | 'en') {
  return useQuery({
    queryKey: ['categories', lang],
    queryFn: () => categoryService.getAll(lang),
  });
}

export function useBranches(lang?: 'vi' | 'en') {
  return useQuery({
    queryKey: ['branches', lang],
    queryFn: () => branchService.getAll(lang),
  });
}
