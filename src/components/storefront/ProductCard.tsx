'use client';

import React from 'react';
import Link from 'next/link';
import { Thermometer, Snowflake, Sun, Scale, Plus } from 'lucide-react';
import { Product, StorageType } from '@/types';
import { useCartStore } from '@/stores/cart.store';
import { BRAND_ASSETS } from '@/data/cobi-content';
import {
  useTranslation,
  Locale,
  getLocalizedProductName,
  getLocalizedProductDescription,
  getLocalizedCategoryName,
} from '@/i18n';
import { vi } from '@/i18n/vi';
import { en } from '@/i18n/en';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function getStorageBadge(storageType: StorageType, locale: Locale = 'vi') {
  const dict = locale === 'en' ? en.storage : vi.storage;

  switch (storageType) {
    case 'FRESH':
      return {
        label: dict.freshFull,
        shortLabel: dict.freshShort,
        className: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
        icon: <Thermometer className="w-3 h-3 text-emerald-600" />,
      };
    case 'FROZEN':
      return {
        label: dict.frozenFull,
        shortLabel: dict.frozenShort,
        className: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
        icon: <Snowflake className="w-3 h-3 text-cyan-600" />,
      };
    case 'AMBIENT':
    default:
      return {
        label: dict.ambientFull,
        shortLabel: dict.ambientShort,
        className: 'bg-amber-50 text-amber-900 border-amber-200/80',
        icon: <Sun className="w-3 h-3 text-amber-600" />,
      };
  }
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { t, locale } = useTranslation();

  const storageInfo = getStorageBadge(product.storageType, locale);
  const isOutOfStock = product.isActive === false;

  const primaryImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : BRAND_ASSETS.heroImage;

  const categoryName = getLocalizedCategoryName(product.category, locale);
  const productTitle = getLocalizedProductName(product, locale);
  const productDesc = getLocalizedProductDescription(product, locale);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      addItem(product, 1);
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-stone-200/80 hover:border-[#F37021]/60 hover:shadow-xl hover:shadow-stone-900/5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Product Image & Badges Container */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={primaryImage}
          alt={productTitle}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
          {/* Storage Condition Badge */}
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-md ${storageInfo.className}`}>
            {storageInfo.icon}
            <span>{storageInfo.label}</span>
          </span>

          {/* Out of stock or B2B */}
          {isOutOfStock ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-white shadow-xs uppercase tracking-wider">
              {t.productCard.outOfStock}
            </span>
          ) : product.isB2b ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs uppercase tracking-wider">
              {t.productCard.b2bBadge}
            </span>
          ) : null}
        </div>

        {/* Net Weight Pill */}
        <div className="absolute bottom-3 right-3 pointer-events-none z-10">
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-stone-900/80 text-white backdrop-blur-xs">
            <Scale className="w-3 h-3 text-[#F37021]" />
            {product.netWeightG}g
          </span>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & SKU */}
          <div className="flex items-center justify-between gap-2 text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-[#D95D14] truncate text-[11px]">
              {categoryName}
            </span>
            <span className="font-mono text-[10px] text-stone-400 shrink-0">
              {product.sku}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm sm:text-base font-bold text-[#231812] group-hover:text-[#F37021] transition-colors line-clamp-2 leading-snug">
              {productTitle}
            </h3>
          </Link>

          {/* Short Description */}
          {productDesc && (
            <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {productDesc}
            </p>
          )}
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-3.5 border-t border-stone-100 flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
              {t.productCard.priceLabel}
            </span>
            <span className="text-base sm:text-lg font-black text-[#F37021] tracking-tight">
              {formatVND(product.price)}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className="px-3.5 py-2 rounded-xl bg-[#231812] hover:bg-[#F37021] disabled:bg-stone-200 disabled:text-stone-400 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.productCard.addCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
