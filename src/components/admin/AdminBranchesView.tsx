'use client';

import { getApiErrorMessage } from '@/utils/error';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Store,
  Plus,
  Search,
  MapPin,
  Clock,
  Phone,
  Edit3,
  Trash2,
  X,
  ExternalLink,
  Power,
  ShoppingBag,
  Boxes,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAuthStore } from '@/stores/auth.store';
import { branchesApi, ordersApi, inventoryApi } from '@/services';
import { Branch, CreateBranchInput, Order, InventoryBatch } from '@/types';
import { formatVND } from '@/components/storefront/ProductCard';
import { getBranchVisualMeta } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedBranchName,
  getLocalizedBranchAddress,
  getLocalizedBranchCity,
} from '@/i18n';

export function AdminBranchesView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isHydrated } = useAuthStore();
  const { locale } = useTranslation();

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);

  const [formData, setFormData] = useState<CreateBranchInput>({
    name: '',
    nameEn: '',
    address: '',
    addressEn: '',
    city: 'TP. Hồ Chí Minh',
    cityEn: 'Ho Chi Minh City',
    openHours: '07:00 - 22:00',
    phone: '',
    mapUrl: '',
    isActive: true,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.push('/login?redirect=/admin/branches');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(user.role === 'BRANCH_MANAGER' ? '/manager' : '/');
    }
  }, [isHydrated, user, router]);

  const { data: branches = [], isLoading } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
    enabled: Boolean(isHydrated && user?.role === 'ADMIN'),
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['portal-orders-branch-kpi'],
    queryFn: () => ordersApi.getAll(),
    enabled: Boolean(isHydrated && user?.role === 'ADMIN'),
  });

  const { data: batches = [] } = useQuery<InventoryBatch[]>({
    queryKey: ['portal-batches-branch-kpi'],
    queryFn: () => inventoryApi.getBatches(),
    enabled: Boolean(isHydrated && user?.role === 'ADMIN'),
  });

  // Compute Mini KPI per branch
  const branchKpiMap = useMemo(() => {
    const map: Record<string, { ordersCount: number; revenue: number; batchesCount: number }> = {};
    branches.forEach((b) => {
      const bOrders = orders.filter((o) => o.branchId === b.id && o.status !== 'CANCELLED');
      const bBatches = batches.filter((bt) => bt.branchId === b.id);
      map[b.id] = {
        ordersCount: b._count?.orders ?? bOrders.length,
        revenue: bOrders.reduce((s, o) => s + o.totalAmount, 0),
        batchesCount: b._count?.batches ?? bBatches.length,
      };
    });
    return map;
  }, [branches, orders, batches]);

  const cities = useMemo(
    () => Array.from(new Set(branches.map((b) => b.city).filter(Boolean))),
    [branches]
  );

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      if (cityFilter !== 'ALL' && b.city !== cityFilter) return false;
      if (!debouncedSearch) return true;
      const target = `${b.name} ${b.nameEn || ''} ${b.address} ${b.addressEn || ''} ${b.city} ${
        b.phone
      }`.toLowerCase();
      return target.includes(debouncedSearch);
    });
  }, [branches, cityFilter, debouncedSearch]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateBranchInput) => branchesApi.create(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success(
        locale === 'en'
          ? `Created branch "${created.name}"`
          : `Đã thêm chi nhánh "${created.name}" thành công!`
      );
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Failed to create branch';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CreateBranchInput }) =>
      branchesApi.update(id, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success(
        locale === 'en'
          ? `Updated branch "${updated.name}"`
          : `Đã cập nhật chi nhánh "${updated.name}"!`
      );
      setIsModalOpen(false);
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Failed to update branch';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      branchesApi.toggleActive(id, isActive),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success(
        locale === 'en'
          ? `Branch status updated to ${vars.isActive ? 'Active' : 'Inactive'}`
          : `Đã chuyển trạng thái chi nhánh sang ${vars.isActive ? 'Đang hoạt động' : 'Tạm ngưng'}`
      );
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Cannot change branch status';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => branchesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast.success(locale === 'en' ? 'Branch deleted' : 'Đã xóa chi nhánh thành công');
      setDeletingBranch(null);
    },
    onError: (err: unknown) => {
      const msg =
        getApiErrorMessage(err, "") ||
        (locale === 'en'
          ? 'Cannot delete branch with existing orders/batches'
          : 'Không thể xóa chi nhánh đang có đơn hàng hoặc lô tồn kho');
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      setDeletingBranch(null);
    },
  });

  const openAddModal = () => {
    setEditingBranch(null);
    setFormData({
      name: '',
      nameEn: '',
      address: '',
      addressEn: '',
      city: 'TP. Hồ Chí Minh',
      cityEn: 'Ho Chi Minh City',
      openHours: '07:00 - 22:00',
      phone: '028 5411 7799',
      mapUrl: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (branch: Branch) => {
    const visual = getBranchVisualMeta(branch);
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      nameEn: branch.nameEn || '',
      address: branch.address,
      addressEn: branch.addressEn || '',
      city: branch.city,
      cityEn: branch.cityEn || '',
      openHours: branch.openHours,
      phone: branch.phone,
      mapUrl: branch.mapUrl || visual.googleMapsUrl,
      isActive: branch.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateBranchInput = {
      name: formData.name.trim(),
      nameEn: formData.nameEn?.trim() || undefined,
      address: formData.address.trim(),
      addressEn: formData.addressEn?.trim() || undefined,
      city: formData.city.trim(),
      cityEn: formData.cityEn?.trim() || undefined,
      openHours: formData.openHours.trim(),
      phone: formData.phone.trim(),
      mapUrl: formData.mapUrl?.trim() || undefined,
      isActive: formData.isActive,
    };

    if (editingBranch) {
      updateMutation.mutate({ id: editingBranch.id, payload });
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
              {locale === 'en' ? 'Nationwide Store Network' : 'Mạng Lưới Cửa Hàng Toàn Quốc'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812] mt-0.5">
              {locale === 'en'
                ? 'Manage 5 Cobi Bread Branches'
                : 'Quản Lý 5 Chi Nhánh Cobi Bread'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {locale === 'en'
                ? 'Configure bilingual VI/EN store info, operating hours, hotline, Google Maps links, and live KPIs.'
                : 'Cấu hình thông tin song ngữ VI/EN, giờ mở cửa, hotline, liên kết Google Maps và theo dõi Mini KPI.'}
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md shadow-[#F37021]/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'en' ? 'Add New Branch' : 'Thêm chi nhánh mới'}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setCityFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                cityFilter === 'ALL'
                  ? 'bg-[#231812] text-white'
                  : 'bg-[#F8F7F4] text-stone-600 hover:text-[#231812]'
              }`}
            >
              {locale === 'en' ? 'All Cities' : 'Tất cả khu vực'} ({branches.length})
            </button>
            {cities.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  cityFilter === city
                    ? 'bg-[#F37021] text-white'
                    : 'bg-[#F8F7F4] text-stone-600 hover:text-[#231812]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                locale === 'en'
                  ? 'Search branch name, address, phone...'
                  : 'Tìm tên chi nhánh, địa chỉ, SĐT...'
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-black/5 text-xs focus:outline-none focus:border-[#F37021]"
            />
          </div>
        </div>

        {/* Branches Cards Grid with Mini KPIs */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-black/5 p-5 h-72 animate-pulse space-y-4"
              >
                <div className="h-32 bg-stone-200 rounded-xl" />
                <div className="h-4 w-2/3 bg-stone-200 rounded" />
                <div className="h-3 w-full bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredBranches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-black/5 p-12 text-center space-y-2">
            <Store className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-[#231812]">
              {locale === 'en' ? 'No branches found' : 'Không tìm thấy chi nhánh phù hợp'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBranches.map((branch, idx) => {
              const visual = getBranchVisualMeta(branch);
              const kpi = branchKpiMap[branch.id] || {
                ordersCount: 0,
                revenue: 0,
                batchesCount: 0,
              };
              const isActive = branch.isActive !== false;

              return (
                <div
                  key={branch.id}
                  className="bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#F37021]/40 transition-all"
                >
                  <div>
                    {/* Branch Photo Banner */}
                    <div className="relative h-40 bg-stone-100 overflow-hidden">
                      <img
                        src={visual.image}
                        alt={branch.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-[#231812]/90 text-white text-[11px] font-bold">
                          #0{idx + 1} • {getLocalizedBranchCity(branch, locale)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            toggleActiveMutation.mutate({
                              id: branch.id,
                              isActive: !isActive,
                            })
                          }
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer shadow-xs ${
                            isActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-stone-700 text-stone-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>
                            {isActive
                              ? locale === 'en'
                                ? 'Active'
                                : 'Hoạt động'
                              : locale === 'en'
                              ? 'Paused'
                              : 'Tạm ngưng'}
                          </span>
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-4 right-4 text-white">
                        <h3 className="text-base font-bold leading-snug truncate">
                          {getLocalizedBranchName(branch, locale)}
                        </h3>
                        {branch.nameEn && (
                          <p className="text-[11px] text-orange-200 truncate">
                            EN: {branch.nameEn}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mini KPI Bar */}
                    <div className="grid grid-cols-3 divide-x divide-stone-100 border-b border-stone-100 bg-[#F8F7F4] text-center py-2.5">
                      <div className="px-2">
                        <span className="text-[10px] text-stone-500 font-medium block">
                          {locale === 'en' ? 'Orders' : 'Đơn hàng'}
                        </span>
                        <span className="text-xs font-black text-[#231812] tabular-nums flex items-center justify-center gap-1 mt-0.5">
                          <ShoppingBag className="w-3 h-3 text-[#F37021]" />
                          {kpi.ordersCount}
                        </span>
                      </div>
                      <div className="px-2">
                        <span className="text-[10px] text-stone-500 font-medium block">
                          {locale === 'en' ? 'FEFO Batches' : 'Lô tồn kho'}
                        </span>
                        <span className="text-xs font-black text-[#231812] tabular-nums flex items-center justify-center gap-1 mt-0.5">
                          <Boxes className="w-3 h-3 text-emerald-600" />
                          {kpi.batchesCount}
                        </span>
                      </div>
                      <div className="px-2">
                        <span className="text-[10px] text-stone-500 font-medium block">
                          {locale === 'en' ? 'Revenue' : 'Doanh thu'}
                        </span>
                        <span className="text-xs font-black text-[#F37021] tabular-nums block mt-0.5 truncate">
                          {kpi.revenue > 0 ? formatVND(kpi.revenue) : '---'}
                        </span>
                      </div>
                    </div>

                    {/* Address, Hours, Hotline */}
                    <div className="p-4 space-y-2 text-xs text-stone-600">
                      <p className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#F37021] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {getLocalizedBranchAddress(branch, locale)}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium text-[#231812]">{branch.openHours}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
                        <span className="font-mono font-semibold text-[#231812]">
                          {branch.phone}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="px-4 py-3 border-t border-stone-100 flex items-center justify-between gap-2 bg-stone-50/40">
                    <a
                      href={branch.mapUrl || visual.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#F37021] hover:underline"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(branch)}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-orange-50 border border-stone-200 text-xs font-bold text-[#231812] hover:text-[#F37021] inline-flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{locale === 'en' ? 'Edit' : 'Sửa'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeletingBranch(branch)}
                        aria-label="Delete branch"
                        className="p-1.5 rounded-lg bg-white hover:bg-red-50 border border-stone-200 text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Branch Bilingual Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 shadow-2xl border border-black/10 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-[#231812] flex items-center gap-2">
                <Store className="w-5 h-5 text-[#F37021]" />
                <span>
                  {editingBranch
                    ? locale === 'en'
                      ? 'Edit Branch Information'
                      : 'Chỉnh Sửa Thông Tin Chi Nhánh'
                    : locale === 'en'
                    ? 'Create New Branch'
                    : 'Thêm Chi Nhánh Mới'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Branch Name (VI) *' : 'Tên chi nhánh (Tiếng Việt) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Cobi Bread Tower Quận 7"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Branch Name (EN - nameEn)' : 'Tên chi nhánh (Tiếng Anh)'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="e.g. Cobi Bread Tower District 7"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Address (VI) *' : 'Địa chỉ (Tiếng Việt) *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="69 Hoàng Văn Thái, Phường Tân Phú, Quận 7"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Address (EN - addressEn)' : 'Địa chỉ (Tiếng Anh)'}
                  </label>
                  <input
                    type="text"
                    value={formData.addressEn}
                    onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
                    placeholder="69 Hoang Van Thai St, Tan Phu Ward, Dist 7"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'City (VI) *' : 'Tỉnh / Thành phố *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Opening Hours *' : 'Giờ mở cửa *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.openHours}
                    onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                    placeholder="07:00 - 22:00"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Hotline *' : 'Số điện thoại *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="028 5411 7799"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-mono focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {locale === 'en' ? 'Google Maps URL' : 'Đường dẫn Google Maps'}
                </label>
                <input
                  type="text"
                  value={formData.mapUrl}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  placeholder="https://www.google.com/maps/search/?api=1&query=..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#F8F7F4] border border-black/5 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="branchActive"
                  checked={formData.isActive !== false}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#F37021]"
                />
                <label htmlFor="branchActive" className="text-xs font-bold text-[#231812] cursor-pointer">
                  {locale === 'en'
                    ? 'Branch is active and accepting online orders'
                    : 'Chi nhánh đang hoạt động và nhận đơn đặt bánh'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {locale === 'en' ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md shadow-[#F37021]/20 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>
                    {editingBranch
                      ? locale === 'en'
                        ? 'Save Changes'
                        : 'Lưu cập nhật'
                      : locale === 'en'
                      ? 'Create Branch'
                      : 'Tạo chi nhánh'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation AlertDialog */}
      {deletingBranch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-black/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#231812]">
                  {locale === 'en' ? 'Delete Branch?' : 'Xác nhận xóa chi nhánh?'}
                </h3>
                <p className="text-xs text-stone-500">{deletingBranch.name}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {locale === 'en'
                ? 'Are you sure you want to delete this branch? Branches with existing orders or inventory batches cannot be removed.'
                : 'Bạn có chắc chắn muốn xóa chi nhánh này? Nếu chi nhánh đang có đơn hàng hoặc lô hàng FEFO, hệ thống sẽ giữ lại để bảo toàn dữ liệu.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBranch(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {locale === 'en' ? 'Cancel' : 'Hủy bỏ'}
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deletingBranch.id)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
              >
                {deleteMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{locale === 'en' ? 'Confirm Delete' : 'Xác nhận xóa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}

export default AdminBranchesView;
