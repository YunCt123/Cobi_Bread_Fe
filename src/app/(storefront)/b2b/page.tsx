'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  Briefcase, 
  Snowflake, 
  CheckCircle2, 
  Truck, 
  Coffee, 
  Hotel, 
  ShoppingBag, 
  ArrowRight,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { productsApi } from '@/lib/api';

export default function B2BPage() {
  const { data: b2bData, isLoading } = useQuery({
    queryKey: ['b2b-products'],
    queryFn: () => productsApi.getAll({ isB2b: true, limit: 20 }),
  });

  const b2bProducts = b2bData?.data || [];

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />

      <main className="flex-1">
        {/* B2B Hero */}
        <section className="bg-gradient-to-b from-blue-900 to-stone-900 text-white py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Briefcase className="w-3.5 h-3.5" />
              Giải Pháp Bán Sỉ & Cung Ứng Bánh Mì Cobi Bread
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
              Cung Cấp Bánh Mì Tươi & Đông Lạnh Cho Chuỗi Cà Phê, Khách Sạn & Nhà Hàng
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Giải pháp tối ưu chi phí vận hành: 100% bánh cấp đông sâu -18°C, bảo quản 30-45 ngày, rã đông và nướng giòn chỉ 3 phút, hương vị thơm ngon đồng nhất.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <a
                href="tel:02854117799"
                className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-lg shadow-amber-600/30 flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                <span>Liên hệ Báo Giá B2B: 028 5411 7799</span>
              </a>
              <Link
                href="/products?isB2b=true"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm transition-all"
              >
                Xem danh mục sản phẩm sỉ
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Chuỗi Cà Phê & Trà Sữa</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Không cần đầu tư bếp bánh hay thợ bánh chuyên nghiệp. Nhân viên chỉ cần nướng nóng bánh Pocket Toast, bánh que hoặc bánh mì kem tươi phục vụ khách.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Hotel className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Khách Sạn & Buffet Sáng</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Cung ứng bánh mì sandwich ép viền, bánh mì que, bánh đông lạnh tiêu chuẩn 5 sao với sản lượng lớn và giao hàng lạnh hàng ngày.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Giao Hàng Lạnh Chuyên Dụng</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hệ thống xe thùng lạnh chuyên dụng vận chuyển đảm bảo nhiệt độ ổn định từ xưởng sản xuất Cobi Home Long Hậu đến kho của quý đối tác.
              </p>
            </div>
          </div>
        </section>

        {/* B2B Products Catalog */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Sản Phẩm Dành Cho Khách Hàng Doanh Nghiệp
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
                Danh Mục Bánh Sỉ B2B Cobi Bread
              </h2>
            </div>
            <Link
              href="/products?isB2b=true"
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              Xem trên bộ lọc sản phẩm →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {b2bProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
