'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronRight,
  MapPin,
  Truck,
  Store,
  Clock,
  Zap,
  CheckCircle2,
  Snowflake,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  ClipboardList,
  AlertTriangle,
  AlertCircle,
  Loader2,
  LogIn,
  PackageCheck,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useBranchStore } from '@/stores/branch.store';
import { useAuthStore } from '@/stores/auth.store';
import { branchesApi, inventoryApi, ordersApi } from '@/lib/api';
import {
  Branch,
  DeliveryType,
  Order,
  PaymentMethod,
  ProductAvailability,
} from '@/types';
import { formatVND, getStorageBadge } from '@/components/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedProductName,
  getLocalizedBranchName,
  getLocalizedBranchAddress,
} from '@/i18n';

export default function CheckoutPage() {
  const queryClient = useQueryClient();
  const { items, getTotalPrice, hasMixedStorage, clearCart } = useCartStore();
  const { selectedBranch, setSelectedBranch } = useBranchStore();
  const { user, isAuthenticated } = useAuthStore();
  const { t, locale } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('EXPRESS_NOW');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [serverError, setServerError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch branches in current locale in case none selected yet
  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
  });

  useEffect(() => {
    if (mounted && branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [mounted, branches, selectedBranch, setSelectedBranch]);

  const activeBranch = mounted ? selectedBranch || branches[0] || null : null;
  const safeItems = mounted ? items : [];
  const subtotal = mounted ? getTotalPrice() : 0;
  const isMixed = mounted ? hasMixedStorage() : false;
  const shippingFee = deliveryType === 'PICKUP' ? 0 : 25000;
  const displayTotal = subtotal + shippingFee;

  // Live Inventory Availability Check for each item at selected branch
  const itemIdsSignature = safeItems.map((i) => `${i.productId}:${i.quantity}`).join(',');
  const { data: availabilityMap = {}, isFetching: isCheckingStock } = useQuery<
    Record<string, ProductAvailability | null>
  >({
    queryKey: ['checkout-availability', activeBranch?.id, itemIdsSignature],
    enabled: Boolean(mounted && activeBranch?.id && safeItems.length > 0),
    queryFn: async () => {
      if (!activeBranch) return {};
      const entries = await Promise.all(
        safeItems.map(async (item) => {
          try {
            const avail = await inventoryApi.getAvailability(activeBranch.id, item.productId);
            return [item.productId, avail] as const;
          } catch {
            return [item.productId, null] as const;
          }
        })
      );
      return Object.fromEntries(entries);
    },
  });

  const stockIssues = useMemo(() => {
    if (!activeBranch || Object.keys(availabilityMap).length === 0) return {};
    const map: Record<string, { available: number; insufficient: boolean }> = {};
    safeItems.forEach((item) => {
      const availObj = availabilityMap[item.productId];
      if (availObj) {
        map[item.productId] = {
          available: availObj.totalAvailable,
          insufficient: availObj.totalAvailable < item.quantity,
        };
      }
    });
    return map;
  }, [activeBranch, availabilityMap, safeItems]);

  const hasStockError = Object.values(stockIssues).some((s) => s.insufficient);

  // React Hook Form + Zod schema
  const checkoutSchema = useMemo(
    () =>
      z
        .object({
          recipientName: z.string().trim().min(2, t.checkoutPage.validationName),
          phone: z
            .string()
            .trim()
            .regex(/^[0-9+\-\s]{9,15}$/, t.checkoutPage.validationPhone),
          address: z.string().trim().optional(),
          note: z.string().trim().optional(),
        })
        .superRefine((vals, ctx) => {
          if (deliveryType !== 'PICKUP' && (!vals.address || vals.address.trim().length < 5)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['address'],
              message: t.checkoutPage.validationAddress,
            });
          }
        }),
    [deliveryType, t]
  );

  type CheckoutFormValues = z.infer<typeof checkoutSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      recipientName: '',
      phone: '',
      address: '',
      note: '',
    },
  });

  useEffect(() => {
    if (mounted && user?.fullName) {
      setValue('recipientName', user.fullName);
    }
  }, [mounted, user?.fullName, setValue]);

  const createOrderMutation = useMutation({
    mutationFn: (values: CheckoutFormValues) => {
      if (!activeBranch) {
        throw new Error('Branch is required');
      }
      const branchLabel = getLocalizedBranchName(activeBranch, locale);
      const branchAddr = getLocalizedBranchAddress(activeBranch, locale);
      return ordersApi.create({
        branchId: activeBranch.id,
        items: safeItems.map((entry) => ({
          productId: entry.productId,
          quantity: entry.quantity,
        })),
        paymentMethod,
        deliveryType,
        shippingAddress: {
          recipientName: values.recipientName.trim(),
          phone: values.phone.trim(),
          address:
            deliveryType === 'PICKUP'
              ? `${t.checkoutPage.pickupMethodName}: ${branchLabel} (${branchAddr})`
              : (values.address || '').trim(),
        },
        note: values.note?.trim() || undefined,
      });
    },
    onSuccess: (order) => {
      setCreatedOrder(order);
      clearCart();
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-batches'] });
      queryClient.invalidateQueries({ queryKey: ['checkout-availability'] });
    },
    onError: (err: any) => {
      const rawMsg = err?.response?.data?.message || err?.message;
      const msg = Array.isArray(rawMsg) ? rawMsg.join(', ') : rawMsg;
      setServerError(msg || t.checkoutPage.orderErrorFallback);
    },
  });

  const onSubmit = (values: CheckoutFormValues) => {
    setServerError(null);
    if (!isAuthenticated) {
      setServerError(t.checkoutPage.loginRequiredDesc);
      return;
    }
    if (!activeBranch || hasStockError) {
      setServerError(t.checkoutPage.stockErrorNotice);
      return;
    }
    createOrderMutation.mutate(values);
  };

  const getDeliveryName = (dt: DeliveryType) => {
    if (dt === 'EXPRESS_NOW') return t.checkoutPage.expressDeliveryName;
    if (dt === 'SCHEDULED') return t.checkoutPage.scheduledDeliveryName;
    return t.checkoutPage.pickupMethodName;
  };

  if (createdOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-5 border border-stone-200 shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="inline-block px-3.5 py-1 rounded-full bg-orange-50 text-[#F37021] text-xs font-mono font-bold border border-orange-200">
              {createdOrder.orderCode}
            </span>
            <h1 className="font-display text-2xl font-bold text-[#231812]">
              {t.checkoutPage.successTitle}
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              {t.checkoutPage.successDescPrefix}{' '}
              <strong className="text-[#F37021]">{t.common.brandName}</strong>.{' '}
              {t.checkoutPage.successDescMid}{' '}
              <strong className="text-[#231812]">
                {createdOrder.branch
                  ? getLocalizedBranchName(createdOrder.branch, locale)
                  : activeBranch
                  ? getLocalizedBranchName(activeBranch, locale)
                  : t.checkoutPage.nearestBranch}
              </strong>{' '}
              {t.checkoutPage.successDescSuffix}
            </p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-4 text-xs text-stone-700 space-y-2 text-left border border-stone-200/80">
            <div className="flex justify-between">
              <span className="text-stone-500">{t.checkoutPage.recipientLabel}</span>
              <span className="font-bold">{createdOrder.shippingAddress.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.checkoutPage.phoneLabel}</span>
              <span className="font-bold">{createdOrder.shippingAddress.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.checkoutPage.methodLabel}</span>
              <span className="font-bold">{getDeliveryName(createdOrder.deliveryType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.checkoutPage.paymentSelectedLabel}</span>
              <span className="font-bold font-mono">{createdOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200">
              <span className="text-stone-500 font-bold">{t.checkoutPage.totalLabel}</span>
              <span className="font-black text-[#F37021] text-sm">
                {formatVND(createdOrder.totalAmount)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link
              href="/account/orders"
              className="flex-1 py-3.5 px-5 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" />
              <span>{t.checkoutPage.viewOrdersBtn}</span>
            </Link>

            <Link
              href="/"
              className="flex-1 py-3.5 px-5 rounded-2xl bg-[#231812] hover:bg-stone-800 text-white font-bold text-sm transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>{t.common.backToHome}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (mounted && safeItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 border border-stone-200 shadow-xs">
          <div className="w-16 h-16 bg-orange-50 text-[#F37021] rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#231812]">
            {t.checkoutPage.emptyTitle}
          </h2>
          <p className="text-xs text-stone-500">{t.checkoutPage.emptyDesc}</p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-[#F37021] text-white text-xs font-bold hover:bg-[#D95D14]"
          >
            {t.checkoutPage.viewMenuBtn}
          </Link>
        </div>
      </div>
    );
  }

  const deliveryOptions: {
    id: DeliveryType;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'EXPRESS_NOW',
      title: t.checkoutPage.expressTitle,
      desc: t.checkoutPage.expressDesc,
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'SCHEDULED',
      title: t.checkoutPage.scheduledTitle,
      desc: t.checkoutPage.scheduledDesc,
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'PICKUP',
      title: t.checkoutPage.pickupTitle,
      desc: t.checkoutPage.pickupDesc,
      icon: <Store className="w-4 h-4" />,
    },
  ];

  const paymentOptions: {
    id: PaymentMethod;
    title: string;
    desc: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'COD',
      title: t.checkoutPage.codTitle,
      desc: t.checkoutPage.codDesc,
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      id: 'BANK_TRANSFER',
      title: t.checkoutPage.bankTitle,
      desc: t.checkoutPage.bankDesc,
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      id: 'MOMO',
      title: t.checkoutPage.momoTitle,
      desc: t.checkoutPage.momoDesc,
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: 'VNPAY',
      title: t.checkoutPage.vnpayTitle,
      desc: t.checkoutPage.vnpayDesc,
      icon: <CreditCard className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#F37021]">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-[#F37021]">
            {t.common.products}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812]">{t.checkoutPage.breadcrumb}</span>
        </nav>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231812]">
          {t.checkoutPage.title}
        </h1>

        {/* Auth Reminder Alert */}
        {mounted && !isAuthenticated && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-950 space-y-0.5">
                <strong className="block font-bold">{t.checkoutPage.loginRequiredTitle}</strong>
                <p className="text-amber-900">{t.checkoutPage.loginRequiredDesc}</p>
              </div>
            </div>
            <Link
              href="/login?redirect=/checkout"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#231812] hover:bg-black text-white text-xs font-bold shrink-0 self-start sm:self-center"
            >
              <LogIn className="w-3.5 h-3.5 text-[#F37021]" />
              <span>{t.checkoutPage.loginToCheckoutBtn}</span>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Customer & Delivery Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 space-y-6">
            {isMixed && (
              <div className="bg-cyan-50/90 border border-cyan-200 rounded-2xl p-4 flex items-start gap-3">
                <Snowflake className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-950 space-y-1">
                  <span className="font-bold block">{t.checkoutPage.mixedTitle}</span>
                  <p className="leading-relaxed text-cyan-900">{t.checkoutPage.mixedDesc}</p>
                </div>
              </div>
            )}

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 flex items-start gap-2.5 text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Branch summary */}
              {activeBranch && (
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-stone-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <MapPin className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="text-stone-500 block">{t.checkoutPage.handlingBranch}</span>
                      <strong className="text-[#231812] block truncate">
                        {getLocalizedBranchName(activeBranch, locale)}
                      </strong>
                      <span className="text-[11px] text-stone-500 block truncate">
                        {getLocalizedBranchAddress(activeBranch, locale)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/stores"
                    className="text-[#F37021] font-bold hover:underline shrink-0 px-2 py-1"
                  >
                    {t.common.change}
                  </Link>
                </div>
              )}

              {/* Delivery Types (EXPRESS_NOW / SCHEDULED / PICKUP) */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {t.checkoutPage.receiveMethodHeading}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {deliveryOptions.map((opt) => {
                    const isSelected = deliveryType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setDeliveryType(opt.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isSelected
                            ? 'border-[#F37021] bg-orange-50/50'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={isSelected ? 'text-[#F37021]' : 'text-stone-400'}>
                            {opt.icon}
                          </span>
                          <span className="text-xs font-bold text-[#231812]">{opt.title}</span>
                        </div>
                        <span className="text-[11px] text-stone-500 leading-snug">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customer Inputs (React Hook Form) */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t.checkoutPage.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      {...register('recipientName')}
                      placeholder={t.checkoutPage.fullNamePlaceholder}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FAF7F2] text-sm focus:outline-none ${
                        errors.recipientName
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-stone-200 focus:border-[#F37021]'
                      }`}
                    />
                    {errors.recipientName && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {errors.recipientName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t.checkoutPage.phoneInputLabel}
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="09xx xxx xxx"
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FAF7F2] text-sm focus:outline-none ${
                        errors.phone
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-stone-200 focus:border-[#F37021]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-600 font-medium">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {deliveryType !== 'PICKUP' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t.checkoutPage.addressLabel}
                    </label>
                    <input
                      type="text"
                      {...register('address')}
                      placeholder={t.checkoutPage.addressPlaceholder}
                      className={`w-full px-3.5 py-2.5 rounded-xl border bg-[#FAF7F2] text-sm focus:outline-none ${
                        errors.address
                          ? 'border-red-400 focus:border-red-500'
                          : 'border-stone-200 focus:border-[#F37021]'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-red-600 font-medium">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.checkoutPage.noteLabel}
                  </label>
                  <textarea
                    rows={2}
                    {...register('note')}
                    placeholder={t.checkoutPage.notePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              {/* Payment Methods (COD / BANK_TRANSFER / MOMO / VNPAY) */}
              <div className="pt-2 border-t border-stone-100 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {t.checkoutPage.paymentMethodLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentOptions.map((pm) => {
                    const isSelected = paymentMethod === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'border-[#F37021] bg-orange-50/40'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <span
                          className={`mt-0.5 shrink-0 ${
                            isSelected ? 'text-[#F37021]' : 'text-stone-400'
                          }`}
                        >
                          {pm.icon}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-[#231812] block">{pm.title}</span>
                          <span className="text-[11px] text-stone-500 leading-snug block mt-0.5">
                            {pm.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                createOrderMutation.isPending || !isAuthenticated || hasStockError || isCheckingStock
              }
              className="w-full py-4 px-6 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold text-base shadow-lg shadow-[#F37021]/25 transition-all cursor-pointer lg:hidden flex items-center justify-center gap-2"
            >
              {createOrderMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {createOrderMutation.isPending
                  ? t.checkoutPage.submittingBtn
                  : `${t.checkoutPage.confirmBtn} (${formatVND(displayTotal)})`}
              </span>
            </button>
          </form>

          {/* RIGHT: Order Summary Sticky */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-7 shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <h2 className="font-display text-lg font-bold text-[#231812]">
                  {t.checkoutPage.summaryHeading} ({safeItems.length} {t.cart.itemsUnit})
                </h2>
                {isCheckingStock && (
                  <span className="text-[11px] text-stone-500 inline-flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-[#F37021]" />
                    {t.checkoutPage.checkingStock}
                  </span>
                )}
              </div>

              {hasStockError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{t.checkoutPage.stockErrorNotice}</span>
                </div>
              )}

              <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                {safeItems.map((item) => {
                  const badge = getStorageBadge(item.storageType, locale);
                  const img = item.image || BRAND_ASSETS.heroImage;
                  const itemName = getLocalizedProductName(item, locale);
                  const stockInfo = stockIssues[item.productId];

                  return (
                    <div key={item.productId} className="space-y-1.5 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <img
                          src={img}
                          alt={itemName}
                          className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#231812] truncate">{itemName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badge.className}`}
                            >
                              {badge.shortLabel}
                            </span>
                            <span className="text-[11px] text-stone-500">x{item.quantity}</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#231812] shrink-0">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </div>

                      {stockInfo && (
                        <div className="pl-17 text-[11px]">
                          {stockInfo.available === 0 ? (
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {t.checkoutPage.outOfStockBranch}
                            </span>
                          ) : stockInfo.insufficient ? (
                            <span className="text-red-600 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {t.checkoutPage.insufficientStock} {stockInfo.available})
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-medium flex items-center gap-1">
                              <PackageCheck className="w-3 h-3" />
                              {t.checkoutPage.inStockLabel} {stockInfo.available}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{t.checkoutPage.subtotalBread}</span>
                  <span className="font-bold text-[#231812]">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t.checkoutPage.shippingFee}</span>
                  <span className="font-bold text-[#231812]">
                    {deliveryType === 'PICKUP'
                      ? t.checkoutPage.freePickup
                      : formatVND(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#231812] pt-3 border-t border-stone-200">
                  <span>{t.checkoutPage.grandTotal}</span>
                  <span className="text-[#F37021]">{formatVND(displayTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={
                  createOrderMutation.isPending || !isAuthenticated || hasStockError || isCheckingStock
                }
                onClick={(e) => {
                  const form = e.currentTarget.closest('.grid')?.querySelector('form');
                  form?.requestSubmit();
                }}
                className="hidden lg:flex w-full py-3.5 px-6 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] disabled:bg-stone-300 disabled:text-stone-500 text-white font-bold text-sm shadow-lg shadow-[#F37021]/25 transition-all items-center justify-center gap-2 cursor-pointer"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.checkoutPage.submittingBtn}</span>
                  </>
                ) : (
                  <>
                    <span>{t.checkoutPage.confirmBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
