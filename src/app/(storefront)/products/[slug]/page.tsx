'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  ChevronRight, 
  Thermometer, 
  Snowflake, 
  Sun, 
  Scale, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowLeft, 
  Store, 
  Heart, 
  Share2, 
  Truck, 
  Flame, 
  Info,
  Loader2
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { formatVND, getStorageBadge } from '@/components/ProductCard';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch product by slug
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['product', slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: Boolean(slug),
  });

  const handleAddToCart = () => {
    if (!product) return;
    setToastMessage(`Đã thêm ${quantity} x "${product.name}" vào giỏ hàng thành công!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="flex items-center gap-2 text-stone-500 font-semibold text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            <span>Đang tải thông tin bánh...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <div className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-sm text-stone-500">
            Sản phẩm có thể đã đổi tên hoặc tạm thời ngừng kinh doanh.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại thực đơn bánh</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop'];

  const storageInfo = getStorageBadge(product.storageType);
  const nutrition = product.nutritionJson;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />

      {/* Floating Add to Cart Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold border border-stone-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-amber-700">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <Link href="/products" className="hover:text-amber-700">Sản phẩm</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                <Link
                  href={`/products?categorySlug=${product.category.slug}`}
                  className="hover:text-amber-700"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-900 font-semibold truncate max-w-xs sm:max-w-md">
              {product.name}
            </span>
          </nav>

          {/* Product Overview: Gallery & Purchasing Box */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Col: Image Gallery (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />

                {/* Storage Condition Overlay Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border shadow-xs backdrop-blur-md ${storageInfo.className}`}>
                    {storageInfo.icon}
                    <span>{storageInfo.label}</span>
                  </span>
                </div>

                {/* B2B pill */}
                {product.isB2b && (
                  <div className="absolute top-4 right-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white shadow-xs uppercase">
                      B2B Sỉ
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple images */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-amber-600 scale-105' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Col: Details, Price, Shelf-Life & Add to Cart (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Category & SKU */}
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <Link
                    href={`/products?categorySlug=${product.category?.slug}`}
                    className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    {product.category?.name}
                  </Link>
                  <span className="font-mono text-stone-400">
                    Mã SKU: <strong className="text-stone-700">{product.sku}</strong>
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                  {product.name}
                </h1>

                {/* Price & Net Weight */}
                <div className="flex flex-wrap items-baseline gap-4 pt-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-amber-700 tracking-tight">
                    {formatVND(product.price)}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    <span>Khối lượng tịnh: <strong>{product.netWeightG}g</strong></span>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-stone-600 leading-relaxed pt-2">
                    {product.description}
                  </p>
                )}

                {/* Shelf-Life & Storage Conditions Card */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700" />
                    Hướng Dẫn Bảo Quản & Hạn Sử Dụng
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                      <Thermometer className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-stone-900 block">Bảo quản mát (0 - 10°C)</strong>
                        <span className="text-stone-600">
                          Sử dụng tốt nhất trong <strong className="text-emerald-700">{product.shelfLifeChilledDays} ngày</strong>.
                        </span>
                      </div>
                    </div>

                    {product.shelfLifeFrozenDays ? (
                      <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                        <Snowflake className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-stone-900 block">Bảo quản đông sâu (-18°C)</strong>
                          <span className="text-stone-600">
                            Hạn dùng lên đến <strong className="text-cyan-700">{product.shelfLifeFrozenDays} ngày</strong>.
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-amber-100">
                        <Flame className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          <strong className="text-stone-900 block">Thưởng thức nóng</strong>
                          <span className="text-stone-600">Dùng ngay sau khi nướng để trọn vị giòn.</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Selector & Add to Cart Button */}
              <div className="pt-6 border-t border-stone-200 space-y-4">
                <div className="flex items-center gap-4">
                  {/* Counter */}
                  <div className="flex items-center border border-stone-300 rounded-2xl bg-stone-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3.5 py-3 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-sm text-stone-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-3.5 py-3 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-extrabold text-sm sm:text-base transition-all shadow-md shadow-amber-600/30 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Thêm vào giỏ ({formatVND(product.price * quantity)})</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    Giao hàng nhanh từ 5 chi nhánh Cobi Bread
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Đảm bảo tươi mới 100%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info: Ingredients, Nutrition & Allergen Warning */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Ingredients & Allergens (7 cols) */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-4">
                <Info className="w-5 h-5 text-amber-600" />
                Thành Phần & Cảnh Báo Dị Ứng
              </h3>

              <div className="text-sm text-stone-700 leading-relaxed space-y-4">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-1.5">
                    Thành phần nguyên liệu
                  </h4>
                  <p className="bg-stone-50 p-4 rounded-2xl border border-stone-100">
                    {product.ingredients}
                  </p>
                </div>

                {/* Allergen Warning Pill */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <strong className="block font-bold">Lưu ý quan trọng cho khách hàng dị ứng:</strong>
                    Sản phẩm được chế biến trong xưởng bánh có sử dụng lúa mì (gluten), trứng, sữa, đậu nành và các loại hạt.
                  </div>
                </div>
              </div>
            </div>

            {/* Nutrition Facts Table (5 cols) */}
            <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-5">
              <h3 className="text-xl font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-4">
                <Scale className="w-5 h-5 text-emerald-600" />
                Bảng Giá Trị Dinh Dưỡng
              </h3>

              {nutrition ? (
                <div className="border border-stone-200 rounded-2xl overflow-hidden divide-y divide-stone-100 text-xs sm:text-sm">
                  <div className="bg-stone-50 px-4 py-2.5 font-bold text-stone-700 flex justify-between">
                    <span>Thành phần dinh dưỡng</span>
                    <span>Trên 1 khẩu phần ({product.netWeightG}g)</span>
                  </div>

                  {nutrition.energyKcal !== undefined && (
                    <div className="px-4 py-3 flex justify-between items-center">
                      <span className="font-semibold text-stone-800">Năng lượng (Calories)</span>
                      <strong className="text-amber-700 font-bold">{nutrition.energyKcal} kcal</strong>
                    </div>
                  )}

                  {nutrition.carbsG !== undefined && (
                    <div className="px-4 py-3 flex justify-between items-center">
                      <span className="text-stone-700">Carbohydrate (Đường bột)</span>
                      <span className="font-semibold text-stone-900">{nutrition.carbsG} g</span>
                    </div>
                  )}

                  {nutrition.proteinG !== undefined && (
                    <div className="px-4 py-3 flex justify-between items-center">
                      <span className="text-stone-700">Chất đạm (Protein)</span>
                      <span className="font-semibold text-stone-900">{nutrition.proteinG} g</span>
                    </div>
                  )}

                  {nutrition.fatG !== undefined && (
                    <div className="px-4 py-3 flex justify-between items-center">
                      <span className="text-stone-700">Chất béo (Total Fat)</span>
                      <span className="font-semibold text-stone-900">{nutrition.fatG} g</span>
                    </div>
                  )}

                  {nutrition.sodiumMg !== undefined && (
                    <div className="px-4 py-3 flex justify-between items-center">
                      <span className="text-stone-700">Natri (Sodium)</span>
                      <span className="font-semibold text-stone-900">{nutrition.sodiumMg} mg</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-stone-500 bg-stone-50 rounded-2xl p-4">
                  Đang cập nhật bảng chỉ số dinh dưỡng chi tiết từ phòng kiểm nghiệm Cobi Bread.
                </div>
              )}

              <p className="text-[11px] text-stone-500 italic">
                * Giá trị dinh dưỡng hàng ngày dựa trên chế độ ăn 2.000 calo tiêu chuẩn.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
