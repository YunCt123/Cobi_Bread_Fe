import React from 'react';
import Link from 'next/link';
import { Store, Phone, MapPin, Mail, ShieldCheck, Heart, FileText, CheckCircle2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1C1410] text-stone-300 pt-16 pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Balanced Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Cột 1: Thông tin công ty */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#C67C3B] text-white flex items-center justify-center font-bold">
                <Store className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white font-display">
                COBI <span className="text-[#C67C3B]">BREAD</span>
              </span>
            </Link>

            <div className="space-y-2 text-stone-400 leading-relaxed text-[11px] sm:text-xs">
              <p className="font-bold text-white text-xs uppercase tracking-wide">
                CÔNG TY TNHH QUỐC TẾ COBI
              </p>
              <p>
                Mã số thuế (MST): <strong className="text-stone-200 font-mono">0314490563</strong>
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C67C3B] mt-0.5 shrink-0" />
                <span>
                  Phòng 1602, Tầng 16, Tòa nhà Cobi Tower II, Số 2-4 Đường số 8, Phường Tân Mỹ, Thành phố Hồ Chí Minh, Việt Nam.
                </span>
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2 text-[11px] text-[#C67C3B]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Thành viên hệ sinh thái COBI GROUP</span>
            </div>
          </div>

          {/* Cột 2: Liên hệ & Hotline */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Liên Hệ & Hotline
            </h4>
            
            <div className="space-y-2 text-[11px] sm:text-xs text-stone-400">
              <p>
                <span className="text-stone-300 font-medium">B2B (HCM):</span>{' '}
                <a href="tel:0909459387" className="text-white hover:text-[#C67C3B] font-bold">
                  0909 459 387
                </a>
              </p>

              <p>
                <span className="text-stone-300 font-medium">Mr Đức (Hà Nội):</span>{' '}
                <a href="tel:0982219841" className="text-white hover:text-[#C67C3B] font-bold">
                  0982 219 841
                </a>
              </p>

              <p>
                <span className="text-stone-300 font-medium">Cobi Bread Bakery & Coffee (HCM):</span>{' '}
                <a href="tel:0938891235" className="text-white hover:text-[#C67C3B] font-bold">
                  0938 891 235
                </a>
              </p>

              <p className="pt-1 border-t border-stone-800">
                <span className="text-stone-300 font-medium">Export sales Hotline:</span>{' '}
                <a href="tel:+84984889941" className="text-white hover:text-[#C67C3B] font-bold">
                  +84 984889941
                </a>
              </p>

              <p>
                <span className="text-stone-300 font-medium">Export sales email:</span>{' '}
                <a href="mailto:Exportsales@cobione.com" className="text-[#C67C3B] hover:underline font-mono">
                  Exportsales@cobione.com
                </a>
              </p>
            </div>
          </div>

          {/* Cột 3: Về chúng tôi (Chính sách & Pháp lý) */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Về Chúng Tôi & Chính Sách
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Thông tin chủ sở hữu website
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Chính sách kiểm hàng
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Điều khoản & điều kiện
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Phân định trách nhiệm của thương nhân & đơn vị logistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Dịch vụ */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Dịch Vụ & Hợp Tác
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs text-stone-400">
              <li>
                <Link href="/b2b" className="hover:text-[#C67C3B] transition-colors font-semibold text-white">
                  Mua hàng B2B / Số lượng lớn
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:text-white transition-colors">
                  Tư vấn lắp đặt bếp công nghiệp
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <a href="tel:0909459387" className="hover:text-white transition-colors">
                  Tổng đài hỗ trợ đối tác
                </a>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-white transition-colors text-[#C67C3B]">
                  Hồ sơ năng lực & Chứng nhận ISO
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Thanh cuối: Copyright + Quick links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            Copyright 2026 © <strong className="text-stone-300">Cobi Bread</strong> — All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-stone-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <span>•</span>
            <Link href="/stores" className="hover:text-white transition-colors">Our Stores</Link>
            <span>•</span>
            <Link href="/news" className="hover:text-white transition-colors">Blog</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">Contact</Link>
            <span>•</span>
            <Link href="/about" className="hover:text-white transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
