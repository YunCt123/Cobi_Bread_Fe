'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from 'lucide-react';
import { branchesApi, inventoryApi, productsApi } from '@/lib/api';
import { Branch, CreateInventoryBatchInput, InventoryBatch, Product } from '@/types';
import { getStorageBadge } from '@/components/ProductCard';
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

function getBatchFefoRisk(expiresAt: string, locale: 'vi' | 'en'): {
  level: RiskLevel;
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
      label: locale === 'en' ? 'Urgent (≤ 24h)' : 'Khẩn (≤ 24 giờ)',
      countdown: locale === 'en' ? `${hrs}h left` : `Còn ~${hrs} giờ`,
      rowClass: 'bg-red-50/60 hover:bg-red-50 border-l-4 border-l-red-500',
      badgeClass: 'bg-red-100 text-red-800 border-red-300',
    };
  }

  if (diffHours <= 48) {
    const hrs = Math.round(diffHours);
    return {
      level: 'WARNING',
      label: locale === 'en' ? 'Near Expiry (≤ 2d)' : 'Cận date (≤ 2 ngày)',
      countdown: locale === 'en' ? `${hrs}h left` : `Còn ~${hrs} giờ`,
      rowClass: 'bg-amber-50/60 hover:bg-amber-50 border-l-4 border-l-amber-400',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    };
  }

  const days = Math.floor(diffHours / 24);
  return {
    level: 'HEALTHY',
    label: locale === 'en' ? 'Good (> 2d)' : 'Còn hạn tốt',
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
  const [riskFilter, setRiskFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [formState, setFormState] = useState({
    branchId: defaultBranchId || '',
    productId: '',
    batchCode: '',
    quantity: 20,
    manufacturedAt: '',
    expiresAt: '',
  });

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

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

  const riskCounts = useMemo(() => {
    const counts = { URGENT: 0, WARNING: 0, HEALTHY: 0 };
    sortedBatches.forEach((b) => {
      const r = getBatchFefoRisk(b.expiresAt, locale).level;
      counts[r] += 1;
    });
    return counts;
  }, [sortedBatches, locale]);

  const visibleBatches = sortedBatches.filter((b) => {
    if (riskFilter === 'ALL') return true;
    return getBatchFefoRisk(b.expiresAt, locale).level === riskFilter;
  });

  const createBatchMutation = useMutation({
    mutationFn: (payload: CreateInventoryBatchInput) => inventoryApi.createBatch(payload),
    onSuccess: (created) => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['inventory-batches'] });
      queryClient.invalidateQueries({ queryKey: ['checkout-availability'] });
      showToast(
        locale === 'en'
          ? `Batch ${created.batchCode} added cleanly!`
          : `Đã nhập lô hàng ${created.batchCode} thành công!`
      );
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        (locale === 'en' ? 'Failed to create inventory batch' : 'Không thể nhập lô hàng mới');
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
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
      quantity: 20,
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
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold ${
            toast.type === 'success' ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-200" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <span
            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
              mode === 'ADMIN'
                ? 'bg-purple-100 text-purple-800 border-purple-200'
                : 'bg-blue-100 text-blue-800 border-blue-200'
            }`}
          >
            {locale === 'en' ? 'FEFO Cold-Chain Stock Control' : 'Kiểm Soát Hạn Sử Dụng FEFO'}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center gap-2.5">
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
          <p className="text-xs sm:text-sm text-stone-500">
            {locale === 'en'
              ? 'First-Expired, First-Out prioritization: Red (≤ 24h / Expired), Yellow (≤ 2 days), Green (> 2 days).'
              : 'Sắp xếp ưu tiên xuất trước hết hạn trước (FEFO): Đỏ (≤ 24h hoặc hết hạn), Vàng (cận date ≤ 2 ngày), Xanh (còn hạn).'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {mode === 'ADMIN' && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              aria-label="Filter batches by branch"
              className="px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2] text-xs font-bold text-stone-800 focus:outline-none focus:border-[#F37021]"
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{locale === 'en' ? 'Refresh' : 'Làm mới'}</span>
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md shadow-[#F37021]/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === 'en' ? 'Import New Batch' : 'Nhập lô hàng mới'}</span>
          </button>
        </div>
      </div>

      {/* FEFO Summary Cards (Clickable Filters) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => setRiskFilter('ALL')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            riskFilter === 'ALL'
              ? 'bg-[#231812] text-white border-[#231812]'
              : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="text-xs font-semibold opacity-75 block">
            {locale === 'en' ? 'Total Batches' : 'Tổng số lô hàng'}
          </span>
          <span className="text-2xl font-black tabular-nums mt-1 block">
            {sortedBatches.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setRiskFilter('URGENT')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            riskFilter === 'URGENT'
              ? 'bg-red-600 text-white border-red-600'
              : 'bg-red-50/70 text-red-900 border-red-200 hover:border-red-400'
          }`}
        >
          <span className="text-xs font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" />
            {locale === 'en' ? 'Urgent (≤ 24h / Expired)' : 'Đỏ: ≤ 24h hoặc hết hạn'}
          </span>
          <span className="text-2xl font-black tabular-nums mt-1 block">{riskCounts.URGENT}</span>
        </button>

        <button
          type="button"
          onClick={() => setRiskFilter('WARNING')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            riskFilter === 'WARNING'
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-amber-50/70 text-amber-900 border-amber-200 hover:border-amber-400'
          }`}
        >
          <span className="text-xs font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            {locale === 'en' ? 'Near Expiry (≤ 2d)' : 'Vàng: Cận date ≤ 2 ngày'}
          </span>
          <span className="text-2xl font-black tabular-nums mt-1 block">{riskCounts.WARNING}</span>
        </button>

        <button
          type="button"
          onClick={() => setRiskFilter('HEALTHY')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            riskFilter === 'HEALTHY'
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-emerald-50/70 text-emerald-900 border-emerald-200 hover:border-emerald-400'
          }`}
        >
          <span className="text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            {locale === 'en' ? 'Healthy (> 2 days)' : 'Xanh: Còn hạn tốt'}
          </span>
          <span className="text-2xl font-black tabular-nums mt-1 block">{riskCounts.HEALTHY}</span>
        </button>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-14 flex flex-col items-center gap-3 text-stone-500">
            <Loader2 className="w-7 h-7 animate-spin text-[#F37021]" />
            <span className="text-xs font-semibold">
              {locale === 'en' ? 'Loading FEFO batches...' : 'Đang tải danh sách lô hàng...'}
            </span>
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-xs text-red-600">
            {locale === 'en'
              ? 'Failed to fetch batches from /inventory/batches.'
              : 'Không thể tải danh sách lô hàng từ /inventory/batches.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-700">
              <thead className="bg-stone-50 text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200">
                <tr>
                  <th className="px-4 py-3.5">{locale === 'en' ? 'Batch Code' : 'Mã Lô'}</th>
                  <th className="px-4 py-3.5">{locale === 'en' ? 'Product' : 'Sản Phẩm'}</th>
                  {mode === 'ADMIN' && (
                    <th className="px-4 py-3.5">{locale === 'en' ? 'Branch' : 'Chi Nhánh'}</th>
                  )}
                  <th className="px-4 py-3.5 text-center">
                    {locale === 'en' ? 'Qty' : 'Số Lượng'}
                  </th>
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Manufactured' : 'Ngày SX'}
                  </th>
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Expires At' : 'Hạn Sử Dụng'}
                  </th>
                  <th className="px-4 py-3.5 text-right">
                    {locale === 'en' ? 'FEFO Status' : 'Cảnh Báo FEFO'}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100">
                {visibleBatches.map((batch) => {
                  const risk = getBatchFefoRisk(batch.expiresAt, locale);
                  const storageBadge = batch.product?.storageType
                    ? getStorageBadge(batch.product.storageType, locale)
                    : null;

                  return (
                    <tr key={batch.id} className={`transition-colors ${risk.rowClass}`}>
                      <td className="px-4 py-3.5 font-mono text-xs font-bold text-stone-900 whitespace-nowrap">
                        {batch.batchCode}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span className="font-bold text-stone-900 block">
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
                          <span className="inline-flex items-center gap-1 font-semibold text-stone-800">
                            <Store className="w-3.5 h-3.5 text-[#F37021]" />
                            {batch.branch
                              ? getLocalizedBranchName(batch.branch, locale)
                              : batch.branchId}
                          </span>
                        </td>
                      )}

                      <td className="px-4 py-3.5 text-center font-black text-base tabular-nums text-stone-900">
                        {batch.quantity}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-stone-600 whitespace-nowrap">
                        {new Date(batch.manufacturedAt).toLocaleString(
                          locale === 'en' ? 'en-US' : 'vi-VN'
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-xs font-semibold text-stone-800 whitespace-nowrap">
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

            {visibleBatches.length === 0 && (
              <div className="p-12 text-center text-sm text-stone-400">
                {locale === 'en'
                  ? 'No batches found matching this filter.'
                  : 'Không có lô hàng nào phù hợp.'}
              </div>
            )}
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 cursor-pointer"
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
