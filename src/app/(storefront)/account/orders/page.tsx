'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import { useOrdersStore } from '@/stores/orders.store';
import { useAuthStore } from '@/stores/auth.store';
import { formatVND, getStorageBadge } from '@/components/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

export default function AccountOrdersPage() {
  const { orders } = useOrdersStore();
  const { user, isAuthenticated } = useAuthStore();
  const { t, locale } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED'>('ALL');

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleOrders = mounted
    ? orders.filter((order) => (statusFilter === 'ALL' ? true : order.status === statusFilter))
    : [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold transition-colors shrink-0 self-start sm:self-center"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.ordersPage.ctaShop}</span>
            </Link>
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
                  href="/login"
                  className="font-bold text-[#F37021] hover:underline inline-flex items-center gap-1"
                >
                  <span>{t.common.login}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL' as const, label: t.ordersPage.filterAll },
            { id: 'PENDING' as const, label: t.ordersPage.filterPending },
            { id: 'CONFIRMED' as const, label: t.ordersPage.filterCompleted },
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

        {/* Orders List or Empty */}
        {visibleOrders.length === 0 ? (
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
            {visibleOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-stone-100">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-mono font-bold text-[#F37021] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                      {t.ordersPage.orderCode}: #{order.id}
                    </span>
                    <span className="text-xs text-stone-500">
                      {new Date(order.createdAt).toLocaleString(
                        locale === 'en' ? 'en-US' : 'vi-VN'
                      )}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                      order.status === 'CONFIRMED'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {order.status === 'CONFIRMED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {order.status === 'CONFIRMED'
                        ? t.ordersPage.statusCompleted
                        : t.ordersPage.statusPending}
                    </span>
                  </span>
                </div>

                {/* Order Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#FAF7F2] rounded-2xl p-3.5 border border-stone-200/60">
                  <div className="flex items-center gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-[#F37021] shrink-0" />
                    <span>{t.ordersPage.branchLabel}</span>
                    <strong className="text-[#231812] truncate">
                      {order.branchName || 'Cobi Bread'}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2 text-stone-700">
                    {order.deliveryMethod === 'DELIVERY' ? (
                      <Truck className="w-4 h-4 text-[#F37021] shrink-0" />
                    ) : (
                      <Store className="w-4 h-4 text-[#F37021] shrink-0" />
                    )}
                    <span>{t.ordersPage.methodLabel}</span>
                    <strong className="text-[#231812]">
                      {order.deliveryMethod === 'DELIVERY'
                        ? t.checkoutPage.deliveryMethodName
                        : t.checkoutPage.pickupMethodName}
                    </strong>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {order.items.map((item) => {
                    const storage = getStorageBadge(item.storageType, locale);
                    return (
                      <div key={item.productId} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={item.image || BRAND_ASSETS.heroImage}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.slug}`}
                              className="text-xs font-bold text-[#231812] hover:text-[#F37021] truncate block"
                            >
                              {item.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${storage.className}`}
                              >
                                {storage.shortLabel}
                              </span>
                              <span className="text-[11px] text-stone-500">x{item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#231812] shrink-0">
                          {formatVND(item.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600">
                    {t.ordersPage.totalPaid}
                  </span>
                  <span className="text-base font-black text-[#F37021]">{formatVND(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
