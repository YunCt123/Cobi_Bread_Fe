'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Filter,
  X,
  Thermometer,
  Snowflake,
  Sun,
  Briefcase,
  ChevronRight,
  SlidersHorizontal,
  Loader2,
} from 'lucide-react';
import { categoriesApi, productsApi } from '@/services';
import { Category, Product, StorageType } from '@/types';
import ProductCard from '@/components/storefront/ProductCard';
import { useTranslation, getLocalizedCategoryName } from '@/i18n';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();

  // Sync initial filters from URL
  const categorySlugParam = searchParams.get('categorySlug') || '';
  const storageTypeParam = (searchParams.get('storageType') as StorageType) || '';
  const isB2bParam = searchParams.get('isB2b') === 'true';
  const searchParam = searchParams.get('search') || '';
  const pageParam = Number(searchParams.get('page')) || 1;

  const [searchDraft, setSearchDraft] = useState<{ base: string; value: string }>({
    base: searchParam,
    value: searchParam,
  });
  const localSearch = searchDraft.base === searchParam ? searchDraft.value : searchParam;
  const setLocalSearch = (val: string) =>
    setSearchDraft({ base: searchParam, value: val });

  // Fetch Categories with ?lang=
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories', locale],
    queryFn: () => categoriesApi.getAll(locale),
  });

  // Fetch Products based on query + ?lang=
  const { data: productData, isLoading } = useQuery({
    queryKey: [
      'products',
      locale,
      categorySlugParam,
      storageTypeParam,
      isB2bParam,
      searchParam,
      pageParam,
    ],
    queryFn: () =>
      productsApi.getAll({
        categorySlug: categorySlugParam || undefined,
        storageType: storageTypeParam || undefined,
        isB2b: isB2bParam ? true : undefined,
        search: searchParam || undefined,
        page: pageParam,
        limit: 12,
        lang: locale,
      }),
  });

  const products: Product[] = productData?.data || [];
  const meta = productData?.meta;

  const updateFilters = (updates: Record<string, string | null | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '' || value === 'false') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    if (!('page' in updates)) {
      params.delete('page');
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearch.trim() || null });
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    router.push('/products');
  };

  const activeCategoryObj = categories.find((c) => c.slug === categorySlugParam);
  const activeCategoryDisplay = activeCategoryObj
    ? getLocalizedCategoryName(activeCategoryObj, locale)
    : categorySlugParam;

  const hasAnyFilter = Boolean(categorySlugParam || storageTypeParam || isB2bParam || searchParam);

  const storageFilterOptions: {
    value: StorageType | '';
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: '', label: t.productsPage.allTemperatures, icon: null },
    {
      value: 'FRESH',
      label: t.storage.freshFull,
      icon: <Thermometer className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      value: 'FROZEN',
      label: t.storage.frozenFull,
      icon: <Snowflake className="w-3.5 h-3.5 text-cyan-600" />,
    },
    {
      value: 'AMBIENT',
      label: t.storage.ambientFull,
      icon: <Sun className="w-3.5 h-3.5 text-amber-600" />,
    },
  ];

  const getStorageChipLabel = (st: StorageType) => {
    if (st === 'FRESH') return t.storage.freshFull;
    if (st === 'FROZEN') return t.storage.frozenFull;
    return t.storage.ambientFull;
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812]">{t.productsPage.breadcrumb}</span>
        </nav>

        {/* Title Header */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231812] tracking-tight">
              {t.productsPage.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t.productsPage.subtitle}
            </p>
          </div>
          {meta && (
            <div className="text-xs font-semibold text-stone-600 bg-orange-50/70 px-4 py-2 rounded-full border border-orange-200/60 self-start md:self-center">
              {t.productsPage.foundPrefix}{' '}
              <span className="text-[#F37021] font-bold">{meta.total}</span>{' '}
              {t.productsPage.foundSuffix}
            </div>
          )}
        </div>

        {/* Main Grid: Filters Sidebar + Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* LEFT SIDEBAR: Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-sm font-bold text-[#231812] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#F37021]" />
                  <span>{t.productsPage.filterTitle}</span>
                </h3>
                {hasAnyFilter && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    {t.productsPage.clearAll}
                  </button>
                )}
              </div>

              {/* Search by Name / SKU */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {t.productsPage.searchLabel}
                </label>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    placeholder={t.productsPage.searchInputPlaceholder}
                    className="w-full pl-3 pr-9 py-2 rounded-xl border border-stone-200 bg-[#FAF7F2] text-xs focus:outline-none focus:border-[#F37021]"
                  />
                  <button
                    type="submit"
                    aria-label={t.common.searchBtn}
                    className="absolute right-2.5 top-2 text-stone-400 hover:text-[#F37021] cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {t.productsPage.categoryLabel}
                </label>
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => updateFilters({ categorySlug: null })}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                      !categorySlugParam
                        ? 'bg-[#231812] text-white font-bold'
                        : 'text-stone-700 hover:bg-orange-50'
                    }`}
                  >
                    {t.common.allCategories}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => updateFilters({ categorySlug: cat.slug })}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-between ${
                        categorySlugParam === cat.slug
                          ? 'bg-[#F37021] text-white font-bold shadow-xs'
                          : 'text-stone-700 hover:bg-orange-50'
                      }`}
                    >
                      <span className="truncate">
                        {getLocalizedCategoryName(cat, locale)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Storage Condition Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {t.productsPage.storageLabel}
                </label>
                <div className="space-y-1.5">
                  {storageFilterOptions.map((item) => (
                    <button
                      key={item.value || 'ALL'}
                      type="button"
                      onClick={() => updateFilters({ storageType: item.value || null })}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                        storageTypeParam === item.value
                          ? 'bg-[#231812] text-white font-bold'
                          : 'bg-[#FAF7F2] text-stone-700 hover:bg-stone-200/60'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* B2B Filter */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => updateFilters({ isB2b: isB2bParam ? null : 'true' })}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isB2bParam
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                      : 'bg-white border-stone-200 text-stone-700 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase
                      className={`w-4 h-4 ${isB2bParam ? 'text-blue-700' : 'text-stone-400'}`}
                    />
                    <div className="text-left">
                      <span className="block">{t.productsPage.b2bLabel}</span>
                      <span className="text-[10px] font-normal text-stone-500">
                        {t.productsPage.b2bSub}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isB2bParam ? 'border-blue-700 bg-blue-700' : 'border-stone-300'
                    }`}
                  >
                    {isB2bParam && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* RIGHT CATALOG GRID */}
          <div className="lg:col-span-3 space-y-6">
            {/* Active Filters Chips */}
            {hasAnyFilter && (
              <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-stone-200/80 text-xs">
                <span className="text-stone-500 font-medium mr-1">
                  {t.productsPage.filteringBy}
                </span>
                {categorySlugParam && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 text-[#F37021] font-semibold border border-orange-200">
                    <span>{activeCategoryDisplay}</span>
                    <button
                      type="button"
                      onClick={() => updateFilters({ categorySlug: null })}
                      aria-label={t.common.close}
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {storageTypeParam && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 font-semibold border border-cyan-200">
                    <span>{getStorageChipLabel(storageTypeParam)}</span>
                    <button
                      type="button"
                      onClick={() => updateFilters({ storageType: null })}
                      aria-label={t.common.close}
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {isB2bParam && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                    <span>{t.common.b2b}</span>
                    <button
                      type="button"
                      onClick={() => updateFilters({ isB2b: null })}
                      aria-label={t.common.close}
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchParam && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-semibold">
                    <span>
                      {t.productsPage.keywordPrefix} &quot;{searchParam}&quot;
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setLocalSearch('');
                        updateFilters({ search: null });
                      }}
                      aria-label={t.common.close}
                      className="cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl border border-stone-200/80 p-4 space-y-3 animate-pulse"
                  >
                    <div className="aspect-[4/3] bg-stone-200 rounded-2xl" />
                    <div className="h-4 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                    <div className="h-8 bg-stone-200 rounded-xl w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-orange-50 text-[#F37021] rounded-full flex items-center justify-center mx-auto">
                  <Filter className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold text-[#231812]">
                    {t.productsPage.emptyTitle}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {t.productsPage.emptyDesc}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-full bg-[#F37021] text-white text-xs font-bold hover:bg-[#D95D14] cursor-pointer"
                >
                  {t.productsPage.resetFilters}
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  type="button"
                  disabled={meta.page <= 1}
                  onClick={() => updateFilters({ page: String(meta.page - 1) })}
                  className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 cursor-pointer hover:bg-orange-50"
                >
                  {t.common.previousPage}
                </button>
                <span className="text-xs font-bold text-stone-600 px-3">
                  {t.common.pagePrefix} {meta.page} / {meta.totalPages}
                </span>
                <button
                  type="button"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => updateFilters({ page: String(meta.page + 1) })}
                  className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-xs font-bold text-stone-700 disabled:opacity-40 cursor-pointer hover:bg-orange-50"
                >
                  {t.common.nextPage}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsSuspenseFallback() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-[#F37021]" />
        <span className="text-sm font-semibold">{t.productsPage.loadingMenu}</span>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsSuspenseFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
