'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronRight,
  Thermometer,
  Snowflake,
  Scale,
  Clock,
  ShoppingBag,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Minus,
  Plus,
  Loader2,
  Briefcase,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cart.store';
import { formatVND, getStorageBadge } from '@/components/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedProductName,
  getLocalizedProductDescription,
  getLocalizedProductIngredients,
  getLocalizedCategoryName,
} from '@/i18n';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addItem } = useCartStore();
  const { t, locale } = useTranslation();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const { data: product, isLoading, isError } = useQuery<Product>({
    queryKey: ['product', slug, locale],
    queryFn: () => productsApi.getBySlug(slug, locale),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#F37021]" />
          <p className="text-sm font-semibold">{t.productDetail.loadingText}</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center space-y-4 border border-stone-200 shadow-xs">
          <h2 className="font-display text-xl font-bold text-[#231812]">
            {t.productDetail.notFoundTitle}
          </h2>
          <p className="text-xs text-stone-500">{t.productDetail.notFoundDesc}</p>
          <Link
            href="/products"
            className="inline-block px-6 py-2.5 rounded-full bg-[#F37021] text-white text-xs font-bold hover:bg-[#D95D14]"
          >
            {t.productDetail.backToMenu}
          </Link>
        </div>
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0 ? product.images : [BRAND_ASSETS.heroImage];
  const storageInfo = getStorageBadge(product.storageType, locale);
  const nutrition = product.nutritionJson;
  const productName = getLocalizedProductName(product, locale);
  const productDesc = getLocalizedProductDescription(product, locale);
  const productIngredients = getLocalizedProductIngredients(product, locale);
  const categoryName = getLocalizedCategoryName(product.category, locale);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2500);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Toast feedback */}
        {addedFeedback && (
          <div className="fixed bottom-6 right-6 z-40 bg-[#231812] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-white/10 animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {t.productDetail.addedToastPrefix} {quantity} {t.productDetail.addedToastMid}{' '}
              {productName} {t.productDetail.addedToastSuffix}
            </span>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-[#F37021] transition-colors">
            {t.common.products}
          </Link>
          {product.category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                href={`/products?categorySlug=${product.category.slug}`}
                className="hover:text-[#F37021] transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812] truncate">{productName}</span>
        </nav>

        {/* Top Grid: Product Images + Main Overview */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* LEFT: Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60 relative">
                <img
                  src={images[selectedImageIdx]}
                  alt={productName}
                  className="w-full h-full object-cover object-center"
                />

                {/* Top Storage Badge overlay */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md ${storageInfo.className}`}
                  >
                    {storageInfo.icon}
                    <span>{storageInfo.label}</span>
                  </span>
                </div>
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIdx === idx
                          ? 'border-[#F37021] shadow-md scale-[1.02]'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Key Details & Add to Cart */}
            <div className="flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F37021] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                    {categoryName}
                  </span>
                  {product.isB2b && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                      <Briefcase className="w-3 h-3" />
                      <span>{t.productCard.b2bBadge}</span>
                    </span>
                  )}
                  <span className="text-xs font-mono text-stone-400">
                    {t.productDetail.skuPrefix} {product.sku}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231812] leading-tight">
                  {productName}
                </h1>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#F37021]">
                    {formatVND(product.price)}
                  </span>
                  <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                    <Scale className="w-3.5 h-3.5" />
                    {t.productDetail.netWeightLabel}{' '}
                    <strong className="text-[#231812]">{product.netWeightG}g</strong>
                  </span>
                </div>

                {productDesc && (
                  <p className="text-sm text-stone-600 leading-relaxed pt-2 border-t border-stone-100">
                    {productDesc}
                  </p>
                )}

                {/* Storage Guidelines Cards */}
                <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-stone-200/80 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#231812] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#F37021]" />
                    <span>{t.productDetail.storageGuideTitle}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {product.shelfLifeChilledDays && (
                      <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 flex items-start gap-2.5">
                        <Thermometer className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-emerald-900 block">
                            {t.productDetail.chilledTitle}
                          </span>
                          <span className="text-emerald-700">
                            {t.productDetail.chilledPre}{' '}
                            <strong>
                              {product.shelfLifeChilledDays} {t.productDetail.daysUnit}
                            </strong>
                          </span>
                        </div>
                      </div>
                    )}

                    {product.shelfLifeFrozenDays && (
                      <div className="bg-cyan-50/70 p-3 rounded-xl border border-cyan-200 flex items-start gap-2.5">
                        <Snowflake className="w-4 h-4 text-cyan-700 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-cyan-900 block">
                            {t.productDetail.frozenTitle}
                          </span>
                          <span className="text-cyan-700">
                            {t.productDetail.frozenPre}{' '}
                            <strong>
                              {product.shelfLifeFrozenDays} {t.productDetail.daysUnit}
                            </strong>
                          </span>
                        </div>
                      </div>
                    )}

                    {!product.shelfLifeChilledDays && !product.shelfLifeFrozenDays && (
                      <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2.5 col-span-2">
                        <Sparkles className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-amber-900 block">
                            {t.productDetail.hotServeTitle}
                          </span>
                          <span className="text-amber-700">{t.productDetail.hotServeDesc}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity & Add To Cart Action */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Qty Selector */}
                  <div className="flex items-center justify-between border border-stone-300 rounded-xl bg-white px-2 py-1.5 w-full sm:w-36">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-sm text-[#231812]">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add To Cart Button */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-sm shadow-lg shadow-[#F37021]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>
                      {t.productDetail.addToCartBtn} • {formatVND(product.price * quantity)}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#F37021]" />
                    {t.productDetail.fastShipping}
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {t.productDetail.freshGuarantee}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Details Grid: Ingredients & Allergens + Nutrition Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Ingredients & Allergen Warning */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="font-display text-lg font-bold text-[#231812] flex items-center gap-2 border-b border-stone-100 pb-3">
              <Sparkles className="w-5 h-5 text-[#F37021]" />
              <span>{t.productDetail.ingredientsTitle}</span>
            </h2>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {t.productDetail.ingredientsSubtitle}
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/50">
                {productIngredients}
              </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1 leading-relaxed">
                <span className="font-bold block">{t.productDetail.allergenHeading}</span>
                <p>{t.productDetail.allergenBody}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Nutrition Facts Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <h2 className="font-display text-lg font-bold text-[#231812] border-b border-stone-100 pb-3">
              {t.productDetail.nutritionTitle}
            </h2>

            {nutrition ? (
              <div className="border-2 border-[#231812] rounded-2xl overflow-hidden text-xs">
                <div className="bg-[#231812] text-white px-4 py-2.5 flex justify-between font-bold uppercase tracking-wider">
                  <span>{t.productDetail.nutritionCol1}</span>
                  <span>
                    {t.productDetail.nutritionCol2Prefix} ({product.netWeightG}g)
                  </span>
                </div>

                <div className="divide-y divide-stone-200 bg-white">
                  <div className="px-4 py-3 flex justify-between items-center font-bold text-sm">
                    <span>{t.productDetail.calories}</span>
                    <span className="text-[#F37021] font-mono">
                      {nutrition.energyKcal ?? '-'} kcal
                    </span>
                  </div>

                  <div className="px-4 py-2.5 flex justify-between items-center text-stone-700">
                    <span>{t.productDetail.carbs}</span>
                    <span className="font-semibold font-mono">{nutrition.carbsG ?? '-'} g</span>
                  </div>

                  <div className="px-4 py-2.5 flex justify-between items-center text-stone-700">
                    <span>{t.productDetail.protein}</span>
                    <span className="font-semibold font-mono">{nutrition.proteinG ?? '-'} g</span>
                  </div>

                  <div className="px-4 py-2.5 flex justify-between items-center text-stone-700">
                    <span>{t.productDetail.fat}</span>
                    <span className="font-semibold font-mono">{nutrition.fatG ?? '-'} g</span>
                  </div>

                  <div className="px-4 py-2.5 flex justify-between items-center text-stone-700">
                    <span>{t.productDetail.sodium}</span>
                    <span className="font-semibold font-mono">{nutrition.sodiumMg ?? '-'} mg</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-2xl p-6 text-center text-xs text-stone-500">
                {t.productDetail.nutritionPending}
              </div>
            )}

            <p className="text-[11px] text-stone-400 italic">{t.productDetail.nutritionFootnote}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
