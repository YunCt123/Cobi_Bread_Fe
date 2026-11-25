'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  X, 
  Thermometer, 
  Snowflake, 
  Sun, 
  Briefcase, 
  Layers, 
  Store, 
  Loader2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { categoriesApi, productsApi } from '@/lib/api';
import { Category, Product, StorageType } from '@/types';

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL query params
  const initialCategory = searchParams.get('categorySlug') || '';
  const initialStorage = (searchParams.get('storageType') as StorageType) || '';
  const initialB2b = searchParams.get('isB2b') === 'true';
  const initialSearch = searchParams.get('search') || '';

  const [categorySlug, setCategorySlug] = useState<string>(initialCategory);
  const [storageType, setStorageType] = useState<string>(initialStorage);
  const [isB2b, setIsB2b] = useState<boolean>(initialB2b);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [page, setPage] = useState<number>(1);

  // Sync state if URL searchParams change
  useEffect(() => {
    setCategorySlug(searchParams.get('categorySlug') || '');
    setStorageType(searchParams.get('storageType') || '');
    setIsB2b(searchParams.get('isB2b') === 'true');
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch categories for sidebar filter
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Fetch products with filters
  const { data: productsData, isLoading, isFetching } = useQuery({
    queryKey: ['products-catalog', categorySlug, storageType, isB2b, searchTerm, page],
    queryFn: () =>
      productsApi.getAll({
        categorySlug: categorySlug || undefined,
        storageType: (storageType as StorageType) || undefined,
        isB2b: isB2b ? true : undefined,
        search: searchTerm || undefined,
        page,
        limit: 16,
      }),
  });

  const products: Product[] = productsData?.data || [];
  const meta = productsData?.meta;

  const handleClearFilters = () => {
    setCategorySlug('');
    setStorageType('');
    setIsB2b(false);
    setSearchTerm('');
    setPage(1);
    router.push('/products');
  };

  const updateFilters = (newCat?: string, newStorage?: string, newB2b?: boolean) => {
    setPage(1);
    const cat = newCat !== undefined ? newCat : categorySlug;
    const st = newStorage !== undefined ? newStorage : storageType;
    const b2b = newB2b !== undefined ? newB2b : isB2b;

    const params = new URLSearchParams();
    if (cat) params.set('categorySlug', cat);
    if (st) params.set('storageType', st);
    if (b2b) params.set('isB2b', 'true');
    if (searchTerm) params.set('search', searchTerm);

    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb & Header Banner */}
        <section className="bg-white border-b border-stone-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
              <Link href="/" className="hover:text-amber-700">Trang chủ</Link>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-stone-900 font-semibold">Thực đơn bánh Cobi Bread</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                  Danh Mục Bánh & Sản Phẩm
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                  Khám phá các dòng bánh nướng tươi ngon, bánh cấp đông chất lượng cao phục vụ tận tay
                </p>
              </div>

              {/* Total count badge */}
              <div className="text-xs text-stone-600 bg-stone-100 px-3.5 py-1.5 rounded-xl border border-stone-200 self-start md:self-auto font-medium">
                Tìm thấy <strong className="text-amber-800 font-bold">{meta?.total ?? products.length}</strong> sản phẩm
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout: Filter Sidebar + Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Sidebar Filters */}
            <aside className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-6 lg:sticky lg:top-28">
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                  Bộ lọc sản phẩm
                </span>
                {(categorySlug || storageType || isB2b || searchTerm) && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-xs text-red-600 hover:underline font-semibold"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* 1. Search Bar */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                  Tìm theo tên hoặc SKU
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="VD: Kem tươi, Pocket, CB-..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateFilters();
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm border border-stone-300 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>
              </div>

              {/* 2. Category Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                  Danh mục sản phẩm
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => updateFilters('', undefined, undefined)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                      !categorySlug
                        ? 'bg-amber-100/80 text-amber-900 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>Tất cả danh mục</span>
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateFilters(cat.slug, undefined, undefined)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-between ${
                        categorySlug === cat.slug
                          ? 'bg-amber-100/80 text-amber-900 font-bold'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Storage Type Filter */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5">
                  Điều kiện bảo quản
                </label>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => updateFilters(undefined, '', undefined)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      !storageType ? 'bg-amber-100/80 text-amber-900' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    Tất cả nhiệt độ
                  </button>

                  <button
                    type="button"
                    onClick={() => updateFilters(undefined, 'FRESH', undefined)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                      storageType === 'FRESH'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Bánh tươi (0-10°C)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateFilters(undefined, 'FROZEN', undefined)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                      storageType === 'FROZEN'
                        ? 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Snowflake className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Đông lạnh (-18°C)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateFilters(undefined, 'AMBIENT', undefined)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                      storageType === 'AMBIENT'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    <span>Nhiệt độ thường</span>
                  </button>
                </div>
              </div>

              {/* 4. B2B Filter Toggle */}
              <div className="pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isB2b}
                    onChange={(e) => updateFilters(undefined, undefined, e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-stone-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-stone-900 block">Sản phẩm sỉ B2B</span>
                    <span className="text-[11px] text-stone-500">Dành cho quán cà phê, nhà hàng</span>
                  </div>
                </label>
              </div>
            </aside>

            {/* Products Grid & Pagination */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Active Filter Chips */}
              {(categorySlug || storageType || isB2b || searchTerm) && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-2xl border border-stone-200 text-xs">
                  <span className="text-stone-500 font-medium">Đang lọc theo:</span>
                  
                  {categorySlug && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold">
                      {categories.find((c) => c.slug === categorySlug)?.name || categorySlug}
                      <button onClick={() => updateFilters('', undefined, undefined)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {storageType && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold">
                      {storageType === 'FRESH' ? 'Bánh tươi 0-10°C' : storageType === 'FROZEN' ? 'Đông lạnh -18°C' : 'Nhiệt độ thường'}
                      <button onClick={() => updateFilters(undefined, '', undefined)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {isB2b && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold">
                      Bán sỉ B2B
                      <button onClick={() => updateFilters(undefined, undefined, false)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 font-semibold">
                      Từ khóa: &ldquo;{searchTerm}&rdquo;
                      <button onClick={() => { setSearchTerm(''); updateFilters(); }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Loading Skeleton */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-80 rounded-3xl bg-white border border-stone-200 animate-pulse" />
                  ))}
                </div>
              )}

              {/* Products List */}
              {!isLoading && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && products.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-stone-900">
                    Không tìm thấy sản phẩm nào
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                    Không có sản phẩm nào khớp với tiêu chí lọc hiện tại. Hãy thử chọn danh mục khác hoặc xóa bộ lọc.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors"
                  >
                    Xem lại tất cả sản phẩm
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 disabled:opacity-50 hover:bg-stone-50"
                  >
                    Trang trước
                  </button>
                  <span className="text-xs text-stone-600 px-3 font-semibold">
                    Trang {meta.page} / {meta.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 disabled:opacity-50 hover:bg-stone-50"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-stone-500 text-sm font-semibold">
            <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            <span>Đang tải thực đơn bánh Cobi Bread...</span>
          </div>
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
