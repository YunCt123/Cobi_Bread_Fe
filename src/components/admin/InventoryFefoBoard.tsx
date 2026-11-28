'use client';

import { getApiErrorMessage } from '@/utils/error';
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Boxes,
  Plus,
  X,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Store,
  Calendar,
  Search,
  PackageMinus,
} from 'lucide-react';
import { branchesApi, inventoryApi, productsApi } from '@/services';
import { Branch, CreateInventoryBatchInput, InventoryBatch, Product } from '@/types';
import { getStorageBadge } from '@/components/storefront/ProductCard';
import {
  useTranslation,
  getLocalizedProductName,
  getLocalizedBranchName,
} from '@/i18n';

interface InventoryFefoBoardProps {
  mode: 'ADMIN' | 'MANAGER';
  branchName?: string | null;
  defaultBranchId?: string | null;
}

type RiskLevel = 'URGENT' | 'WARNING' | 'HEALTHY';
type QuickTab = 'ALL' | 'NEAR_EXPIRY' | 'LOW_STOCK' | 'HEALTHY';

function getBatchFefoRisk(expiresAt: string, locale: 'vi' | 'en'): {
  level: RiskLevel;
  hoursLeft: number;
  label: string;
  countdown: string;
  rowClass: string;
  badgeClass: string;
} {
  const now = Date.now();
  const expMs = new Date(expiresAt).getTime();
  const diffHours = (expMs - now) / (1000 * 60 * 60);

  if (diffHours <= 0) {
    return {
      level: 'URGENT',
      hoursLeft: diffHours,
      label: locale === 'en' ? 'Expired' : 'Hết hạn',
      countdown: locale === 'en' ? 'Expired' : 'Đã hết hạn',
      rowClass: 'bg-red-50/70 hover:bg-red-50 border-l-4 border-l-red-500',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
    };
  }

  if (diffHours <= 24) {
    const hrs = Math.max(1, Math.round(diffHours));
    return {
      level: 'URGENT',
      hoursLeft: diffHours,
      label: locale === 'en' ? 'Urgent (≤ 24h)' : 'Đỏ: Khẩn ≤ 24h',
      countdown: locale === 'en' ? `${hrs}h left` : `Còn ~${hrs} giờ`,
      rowClass: 'bg-red-50/60 hover:bg-red-50 border-l-4 border-l-red-500',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
    };
  }

  if (diffHours <= 48) {
    const hrs = Math.round(diffHours);
    return {
      level: 'WARNING',
      hoursLeft: diffHours,
      label: locale === 'en' ? 'Near Expiry (≤ 48h)' : 'Vàng: Cận date ≤ 2 ngày',
      countdown: locale === 'en' ? `${hrs}h left` : `Còn ~${hrs} giờ`,
      rowClass: 'bg-amber-50/60 hover:bg-amber-50 border-l-4 border-l-amber-400',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    };
  }

  const days = Math.floor(diffHours / 24);
  return {
    level: 'HEALTHY',
    hoursLeft: diffHours,
    label: locale === 'en' ? 'Good (> 48h)' : 'Xanh: Còn hạn tốt',
    countdown: locale === 'en' ? `${days}d left` : `Còn ${days} ngày`,
    rowClass: 'bg-emerald-50/25 hover:bg-emerald-50/50 border-l-4 border-l-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };
}

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

export default function InventoryFefoBoard({
  mode,
  branchName,
  defaultBranchId,
}: InventoryFefoBoardProps) {
  const queryClient = useQueryClient();
  const { locale } = useTranslation();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [quickTab, setQuickTab] = useState<QuickTab>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    branchId: defaultBranchId || '',
    productId: '',
    batchCode: '',
    quantity: 20,
    manufacturedAt: '',
    expiresAt: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch branches for Admin filter & modal branch selector
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
    enabled: mode === 'ADMIN',
  });

  // Fetch catalog products for Batch creation dropdown
  const { data: productsRes } = useQuery({
    queryKey: ['portal-products-select', locale],
    queryFn: () => productsApi.getAll({ limit: 100, lang: locale }),
  });
  const products: Product[] = productsRes?.data || [];

  // Fetch FEFO batches
  const {
    data: batches = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<InventoryBatch[]>({
    queryKey: ['inventory-batches', mode, selectedBranchId],
    queryFn: () =>
      inventoryApi.getBatches({
        branchId: mode === 'ADMIN' && selectedBranchId ? selectedBranchId : undefined,
      }),
  });

  // Sort FEFO: soonest expiresAt first
  const sortedBatches = useMemo(() => {
    return [...batches].sort(
      (a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    );
  }, [batches]);

  const summaryCounts = useMemo(() => {
    let nearExpiry = 0;
    let urgent = 0;
    let lowStock = 0;
    let healthy = 0;
    sortedBatches.forEach((b) => {
      const r = getBatchFefoRisk(b.expiresAt, locale);
      if (r.level === 'URGENT') urgent += 1;
      if (r.level === 'URGENT' || r.level === 'WARNING') nearExpiry += 1;
      if (r.level === 'HEALTHY') healthy += 1;
      if (b.quantity <= 15) lowStock += 1;
    });
    return {
      total: sortedBatches.length,
      nearExpiry,
      urgent,
      lowStock,
      healthy,
    };
  }, [sortedBatches, locale]);

  const filteredBatches = useMemo(() => {
    return sortedBatches.filter((b) => {
      const r = getBatchFefoRisk(b.expiresAt, locale);
      if (quickTab === 'NEAR_EXPIRY' && r.level === 'HEALTHY') return false;
      if (quickTab === 'LOW_STOCK' && b.quantity > 15) return false;
      if (quickTab === 'HEALTHY' && r.level !== 'HEALTHY') return false;

      if (!debouncedSearch) return true;
      const target = `${b.batchCode} ${b.product?.name || ''} ${b.product?.nameEn || ''} ${
        b.product?.sku || ''
      }`.toLowerCase();
      return target.includes(debouncedSearch);
    });
  }, [sortedBatches, quickTab, debouncedSearch, locale]);

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / pageSize));
  const paginatedBatches = filteredBatches.slice((page - 1) * pageSize, page * pageSize);

  const createBatchMutation = useMutation({
    mutationFn: (payload: CreateInventoryBatchInput) => inventoryApi.createBatch(payload),
    onSuccess: (created) => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['inventory-batches'] });
      queryClient.invalidateQueries({ queryKey: ['portal-shell-batches'] });
      queryClient.invalidateQueries({ queryKey: ['checkout-availability'] });
      toast.success(
        locale === 'en'
          ? `Imported batch ${created.batchCode} successfully!`
          : `Đã nhập lô hàng mới ${created.batchCode} thành công!`
      );
    },
    onError: (err: unknown) => {
      const msg =
        getApiErrorMessage(err, "") ||
        (locale === 'en' ? 'Failed to create inventory batch' : 'Không thể nhập lô hàng mới');
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const openCreateModal = () => {
    const now = new Date();
    const defaultProduct = products[0];
    const shelfDays =
      defaultProduct?.storageType === 'FROZEN'
        ? defaultProduct?.shelfLifeFrozenDays || 30
        : defaultProduct?.shelfLifeChilledDays || 3;
    const exp = new Date(now.getTime() + shelfDays * 24 * 60 * 60 * 1000);

    setFormState({
      branchId: selectedBranchId || defaultBranchId || branches[0]?.id || '',
      productId: defaultProduct?.id || '',
      batchCode: `BATCH-${Date.now().toString().slice(-6)}`,
      quantity: 25,
      manufacturedAt: toDatetimeLocalValue(now),
      expiresAt: toDatetimeLocalValue(exp),
    });
    setIsModalOpen(true);
  };

  const handleProductChange = (prodId: string) => {
    const prod = products.find((p) => p.id === prodId);
    const mfgDate = formState.manufacturedAt ? new Date(formState.manufacturedAt) : new Date();
    const shelfDays =
      prod?.storageType === 'FROZEN'
        ? prod?.shelfLifeFrozenDays || 30
        : prod?.shelfLifeChilledDays || 3;
    const expDate = new Date(mfgDate.getTime() + shelfDays * 24 * 60 * 60 * 1000);

    setFormState((prev) => ({
      ...prev,
      productId: prodId,
      expiresAt: toDatetimeLocalValue(expDate),
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateInventoryBatchInput = {
      productId: formState.productId,
      batchCode: formState.batchCode.trim().toUpperCase(),
      quantity: Number(formState.quantity),
      manufacturedAt: new Date(formState.manufacturedAt).toISOString(),
      expiresAt: new Date(formState.expiresAt).toISOString(),
      ...(formState.branchId ? { branchId: formState.branchId } : {}),
    };
    createBatchMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#F37021] text-[11px] font-bold uppercase tracking-wider">
            {locale === 'en' ? 'FEFO Cold-Chain Stock Control' : 'Kiểm Soát Hạn Sử Dụng FEFO'}
          </span>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812] flex items-center gap-2">
            <Boxes className="w-6 h-6 text-[#F37021]" />
            <span>
              {mode === 'ADMIN'
                ? locale === 'en'
                  ? 'All-Branch FEFO Batch Inventory'
                  : 'Quản Lý Kho Lô Hàng FEFO Toàn Hệ Thống'
                : locale === 'en'
                ? `Branch FEFO Inventory${branchName ? ` — ${branchName}` : ''}`
                : `Kho Lô Hàng FEFO${branchName ? ` — ${branchName}` : ''}`}
            </span>
          </h1>
          <p className="text-xs text-stone-500">
            {locale === 'en'
              ? 'First-Expired, First-Out priority: Red (≤ 24h / Expired), Yellow (≤ 48h), Green (> 48h).'
              : 'Ưu tiên xuất lô hết hạn trước (FEFO): Đỏ (≤ 24h hoặc hết hạn), Vàng (cận date ≤ 48h), Xanh (còn hạn).'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {mode === 'ADMIN' && (
            <select
              value={selectedBranchId}
              onChange={(e) => {
                setSelectedBranchId(e.target.value);
                setPage(1);
              }}
              aria-label="Filter batches by branch"
              className="px-3.5 py-2 rounded-xl border border-black/10 bg-[#F8F7F4] text-xs font-bold text-[#231812] focus:outline-none focus:border-[#F37021]"
            >
              <option value="">
                {locale === 'en' ? 'All 5 Cobi Bread Branches' : 'Tất cả 5 chi nhánh'}
              </option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {getLocalizedBranchName(b, locale)} ({b.city})
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{locale === 'en' ? 'Refresh' : 'Làm mới'}</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md shadow-[#F37021]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'en' ? 'Import New Batch' : 'Nhập lô hàng mới'}</span>
          </button>
        </div>
      </div>

      {/* Prominent FEFO Warning Banner */}
      {summaryCounts.nearExpiry > 0 && (
        <div className="bg-gradient-to-r from-red-50 via-amber-50 to-orange-50 border border-red-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-red-950 text-sm">
                {locale === 'en'
                  ? `FEFO Attention Required: ${summaryCounts.nearExpiry} batch(es) expiring within 48 hours!`
                  : `Cảnh Báo Kho FEFO: Có ${summaryCounts.nearExpiry} lô bánh cận date (≤ 48 giờ) cần ưu tiên xuất trước!`}
              </p>
              <p className="text-red-800">
                {locale === 'en'
                  ? `${summaryCounts.urgent} urgent/expired (≤ 24h) • ${summaryCounts.lowStock} low-stock batch(es) (≤ 15 units).`
                  : `Trong đó ${summaryCounts.urgent} lô mức Đỏ (≤ 24h hoặc hết hạn) và ${summaryCounts.lowStock} lô sắp hết hàng (≤ 15 cái).`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setQuickTab('NEAR_EXPIRY');
              setPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shrink-0 cursor-pointer self-start sm:self-center"
          >
            {locale === 'en' ? 'Filter Near-Expiry' : 'Xem ngay lô cận date'}
          </button>
        </div>
      )}

      {/* Quick Filter Bar (`Tất cả`, `Cận date <= 48h`, `Sắp hết hàng`, `Còn hạn`) + Search */}
      <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            {
              id: 'ALL' as const,
              label: locale === 'en' ? 'All Batches' : 'Tất cả lô',
              count: summaryCounts.total,
              icon: <Boxes className="w-3.5 h-3.5" />,
            },
            {
              id: 'NEAR_EXPIRY' as const,
              label: locale === 'en' ? 'Near Expiry ≤ 48h' : 'Cận date ≤ 48h',
              count: summaryCounts.nearExpiry,
              icon: <AlertTriangle className="w-3.5 h-3.5" />,
            },
            {
              id: 'LOW_STOCK' as const,
              label: locale === 'en' ? 'Low Stock (≤ 15)' : 'Sắp hết hàng (≤ 15)',
              count: summaryCounts.lowStock,
              icon: <PackageMinus className="w-3.5 h-3.5" />,
            },
            {
              id: 'HEALTHY' as const,
              label: locale === 'en' ? 'Healthy (> 48h)' : 'Còn hạn tốt',
              count: summaryCounts.healthy,
              icon: <CheckCircle2 className="w-3.5 h-3.5" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setQuickTab(tab.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                quickTab === tab.id
                  ? 'bg-[#231812] text-white'
                  : 'bg-[#F8F7F4] text-stone-600 hover:text-[#231812]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
                  quickTab === tab.id
                    ? 'bg-[#F37021] text-white'
                    : 'bg-stone-200/80 text-stone-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={
              locale === 'en'
                ? 'Search batch code, product, SKU...'
                : 'Tìm mã lô, tên bánh, mã SKU...'
            }
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-black/5 text-xs focus:outline-none focus:border-[#F37021]"
          />
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-14 rounded-xl bg-stone-100 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-xs text-red-600">
            {locale === 'en'
              ? 'Failed to fetch batches from /inventory/batches.'
              : 'Không thể tải danh sách lô hàng từ /inventory/batches.'}
          </div>
        ) : paginatedBatches.length === 0 ? (
          <div className="p-14 text-center space-y-2">
            <Boxes className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-[#231812]">
              {locale === 'en'
                ? 'No FEFO batches match this filter'
                : 'Không có lô hàng nào khớp bộ lọc'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-700">
              <thead className="bg-[#F8F7F4] text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200/70">
                <tr>
                  <th className="px-4 py-3.5">{locale === 'en' ? 'Batch Code' : 'Mã Lô'}</th>
                  <th className="px-4 py-3.5">{locale === 'en' ? 'Product' : 'Sản Phẩm'}</th>
                  {mode === 'ADMIN' && (
                    <th className="px-4 py-3.5">{locale === 'en' ? 'Branch' : 'Chi Nhánh'}</th>
                  )}
                  <th className="px-4 py-3.5 text-center">
                    {locale === 'en' ? 'Remaining Qty' : 'Tồn Kho'}
                  </th>
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Manufactured' : 'Ngày SX'}
                  </th>
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Expires At' : 'Hạn Sử Dụng'}
                  </th>
                  <th className="px-4 py-3.5 text-right">
                    {locale === 'en' ? 'FEFO Priority' : 'Cảnh Báo FEFO'}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {paginatedBatches.map((batch) => {
                  const risk = getBatchFefoRisk(batch.expiresAt, locale);
                  const storageBadge = batch.product?.storageType
                    ? getStorageBadge(batch.product.storageType, locale)
                    : null;

                  return (
                    <tr key={batch.id} className={`transition-colors ${risk.rowClass}`}>
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-[#231812] whitespace-nowrap">
                        {batch.batchCode}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span className="font-bold text-[#231812] block">
                            {batch.product
                              ? getLocalizedProductName(batch.product, locale)
                              : batch.productId}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {batch.product?.sku && (
                              <span className="font-mono text-[10px] text-stone-500">
                                {batch.product.sku}
                              </span>
                            )}
                            {storageBadge && (
                              <span
                                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${storageBadge.className}`}
                              >
                                {storageBadge.icon}
                                {storageBadge.shortLabel}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {mode === 'ADMIN' && (
                        <td className="px-4 py-3.5 text-xs whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 font-semibold text-[#231812]">
                            <Store className="w-3.5 h-3.5 text-[#F37021]" />
                            {batch.branch
                              ? getLocalizedBranchName(batch.branch, locale)
                              : batch.branchId}
                          </span>
                        </td>
                      )}

                      <td className="px-4 py-3.5 text-center whitespace-nowrap">
                        <span
                          className={`font-black text-sm tabular-nums px-2.5 py-1 rounded-lg ${
                            batch.quantity <= 15
                              ? 'bg-amber-100 text-amber-900'
                              : 'text-[#231812]'
                          }`}
                        >
                          {batch.quantity}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-stone-600 whitespace-nowrap">
                        {new Date(batch.manufacturedAt).toLocaleString(
                          locale === 'en' ? 'en-US' : 'vi-VN'
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-xs font-semibold text-[#231812] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {new Date(batch.expiresAt).toLocaleString(
                              locale === 'en' ? 'en-US' : 'vi-VN'
                            )}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {risk.countdown}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${risk.badgeClass}`}
                        >
                          {risk.level === 'URGENT' ? (
                            <AlertCircle className="w-3.5 h-3.5" />
                          ) : risk.level === 'WARNING' ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>{risk.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-stone-100 bg-[#F8F7F4] flex items-center justify-between text-xs">
            <span className="text-stone-500">
              {locale === 'en'
                ? `Page ${page} of ${totalPages} (${filteredBatches.length} batches)`
                : `Trang ${page} / ${totalPages} (${filteredBatches.length} lô hàng)`}
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
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 font-bold disabled:opacity-40 cursor-pointer"
              >
                {locale === 'en' ? 'Next' : 'Sau'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Import New Batch Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-black/10 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-[#231812] flex items-center gap-2">
                <Boxes className="w-5 h-5 text-[#F37021]" />
                <span>{locale === 'en' ? 'Import New FEFO Batch' : 'Nhập Lô Hàng Mới'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              {mode === 'ADMIN' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Target Branch *' : 'Chi nhánh nhận lô *'}
                  </label>
                  <select
                    required
                    value={formState.branchId}
                    onChange={(e) => setFormState({ ...formState, branchId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {getLocalizedBranchName(b, locale)} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {locale === 'en' ? 'Product *' : 'Sản phẩm *'}
                </label>
                <select
                  required
                  value={formState.productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
                >
                  <option value="">
                    {locale === 'en' ? '-- Select product --' : '-- Chọn sản phẩm --'}
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.sku}] {getLocalizedProductName(p, locale)} ({p.storageType})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Batch Code *' : 'Mã lô hàng *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.batchCode}
                    onChange={(e) => setFormState({ ...formState, batchCode: e.target.value })}
                    placeholder="BATCH-Q7-001"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs uppercase focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Quantity *' : 'Số lượng nhập *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formState.quantity}
                    onChange={(e) =>
                      setFormState({ ...formState, quantity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Manufactured At *' : 'Ngày sản xuất *'}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formState.manufacturedAt}
                    onChange={(e) =>
                      setFormState({ ...formState, manufacturedAt: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#F37021]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Expires At *' : 'Hạn sử dụng *'}
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formState.expiresAt}
                    onChange={(e) => setFormState({ ...formState, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-[#F37021]"
                  />
                </div>
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
                  disabled={createBatchMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-xs shadow-md shadow-[#F37021]/20 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {createBatchMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {createBatchMutation.isPending
                      ? locale === 'en'
                        ? 'Saving...'
                        : 'Đang lưu...'
                      : locale === 'en'
                      ? 'Confirm Import'
                      : 'Xác nhận nhập lô'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
