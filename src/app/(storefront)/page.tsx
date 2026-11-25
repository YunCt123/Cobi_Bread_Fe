'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Store, 
  ShieldCheck, 
  Package, 
  Truck, 
  Snowflake, 
  Flame, 
  Award, 
  Calendar, 
  Layers, 
  Clock, 
  ChevronRight,
  TrendingUp,
  FileCheck,
  ShoppingBag,
  Briefcase
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import VideoModal from '@/components/VideoModal';
import { categoriesApi, productsApi } from '@/lib/api';
import { Category, Product } from '@/types';
import { useBranchStore } from '@/stores/branch.store';

export default function StorefrontHomePage() {
  const { selectedBranch } = useBranchStore();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CROISSANT' | 'FROZEN' | 'SWEET' | 'SAVORY'>('ALL');

  // Fetch 9 Categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  // Fetch Products
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ['home-products'],
    queryFn: () => productsApi.getAll({ limit: 40 }),
  });

  const allProducts: Product[] = productsData?.data || [];

  // Filter products by active tab in Section 3
  const filteredProducts = allProducts.filter((p) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CROISSANT') {
      return (
        p.name.toLowerCase().includes('croissant') ||
        p.category?.slug.includes('croissant')
      );
    }
    if (activeTab === 'FROZEN') {
      return (
        p.storageType === 'FROZEN' ||
        p.category?.slug.includes('dong-lanh')
      );
    }
    if (activeTab === 'SWEET') {
      return (
        p.category?.slug.includes('kem-tuoi') ||
        p.category?.slug.includes('bong-lan') ||
        p.name.toLowerCase().includes('kem') ||
        p.name.toLowerCase().includes('socola') ||
        p.name.toLowerCase().includes('matcha') ||
        p.name.toLowerCase().includes('sua')
      );
    }
    if (activeTab === 'SAVORY') {
      return (
        p.category?.slug.includes('pocket') ||
        p.category?.slug.includes('que') ||
        p.name.toLowerCase().includes('xuc xich') ||
        p.name.toLowerCase().includes('ga') ||
        p.name.toLowerCase().includes('teriyaki')
      );
    }
    return true;
  });

  const categoryIconsMap: Record<string, string> = {
    'banh-mi-kem-tuoi': '❄️',
    'banh-pocket-toast': '🥪',
    'banh-bong-lan-sua': '🍰',
    'banh-mi-dong-lanh-b2c': '🧊',
    'banh-mi-dong-lanh-b2b': '📦',
    'snack-banh-quy': '🍪',
    'banh-mi-que': '🥖',
    'set-qua-tang': '🎁',
    'cac-loai-banh-khac': '🥐',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
      <Header />

      <main className="flex-1">
        
        {/* ========================================================
            SECTION 1 — HERO BANNER & VIDEO SHOWCASE + 9 CATEGORIES
           ======================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#231812] to-[#3A281E] text-white pt-16 pb-20 sm:pt-24 sm:pb-28">
          {/* Subtle background texture / bakery image */}
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&auto=format&fit=crop')`,
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Heading and CTAs */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-200 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-[#C67C3B]" />
                  <span>Nghệ Thuật Bánh Ngọt Thuộc Cobi Group</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.1] font-display text-white">
                  BÁNH NGON NHẤT LÀ{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#C67C3B] to-amber-300">
                    BÁNH MỚI RA LÒ
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Tại Cobi Bread, từng mẻ bánh đều được nướng tươi mới mỗi sáng từ men tự nhiên và bơ thượng hạng. Thưởng thức trọn vẹn hương vị bánh kem tươi mát lạnh và bánh mì đông lạnh cao cấp.
                </p>

                {/* Selected branch indicator */}
                {selectedBranch && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-stone-200 backdrop-blur-xs">
                    <Store className="w-4 h-4 text-[#C67C3B] shrink-0" />
                    <span>Chi nhánh phục vụ: <strong>{selectedBranch.name}</strong> ({selectedBranch.city})</span>
                    <Link href="/stores" className="text-amber-300 font-bold hover:underline ml-1">
                      Đổi →
                    </Link>
                  </div>
                )}

                {/* 2 CTA Buttons + Video Button */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                  <Link
                    href="/products"
                    className="px-6 py-3.5 rounded-2xl bg-[#C67C3B] hover:bg-[#A86224] text-white font-extrabold text-sm transition-all shadow-lg shadow-[#C67C3B]/30 flex items-center gap-2"
                  >
                    <span>Khám phá Menu</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/b2b"
                    className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm transition-all"
                  >
                    Đặt hàng B2B
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="px-5 py-3.5 rounded-2xl bg-stone-900/80 hover:bg-black text-amber-200 border border-amber-400/30 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#C67C3B] text-white flex items-center justify-center shrink-0">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                    <span>Xem video giới thiệu</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Visual Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800 bg-stone-900 group">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop"
                    alt="Bánh Mì Mới Ra Lò Cobi Bread"
                    className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[11px] uppercase tracking-widest text-[#C67C3B] font-bold">
                      COBI BREAD ARTISAN
                    </span>
                    <h3 className="text-xl font-bold mt-1 font-display">
                      Bánh Mì Kem Tươi Phô Mai & Pocket Toast
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 line-clamp-2">
                      Kỹ thuật nướng thủ công phong cách Hàn - Pháp, công nghệ bảo quản đông sâu -18°C giữ trọn chất lượng 12 tháng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Category Icon Pills Bar (Immediately below hero) */}
        <section className="bg-white border-b border-stone-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between pb-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#C67C3B]" />
                9 Danh Mục Sản Phẩm Nổi Bật
              </span>
              <Link href="/products" className="text-xs text-[#C67C3B] font-bold hover:underline">
                Xem toàn bộ menu →
              </Link>
            </div>

            {/* Scrollable Pills */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?categorySlug=${cat.slug}`}
                  className="px-4 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#C67C3B] hover:text-white border border-stone-200/80 text-stone-800 text-xs font-bold transition-all shrink-0 flex items-center gap-2 group shadow-2xs"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {categoryIconsMap[cat.slug] || '🥐'}
                  </span>
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>


        {/* ========================================================
            SECTION 2 — VỀ CHÚNG TÔI (ABOUT US) + BANNER B2B
           ======================================================== */}
        <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Text Content */}
              <div className="lg:col-span-7 space-y-5">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#C67C3B]">
                  Về chúng tôi
                </span>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#231812] tracking-tight leading-tight font-display">
                  GIẢI PHÁP TOÀN DIỆN TRONG SẢN XUẤT VÀ KINH DOANH BÁNH NGỌT
                </h2>

                <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                  <p>
                    <strong>COBI BREAD</strong> là thương hiệu bánh ngọt thuộc <strong>COBI GROUP</strong>. Với bề dày kinh nghiệm và bí quyết riêng trong lĩnh vực sản xuất bánh ngọt, chúng tôi cam kết mang tới cho khách hàng những sản phẩm chất lượng với hương vị tuyệt hảo.
                  </p>
                  <p>
                    COBI BREAD cung cấp <strong>hơn 100 sản phẩm</strong> bánh ngọt, đồ ăn và thức uống, cùng <strong>hơn 5,000 trang thiết bị</strong>, dụng cụ và vật liệu đóng gói, phục vụ nhu cầu đa dạng của khách hàng. Với những sản phẩm bánh ngọt được sản xuất mới mỗi ngày, COBI BREAD cam kết mang tới khách hàng những sản phẩm chất lượng và trọn vị nhất.
                  </p>
                </div>

                {/* Key Stats */}
                <div className="pt-4 grid grid-cols-3 gap-4 border-t border-stone-200">
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs text-center">
                    <span className="text-2xl sm:text-3xl font-black text-[#C67C3B] block">100+</span>
                    <span className="text-[11px] sm:text-xs text-stone-600 font-semibold">Sản phẩm bánh & đồ uống</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs text-center">
                    <span className="text-2xl sm:text-3xl font-black text-[#231812] block">5,000+</span>
                    <span className="text-[11px] sm:text-xs text-stone-600 font-semibold">Thiết bị & đóng gói</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs text-center">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 block">100%</span>
                    <span className="text-[11px] sm:text-xs text-stone-600 font-semibold">Nướng mới mỗi ngày</span>
                  </div>
                </div>
              </div>

              {/* Graphic / Photo */}
              <div className="lg:col-span-5 relative">
                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop"
                    alt="Xưởng sản xuất Cobi Bread"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="p-5 bg-white space-y-1">
                    <h4 className="font-bold text-sm text-[#231812]">Nhà máy Cobi Home & Hệ thống cửa hàng</h4>
                    <p className="text-xs text-stone-500">KCN Long Hậu, Cần Giuộc, Long An & Chi nhánh toàn quốc</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner CTA B2B Nổi Bật */}
            <div className="rounded-3xl bg-gradient-to-r from-[#231812] via-[#352319] to-[#231812] text-white p-8 sm:p-10 shadow-xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#C67C3B]/30 text-amber-300 border border-[#C67C3B]/40 uppercase tracking-wider">
                  <Briefcase className="w-3.5 h-3.5" />
                  Đối tác doanh nghiệp & Chuỗi F&B
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
                  Dịch vụ đặt hàng B2B / SỐ LƯỢNG LỚN
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
                  Cung ứng bánh mì tươi, bánh mì cấp đông sâu cho chuỗi cà phê, nhà hàng, khách sạn và xuất khẩu quốc tế với chính sách chiết khấu tốt nhất.
                </p>
              </div>

              <Link
                href="/b2b"
                className="px-6 py-3.5 rounded-2xl bg-[#C67C3B] hover:bg-[#A86224] text-white font-extrabold text-sm shadow-md shadow-[#C67C3B]/30 transition-all shrink-0 flex items-center gap-2"
              >
                <span>Xem giải pháp B2B</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>


        {/* ========================================================
            SECTION 3 — BÁNH ĐƯỢC GỢI Ý BỞI COBI BREAD
           ======================================================== */}
        <section className="py-16 sm:py-24 bg-white border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Heading & Subtitle */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C67C3B] block">
                  Đặc sản chọn lọc
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231812] tracking-tight mt-1 font-display">
                  Bánh được gợi ý bởi Cobi Bread
                </h2>
                <p className="text-sm text-stone-500 mt-1">
                  Chúng tôi chọn những chiếc bánh ngon nhất cho bạn
                </p>
              </div>

              <Link
                href="/products"
                className="text-xs sm:text-sm font-bold text-[#C67C3B] hover:underline flex items-center gap-1 self-start md:self-auto"
              >
                <span>Xem tất cả sản phẩm ({allProducts.length})</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-100">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'CROISSANT', label: 'Bánh Croissant' },
                { key: 'FROZEN', label: 'Bánh Đông Lạnh' },
                { key: 'SWEET', label: 'Bánh Ngọt' },
                { key: 'SAVORY', label: 'Bánh Mặn' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                    activeTab === tab.key
                      ? 'bg-[#231812] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-sm text-stone-400 bg-stone-50 rounded-3xl">
                Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn.
              </div>
            )}
          </div>
        </section>


        {/* ========================================================
            SECTION 4 — 3 CAM KẾT DỊCH VỤ (SERVICE PILLARS)
           ======================================================== */}
        <section className="py-14 bg-[#FAF7F2] border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Pillar 1 */}
              <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-2xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C67C3B] flex items-center justify-center shrink-0 border border-amber-100">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#231812]">
                    1. Sản xuất theo đơn đặt hàng
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Tùy biến công thức, hương vị và quy cách đóng gói theo đúng yêu cầu riêng của đối tác.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-2xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-100">
                  <Snowflake className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#231812]">
                    2. Đóng gói thực phẩm đông lạnh
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Công nghệ cấp đông nhanh -18°C và bao bì đạt chuẩn xuất khẩu bảo lưu trọn độ ẩm và vị ngon.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-2xs flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#231812]">
                    3. Giao hàng trong vòng 24h
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    Hệ thống vận tải xe lạnh chuyên dụng kết nối nhanh chóng từ xưởng sản xuất đến điểm nhận.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================
            SECTION 5 — TẠI SAO NÊN CHỌN COBI BREAD (BENTO GRID 5)
           ======================================================== */}
        <section className="py-16 sm:py-24 bg-white border-b border-stone-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C67C3B]">
                Giá Trị Cốt Lõi
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231812] tracking-tight font-display">
                Tại Sao Nên Chọn Cobi Bread
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                Tại cửa hàng của chúng tôi, bánh mì đều được nướng mới mỗi ngày để đảm bảo chất lượng và hương vị của bánh. Chúng tôi cam kết mang tới cho khách hàng những sản phẩm tươi ngon nhất.
              </p>
            </div>

            {/* Bento Grid 5 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Card 1: Hạn sử dụng lên đến 12 tháng (Large card) */}
              <div className="lg:col-span-2 bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#231812] font-display">
                    1. Hạn sử dụng lên đến 12 tháng
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Khi được bảo quản ở nhiệt độ -18°C, bánh mì đông lạnh của chúng tôi có hạn sử dụng lên tới 12 tháng mà vẫn giữ hương vị và độ tươi mới của bánh.
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-200 flex items-center gap-2 text-xs font-semibold text-cyan-800">
                  <Snowflake className="w-4 h-4" />
                  <span>Nhiệt độ tối ưu: -18°C tiêu chuẩn châu Âu</span>
                </div>
              </div>

              {/* Card 2: Chất lượng tuyệt hảo */}
              <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#C67C3B] flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#231812] font-display">
                  2. Chất lượng tuyệt hảo
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Mỗi sản phẩm được tạo ra theo công thức độc quyền và trải qua quá trình thử nghiệm nghiêm ngặt, đảm bảo tiêu chuẩn cao nhất về hương vị.
                </p>
              </div>

              {/* Card 3: Cam kết doanh số */}
              <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#231812] font-display">
                  3. Cam kết doanh số
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Các sản phẩm bánh mì đông lạnh không chỉ được khách hàng nội địa tin dùng mà còn xuất khẩu sang nhiều quốc gia trên thế giới.
                </p>
              </div>

              {/* Card 4: Quy trình sản xuất tối ưu */}
              <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#231812] font-display">
                  4. Quy trình sản xuất tối ưu
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Sản xuất theo các tiêu chuẩn nghiêm ngặt nhất về chất lượng và vệ sinh an toàn thực phẩm.
                </p>
              </div>

              {/* Card 5: An toàn vệ sinh thực phẩm */}
              <div className="bg-[#FAF7F2] p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#231812] font-display">
                  5. An toàn vệ sinh thực phẩm
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Kiểm soát chặt chẽ mọi nguyên liệu đầu vào và giám sát nghiêm ngặt trong suốt quá trình sản xuất.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ========================================================
            SECTION 6 — TIN TỨC & SỰ KIỆN (NEWS)
           ======================================================== */}
        <section className="py-16 sm:py-24 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C67C3B]">
                  Cập Nhật Mới Nhất
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#231812] tracking-tight mt-1 font-display">
                  Tin tức
                </h2>
              </div>
              <Link 
                href="/news" 
                className="text-xs sm:text-sm font-bold text-[#C67C3B] hover:underline flex items-center gap-1"
              >
                <span>Xem tất cả tin tức</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid 1 Featured Article + 3 Small Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Featured News Card (7 cols) */}
              <Link 
                href="/news" 
                className="lg:col-span-7 group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-16/9 overflow-hidden bg-stone-100 relative">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop"
                    alt="Ra mắt vị mới GS25"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C67C3B] text-white shadow-xs">
                      Tin Nổi Bật
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-[#C67C3B]" />
                    <span>22/12/2025</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#231812] group-hover:text-[#C67C3B] transition-colors leading-snug font-display">
                    Ra mắt vị mới chỉ có tại GS25: Bánh Mì Kem Tươi Muối Hồng Himalaya
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    Sự kết hợp độc đáo giữa vị béo ngậy của kem sữa tươi và chút mặn thanh dịu của muối khoáng Himalaya, mang đến trải nghiệm vị giác bùng nổ chỉ có tại chuỗi cửa hàng tiện lợi GS25.
                  </p>
                  <div className="pt-2 text-xs font-bold text-[#C67C3B] flex items-center gap-1 group-hover:underline">
                    <span>Đọc tiếp bài viết</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>

              {/* 3 Secondary News Items (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {[
                  {
                    title: 'Cobi "Song Kiếm Hợp Bích" tại Coffee Expo Vietnam 2025',
                    date: '29/10/2025',
                    desc: 'Cobi Bread cùng Cobi Home giới thiệu giải pháp quầy bánh ngọt & máy làm bánh tự động cho hơn 200 đối tác F&B.',
                    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop',
                  },
                  {
                    title: 'Cafeshow 2025 – Khơi nguồn giải pháp doanh nghiệp F&B',
                    date: '17/04/2025',
                    desc: 'Giải pháp bánh mì cấp đông sâu giúp chuỗi cafe tối ưu chi phí bếp bánh và đồng bộ chất lượng vượt trội.',
                    img: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=400&auto=format&fit=crop',
                  },
                  {
                    title: 'Cobi Bread Tower 1 – Góc nhỏ ngọt ngào giữa lòng Quận 7',
                    date: '14/03/2025',
                    desc: 'Không gian tiệm bánh đậm chất thư thái tại tòa nhà Cobi Tower, 69 Hoàng Văn Thái, Tân Phú, Quận 7.',
                    img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop',
                  },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href="/news"
                    className="group bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs hover:border-[#C67C3B] hover:shadow-md transition-all flex gap-4 items-center"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 bg-stone-100"
                    />
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                        <Calendar className="w-3 h-3 text-[#C67C3B]" />
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#231812] group-hover:text-[#C67C3B] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
