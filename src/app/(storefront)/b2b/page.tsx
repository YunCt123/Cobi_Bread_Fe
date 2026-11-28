'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Briefcase,
  Truck,
  Phone,
  Coffee,
  Building2,
  Loader2,
  ExternalLink,
  ZoomIn,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { productsApi } from '@/services';
import { Product } from '@/types';
import ProductCard from '@/components/storefront/ProductCard';
import { BRAND_ASSETS } from '@/data/cobi-content';
import ImageLightboxModal from '@/components/common/ImageLightboxModal';
import { useTranslation } from '@/i18n';

export default function B2bPage() {
  const { t, locale } = useTranslation();
  const [isDiagramZoomed, setIsDiagramZoomed] = useState(false);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['b2b-products', locale],
    queryFn: () => productsApi.getAll({ isB2b: true, limit: 12, lang: locale }),
  });

  const b2bProducts: Product[] = productData?.data || [];

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* B2B Hero Banner */}
      <section className="bg-[#231812] text-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-[#F37021]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{t.b2bPage.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold max-w-3xl leading-tight">
            {t.b2bPage.heroTitle}
          </h1>

          <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            {t.b2bPage.heroDesc}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="tel:0909459387"
              className="px-6 py-3.5 rounded-full bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-sm shadow-lg shadow-[#F37021]/25 transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t.b2bPage.callHcm}</span>
            </a>

            <a
              href="tel:0982219841"
              className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all inline-flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t.b2bPage.callHn}</span>
            </a>

            <a
              href={BRAND_ASSETS.flipbookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-full bg-white text-[#231812] hover:bg-orange-50 font-bold text-sm transition-all inline-flex items-center gap-2"
            >
              <span>{t.b2bPage.viewCatalogue}</span>
              <ExternalLink className="w-4 h-4 text-[#F37021]" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-14 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-stone-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F37021] flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#231812]">{t.b2bPage.card1Title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.b2bPage.card1Desc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-stone-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#231812]">{t.b2bPage.card2Title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.b2bPage.card2Desc}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#FAF7F2] border border-stone-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#231812]">{t.b2bPage.card3Title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.b2bPage.card3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* Total Bakery Solutions Diagram */}
      <section className="py-14 bg-[#FAF7F2] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
                {t.b2bPage.diagramEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#231812] leading-snug">
                {t.b2bPage.diagramTitle}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">{t.b2bPage.diagramDesc}</p>
              <Link
                href="/certificates"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-[#F37021] hover:underline"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.b2bPage.viewCertsLink}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <button
                type="button"
                onClick={() => setIsDiagramZoomed(true)}
                className="group relative w-full bg-[#FAF7F2] rounded-2xl border border-stone-200 p-4 cursor-zoom-in block"
              >
                <img
                  src={BRAND_ASSETS.b2bSolutionsDiagram}
                  alt={t.b2bPage.diagramTitle}
                  className="w-full max-h-80 object-contain mx-auto"
                  loading="lazy"
                />
                <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#F37021]">
                  <ZoomIn className="w-3.5 h-3.5" />
                  {t.common.zoomDetail}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Products Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
                {t.b2bPage.catalogEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#231812] mt-1">
                {t.b2bPage.catalogTitle}
              </h2>
            </div>

            <Link
              href="/products?isB2b=true"
              className="text-xs font-bold text-[#F37021] hover:underline"
            >
              {t.b2bPage.viewFilterLink} →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#F37021]" />
              <span className="text-xs font-semibold">{t.common.loading}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {b2bProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ImageLightboxModal
        items={[
          {
            src: BRAND_ASSETS.b2bSolutionsDiagram,
            title: t.b2bPage.diagramTitle,
            category: t.b2bPage.diagramEyebrow,
          },
        ]}
        currentIndex={isDiagramZoomed ? 0 : null}
        onClose={() => setIsDiagramZoomed(false)}
      />
    </div>
  );
}
