'use client';

import { getApiErrorMessage } from '@/utils/error';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  X,
  Search,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAuthStore } from '@/stores/auth.store';
import { categoriesApi } from '@/services';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/types';
import { useTranslation, getLocalizedCategoryName } from '@/i18n';

export function AdminCategoriesView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isHydrated } = useAuthStore();
  const { locale } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    slug: '',
    displayOrder: 1,
    parentId: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.push('/login?redirect=/admin/categories');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(user.role === 'BRANCH_MANAGER' ? '/manager' : '/');
    }
  }, [isHydrated, user, router]);

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories', locale],
    queryFn: () => categoriesApi.getAll(locale),
    enabled: Boolean(isHydrated && user?.role === 'ADMIN'),
  });

  const filteredCategories = useMemo(() => {
    if (!debouncedSearch) return categories;
    return categories.filter((c) =>
      `${c.name} ${c.nameEn || ''} ${c.slug} ${getLocalizedCategoryName(c, 'en')}`
        .toLowerCase()
        .includes(debouncedSearch)
    );
  }, [categories, debouncedSearch]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryInput) => categoriesApi.create(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(
        locale === 'en'
          ? `Added category "${created.name}"!`
          : `Đã thêm danh mục "${created.name}" thành công!`
      );
      closeModal();
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Error creating category';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryInput }) =>
      categoriesApi.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(
        locale === 'en'
          ? `Updated category "${updated.name}"!`
          : `Cập nhật danh mục "${updated.name}" thành công!`
      );
      closeModal();
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Error updating category';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(locale === 'en' ? 'Category deleted!' : 'Đã xóa danh mục!');
      setDeletingCategory(null);
    },
    onError: (err: unknown) => {
      const msg =
        getApiErrorMessage(err, "") ||
        (locale === 'en'
          ? 'Cannot delete category containing products'
          : 'Không thể xóa danh mục đang có sản phẩm');
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      setDeletingCategory(null);
    },
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      nameEn: '',
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
      nameEn: cat.nameEn || getLocalizedCategoryName(cat, 'en'),
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
      nameEn: formData.nameEn.trim() || undefined,
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
    <PortalShell roleMode="ADMIN">
      <div className="space-y-6">
        {/* Header Title & Action */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F37021]">
              {locale === 'en' ? 'Category Hierarchy Management' : 'Phân Cấp Danh Mục Song Ngữ'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812] mt-0.5">
              {locale === 'en'
                ? 'Manage Cobi Bread Categories'
                : 'Quản Lý Danh Mục Bánh Cobi Bread'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {locale === 'en'
                ? 'Organize the 9 core bakery categories, bilingual VI/EN labels, slugs, and display order.'
                : 'Quản lý 9 danh mục phân loại bánh chủ lực, tên song ngữ VI/EN, đường dẫn slug và thứ tự hiển thị.'}
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-xs transition-all shadow-md shadow-[#F37021]/20 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'en' ? 'Add Category' : 'Thêm danh mục mới'}</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-2xs flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-stone-600">
            {locale === 'en'
              ? `Total: ${filteredCategories.length} categories`
              : `Tổng số: ${filteredCategories.length} danh mục`}
          </span>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                locale === 'en' ? 'Search category name or slug...' : 'Tìm tên danh mục hoặc slug...'
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-black/5 text-xs focus:outline-none focus:border-[#F37021]"
            />
          </div>
        </div>

        {/* Categories Data Table */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-14 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-14 text-center space-y-2">
              <Layers className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-[#231812]">
                {locale === 'en' ? 'No categories found' : 'Chưa có danh mục nào khớp'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-stone-600">
                <thead className="bg-[#F8F7F4] text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200/70">
                  <tr>
                    <th className="px-5 py-3.5">{locale === 'en' ? 'Order' : 'Thứ Tự (#)'}</th>
                    <th className="px-5 py-3.5">
                      {locale === 'en' ? 'Category Name (VI / EN)' : 'Tên Danh Mục (VI / EN)'}
                    </th>
                    <th className="px-5 py-3.5">Slug</th>
                    <th className="px-5 py-3.5">
                      {locale === 'en' ? 'Parent' : 'Danh Mục Cha'}
                    </th>
                    <th className="px-5 py-3.5">
                      {locale === 'en' ? 'Products Count' : 'Số Sản Phẩm'}
                    </th>
                    <th className="px-5 py-3.5 text-right">
                      {locale === 'en' ? 'Actions' : 'Thao Tác'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-[#F37021]">
                        #{cat.displayOrder}
                      </td>

                      <td className="px-5 py-4 font-bold text-[#231812]">
                        <span className="block">{cat.name}</span>
                        <span className="block text-[11px] font-medium text-stone-400 mt-0.5">
                          EN: {cat.nameEn || getLocalizedCategoryName(cat, 'en')}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-stone-500">{cat.slug}</td>

                      <td className="px-5 py-4 text-xs">
                        {cat.parent ? (
                          <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium">
                            {cat.parent.name}
                          </span>
                        ) : (
                          <span className="text-stone-400">---</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-[#231812] tabular-nums">
                        {cat._count?.products !== undefined ? (
                          <span>
                            {cat._count.products} {locale === 'en' ? 'items' : 'sản phẩm'}
                          </span>
                        ) : (
                          <span className="text-stone-400">---</span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            title="Edit category"
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-[#F37021] hover:border-[#F37021] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCategory(cat)}
                            title="Delete category"
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-red-600 hover:border-red-300 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation AlertDialog */}
      {deletingCategory && (
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
                  {locale === 'en' ? 'Delete Category?' : 'Xác nhận xóa danh mục?'}
                </h3>
                <p className="text-xs text-stone-500">{deletingCategory.name}</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {locale === 'en'
                ? 'Categories that currently contain products cannot be deleted to preserve catalog integrity.'
                : 'Nếu danh mục đang chứa sản phẩm, hệ thống sẽ từ chối xóa để bảo vệ toàn vẹn dữ liệu.'}
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {locale === 'en' ? 'Cancel' : 'Hủy'}
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingCategory.id)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white cursor-pointer inline-flex items-center gap-1.5"
              >
                {deleteMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{locale === 'en' ? 'Confirm Delete' : 'Xác nhận xóa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/10 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-[#231812] flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F37021]" />
                <span>
                  {editingCategory
                    ? locale === 'en'
                      ? 'Edit Category'
                      : 'Sửa danh mục'
                    : locale === 'en'
                    ? 'Add New Category'
                    : 'Thêm danh mục mới'}
                </span>
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Tên danh mục (Tiếng Việt) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="VD: Bánh Mì Kem Tươi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Tên danh mục (Tiếng Anh - nameEn)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Fresh Cream Bread"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Đường dẫn Slug (tự động nếu để trống)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="VD: banh-mi-kem-tuoi"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:border-[#F37021]"
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
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    Danh mục cha
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {locale === 'en' ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-xs shadow-md shadow-[#F37021]/20 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>{locale === 'en' ? 'Save Category' : 'Lưu danh mục'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalShell>
  );
}

export default AdminCategoriesView;
