'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ClipboardList,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  Phone,
  User as UserIcon,
  AlertCircle,
  Clock,
  Store,
  CreditCard,
} from 'lucide-react';
import { branchesApi, ordersApi } from '@/lib/api';
import { Branch, Order, OrderStatus } from '@/types';
import { formatVND } from '@/components/ProductCard';
import {
  useTranslation,
  getLocalizedProductName,
  getLocalizedBranchName,
} from '@/i18n';

interface OrdersManagementBoardProps {
  mode: 'ADMIN' | 'MANAGER';
  branchName?: string | null;
}

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  PAID: 'bg-sky-50 text-sky-800 border-sky-200',
  CONFIRMED: 'bg-blue-50 text-blue-800 border-blue-200',
  PROCESSING: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  SHIPPING: 'bg-orange-50 text-orange-800 border-orange-200',
  DELIVERED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const ALL_STATUSES: OrderStatus[] = [
  'PENDING',
  'PAID',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPING',
  'DELIVERED',
  'CANCELLED',
];

export default function OrdersManagementBoard({
  mode,
  branchName,
}: OrdersManagementBoardProps) {
  const queryClient = useQueryClient();
  const { t, locale } = useTranslation();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3200);
  };

  // Fetch 5 branches for Admin branch selector
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
    enabled: mode === 'ADMIN',
  });

  // Fetch orders with 15s automatic polling per Milestone 3 requirement
  const {
    data: orders = [],
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery<Order[]>({
    queryKey: ['portal-orders', mode, selectedBranchId],
    queryFn: () =>
      ordersApi.getAll({
        branchId: mode === 'ADMIN' && selectedBranchId ? selectedBranchId : undefined,
      }),
    refetchInterval: 15000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      ordersApi.updateStatus(orderId, status),
    onMutate: ({ orderId }) => {
      setUpdatingOrderId(orderId);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['portal-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-batches'] });
      showToast(
        locale === 'en'
          ? `Order ${updated.orderCode} updated to ${updated.status}`
          : `Đã cập nhật đơn ${updated.orderCode} sang ${t.ordersPage.statuses[updated.status]}`
      );
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        (locale === 'en' ? 'Failed to update order status' : 'Không thể cập nhật trạng thái đơn');
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
    },
    onSettled: () => {
      setUpdatingOrderId(null);
    },
  });

  const filteredOrders = orders.filter((order) =>
    statusFilter === 'ALL' ? true : order.status === statusFilter
  );

  // Quick progression workflow helper
  const getNextActions = (
    status: OrderStatus
  ): Array<{ target: OrderStatus; label: string; variant: 'primary' | 'danger' }> => {
    switch (status) {
      case 'PENDING':
      case 'PAID':
        return [
          {
            target: 'CONFIRMED',
            label: locale === 'en' ? 'Confirm Order' : 'Xác nhận đơn',
            variant: 'primary',
          },
          {
            target: 'CANCELLED',
            label: locale === 'en' ? 'Cancel' : 'Hủy đơn',
            variant: 'danger',
          },
        ];
      case 'CONFIRMED':
        return [
          {
            target: 'PROCESSING',
            label: locale === 'en' ? 'Start Preparing' : 'Chuẩn bị bánh',
            variant: 'primary',
          },
          {
            target: 'CANCELLED',
            label: locale === 'en' ? 'Cancel' : 'Hủy đơn',
            variant: 'danger',
          },
        ];
      case 'PROCESSING':
        return [
          {
            target: 'SHIPPING',
            label: locale === 'en' ? 'Dispatch / Ready' : 'Giao hàng',
            variant: 'primary',
          },
        ];
      case 'SHIPPING':
        return [
          {
            target: 'DELIVERED',
            label: locale === 'en' ? 'Mark Delivered' : 'Hoàn tất giao',
            variant: 'primary',
          },
        ];
      default:
        return [];
    }
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
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                mode === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800 border-purple-200'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}
            >
              {mode === 'ADMIN' ? 'HQ Admin Orders' : 'Branch Orders'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {locale === 'en' ? 'Auto-refresh 15s' : 'Tự động cập nhật 15s'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 flex items-center gap-2.5">
            <ClipboardList className="w-6 h-6 text-[#F37021]" />
            <span>
              {mode === 'ADMIN'
                ? locale === 'en'
                  ? 'All-Branch Order Management'
                  : 'Quản Lý Đơn Hàng Toàn Hệ Thống'
                : locale === 'en'
                ? `Branch Orders${branchName ? ` — ${branchName}` : ''}`
                : `Đơn Hàng Chi Nhánh${branchName ? ` — ${branchName}` : ''}`}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {locale === 'en'
              ? 'Process live FEFO bakery orders and transition status from Pending through Delivered.'
              : 'Theo dõi và xử lý đơn hàng bánh tươi / đông lạnh theo thời gian thực với lộ trình FEFO.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {mode === 'ADMIN' && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              aria-label="Filter by branch"
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
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#231812] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{locale === 'en' ? 'Refresh' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200 flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#231812] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          {locale === 'en' ? 'All' : 'Tất cả'} ({orders.length})
        </button>

        {ALL_STATUSES.map((st) => {
          const count = orders.filter((o) => o.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#F37021] text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {t.ordersPage.statuses[st]} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders Table / List */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-14 flex flex-col items-center gap-3 text-stone-500">
            <Loader2 className="w-7 h-7 animate-spin text-[#F37021]" />
            <span className="text-xs font-semibold">{t.common.loading}</span>
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-xs text-red-600 space-y-2">
            <p>{t.ordersPage.errorLoading}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-14 text-center text-sm text-stone-400">
            {locale === 'en'
              ? 'No orders match the current filter.'
              : 'Không có đơn hàng nào khớp bộ lọc hiện tại.'}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredOrders.map((order) => {
              const nextActions = getNextActions(order.status);
              const isUpdating = updatingOrderId === order.id;

              return (
                <div key={order.id} className="p-5 sm:p-6 hover:bg-stone-50/70 transition-colors space-y-4">
                  {/* Top Row: Code + Time + Branch + Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-orange-50 text-[#F37021] border border-orange-200 font-mono text-xs font-bold">
                        {order.orderCode}
                      </span>
                      <span className="text-xs text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleString(
                          locale === 'en' ? 'en-US' : 'vi-VN'
                        )}
                      </span>
                      {order.branch && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-semibold">
                          <Store className="w-3 h-3 text-[#F37021]" />
                          {getLocalizedBranchName(order.branch, locale)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg">
                        <CreditCard className="w-3 h-3 text-stone-500" />
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${STATUS_STYLE[order.status]}`}
                      >
                        {t.ordersPage.statuses[order.status]}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Customer + Items */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                    {/* Customer details */}
                    <div className="lg:col-span-4 bg-[#FAF7F2] rounded-2xl p-4 border border-stone-200/70 space-y-1.5 text-xs text-stone-700">
                      <p className="font-bold text-stone-900 flex items-center gap-1.5">
                        <UserIcon className="w-3.5 h-3.5 text-[#F37021]" />
                        <span>{order.shippingAddress?.recipientName || order.user?.fullName}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400" />
                        <span className="font-mono">{order.shippingAddress?.phone}</span>
                      </p>
                      <p className="flex items-start gap-1.5 text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                        <span>{order.shippingAddress?.address}</span>
                      </p>
                      {order.note && (
                        <p className="text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200 mt-1">
                          {order.note}
                        </p>
                      )}
                    </div>

                    {/* Items + Batch FEFO */}
                    <div className="lg:col-span-5 space-y-2 text-xs">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-stone-200/70"
                        >
                          <div className="min-w-0">
                            <p className="font-bold text-stone-900 truncate">
                              {item.product
                                ? getLocalizedProductName(item.product, locale)
                                : item.productId}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500">
                              <span>
                                x{item.quantity} • {formatVND(item.unitPrice)}
                              </span>
                              {item.batch?.batchCode && (
                                <span className="font-mono bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded">
                                  {item.batch.batchCode}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-stone-900 shrink-0 tabular-nums">
                            {formatVND(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total + Status Actions */}
                    <div className="lg:col-span-3 flex flex-col items-stretch lg:items-end justify-between gap-3">
                      <div className="lg:text-right">
                        <span className="text-[11px] text-stone-500 block">
                          {locale === 'en' ? 'Total Amount' : 'Tổng giá trị đơn'}
                        </span>
                        <span className="text-lg font-black text-[#F37021] tabular-nums">
                          {formatVND(order.totalAmount)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center lg:justify-end gap-2">
                        {nextActions.map((act) => (
                          <button
                            key={act.target}
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateStatusMutation.mutate({
                                orderId: order.id,
                                status: act.target,
                              })
                            }
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50 ${
                              act.variant === 'primary'
                                ? 'bg-[#231812] hover:bg-[#F37021] text-white'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : act.variant === 'danger' ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            <span>{act.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
