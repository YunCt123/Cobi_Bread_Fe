'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Thermometer, 
  Snowflake, 
  Sun, 
  Scale, 
  Filter, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { AdminNav } from '@/components/AdminNav';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category, StorageType, CreateProductInput, UpdateProductInput } from '@/types';
import { formatVND, getStorageBadge } from '@/components/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';

export default function AdminProductsPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Delete State
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form State
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

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Queries
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll(),
  });

  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: ['admin-products', selectedCategory, selectedStorage, searchTerm, page],
    queryFn: () =>
      productsApi.getAll({
        categorySlug: selectedCategory || undefined,
        storageType: (selectedStorage as StorageType) || undefined,
        search: searchTerm || undefined,
        page,
        limit: 20,
      }),
  });

  const products = productsData?.data || [];
  const meta = productsData?.meta;

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateProductInput) => productsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast('Thêm sản phẩm mới thành công!');
      closeModal();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm';
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductInput }) =>
      productsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      showToast('Cập nhật sản phẩm thành công!');
      closeModal();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi sửa sản phẩm';
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['home-products'] });
      showToast('Đã xóa sản phẩm thành công!');
      setDeletingProductId(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Không thể xóa sản phẩm';
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
      setDeletingProductId(null);
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
      ingredientsEn: '',
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
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <AdminNav />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-700 text-white'
              : 'bg-red-700 text-white'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-200" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Title & Action */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
              <Package className="w-4 h-4" />
              Admin Catalog Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Quản Lý Sản Phẩm Bánh Cobi Bread
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Xem danh sách, thêm mới, sửa đổi thông tin bảo quản, khối lượng tịnh và xóa sản phẩm
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/20 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên hoặc SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
              />
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Storage Select */}
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="text-xs sm:text-sm py-2 px-3 rounded-xl border border-stone-200 bg-white text-stone-800"
            >
              <option value="">Tất cả bảo quản</option>
              <option value="FRESH">Bánh tươi 0-10°C</option>
              <option value="FROZEN">Đông lạnh -18°C</option>
              <option value="AMBIENT">Nhiệt độ thường</option>
            </select>
          </div>

          <span className="text-xs text-stone-500 font-medium">
            Tổng cộng: <strong className="text-stone-900">{meta?.total ?? products.length}</strong> sản phẩm
          </span>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-stone-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              <span>Đang tải danh sách sản phẩm...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-stone-600">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3.5">Hình ảnh & Tên</th>
                    <th className="px-4 py-3.5">Mã SKU</th>
                    <th className="px-4 py-3.5">Danh mục</th>
                    <th className="px-4 py-3.5">Giá bán</th>
                    <th className="px-4 py-3.5">Khối lượng</th>
                    <th className="px-4 py-3.5">Điều kiện bảo quản</th>
                    <th className="px-4 py-3.5">Phân loại</th>
                    <th className="px-4 py-3.5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => {
                    const storageInfo = getStorageBadge(p.storageType);
                    return (
                      <tr key={p.id} className="hover:bg-purple-50/20 transition-colors">
                        {/* Image & Name */}
                        <td className="px-4 py-3.5 flex items-center gap-3">
                          <img
                            src={p.images?.[0] || BRAND_ASSETS.heroImage}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 bg-stone-100 border border-stone-200"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/products/${p.slug}`}
                              target="_blank"
                              className="font-bold text-stone-900 hover:text-purple-700 transition-colors line-clamp-1 block"
                            >
                              {p.name}
                            </Link>
                            {p.nameEn && (
                              <span className="text-[11px] text-purple-700 font-medium block line-clamp-1">
                                EN: {p.nameEn}
                              </span>
                            )}
                            <span className="text-[11px] text-stone-400 font-mono block">
                              /{p.slug}
                            </span>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-stone-700">
                          {p.sku}
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3.5 text-xs">
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 font-medium">
                            {p.category?.name || '---'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3.5 font-bold text-amber-700 whitespace-nowrap">
                          {formatVND(p.price)}
                        </td>

                        {/* Weight */}
                        <td className="px-4 py-3.5 text-xs text-stone-700 whitespace-nowrap">
                          {p.netWeightG}g
                        </td>

                        {/* Storage Condition */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${storageInfo.className}`}>
                            {storageInfo.icon}
                            <span>{storageInfo.label}</span>
                          </span>
                        </td>

                        {/* B2B */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          {p.isB2b ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                              B2B Sỉ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600">
                              B2C Lẻ
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              title="Sửa sản phẩm"
                              className="p-1.5 rounded-lg text-stone-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingProductId(p.id)}
                              title="Xóa sản phẩm"
                              className="p-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors"
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

              {products.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-sm">
                  Không tìm thấy sản phẩm nào phù hợp
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">Xác nhận xóa sản phẩm</h3>
            <p className="text-xs text-stone-600">
              Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này sẽ gỡ sản phẩm khỏi danh mục hiển thị.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingProductId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa vĩnh viễn'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl border border-stone-200 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                <span>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SKU */}
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 font-mono text-xs uppercase"
                  />
                </div>

                {/* Name (VI) */}
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Name (EN) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Tên sản phẩm tiếng Anh (nameEn)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Cheese Fresh Cream Bread 75g"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Danh mục *
                  </label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 font-semibold"
                  />
                </div>

                {/* Net Weight */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Trọng lượng (g) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.netWeightG}
                    onChange={(e) => setFormData({ ...formData, netWeightG: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Storage Type */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Điều kiện bảo quản *
                  </label>
                  <select
                    value={formData.storageType}
                    onChange={(e) =>
                      setFormData({ ...formData, storageType: e.target.value as StorageType })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="FRESH">Bánh tươi 0-10°C (FRESH)</option>
                    <option value="FROZEN">Đông lạnh -18°C (FROZEN)</option>
                    <option value="AMBIENT">Nhiệt độ thường (AMBIENT)</option>
                  </select>
                </div>

                {/* Shelf life chilled */}
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Shelf life frozen */}
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 disabled:bg-stone-100"
                  />
                </div>
              </div>

              {/* B2B Toggle */}
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isB2b"
                  checked={formData.isB2b}
                  onChange={(e) => setFormData({ ...formData, isB2b: e.target.checked })}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-stone-300"
                />
                <label htmlFor="isB2b" className="cursor-pointer">
                  <strong className="text-stone-900 block text-xs">Sản phẩm phân phối sỉ B2B</strong>
                  <span className="text-[11px] text-stone-500">
                    Đánh dấu nếu sản phẩm dùng cho kênh nhà hàng, khách sạn, chuỗi cà phê.
                  </span>
                </label>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  URL Hình ảnh
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/cobi/introduce/DSC9528-5-1.png hoặc https://..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 text-xs font-mono"
                />
              </div>

              {/* Ingredients VI & EN */}
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
                    placeholder="Liệt kê thành phần: bột mì, sữa tươi, phô mai..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 text-xs"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Description VI & EN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Mô tả sản phẩm (VI)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả hương vị, đặc điểm nổi bật..."
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 text-xs"
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
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 text-xs"
                  />
                </div>
              </div>

              {/* Nutrition Summary (Quick fields) */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-xs font-bold uppercase text-stone-700 block mb-2">
                  Dinh dưỡng (trên 1 khẩu phần):
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-stone-500 text-[10px]">Calories (kcal)</span>
                    <input
                      type="number"
                      value={formData.energyKcal}
                      onChange={(e) => setFormData({ ...formData, energyKcal: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px]">Carbs (g)</span>
                    <input
                      type="number"
                      value={formData.carbsG}
                      onChange={(e) => setFormData({ ...formData, carbsG: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px]">Protein (g)</span>
                    <input
                      type="number"
                      value={formData.proteinG}
                      onChange={(e) => setFormData({ ...formData, proteinG: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <span className="text-stone-500 text-[10px]">Fat (g)</span>
                    <input
                      type="number"
                      value={formData.fatG}
                      onChange={(e) => setFormData({ ...formData, fatG: Number(e.target.value) })}
                      className="w-full px-2 py-1 rounded-lg border border-stone-300"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-600/20"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Đang lưu...'
                    : editingProduct
                    ? 'Cập nhật sản phẩm'
                    : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
