'use client';

import { getApiErrorMessage } from '@/utils/error';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ClipboardList,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  MapPin,
  Phone,
  User as UserIcon,
  Clock,
  Store,
  CreditCard,
  Search,
  Eye,
  Printer,
  X,
  Truck,
  ChefHat,
  PackageCheck,
} from 'lucide-react';
import { branchesApi, ordersApi } from '@/services';
import { Branch, Order, OrderStatus } from '@/types';
import { formatVND } from '@/components/storefront/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedProductName,
  getLocalizedBranchName,
} from '@/i18n';

interface OrdersManagementBoardProps {
  mode: 'ADMIN' | 'MANAGER';
  branchName?: string | null;
}

type OrderTabGroup = 'ALL' | 'PENDING_GROUP' | 'PREPARING_GROUP' | 'SHIPPING_GROUP' | 'COMPLETED_GROUP' | 'CANCELLED_GROUP';

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  PAID: 'bg-sky-50 text-sky-800 border-sky-200',
  CONFIRMED: 'bg-blue-50 text-blue-800 border-blue-200',
  PROCESSING: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  SHIPPING: 'bg-orange-50 text-orange-800 border-orange-200',
  DELIVERED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

const TIMELINE_STEPS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPING',
  'DELIVERED',
];

export default function OrdersManagementBoard({
  mode,
  branchName,
}: OrdersManagementBoardProps) {
  const queryClient = useQueryClient();
  const { t, locale } = useTranslation();

  const [selectedBranchId, setSelectedBranchId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<OrderTabGroup>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [rawSelectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Track seen PENDING order IDs to fire Sonner toast when a new PENDING order arrives
  const seenPendingIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch 5 branches for Admin branch selector
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
    enabled: mode === 'ADMIN',
  });

  // Fetch orders with 15s automatic polling
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

  // Detect newly arrived PENDING orders on polling
  useEffect(() => {
    if (!orders.length) return;
    const currentPending = orders.filter((o) => o.status === 'PENDING');
    if (seenPendingIdsRef.current === null) {
      seenPendingIdsRef.current = new Set(currentPending.map((o) => o.id));
      return;
    }
    currentPending.forEach((o) => {
      if (!seenPendingIdsRef.current?.has(o.id)) {
        seenPendingIdsRef.current?.add(o.id);
        toast.info(
          locale === 'en'
            ? `New pending order received: ${o.orderCode}`
            : `Có đơn hàng mới chờ xác nhận: ${o.orderCode}`
        );
      }
    });
  }, [orders, locale]);

  const selectedOrder = useMemo(
    () =>
      rawSelectedOrder
        ? orders.find((o) => o.id === rawSelectedOrder.id) ?? rawSelectedOrder
        : null,
    [orders, rawSelectedOrder]
  );

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      ordersApi.updateStatus(orderId, status),
    onMutate: ({ orderId }) => {
      setUpdatingOrderId(orderId);
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['portal-orders'] });
      queryClient.invalidateQueries({ queryKey: ['portal-shell-orders'] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-batches'] });
      toast.success(
        locale === 'en'
          ? `Order ${updated.orderCode} → ${updated.status}`
          : `Đã chuyển đơn ${updated.orderCode} sang ${t.ordersPage.statuses[updated.status]}`
      );
    },
    onError: (err: unknown) => {
      toast.error(
        getApiErrorMessage(
          err,
          locale === 'en' ? 'Failed to update order status' : 'Không thể cập nhật trạng thái đơn'
        )
      );
    },
    onSettled: () => {
      setUpdatingOrderId(null);
    },
  });

  const matchTabGroup = (status: OrderStatus, group: OrderTabGroup): boolean => {
    if (group === 'ALL') return true;
    if (group === 'PENDING_GROUP') return status === 'PENDING' || status === 'PAID';
    if (group === 'PREPARING_GROUP') return status === 'CONFIRMED' || status === 'PROCESSING';
    if (group === 'SHIPPING_GROUP') return status === 'SHIPPING';
    if (group === 'COMPLETED_GROUP') return status === 'DELIVERED';
    if (group === 'CANCELLED_GROUP') return status === 'CANCELLED';
    return true;
  };

  const tabCounts = useMemo(
    () => ({
      ALL: orders.length,
      PENDING_GROUP: orders.filter((o) => matchTabGroup(o.status, 'PENDING_GROUP')).length,
      PREPARING_GROUP: orders.filter((o) => matchTabGroup(o.status, 'PREPARING_GROUP')).length,
      SHIPPING_GROUP: orders.filter((o) => matchTabGroup(o.status, 'SHIPPING_GROUP')).length,
      COMPLETED_GROUP: orders.filter((o) => matchTabGroup(o.status, 'COMPLETED_GROUP')).length,
      CANCELLED_GROUP: orders.filter((o) => matchTabGroup(o.status, 'CANCELLED_GROUP')).length,
    }),
    [orders]
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (!matchTabGroup(order.status, activeTab)) return false;
      if (!debouncedSearch) return true;
      const target = `${order.orderCode} ${order.shippingAddress?.recipientName || ''} ${
        order.shippingAddress?.phone || ''
      } ${order.user?.email || ''}`.toLowerCase();
      return target.includes(debouncedSearch);
    });
  }, [orders, activeTab, debouncedSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  // Quick 1-click progression buttons
  const getNextActions = (
    status: OrderStatus
  ): Array<{ target: OrderStatus; label: string; variant: 'primary' | 'danger' }> => {
    switch (status) {
      case 'PENDING':
      case 'PAID':
        return [
          {
            target: 'CONFIRMED',
            label: locale === 'en' ? 'Confirm' : 'Duyệt đơn',
            variant: 'primary',
          },
          {
            target: 'CANCELLED',
            label: locale === 'en' ? 'Cancel' : 'Hủy',
            variant: 'danger',
          },
        ];
      case 'CONFIRMED':
        return [
          {
            target: 'PROCESSING',
            label: locale === 'en' ? 'Prepare' : 'Làm bánh',
            variant: 'primary',
          },
          {
            target: 'CANCELLED',
            label: locale === 'en' ? 'Cancel' : 'Hủy',
            variant: 'danger',
          },
        ];
      case 'PROCESSING':
        return [
          {
            target: 'SHIPPING',
            label: locale === 'en' ? 'Dispatch' : 'Giao bánh',
            variant: 'primary',
          },
        ];
      case 'SHIPPING':
        return [
          {
            target: 'DELIVERED',
            label: locale === 'en' ? 'Complete' : 'Hoàn thành',
            variant: 'primary',
          },
        ];
      default:
        return [];
    }
  };

  const handlePrintSlip = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#F37021] text-[11px] font-bold uppercase tracking-wider">
              {mode === 'ADMIN' ? 'HQ Order Center' : 'Branch Fulfillment'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {locale === 'en' ? 'Live Polling 15s' : 'Tự động cập nhật 15s'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812] flex items-center gap-2">
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
          <p className="text-xs text-stone-500">
            {locale === 'en'
              ? '1-click status transitions, FEFO batch allocation inspection, and printable packing slips.'
              : 'Duyệt đơn 1-click, kiểm tra lô bánh FEFO xuất kho, xem timeline và in phiếu soạn bánh.'}
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
              aria-label="Filter by branch"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#231812] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            <span>{locale === 'en' ? 'Refresh' : 'Làm mới'}</span>
          </button>
        </div>
      </div>

      {/* Status Tabs + Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {[
            {
              id: 'ALL' as const,
              label: locale === 'en' ? 'All' : 'Tất cả',
              count: tabCounts.ALL,
            },
            {
              id: 'PENDING_GROUP' as const,
              label: locale === 'en' ? 'Pending Approval' : 'Chờ duyệt',
              count: tabCounts.PENDING_GROUP,
            },
            {
              id: 'PREPARING_GROUP' as const,
              label: locale === 'en' ? 'Preparing' : 'Đang làm',
              count: tabCounts.PREPARING_GROUP,
            },
            {
              id: 'SHIPPING_GROUP' as const,
              label: locale === 'en' ? 'Out for Delivery' : 'Đang giao',
              count: tabCounts.SHIPPING_GROUP,
            },
            {
              id: 'COMPLETED_GROUP' as const,
              label: locale === 'en' ? 'Completed' : 'Hoàn thành',
              count: tabCounts.COMPLETED_GROUP,
            },
            {
              id: 'CANCELLED_GROUP' as const,
              label: locale === 'en' ? 'Cancelled' : 'Đã hủy',
              count: tabCounts.CANCELLED_GROUP,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-[#231812] text-white'
                  : 'bg-[#F8F7F4] text-stone-600 hover:text-[#231812]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] tabular-nums ${
                  activeTab === tab.id
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
                ? 'Search order code, customer, phone...'
                : 'Tìm mã đơn, tên khách, SĐT...'
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
        ) : isError ? (
          <div className="p-12 text-center text-xs text-red-600">
            {t.ordersPage.errorLoading}
          </div>
        ) : paginatedOrders.length === 0 ? (
          <div className="p-14 text-center space-y-2">
            <ClipboardList className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-[#231812]">
              {locale === 'en'
                ? 'No orders match the current filter'
                : 'Không có đơn hàng nào khớp bộ lọc'}
            </p>
            <p className="text-xs text-stone-500">
              {locale === 'en'
                ? 'Try clearing the search query or switching status tabs.'
                : 'Hãy thử đổi tab trạng thái hoặc xóa từ khóa tìm kiếm.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#F8F7F4] text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200/70">
                <tr>
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Order Code' : 'Mã Đơn'}
                  </th>
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Customer' : 'Khách Hàng'}
                  </th>
                  {mode === 'ADMIN' && (
                    <th className="px-4 py-3.5">
                      {locale === 'en' ? 'Branch' : 'Chi Nhánh'}
                    </th>
                  )}
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Items & FEFO Batch' : 'Món Bánh & Lô FEFO'}
                  </th>
                  <th className="px-4 py-3.5 text-right">
                    {locale === 'en' ? 'Total' : 'Tổng Tiền'}
                  </th>
                  <th className="px-4 py-3.5">
                    {locale === 'en' ? 'Status' : 'Trạng Thái'}
                  </th>
                  <th className="px-4 py-3.5 text-right">
                    {locale === 'en' ? 'Quick Action' : 'Xử Lý Nhanh'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedOrders.map((order) => {
                  const nextActions = getNextActions(order.status);
                  const isUpdating = updatingOrderId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="font-mono text-xs font-bold text-[#F37021] hover:underline block cursor-pointer"
                        >
                          {order.orderCode}
                        </button>
                        <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleString(
                            locale === 'en' ? 'en-US' : 'vi-VN'
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-bold text-[#231812] text-xs">
                          {order.shippingAddress?.recipientName || order.user?.fullName}
                        </p>
                        <p className="text-[11px] text-stone-500 font-mono">
                          {order.shippingAddress?.phone}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600">
                          {order.deliveryType} • {order.paymentMethod}
                        </span>
                      </td>

                      {mode === 'ADMIN' && (
                        <td className="px-4 py-4 whitespace-nowrap text-xs">
                          <span className="inline-flex items-center gap-1 font-semibold text-[#231812]">
                            <Store className="w-3.5 h-3.5 text-[#F37021]" />
                            {order.branch
                              ? getLocalizedBranchName(order.branch, locale)
                              : 'Cobi Bread'}
                          </span>
                        </td>
                      )}

                      <td className="px-4 py-4 max-w-xs">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item) => (
                            <div key={item.id} className="text-xs flex items-center gap-1.5">
                              <span className="font-bold text-[#231812] truncate">
                                {item.quantity}x{' '}
                                {item.product
                                  ? getLocalizedProductName(item.product, locale)
                                  : item.productId}
                              </span>
                              {item.batch?.batchCode && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-orange-50 text-[#F37021] border border-orange-200 shrink-0">
                                  {item.batch.batchCode}
                                </span>
                              )}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-[11px] text-stone-400">
                              +{order.items.length - 2}{' '}
                              {locale === 'en' ? 'more items' : 'món khác'}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap font-black text-[#F37021] tabular-nums">
                        {formatVND(order.totalAmount)}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${STATUS_STYLE[order.status]}`}
                        >
                          {t.ordersPage.statuses[order.status]}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
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
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 disabled:opacity-50 ${
                                act.variant === 'primary'
                                  ? 'bg-[#231812] hover:bg-[#F37021] text-white'
                                  : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                              }`}
                            >
                              {isUpdating ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : act.variant === 'danger' ? (
                                <XCircle className="w-3 h-3" />
                              ) : (
                                <CheckCircle2 className="w-3 h-3" />
                              )}
                              <span>{act.label}</span>
                            </button>
                          ))}

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            title={locale === 'en' ? 'Order Details' : 'Xem chi tiết & In phiếu'}
                            className="p-1.5 rounded-lg border border-stone-200 hover:border-[#F37021] text-stone-600 hover:text-[#F37021] cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
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

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-stone-100 bg-[#F8F7F4] flex items-center justify-between text-xs">
            <span className="text-stone-500">
              {locale === 'en'
                ? `Showing ${(page - 1) * pageSize + 1}-${Math.min(
                    page * pageSize,
                    filteredOrders.length
                  )} of ${filteredOrders.length}`
                : `Hiển thị ${(page - 1) * pageSize + 1}-${Math.min(
                    page * pageSize,
                    filteredOrders.length
                  )} / ${filteredOrders.length} đơn`}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 font-bold disabled:opacity-40 cursor-pointer"
              >
                {t.common.previousPage}
              </button>
              <span className="px-2 font-bold">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 font-bold disabled:opacity-40 cursor-pointer"
              >
                {t.common.nextPage}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Slide-Over Drawer + Printable Packing Slip */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 border-b border-stone-200 bg-[#F8F7F4] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="COBI BREAD"
                  className="h-7 w-auto object-contain"
                />
                <div>
                  <h3 className="text-base font-bold text-[#231812] font-mono">
                    {selectedOrder.orderCode}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {new Date(selectedOrder.createdAt).toLocaleString(
                      locale === 'en' ? 'en-US' : 'vi-VN'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#231812] hover:bg-[#F37021] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{locale === 'en' ? 'Print Slip' : 'In phiếu soạn bánh'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Timeline Progression */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  {locale === 'en' ? 'Fulfillment Timeline' : 'Tiến Trình Xử Lý Đơn Hàng'}
                </span>
                {selectedOrder.status === 'CANCELLED' ? (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 font-bold flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    <span>
                      {locale === 'en'
                        ? 'This order was cancelled and FEFO stock was restored.'
                        : 'Đơn hàng đã bị hủy (tồn kho lô FEFO đã được hoàn lại).'}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-5 gap-1.5">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const currentIdx = TIMELINE_STEPS.indexOf(
                        selectedOrder.status === 'PAID' ? 'PENDING' : selectedOrder.status
                      );
                      const isDone = idx <= currentIdx;
                      return (
                        <div
                          key={step}
                          className={`p-2 rounded-xl border text-center space-y-1 ${
                            isDone
                              ? 'bg-orange-50/80 border-[#F37021] text-[#231812]'
                              : 'bg-stone-50 border-stone-200 text-stone-400'
                          }`}
                        >
                          <div className="flex justify-center">
                            {idx === 0 && <Clock className="w-3.5 h-3.5 text-[#F37021]" />}
                            {idx === 1 && <CheckCircle2 className="w-3.5 h-3.5 text-[#F37021]" />}
                            {idx === 2 && <ChefHat className="w-3.5 h-3.5 text-[#F37021]" />}
                            {idx === 3 && <Truck className="w-3.5 h-3.5 text-[#F37021]" />}
                            {idx === 4 && <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <span className="text-[10px] font-bold block truncate">
                            {t.ordersPage.statuses[step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customer & Branch Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8F7F4] rounded-2xl p-4 border border-black/5">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">
                    {locale === 'en' ? 'Recipient Details' : 'Thông tin người nhận'}
                  </span>
                  <p className="font-bold text-[#231812] flex items-center gap-1.5">
                    <UserIcon className="w-3.5 h-3.5 text-[#F37021]" />
                    {selectedOrder.shippingAddress?.recipientName || selectedOrder.user?.fullName}
                  </p>
                  <p className="font-mono text-stone-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {selectedOrder.shippingAddress?.phone}
                  </p>
                  <p className="text-stone-600 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.shippingAddress?.address}</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">
                    {locale === 'en' ? 'Fulfillment & Payment' : 'Chi nhánh & Thanh toán'}
                  </span>
                  <p className="font-bold text-[#231812] flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-[#F37021]" />
                    {selectedOrder.branch
                      ? getLocalizedBranchName(selectedOrder.branch, locale)
                      : 'Cobi Bread'}
                  </p>
                  <p className="text-stone-700 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-stone-400" />
                    <span>{selectedOrder.deliveryType}</span>
                  </p>
                  <p className="text-stone-700 flex items-center gap-1.5 font-mono">
                    <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                    <span>
                      {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                    </span>
                  </p>
                </div>
              </div>

              {selectedOrder.note && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                  <strong className="block mb-0.5">
                    {locale === 'en' ? 'Customer Note:' : 'Ghi chú khách hàng:'}
                  </strong>
                  {selectedOrder.note}
                </div>
              )}

              {/* Packing Items List */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                  {locale === 'en'
                    ? 'Packing List & Assigned FEFO Batches'
                    : 'Danh Sách Bánh & Lô FEFO Xuất Kho'}
                </span>
                <div className="border border-stone-200 rounded-2xl divide-y divide-stone-100 overflow-hidden">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-[#231812]">
                          {item.product
                            ? getLocalizedProductName(item.product, locale)
                            : item.productId}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-stone-500">
                            {locale === 'en' ? 'Qty:' : 'SL:'}{' '}
                            <strong className="text-[#231812]">x{item.quantity}</strong> •{' '}
                            {formatVND(item.unitPrice)}
                          </span>
                          {item.batch && (
                            <span className="px-2 py-0.5 rounded bg-orange-50 text-[#F37021] border border-orange-200 font-mono text-[10px] font-bold">
                              FEFO: {item.batch.batchCode} (EXP:{' '}
                              {new Date(item.batch.expiresAt).toLocaleDateString('vi-VN')})
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-[#231812] tabular-nums shrink-0">
                        {formatVND(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer: Total & Quick Status Switch */}
            <div className="p-5 border-t border-stone-200 bg-[#F8F7F4] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">
                  {locale === 'en' ? 'Grand Total' : 'Tổng thanh toán'}
                </span>
                <span className="text-lg font-black text-[#F37021] tabular-nums">
                  {formatVND(selectedOrder.totalAmount)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                {getNextActions(selectedOrder.status).map((act) => (
                  <button
                    key={act.target}
                    type="button"
                    disabled={updatingOrderId === selectedOrder.id}
                    onClick={() =>
                      updateStatusMutation.mutate({
                        orderId: selectedOrder.id,
                        status: act.target,
                      })
                    }
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                      act.variant === 'primary'
                        ? 'bg-[#F37021] hover:bg-[#D95D14] text-white shadow-md shadow-[#F37021]/20'
                        : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    <span>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
