'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, FileCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CertificatesPage() {
  const certs = [
    {
      title: 'Chứng Nhận Hệ Thống Quản Lý ATTP ISO 22000:2018',
      desc: 'Tiêu chuẩn quốc tế cao nhất về an toàn vệ sinh thực phẩm trong toàn bộ chuỗi cung ứng sản xuất bánh ngọt và bánh đông lạnh.',
      issuedBy: 'Tổ chức Tiêu chuẩn hóa Quốc tế (ISO)',
      code: 'ISO 22000:2018',
    },
    {
      title: 'Chứng Nhận Hệ Thống Phân Tích Mối Nguy HACCP',
      desc: 'Hệ thống kiểm soát các điểm tới hạn nguy hại trong quá trình nhào bột, nướng, đóng gói và cấp đông bánh mì.',
      issuedBy: 'Cục An Toàn Thực Phẩm',
      code: 'HACCP Codex Alimentarius',
    },
    {
      title: 'Giấy Chứng Nhận Cơ Sở Đủ Điều Kiện An Toàn Thực Phẩm',
      desc: 'Chứng nhận xưởng sản xuất Cobi Home Long Hậu và 5 cửa hàng Cobi Bread đạt chuẩn điều kiện vệ sinh phòng chống lây nhiễm chéo.',
      issuedBy: 'Ban Quản Lý An Toàn Thực Phẩm',
      code: 'ATTP-2025/CB',
    },
    {
      title: 'Tiêu Chuẩn Đóng Gói Thực Phẩm Cấp Đông Xuất Khẩu',
      desc: 'Quy chuẩn vật liệu bao bì tiếp xúc trực tiếp với thực phẩm đông lạnh đảm bảo không thôi nhiễm ở nhiệt độ -18°C.',
      issuedBy: 'Viện Kiểm Nghiệm Vệ Sinh ATTP Quốc Gia',
      code: 'TCVN 12-1:2011/BYT',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#231812]">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C67C3B]">
              Tiêu Chuẩn Vàng Về An Toàn
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#231812] font-display">
              Chứng Chỉ & Giấy Phép Chất Lượng
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Cobi Bread tuân thủ nghiêm ngặt các quy chuẩn quốc tế về an toàn vệ sinh thực phẩm, đảm bảo sức khỏe tối đa cho người tiêu dùng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certs.map((c, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-stone-100 text-stone-700">
                      {c.code}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#231812] font-display leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Cơ quan cấp: <strong className="text-stone-800">{c.issuedBy}</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Hiệu lực
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
