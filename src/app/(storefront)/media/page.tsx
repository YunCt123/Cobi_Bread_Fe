'use client';

import React, { useState } from 'react';
import { Film, Play, Image as ImageIcon, Sparkles, Store } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import VideoModal from '@/components/VideoModal';

export default function MediaPage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const galleryItems = [
    {
      title: 'Quy trình nhào bột & nướng bánh men tự nhiên',
      type: 'Video',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
    },
    {
      title: 'Dây chuyền cấp đông sâu -18°C tại nhà máy Cobi Home',
      type: 'Hình ảnh',
      img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop',
    },
    {
      title: 'Không gian tiệm bánh Cobi Bread Tower Quận 7',
      type: 'Hình ảnh',
      img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop',
    },
    {
      title: 'Gian hàng Cobi Bread tại triển lãm Coffee Expo Vietnam',
      type: 'Hình ảnh',
      img: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&auto=format&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C67C3B]">
              Thư Viện Đa Phương Tiện
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#231812] font-display">
              Media & Hình Ảnh Hoạt Động
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Khám phá hình ảnh xưởng sản xuất hiện đại, quy trình nướng bánh tươi và các hoạt động sôi nổi tại chuỗi tiệm bánh Cobi Bread.
            </p>
          </div>

          {/* Featured Video Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl bg-stone-900 border border-stone-800 text-white">
            <div className="aspect-21/9 min-h-[300px] relative overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop"
                alt="Video giới thiệu Cobi Bread"
                className="w-full h-full object-cover opacity-50"
              />
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="absolute w-20 h-20 rounded-full bg-[#C67C3B] hover:bg-[#A86224] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all cursor-pointer"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            </div>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-stone-900">
              <div>
                <h3 className="text-xl font-bold font-display">Video Giới Thiệu Cobi Bread & Cobi Group</h3>
                <p className="text-xs text-stone-400 mt-1">Khám phá hành trình tạo nên những chiếc bánh ngọt thơm lừng mỗi sáng.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
              >
                Phát video ngay
              </button>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryItems.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs group"
              >
                <div className="aspect-4/3 overflow-hidden bg-stone-100 relative">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#231812]/80 text-white backdrop-blur-xs">
                    {item.type}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-xs sm:text-sm font-bold text-[#231812] line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
}
