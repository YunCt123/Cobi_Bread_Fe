'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  FolderTree,
  Hash
} from 'lucide-react';
import { AdminNav } from '@/components/AdminNav';
import { categoriesApi } from '@/lib/api';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types';

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    displayOrder: 1,
    parentId: '',
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Queries
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryInput) => categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Đã thêm danh mục mới thành công!');
      closeModal();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Lỗi khi thêm danh mục';
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryInput }) =>
      categoriesApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Cập nhật danh mục thành công!');
      closeModal();
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Lỗi khi sửa danh mục';
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      showToast('Đã xóa danh mục!');
      setDeletingCatId(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'Không thể xóa danh mục đang có sản phẩm';
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
      setDeletingCatId(null);
    },
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      displayOrder: (categories.length || 0) + 1,
      parentId: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      displayOrder: cat.displayOrder,
      parentId: cat.parentId || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: CreateCategoryInput = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || undefined,
      displayOrder: Number(formData.displayOrder),
      parentId: formData.parentId || undefined,
    };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <AdminNav />

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200 ${
            toastMessage.type === 'success' ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white'
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
              <Layers className="w-4 h-4" />
              Category Hierarchy Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              Quản Lý Danh Mục Bánh Cobi Bread
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Quản lý 9 danh mục phân loại bánh, thứ tự hiển thị và phân cấp danh mục
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/20 flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm danh mục mới</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-stone-500 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
              <span>Đang tải danh mục...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-stone-600">
                <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200">
                  <tr>
                    <th className="px-5 py-4">Thứ tự (#)</th>
                    <th className="px-5 py-4">Tên Danh Mục</th>
                    <th className="px-5 py-4">Đường Dẫn Slug</th>
                    <th className="px-5 py-4">Danh Mục Cha</th>
                    <th className="px-5 py-4">Số lượng sản phẩm</th>
                    <th className="px-5 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-purple-50/20 transition-colors">
                      {/* Display Order */}
                      <td className="px-5 py-4 font-mono font-bold text-purple-700">
                        #{cat.displayOrder}
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4 font-bold text-stone-900">
                        {cat.name}
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4 font-mono text-xs text-stone-500">
                        {cat.slug}
                      </td>

                      {/* Parent */}
                      <td className="px-5 py-4 text-xs">
                        {cat.parent ? (
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium">
                            {cat.parent.name}
                          </span>
                        ) : (
                          <span className="text-stone-400">---</span>
                        )}
                      </td>

                      {/* Products Count */}
                      <td className="px-5 py-4 text-xs font-semibold text-stone-700">
                        {cat._count?.products !== undefined ? (
                          <span>{cat._count.products} sản phẩm</span>
                        ) : (
                          <span className="text-stone-400">---</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            title="Sửa danh mục"
                            className="p-1.5 rounded-lg text-stone-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCatId(cat.id)}
                            title="Xóa danh mục"
                            className="p-1.5 rounded-lg text-stone-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {categories.length === 0 && (
                <div className="text-center py-12 text-stone-400 text-sm">
                  Chưa có danh mục nào được khởi tạo.
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingCatId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900">Xóa danh mục</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa danh mục này? Lưu ý: Nếu danh mục đang chứa sản phẩm, hệ thống sẽ từ chối xóa để bảo vệ dữ liệu.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCatId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingCatId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs"
              >
                {deleteMutation.isPending ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                <span>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}</span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Bánh Mì Kem Tươi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Đường dẫn Slug (tự động tạo nếu để trống)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="VD: banh-mi-kem-tuoi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Danh mục cha
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="">-- Danh mục gốc --</option>
                    {categories
                      .filter((c) => c.id !== editingCategory?.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
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
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20"
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Đang lưu...' : 'Lưu danh mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
