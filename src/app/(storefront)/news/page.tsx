'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Sparkles, Store } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const newsArticles = [
  {
    id: 1,
    title: 'Ra mắt vị mới chỉ có tại GS25: Bánh Mì Kem Tươi Muối Hồng Himalaya',
    date: '22/12/2025',
    category: 'Sản Phẩm Mới',
    desc: 'Sự kết hợp độc đáo giữa vị béo ngậy của kem sữa tươi và chút mặn thanh dịu của muối khoáng Himalaya, mang đến trải nghiệm vị giác bùng nổ chỉ có tại chuỗi cửa hàng tiện lợi GS25.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Cobi "Song Kiếm Hợp Bích" tại Coffee Expo Vietnam 2025',
    date: '29/10/2025',
    category: 'Sự Kiện',
    desc: 'Cobi Bread cùng Cobi Home giới thiệu giải pháp quầy bánh ngọt & máy làm bánh tự động cho hơn 200 đối tác F&B tại triển lãm SECC Quận 7.',
    img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Cafeshow 2025 – Khơi nguồn giải pháp doanh nghiệp F&B',
    date: '17/04/2025',
    category: 'Giải Pháp B2B',
    desc: 'Giải pháp bánh mì cấp đông sâu giúp chuỗi cafe tối ưu chi phí bếp bánh và đồng bộ chất lượng vượt trội tại mọi điểm bán.',
    img: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=800&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Cobi Bread Tower 1 – Góc nhỏ ngọt ngào giữa lòng Quận 7',
    date: '14/03/2025',
    category: 'Cửa Hàng',
    desc: 'Không gian tiệm bánh đậm chất thư thái tại tòa nhà Cobi Tower, 69 Hoàng Văn Thái, Tân Phú, Quận 7 với view ngắm phố thoáng đãng.',
    img: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop',
  },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C67C3B]">
              Bản Tin Cobi Bread
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#231812] font-display">
              Tin Tức & Hoạt Động Sự Kiện
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Cập nhật các chương trình ra mắt sản phẩm mới, sự kiện triển lãm F&B và hoạt động kết nối cộng đồng của Cobi Bread.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="aspect-16/9 overflow-hidden bg-stone-100 relative">
                  <img
                    src={article.img}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C67C3B] text-white">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                      <Calendar className="w-3.5 h-3.5 text-[#C67C3B]" />
                      <span>{article.date}</span>
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold text-[#231812] group-hover:text-[#C67C3B] transition-colors leading-snug font-display">
                      {article.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {article.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#C67C3B] group-hover:underline flex items-center gap-1">
                      Xem chi tiết bài viết
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
