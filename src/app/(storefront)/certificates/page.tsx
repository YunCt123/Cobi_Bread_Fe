'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  ZoomIn,
  CheckCircle2,
  Calendar,
  Building2,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { getLocalizedCertificatesData, BRAND_ASSETS } from '@/data/cobi-content';
import ImageLightboxModal, { LightboxItem } from '@/components/common/ImageLightboxModal';
import { useTranslation } from '@/i18n';

export default function CertificatesPage() {
  const { t, locale } = useTranslation();
  const certificates = getLocalizedCertificatesData(locale);

  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const certLightboxList: LightboxItem[] = certificates.map((cert) => ({
    src: cert.image,
    title: cert.title,
    category: cert.code,
    description: `${cert.subtitle} — ${cert.scope}`,
  }));

  const openCertModal = (idx: number) => {
    setLightboxItems(certLightboxList);
    setLightboxIndex(idx);
  };

  const openSafetyDiagram = () => {
    setLightboxItems([
      {
        src: BRAND_ASSETS.foodSafetyDiagram,
        title: t.certificatesPage.qualityTitle,
        category: t.certificatesPage.qualityEyebrow,
      },
    ]);
    setLightboxIndex(0);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812]">{t.common.certificates}</span>
        </nav>

        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.certificatesPage.eyebrow}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#231812] tracking-tight">
            {t.certificatesPage.title}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">{t.certificatesPage.subtitle}</p>
        </div>

        {/* 4 Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {certificates.map((cert, idx) => (
            <div
              key={cert.id}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:border-[#F37021]/60 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Real Scan Preview */}
                <button
                  type="button"
                  onClick={() => openCertModal(idx)}
                  className="group relative w-full bg-[#FAF7F2] border-b border-stone-200/70 p-6 flex items-center justify-center cursor-zoom-in"
                >
                  <div className="relative h-72 sm:h-80 w-full flex items-center justify-center">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-md group-hover:scale-[1.03] transition-transform duration-300 bg-white"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#231812]/90 text-white text-[11px] font-bold inline-flex items-center gap-1.5 shadow-md">
                    <ZoomIn className="w-3.5 h-3.5 text-[#F37021]" />
                    {t.common.zoomOriginal}
                  </span>
                </button>

                {/* Certificate Metadata */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-[#F37021] border border-orange-200 text-xs font-mono font-bold">
                      {cert.code}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.certificatesPage.activeStatus}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-bold text-[#231812] leading-snug">
                      {cert.title}
                    </h2>
                    <p className="text-xs font-medium text-[#A85016] mt-1">{cert.subtitle}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{cert.scope}</p>

                  <div className="pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-[#231812]">
                          {t.certificatesPage.issuedByLabel}
                        </strong>{' '}
                        {cert.issuedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#F37021] shrink-0" />
                      <span>
                        <strong className="text-[#231812]">
                          {t.certificatesPage.validUntilLabel}
                        </strong>{' '}
                        {cert.validUntil}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => openCertModal(idx)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-orange-50 border border-stone-200 text-xs font-bold text-[#231812] hover:text-[#F37021] transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-[#F37021]" />
                  <span>{t.common.viewDetail}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Comprehensive Quality Diagram + B2B Link */}
        <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {t.certificatesPage.qualityEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#231812]">
                {t.certificatesPage.qualityTitle}
              </h2>
            </div>

            <Link
              href="/b2b"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold transition-colors shrink-0 self-start md:self-auto"
            >
              <span>{t.certificatesPage.requestB2bCta}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={openSafetyDiagram}
            className="group w-full bg-[#FAF7F2] rounded-2xl border border-stone-200 p-4 sm:p-6 block cursor-zoom-in"
          >
            <img
              src={BRAND_ASSETS.foodSafetyDiagram}
              alt={t.certificatesPage.qualityTitle}
              className="w-full max-h-[440px] object-contain mx-auto"
              loading="lazy"
            />
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021]">
              <ZoomIn className="w-4 h-4" />
              {t.common.zoomDetail}
            </span>
          </button>
        </section>
      </div>

      <ImageLightboxModal
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
