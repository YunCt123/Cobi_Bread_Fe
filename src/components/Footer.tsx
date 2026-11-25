'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, Phone, Mail } from 'lucide-react';
import { BRAND_ASSETS } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1C1410] text-stone-300 pt-16 pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Company Info + 3 Footer Link/Support Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800/80">
          
          {/* Cột 1: Thông tin công ty & Liên hệ */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block group">
              <img
                src={BRAND_ASSETS.logo}
                alt="COBI BREAD Bakery Cafe"
                className="h-10 sm:h-11 w-auto object-contain group-hover:scale-[1.03] transition-transform"
              />
            </Link>

            <div className="space-y-2 text-stone-400 leading-relaxed text-[11px] sm:text-xs">
              <p className="font-bold text-white text-xs uppercase tracking-wide">
                {t.footer.companyName}
              </p>
              <p>
                {t.footer.taxCodeLabel}{' '}
                <strong className="text-stone-200 font-mono">0314490563</strong>
              </p>
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F37021] mt-0.5 shrink-0" />
                <span>{t.footer.companyAddress}</span>
              </p>
            </div>

            <div className="pt-2 border-t border-stone-800/80 space-y-1.5 text-[11px] sm:text-xs text-stone-400">
              <p>
                <span className="text-stone-300 font-medium">{t.footer.b2bHcm}</span>{' '}
                <a href="tel:0909459387" className="text-white hover:text-[#F37021] font-bold">
                  0909 459 387
                </a>
                {' • '}
                <span className="text-stone-300 font-medium">{t.footer.hnLabel}</span>{' '}
                <a href="tel:0982219841" className="text-white hover:text-[#F37021] font-bold">
                  0982 219 841
                </a>
              </p>
              <p>
                <span className="text-stone-300 font-medium">{t.footer.exportHotline}</span>{' '}
                <a href="tel:+84984889941" className="text-white hover:text-[#F37021] font-bold">
                  +84 984889941
                </a>
              </p>
              <p>
                <span className="text-stone-300 font-medium">{t.footer.exportEmail}</span>{' '}
                <a href={BRAND_ASSETS.social.exportEmail} className="text-[#F37021] hover:underline font-mono">
                  Exportsales@cobione.com
                </a>
              </p>
            </div>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#F37021]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{t.footer.ecosystem}</span>
            </div>
          </div>

          {/* Cột 2: Về chúng tôi (6 link pháp lý & chính sách) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.colAbout}
            </h4>
            <ul className="space-y-2.5 text-[11px] sm:text-xs text-stone-400">
              <li>
                <Link href="/policies/thong-tin-chu-so-huu" className="hover:text-[#F37021] transition-colors">
                  {t.footer.linkOwner}
                </Link>
              </li>
              <li>
                <Link href="/policies/chinh-sach-bao-mat" className="hover:text-[#F37021] transition-colors">
                  {t.footer.linkPrivacy}
                </Link>
              </li>
              <li>
                <Link href="/policies/chinh-sach-giao-hang" className="hover:text-[#F37021] transition-colors">
                  {t.footer.linkDelivery}
                </Link>
              </li>
              <li>
                <Link href="/policies/chinh-sach-kiem-hang" className="hover:text-[#F37021] transition-colors">
                  {t.footer.linkInspection}
                </Link>
              </li>
              <li>
                <Link href="/policies/dieu-khoan-dieu-kien" className="hover:text-[#F37021] transition-colors">
                  {t.footer.linkTerms}
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/phan-dinh-trach-nhiem"
                  className="hover:text-[#F37021] transition-colors leading-relaxed block"
                >
                  {t.footer.linkResponsibilities}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dịch vụ */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.colServices}
            </h4>
            <ul className="space-y-2.5 text-[11px] sm:text-xs text-stone-400">
              <li>
                <Link href="/b2b" className="hover:text-[#F37021] transition-colors font-semibold text-white">
                  {t.footer.linkB2b}
                </Link>
              </li>
              <li>
                <Link
                  href="/policies/tu-van-lap-dat-bep-cong-nghiep"
                  className="hover:text-[#F37021] transition-colors"
                >
                  {t.footer.linkKitchen}
                </Link>
              </li>
              <li>
                <Link href="/policies/chinh-sach-bao-hanh" className="hover:text-[#F37021] transition-colors">
                  {t.footer.linkWarranty}
                </Link>
              </li>
              <li>
                <Link href="/certificates" className="hover:text-[#F37021] transition-colors text-[#FF9A5A]">
                  {t.footer.linkCertificates}
                </Link>
              </li>
              <li>
                <Link href="/stores" className="hover:text-[#F37021] transition-colors">
                  {t.footer.linkStores}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Tổng đài hỗ trợ + 4 kênh Social thật + Badge Bộ Công Thương */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.footer.colSupport}
            </h4>

            <div className="space-y-2 text-[11px] sm:text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
                <span>{t.footer.supportHotline}</span>
                <a href="tel:0356756720" className="text-white hover:text-[#F37021] font-bold">
                  03 567 567 20
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
                <span>{t.footer.bakeryCafeHotline}</span>
                <a href="tel:0938891235" className="text-white hover:text-[#F37021] font-bold">
                  0938 891 235
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F37021] shrink-0" />
                <span>{t.footer.officeHotline}</span>
                <a href="tel:02854111550" className="text-white hover:text-[#F37021] font-bold">
                  028 5411 1550
                </a>
              </p>
            </div>

            {/* 4 Icon Tròn Kết Nối Kênh Chính Thức */}
            <div className="pt-1 space-y-2">
              <span className="text-[11px] font-semibold text-stone-400 block">
                {t.footer.connectChannels}
              </span>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href={BRAND_ASSETS.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Facebook Cobi Home"
                  aria-label="Facebook Cobi Home"
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-[#1877F2] text-white border border-stone-700 hover:border-[#1877F2] flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href={BRAND_ASSETS.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="TikTok @cobihome.official"
                  aria-label="TikTok @cobihome.official"
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-black text-white border border-stone-700 hover:border-white/40 flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.8a4.84 4.84 0 0 1-1-.11z" />
                  </svg>
                </a>

                {/* Email */}
                <a
                  href={BRAND_ASSETS.social.email}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Email cobionline@cobione.com"
                  aria-label="Email cobionline@cobione.com"
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-[#F37021] text-white border border-stone-700 hover:border-[#F37021] flex items-center justify-center transition-all hover:scale-105"
                >
                  <Mail className="w-4 h-4" />
                </a>

                {/* YouTube */}
                <a
                  href={BRAND_ASSETS.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="YouTube @cobihome"
                  aria-label="YouTube @cobihome"
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-[#FF0000] text-white border border-stone-700 hover:border-[#FF0000] flex items-center justify-center transition-all hover:scale-105"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Badge Đã thông báo Bộ Công Thương */}
            <div className="pt-2">
              <Link
                href="/policies/thong-tin-chu-so-huu"
                title={t.footer.moitTitle}
                className="inline-block rounded-xl overflow-hidden hover:opacity-95 transition-opacity shadow-sm"
              >
                <img
                  src={BRAND_ASSETS.moitBadge}
                  alt={t.footer.moitAlt}
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Quick Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            Copyright 2026 © <strong className="text-stone-300">Cobi Bread</strong> — All Rights Reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-stone-400">
            <Link href="/about" className="hover:text-white transition-colors">{t.footer.quickAbout}</Link>
            <span>•</span>
            <Link href="/stores" className="hover:text-white transition-colors">{t.footer.quickStores}</Link>
            <span>•</span>
            <Link href="/news" className="hover:text-white transition-colors">{t.footer.quickBlog}</Link>
            <span>•</span>
            <Link href="/policies/thong-tin-chu-so-huu" className="hover:text-white transition-colors">{t.footer.quickContact}</Link>
            <span>•</span>
            <Link href="/policies/dieu-khoan-dieu-kien" className="hover:text-white transition-colors">{t.footer.quickTerms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
