'use client';

import React from 'react';
import Link from 'next/link';
import { Store, ShieldCheck, Award, Heart, CheckCircle2, Building, Users, MapPin, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-[#231812] to-[#3A281E] text-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#C67C3B]">
              Câu Chuyện Thương Hiệu
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
              COBI BREAD — GIẢI PHÁP TOÀN DIỆN VỀ BÁNH NGỌT & BÁNH MÌ ĐÔNG LẠNH
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-3xl mx-auto leading-relaxed">
              COBI BREAD là thương hiệu bánh ngọt cao cấp thuộc COBI GROUP. Với bề dày kinh nghiệm và bí quyết riêng trong lĩnh vực sản xuất bánh ngọt, chúng tôi cam kết mang tới cho khách hàng những sản phẩm chất lượng với hương vị tuyệt hảo.
            </p>
          </div>
        </section>

        {/* Story Content */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
              <h2 className="text-2xl font-bold text-[#231812] font-display">
                Nướng Mới Mỗi Ngày Với Men Tự Nhiên
              </h2>
              <p>
                Tại cửa hàng của chúng tôi, bánh mì đều được nướng mới mỗi ngày để đảm bảo chất lượng và hương vị của bánh. Chúng tôi cam kết mang tới cho khách hàng những sản phẩm tươi ngon nhất.
              </p>
              <p>
                COBI BREAD cung cấp hơn 100 sản phẩm bánh ngọt, đồ ăn và thức uống, cùng hơn 5,000 trang thiết bị, dụng cụ và vật liệu đóng gói, phục vụ nhu cầu đa dạng của khách hàng.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop"
                alt="Bánh mì Cobi Bread"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* 3 Value Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C67C3B] flex items-center justify-center font-bold">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#231812]">Hệ Thống 5 Cửa Hàng</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Hiện diện tại các trung tâm thương mại và cao ốc văn phòng hàng đầu TP.HCM, Hà Nội và Long An.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#231812]">Nhà Máy Cobi Home</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tọa lạc tại KCN Long Hậu, trang bị dây chuyền làm bánh tự động và công nghệ cấp đông sâu -18°C.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#231812]">Chứng Nhận Quốc Tế</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Đạt chứng nhận ISO 22000:2018 và tiêu chuẩn HACCP về an toàn vệ sinh thực phẩm cho thị trường quốc tế.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
