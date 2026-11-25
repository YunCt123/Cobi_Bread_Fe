'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ClipboardList,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Clock,
  CheckCircle2,
  UserCheck,
  ArrowRight,
  Truck,
  Store,
  XCircle,
  Loader2,
  RefreshCw,
  LogIn,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { useAuthStore } from '@/stores/auth.store';
import { formatVND } from '@/components/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedProductName,
  getLocalizedBranchName,
} from '@/i18n';

const STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  PAID: 'bg-sky-50 text-sky-800 border-sky-200',
  CONFIRMED: 'bg-blue-50 text-blue-800 border-blue-200',
  PROCESSING: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  SHIPPING: 'bg-orange-50 text-orange-800 border-orange-200',
  DELIVERED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

export default function AccountOrdersPage() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuthStore();
  const { t, locale } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'PENDING' | 'ACTIVE' | 'DELIVERED' | 'CANCELLED'
  >('ALL');
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    data: orders = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: ordersApi.getMyOrders,
    enabled: Boolean(mounted && isAuthenticated),
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId: string) => ordersApi.updateStatus(orderId, 'CANCELLED'),
    onSuccess: () => {
      setConfirmCancelId(null);
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-batches'] });
      showToast(t.ordersPage.cancelSuccessToast, 'success');
    },
    onError: (err: any) => {
      setConfirmCancelId(null);
      const msg = err?.response?.data?.message || t.ordersPage.cancelErrorToast;
      showToast(Array.isArray(msg) ? msg.join(', ') : msg, 'error');
    },
  });

  const visibleOrders = orders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return order.status === 'PENDING';
    if (statusFilter === 'DELIVERED') return order.status === 'DELIVERED';
    if (statusFilter === 'CANCELLED') return order.status === 'CANCELLED';
    return ['PAID', 'CONFIRMED', 'PROCESSING', 'SHIPPING'].includes(order.status);
  });

  const getDeliveryLabel = (deliveryType: Order['deliveryType']) => {
    if (deliveryType === 'EXPRESS_NOW') return t.checkoutPage.expressDeliveryName;
    if (deliveryType === 'SCHEDULED') return t.checkoutPage.scheduledDeliveryName;
    return t.checkoutPage.pickupMethodName;
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Toast */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-40 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold ${
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

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812]">{t.common.orders}</span>
        </nav>

        {/* Header Card */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F37021]">
                {t.ordersPage.eyebrow}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231812]">
                {t.ordersPage.title}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">{t.ordersPage.subtitle}</p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {mounted && isAuthenticated && (
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  <span>{t.ordersPage.refreshBtn}</span>
                </button>
              )}

              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold transition-colors shrink-0"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.ordersPage.ctaShop}</span>
              </Link>
            </div>
          </div>

          {/* Auth notice */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {mounted && isAuthenticated && user ? (
              <div className="flex items-center gap-2 text-stone-700">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.ordersPage.signedInAs}</span>
                <strong className="text-[#231812]">
                  {user.fullName} ({user.email})
                </strong>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-stone-600">
                <span>{t.ordersPage.signInPrompt}</span>
                <Link
                  href="/login?redirect=/account/orders"
                  className="font-bold text-[#F37021] hover:underline inline-flex items-center gap-1"
                >
                  <span>{t.ordersPage.loginNowBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Unauthenticated State */}
        {mounted && !isAuthenticated ? (
          <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-orange-50 text-[#F37021] flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold text-[#231812]">
                {t.checkoutPage.loginRequiredTitle}
              </h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                {t.ordersPage.signInPrompt}
              </p>
            </div>
            <Link
              href="/login?redirect=/account/orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#231812] hover:bg-black text-white text-xs font-bold transition-colors"
            >
              <span>{t.ordersPage.loginNowBtn}</span>
              <ArrowRight className="w-4 h-4 text-[#F37021]" />
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'ALL' as const, label: t.ordersPage.filterAll },
                { id: 'PENDING' as const, label: t.ordersPage.filterPending },
                { id: 'ACTIVE' as const, label: t.ordersPage.filterConfirmed },
                { id: 'DELIVERED' as const, label: t.ordersPage.filterDelivered },
                { id: 'CANCELLED' as const, label: t.ordersPage.filterCancelled },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                    statusFilter === tab.id
                      ? 'bg-[#231812] text-white border-[#231812]'
                      : 'bg-white text-stone-700 border-stone-200 hover:border-[#F37021] hover:text-[#F37021]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Loading / Error / Orders */}
            {!mounted || isLoading ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center flex flex-col items-center gap-3 text-stone-500">
                <Loader2 className="w-7 h-7 animate-spin text-[#F37021]" />
                <span className="text-xs font-semibold">{t.common.loading}</span>
              </div>
            ) : isError ? (
              <div className="bg-white rounded-3xl border border-red-200 p-8 text-center text-xs text-red-700 space-y-3">
                <p>{t.ordersPage.errorLoading}</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold cursor-pointer"
                >
                  {t.ordersPage.refreshBtn}
                </button>
              </div>
            ) : visibleOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-orange-50 text-[#F37021] flex items-center justify-center mx-auto">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-[#231812]">
                    {t.ordersPage.emptyTitle}
                  </h2>
                  <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                    {t.ordersPage.emptyDesc}
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold transition-colors"
                >
                  <span>{t.ordersPage.ctaShop}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {visibleOrders.map((order) => {
                  const statusClass =
                    STATUS_BADGE_CLASSES[order.status] ||
                    'bg-stone-100 text-stone-700 border-stone-200';
                  const statusLabel = t.ordersPage.statuses[order.status] || order.status;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4"
                    >
                      {/* Top Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-stone-100">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="text-xs font-mono font-bold text-[#F37021] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                            {t.ordersPage.orderCode}: {order.orderCode}
                          </span>
                          <span className="text-xs text-stone-500">
                            {new Date(order.createdAt).toLocaleString(
                              locale === 'en' ? 'en-US' : 'vi-VN'
                            )}
                          </span>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusClass}`}
                        >
                          {order.status === 'DELIVERED' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : order.status === 'CANCELLED' ? (
                            <XCircle className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          <span>{statusLabel}</span>
                        </span>
                      </div>

                      {/* Order Meta */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#FAF7F2] rounded-2xl p-3.5 border border-stone-200/60">
                        <div className="flex items-center gap-2 text-stone-700">
                          <MapPin className="w-4 h-4 text-[#F37021] shrink-0" />
                          <span className="shrink-0">{t.ordersPage.branchLabel}</span>
                          <strong className="text-[#231812] truncate">
                            {order.branch
                              ? getLocalizedBranchName(order.branch, locale)
                              : 'Cobi Bread'}
                          </strong>
                        </div>
                        <div className="flex items-center gap-2 text-stone-700">
                          {order.deliveryType === 'PICKUP' ? (
                            <Store className="w-4 h-4 text-[#F37021] shrink-0" />
                          ) : (
                            <Truck className="w-4 h-4 text-[#F37021] shrink-0" />
                          )}
                          <span className="shrink-0">{t.ordersPage.methodLabel}</span>
                          <strong className="text-[#231812] truncate">
                            {getDeliveryLabel(order.deliveryType)}
                          </strong>
                        </div>
                        <div className="flex items-center gap-2 text-stone-700">
                          <CreditCard className="w-4 h-4 text-[#F37021] shrink-0" />
                          <span className="shrink-0">{t.ordersPage.paymentLabel}</span>
                          <strong className="text-[#231812] truncate">
                            {order.paymentMethod} •{' '}
                            {order.paymentStatus === 'PAID'
                              ? t.ordersPage.paymentPaid
                              : t.ordersPage.paymentUnpaid}
                          </strong>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2.5">
                        {order.items.map((item) => {
                          const rawImg = item.product?.images;
                          const itemImg = Array.isArray(rawImg)
                            ? rawImg[0]
                            : typeof rawImg === 'string' && rawImg
                            ? rawImg
                            : BRAND_ASSETS.heroImage;
                          const itemName = item.product
                            ? getLocalizedProductName(item.product, locale)
                            : item.productId;

                          return (
                            <div key={item.id} className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={itemImg}
                                  alt={itemName}
                                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-[#231812] truncate">
                                    {itemName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-[11px] text-stone-600 font-medium">
                                      x{item.quantity} • {formatVND(item.unitPrice)}
                                    </span>
                                    {item.batch?.batchCode && (
                                      <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200">
                                        {t.ordersPage.batchLabel} {item.batch.batchCode}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-[#231812] shrink-0">
                                {formatVND(item.unitPrice * item.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer Total + Cancel Action */}
                      <div className="pt-3.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-stone-600">
                            {t.ordersPage.totalPaid}
                          </span>
                          <span className="text-base font-black text-[#F37021]">
                            {formatVND(order.totalAmount)}
                          </span>
                        </div>

                        {order.status === 'PENDING' && (
                          <div>
                            {confirmCancelId === order.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-red-700 font-medium">
                                  {t.ordersPage.cancelConfirmText}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setConfirmCancelId(null)}
                                  className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
                                >
                                  {t.common.close}
                                </button>
                                <button
                                  type="button"
                                  disabled={cancelMutation.isPending}
                                  onClick={() => cancelMutation.mutate(order.id)}
                                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1"
                                >
                                  {cancelMutation.isPending && (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  )}
                                  <span>{t.ordersPage.cancelOrderBtn}</span>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmCancelId(order.id)}
                                className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{t.ordersPage.cancelOrderBtn}</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
