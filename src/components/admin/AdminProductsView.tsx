'use client';

import { getApiErrorMessage } from '@/utils/error';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAuthStore } from '@/stores/auth.store';
import { productsApi, categoriesApi } from '@/services';
import {
  Product,
  Category,
  StorageType,
  CreateProductInput,
  UpdateProductInput,
} from '@/types';
import { formatVND, getStorageBadge } from '@/components/storefront/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedProductName,
  getLocalizedCategoryName,
} from '@/i18n';

export function AdminProductsView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isHydrated } = useAuthStore();
  const { locale } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStorage, setSelectedStorage] = useState<'' | StorageType>('');
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    nameEn: '',
    categoryId: '',
    price: 30000,
    netWeightG: 75,
    storageType: 'FRESH' as StorageType,
    shelfLifeChilledDays: 3,
    shelfLifeFrozenDays: 30,
    isB2b: false,
    ingredients: '',
    ingredientsEn: '',
    description: '',
    descriptionEn: '',
    imageUrl: BRAND_ASSETS.heroImage,
    energyKcal: 280,
    carbsG: 32,
    proteinG: 6,
    fatG: 14,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.push('/login?redirect=/admin/products');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(user.role === 'BRANCH_MANAGER' ? '/manager' : '/');
    }
  }, [isHydrated, user, router]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories', locale],
    queryFn: () => categoriesApi.getAll(locale),
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: [
      'admin-products',
      locale,
      selectedCategory,
      selectedStorage,
      debouncedSearch,
      page,
    ],
    queryFn: () =>
      productsApi.getAll({
        categorySlug: selectedCategory || undefined,
        storageType: selectedStorage || undefined,
        search: debouncedSearch || undefined,
        page,
        limit: 10,
        lang: locale,
      }),
    enabled: Boolean(isHydrated && user?.role === 'ADMIN'),
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  const createMutation = useMutation({
    mutationFn: (payload: CreateProductInput) => productsApi.create(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        locale === 'en'
          ? `Added product "${created.name}"!`
          : `Đã thêm sản phẩm "${created.name}" thành công!`
      );
      closeModal();
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Error creating product';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductInput }) =>
      productsApi.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(
        locale === 'en'
          ? `Updated product "${updated.name}"!`
          : `Đã cập nhật sản phẩm "${updated.name}"!`
      );
      closeModal();
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Error updating product';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(locale === 'en' ? 'Product deleted!' : 'Đã xóa sản phẩm thành công!');
      setDeletingProduct(null);
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Could not delete product';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      setDeletingProduct(null);
    },
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: `CB-${Date.now().toString().slice(-6)}`,
      name: '',
      nameEn: '',
      categoryId: categories[0]?.id || '',
      price: 30000,
      netWeightG: 75,
      storageType: 'FRESH',
      shelfLifeChilledDays: 3,
      shelfLifeFrozenDays: 30,
      isB2b: false,
      ingredients: 'Bột mì, sữa tươi, bơ lạt, men tự nhiên, đường, muối.',
      ingredientsEn: 'Wheat flour, fresh milk, unsalted butter, natural yeast, sugar, salt.',
      description: '',
      descriptionEn: '',
      imageUrl: BRAND_ASSETS.heroImage,
      energyKcal: 280,
      carbsG: 32,
      proteinG: 6,
      fatG: 14,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      sku: p.sku,
      name: p.name,
      nameEn: p.nameEn || '',
      categoryId: p.categoryId,
      price: p.price,
      netWeightG: p.netWeightG,
      storageType: p.storageType,
      shelfLifeChilledDays: p.shelfLifeChilledDays,
      shelfLifeFrozenDays: p.shelfLifeFrozenDays ?? 0,
      isB2b: p.isB2b,
      ingredients: p.ingredients,
      ingredientsEn: p.ingredientsEn || '',
      description: p.description || '',
      descriptionEn: p.descriptionEn || '',
      imageUrl: p.images?.[0] || BRAND_ASSETS.heroImage,
      energyKcal: p.nutritionJson?.energyKcal ?? 280,
      carbsG: p.nutritionJson?.carbsG ?? 32,
      proteinG: p.nutritionJson?.proteinG ?? 6,
      fatG: p.nutritionJson?.fatG ?? 14,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateProductInput = {
      sku: formData.sku.trim().toUpperCase(),
      name: formData.name.trim(),
      nameEn: formData.nameEn.trim() || undefined,
      categoryId: formData.categoryId,
      price: Number(formData.price),
      netWeightG: Number(formData.netWeightG),
      storageType: formData.storageType,
      shelfLifeChilledDays: Number(formData.shelfLifeChilledDays),
      shelfLifeFrozenDays:
        formData.storageType === 'FROZEN' ? Number(formData.shelfLifeFrozenDays) : null,
      isB2b: Boolean(formData.isB2b),
      ingredients: formData.ingredients.trim(),
      ingredientsEn: formData.ingredientsEn.trim() || undefined,
      description: formData.description.trim() || undefined,
      descriptionEn: formData.descriptionEn.trim() || undefined,
      images: [formData.imageUrl.trim()],
      nutritionJson: {
        energyKcal: Number(formData.energyKcal),
        carbsG: Number(formData.carbsG),
        proteinG: Number(formData.proteinG),
        fatG: Number(formData.fatG),
      },
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <PortalShell roleMode="ADMIN">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F37021]">
              {locale === 'en' ? 'Bilingual Product Catalog' : 'Danh Mục Sản Phẩm Song Ngữ'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812] mt-0.5">
              {locale === 'en'
                ? 'Manage Cobi Bread Products'
                : 'Quản Lý Sản Phẩm Bánh Cobi Bread'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {locale === 'en'
                ? 'Configure VI/EN product names, storage temperature, shelf life, ingredients & nutrition facts.'
                : 'Quản lý tên bánh VI/EN, nhiệt độ bảo quản, khối lượng tịnh, thành phần và bảng dinh dưỡng.'}
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md shadow-[#F37021]/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'en' ? 'Add New Product' : 'Thêm sản phẩm mới'}</span>
          </button>
        </div>

        {/* Filter Pills + Category Select + Debounced Search */}
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: '' as const, label: locale === 'en' ? 'All Temps' : 'Tất cả bảo quản' },
              { id: 'FRESH' as const, label: locale === 'en' ? 'Fresh 0-10°C' : 'Bánh tươi 0-10°C' },
              {
                id: 'FROZEN' as const,
                label: locale === 'en' ? 'Frozen -18°C' : 'Đông lạnh -18°C',
              },
              { id: 'AMBIENT' as const, label: locale === 'en' ? 'Ambient' : 'Nhiệt độ thường' },
            ].map((pill) => (
              <button
                key={pill.id || 'ALL'}
                type="button"
                onClick={() => {
                  setSelectedStorage(pill.id);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  selectedStorage === pill.id
                    ? 'bg-[#231812] text-white'
                    : 'bg-[#F8F7F4] text-stone-600 hover:text-[#231812]'
                }`}
              >
                {pill.label}
              </button>
            ))}

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              aria-label="Filter by category"
              className="px-3 py-1.5 rounded-xl border border-black/10 bg-[#F8F7F4] text-xs font-semibold text-[#231812]"
            >
              <option value="">
                {locale === 'en' ? 'All 9 Categories' : 'Tất cả 9 danh mục'}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {getLocalizedCategoryName(c, locale)}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                locale === 'en' ? 'Search name or SKU...' : 'Tìm theo tên bánh hoặc mã SKU...'
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-black/5 text-xs focus:outline-none focus:border-[#F37021]"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-14 text-center space-y-2">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-[#231812]">
                {locale === 'en'
                  ? 'No products match the active filter'
                  : 'Không tìm thấy sản phẩm nào khớp bộ lọc'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8F7F4] text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200/70">
                  <tr>
                    <th className="px-4 py-3.5">
                      {locale === 'en' ? 'Product (VI / EN)' : 'Sản Phẩm (VI / EN)'}
                    </th>
                    <th className="px-4 py-3.5">SKU</th>
                    <th className="px-4 py-3.5">
                      {locale === 'en' ? 'Category' : 'Danh Mục'}
                    </th>
                    <th className="px-4 py-3.5 text-right">
                      {locale === 'en' ? 'Price' : 'Giá Bán'}
                    </th>
                    <th className="px-4 py-3.5">
                      {locale === 'en' ? 'Weight' : 'Khối Lượng'}
                    </th>
                    <th className="px-4 py-3.5">
                      {locale === 'en' ? 'Storage' : 'Bảo Quản'}
                    </th>
                    <th className="px-4 py-3.5">
                      {locale === 'en' ? 'Channel' : 'Kênh'}
                    </th>
                    <th className="px-4 py-3.5 text-right">
                      {locale === 'en' ? 'Actions' : 'Thao Tác'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const storageInfo = getStorageBadge(p.storageType, locale);
                    return (
                      <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="px-4 py-3.5 flex items-center gap-3">
                          <img
                            src={p.images?.[0] || BRAND_ASSETS.heroImage}
                            alt={p.name}
                            className="w-11 h-11 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="font-bold text-[#231812] hover:text-[#F37021] transition-colors line-clamp-1 block"
                            >
                              {getLocalizedProductName(p, locale)}
                            </Link>
                            {p.nameEn && (
                              <span className="text-[11px] text-[#F37021] font-medium block line-clamp-1">
                                EN: {p.nameEn}
                              </span>
                            )}
                            <span className="text-[10px] text-stone-400 font-mono block">
                              /{p.slug}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-stone-700 whitespace-nowrap">
                          {p.sku}
                        </td>

                        <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium">
                            {getLocalizedCategoryName(p.category, locale)}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 text-right font-black text-[#F37021] tabular-nums whitespace-nowrap">
                          {formatVND(p.price)}
                        </td>

                        <td className="px-4 py-3.5 text-xs text-stone-700 font-mono whitespace-nowrap">
                          {p.netWeightG}g
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${storageInfo.className}`}
                          >
                            {storageInfo.icon}
                            <span>{storageInfo.label}</span>
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {p.isB2b ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                              B2B
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600">
                              B2C
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              title="Edit product"
                              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-[#F37021] hover:border-[#F37021] transition-colors cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProduct(p)}
                              title="Delete product"
                              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="px-5 py-3.5 border-t border-stone-100 bg-[#F8F7F4] flex items-center justify-between text-xs">
              <span className="text-stone-500">
                {locale === 'en'
                  ? `Total: ${meta.total} products • Page ${meta.page} of ${meta.totalPages}`
                  : `Tổng cộng: ${meta.total} sản phẩm • Trang ${meta.page} / ${meta.totalPages}`}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 font-bold disabled:opacity-40 cursor-pointer"
                >
                  {locale === 'en' ? 'Prev' : 'Trước'}
                </button>
                <button
                  type="button"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 font-bold disabled:opacity-40 cursor-pointer"
                >
                  {locale === 'en' ? 'Next' : 'Sau'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation AlertDialog */}
      {deletingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-black/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#231812]">
                  {locale === 'en' ? 'Delete Product?' : 'Xác nhận xóa sản phẩm?'}
                </h3>
                <p className="text-xs text-stone-500">{deletingProduct.name}</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {locale === 'en'
                ? 'Are you sure you want to remove this product from the Cobi Bread catalog?'
                : 'Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh mục bánh Cobi Bread?'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {locale === 'en' ? 'Cancel' : 'Hủy bỏ'}
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingProduct.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer inline-flex items-center gap-1.5"
              >
                {deleteMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{locale === 'en' ? 'Delete Permanently' : 'Xóa vĩnh viễn'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl border border-black/10 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg font-bold text-[#231812] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#F37021]" />
                <span>
                  {editingProduct
                    ? locale === 'en'
                      ? 'Edit Bakery Product'
                      : 'Chỉnh sửa sản phẩm'
                    : locale === 'en'
                    ? 'Add New Bakery Product'
                    : 'Thêm sản phẩm mới'}
                </span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mã SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="VD: CB-BMKT-75"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs uppercase focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Tên sản phẩm (Tiếng Việt) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Bánh Mì Kem Tươi Phô Mai"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Tên sản phẩm tiếng Anh (nameEn)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Cheese Fresh Cream Bread 75g"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Danh mục *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {getLocalizedCategoryName(c, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Giá bán (VND) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1000}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Trọng lượng (g) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.netWeightG}
                    onChange={(e) =>
                      setFormData({ ...formData, netWeightG: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Điều kiện bảo quản *
                  </label>
                  <select
                    value={formData.storageType}
                    onChange={(e) =>
                      setFormData({ ...formData, storageType: e.target.value as StorageType })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
                  >
                    <option value="FRESH">Bánh tươi 0-10°C (FRESH)</option>
                    <option value="FROZEN">Đông lạnh -18°C (FROZEN)</option>
                    <option value="AMBIENT">Nhiệt độ thường (AMBIENT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Hạn dùng mát (ngày) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.shelfLifeChilledDays}
                    onChange={(e) =>
                      setFormData({ ...formData, shelfLifeChilledDays: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Hạn dùng đông (ngày)
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={formData.storageType !== 'FROZEN'}
                    value={formData.shelfLifeFrozenDays}
                    onChange={(e) =>
                      setFormData({ ...formData, shelfLifeFrozenDays: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 disabled:bg-stone-100 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-black/5 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isB2b"
                  checked={formData.isB2b}
                  onChange={(e) => setFormData({ ...formData, isB2b: e.target.checked })}
                  className="w-4 h-4 rounded text-[#F37021]"
                />
                <label htmlFor="isB2b" className="cursor-pointer">
                  <strong className="text-[#231812] block text-xs">
                    Sản phẩm phân phối sỉ B2B
                  </strong>
                  <span className="text-[11px] text-stone-500">
                    Đánh dấu nếu sản phẩm dùng cho kênh nhà hàng, khách sạn, chuỗi cà phê.
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  URL Hình ảnh
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/cobi/introduce/DSC9528-5-1.png"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Thành phần nguyên liệu & Dị ứng (VI) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Thành phần tiếng Anh (ingredientsEn)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.ingredientsEn}
                    onChange={(e) => setFormData({ ...formData, ingredientsEn: e.target.value })}
                    placeholder="Wheat flour, fresh milk, cream cheese, butter..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mô tả sản phẩm (VI)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mô tả tiếng Anh (descriptionEn)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    placeholder="Product flavor profile and highlights in English..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {locale === 'en' ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-xs shadow-md shadow-[#F37021]/20 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>
                    {editingProduct
                      ? locale === 'en'
                        ? 'Save Changes'
                        : 'Cập nhật sản phẩm'
                      : locale === 'en'
                      ? 'Create Product'
                      : 'Thêm sản phẩm'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  );
}

export default AdminProductsView;
