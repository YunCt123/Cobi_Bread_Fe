'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  MapPin,
  Truck,
  Store,
  CheckCircle2,
  Snowflake,
  ShoppingBag,
  ArrowRight,
  CreditCard,
  ClipboardList,
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useBranchStore } from '@/stores/branch.store';
import { useAuthStore } from '@/stores/auth.store';
import { useOrdersStore } from '@/stores/orders.store';
import { formatVND, getStorageBadge } from '@/components/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

export default function CheckoutPage() {
  const { items, getTotalPrice, hasMixedStorage, clearCart } = useCartStore();
  const { selectedBranch } = useBranchStore();
  const { user } = useAuthStore();
  const { addOrder } = useOrdersStore();
  const { t, locale } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [submittedTotal, setSubmittedTotal] = useState(0);
  const [submittedOrderId, setSubmittedOrderId] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user?.fullName && !fullName) {
      setFullName(user.fullName);
    }
  }, [user?.fullName, fullName]);

  const safeItems = mounted ? items : [];
  const subtotal = mounted ? getTotalPrice() : 0;
  const isMixed = mounted ? hasMixedStorage() : false;
  const shippingFee = deliveryMethod === 'DELIVERY' ? 25000 : 0;
  const total = subtotal + shippingFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `COBI-${Date.now().toString().slice(-6)}`;
    addOrder({
      id: orderId,
      createdAt: new Date().toISOString(),
      fullName,
      phone,
      address: deliveryMethod === 'DELIVERY' ? address : selectedBranch?.address,
      note: note || undefined,
      deliveryMethod,
      paymentMethod: 'COD',
      branchName: selectedBranch?.name,
      subtotal,
      shippingFee,
      total,
      status: 'PENDING',
      items: safeItems.map((entry) => ({
        productId: entry.product.id,
        name: entry.product.name,
        slug: entry.product.slug,
        price: entry.product.price,
        quantity: entry.quantity,
        storageType: entry.product.storageType,
        image:
          entry.product.images && entry.product.images.length > 0
            ? entry.product.images[0]
            : BRAND_ASSETS.heroImage,
      })),
    });

    setSubmittedOrderId(orderId);
    setSubmittedTotal(total);
    setOrderSubmitted(true);
    clearCart();
  };

  if (orderSubmitted) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-5 border border-stone-200 shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-orange-50 text-[#F37021] text-xs font-mono font-bold border border-orange-200">
              #{submittedOrderId}
            </span>
            <h1 className="font-display text-2xl font-bold text-[#231812]">
              {t.checkoutPage.successTitle}
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed">
              {t.checkoutPage.successDescPrefix}{' '}
              <strong className="text-[#F37021]">{t.common.brandName}</strong>.{' '}
              {t.checkoutPage.successDescMid}{' '}
              <strong className="text-[#231812]">
                {selectedBranch?.name || t.checkoutPage.nearestBranch}
              </strong>{' '}
              {t.checkoutPage.successDescSuffix}
            </p>
          </div>

          <div className="bg-[#FAF7F2] rounded-2xl p-4 text-xs text-stone-700 space-y-1.5 text-left border border-stone-200/80">
            <div className="flex justify-between">
              <span className="text-stone-500">{t.checkoutPage.recipientLabel}</span>
              <span className="font-bold">{fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.checkoutPage.phoneLabel}</span>
              <span className="font-bold">{phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">{t.checkoutPage.methodLabel}</span>
              <span className="font-bold">
                {deliveryMethod === 'DELIVERY'
                  ? t.checkoutPage.deliveryMethodName
                  : t.checkoutPage.pickupMethodName}
              </span>
            </div>
            <div className="flex justify-between pt-1.5 border-t border-stone-200">
              <span className="text-stone-500 font-bold">{t.checkoutPage.totalLabel}</span>
              <span className="font-black text-[#F37021] text-sm">{formatVND(submittedTotal)}</span>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Customer & Delivery Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            {isMixed && (
              <div className="bg-cyan-50/90 border border-cyan-200 rounded-2xl p-4 flex items-start gap-3">
                <Snowflake className="w-5 h-5 text-cyan-700 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-950 space-y-1">
                  <span className="font-bold block">{t.checkoutPage.mixedTitle}</span>
                  <p className="leading-relaxed text-cyan-900">{t.checkoutPage.mixedDesc}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {t.checkoutPage.receiveMethodHeading}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('DELIVERY')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                      deliveryMethod === 'DELIVERY'
                        ? 'border-[#F37021] bg-orange-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Truck
                      className={`w-5 h-5 ${
                        deliveryMethod === 'DELIVERY' ? 'text-[#F37021]' : 'text-stone-400'
                      }`}
                    />
                    <div>
                      <span className="text-xs font-bold text-[#231812] block">
                        {t.checkoutPage.deliveryMethodName}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        {formatVND(25000)}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('PICKUP')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                      deliveryMethod === 'PICKUP'
                        ? 'border-[#F37021] bg-orange-50/50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <Store
                      className={`w-5 h-5 ${
                        deliveryMethod === 'PICKUP' ? 'text-[#F37021]' : 'text-stone-400'
                      }`}
                    />
                    <div>
                      <span className="text-xs font-bold text-[#231812] block">
                        {t.checkoutPage.pickupMethodName}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {t.checkoutPage.freePickup}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Branch summary */}
              {selectedBranch && (
                <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-stone-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="w-4 h-4 text-[#F37021] shrink-0" />
                    <span className="text-stone-500">{t.checkoutPage.handlingBranch}</span>
                    <strong className="text-[#231812] truncate">{selectedBranch.name}</strong>
                  </div>
                  <Link href="/stores" className="text-[#F37021] font-bold hover:underline shrink-0">
                    {t.common.change}
                  </Link>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t.checkoutPage.fullNameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.checkoutPage.fullNamePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#F37021]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t.checkoutPage.phoneInputLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xx xxx xxx"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#F37021]"
                    />
                  </div>
                </div>

                {deliveryMethod === 'DELIVERY' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t.checkoutPage.addressLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t.checkoutPage.addressPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#F37021]"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700">
                    {t.checkoutPage.noteLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t.checkoutPage.notePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-[#FAF7F2] text-sm focus:outline-none focus:border-[#F37021]"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-2 border-t border-stone-100 space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                  {t.checkoutPage.paymentMethodLabel}
                </label>
                <div className="p-3.5 rounded-2xl border border-[#F37021] bg-orange-50/40 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-[#F37021] shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-[#231812] block">
                      {t.checkoutPage.codTitle}
                    </span>
                    <span className="text-[11px] text-stone-500">{t.checkoutPage.codDesc}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-base shadow-lg shadow-[#F37021]/25 transition-all cursor-pointer lg:hidden"
            >
              {t.checkoutPage.confirmBtn} ({formatVND(total)})
            </button>
          </form>

          {/* RIGHT: Order Summary Sticky */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-7 shadow-xs space-y-5 sticky top-24">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
                <h2 className="font-display text-lg font-bold text-[#231812]">
                  {t.checkoutPage.summaryHeading} ({safeItems.length} {t.cart.itemsUnit})
                </h2>
              </div>

              <div className="space-y-3.5 max-h-80 overflow-y-auto pr-1">
                {safeItems.map(({ product, quantity }) => {
                  const badge = getStorageBadge(product.storageType, locale);
                  const img =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : BRAND_ASSETS.heroImage;
                  return (
                    <div key={product.id} className="flex items-center gap-3">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#231812] truncate">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${badge.className}`}
                          >
                            {badge.shortLabel}
                          </span>
                          <span className="text-[11px] text-stone-500">x{quantity}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#231812] shrink-0">
                        {formatVND(product.price * quantity)}
                      </span>
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
                    {deliveryMethod === 'PICKUP'
                      ? t.checkoutPage.freePickup
                      : formatVND(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#231812] pt-3 border-t border-stone-200">
                  <span>{t.checkoutPage.grandTotal}</span>
                  <span className="text-[#F37021]">{formatVND(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  const form = e.currentTarget.closest('.grid')?.querySelector('form');
                  form?.requestSubmit();
                }}
                className="hidden lg:flex w-full py-3.5 px-6 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-sm shadow-lg shadow-[#F37021]/25 transition-all items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t.checkoutPage.confirmBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
