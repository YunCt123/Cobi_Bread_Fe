'use client';

import { useMounted } from '@/hooks/useMounted';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  AlertTriangle, 
  ArrowRight, 
  Store
} from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useBranchStore } from '@/stores/branch.store';
import { formatVND, getStorageBadge } from '@/components/storefront/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import { useTranslation, getLocalizedProductName, getLocalizedBranchName } from '@/i18n';

export default function CartDrawer() {
  const router = useRouter();
  const { 
    items, 
    isOpen, 
    closeCart, 
    updateQuantity, 
    removeItem, 
    clearCart,
    getTotalItems, 
    getTotalPrice, 
    hasMixedStorage 
  } = useCartStore();

  const { selectedBranch } = useBranchStore();
  const { t, locale } = useTranslation();
  const mounted = useMounted();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  if (!mounted || !isOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const isMixed = hasMixedStorage();

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#231812] text-[#FAF7F2] flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#231812] leading-tight">
                {t.cart.title}
              </h2>
              <span className="text-xs text-stone-500">
                {totalItems} {t.cart.selectedCountSuffix}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] font-semibold text-stone-600 hover:text-red-700 p-2 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title={t.cart.clearAll}
              >
                {t.cart.clearAll}
              </button>
            )}
            <button
              type="button"
              onClick={closeCart}
              aria-label={t.common.close}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Selected Branch Indicator */}
        {selectedBranch && (
          <div className="px-5 py-2.5 bg-orange-50/80 border-b border-orange-100/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-stone-700">
              <Store className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
              <span className="truncate max-w-[240px]">
                {t.cart.deliveringFrom}{' '}
                <strong>{getLocalizedBranchName(selectedBranch, locale)}</strong>
              </span>
            </div>
            <Link 
              href="/stores" 
              onClick={closeCart}
              className="text-[#F37021] font-bold hover:underline shrink-0 text-[11px]"
            >
              {t.common.changeBranch}
            </Link>
          </div>
        )}

        {/* Mixed Storage Warning Alert Banner */}
        {isMixed && (
          <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-[#231812] text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block font-bold text-[#D95D14] mb-0.5">
                {t.cart.mixedTitle}
              </strong>
              {t.cart.mixedBodyPre} <strong>{t.cart.mixedFresh}</strong> {t.cart.mixedAnd}{' '}
              <strong>{t.cart.mixedFrozen}</strong>. {t.cart.mixedBodyPost}
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-[#FAF7F2] text-[#F37021] flex items-center justify-center border border-orange-100 shadow-2xs">
                <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-[#231812]">
                  {t.cart.emptyTitle}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  {t.cart.emptyDesc}
                </p>
              </div>
              <Link
                href="/products"
                onClick={closeCart}
                className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-xs shadow-md shadow-[#F37021]/20 transition-all flex items-center gap-1.5"
              >
                <span>{t.cart.exploreMenu}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            items.map((item) => {
              const storageInfo = getStorageBadge(item.storageType, locale);
              const img = item.image || BRAND_ASSETS.heroImage;
              const itemName = getLocalizedProductName(item, locale);

              return (
                <div key={item.productId} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  <img
                    src={img}
                    alt={itemName}
                    className="w-18 h-18 rounded-2xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={closeCart}
                        className="text-xs font-bold text-[#231812] hover:text-[#F37021] transition-colors line-clamp-2 leading-snug"
                      >
                        {itemName}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title={t.cart.removeItem}
                        aria-label={t.cart.removeItem}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${storageInfo.className}`}>
                        {storageInfo.icon}
                        <span>
                          {item.storageType === 'FRESH'
                            ? '0-10°C'
                            : item.storageType === 'FROZEN'
                            ? '-18°C'
                            : t.storage.ambientShort}
                        </span>
                      </span>
                      {item.netWeightG && (
                        <span className="text-[10px] font-mono text-stone-600">
                          {item.netWeightG}g
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs font-bold text-[#F37021]">
                        {formatVND(item.price * item.quantity)}
                      </span>

                      <div className="flex items-center border border-stone-200 rounded-lg bg-[#FAF7F2] overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="p-1 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold text-xs text-[#231812]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="p-1 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-[#FAF7F2] space-y-3.5">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{t.cart.subtotalLabel} ({totalItems} {t.cart.itemsUnit})</span>
                <span className="font-semibold text-[#231812]">{formatVND(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t.cart.shippingFeeLabel}</span>
                <span className="text-emerald-700 font-medium">{t.cart.shippingCalculatedNext}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#231812] pt-2 border-t border-stone-200">
                <span>{t.cart.totalPayment}</span>
                <span className="text-base text-[#F37021]">{formatVND(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-sm shadow-md shadow-[#F37021]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t.cart.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={closeCart}
              className="w-full text-center text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              {t.cart.continueShopping}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
