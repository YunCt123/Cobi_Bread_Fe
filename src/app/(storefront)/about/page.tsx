'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Award,
  CheckCircle2,
  ShieldCheck,
  ChefHat,
  Star,
  ArrowRight,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';
import { BRAND_ASSETS, getLocalizedAboutData } from '@/data/cobi-content';
import ImageLightboxModal, { LightboxItem } from '@/components/ImageLightboxModal';
import { useTranslation } from '@/i18n';

export default function AboutPage() {
  const { t, locale } = useTranslation();
  const aboutData = getLocalizedAboutData(locale);

  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (items: LightboxItem[], idx = 0) => {
    setLightboxItems(items);
    setLightboxIndex(idx);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* =====================================================================
          1. HERO INTRO SECTION
         ===================================================================== */}
      <section className="relative bg-gradient-to-br from-[#FAF7F2] via-[#FFF4E9] to-[#FCE8D5] py-12 sm:py-20 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-stone-500">
            <Link href="/" className="hover:text-[#F37021]">
              {t.common.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-semibold text-[#231812]">{t.common.about}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-orange-200 text-xs font-bold text-[#F37021] shadow-2xs">
                <ChefHat className="w-4 h-4" />
                <span>{aboutData.eyebrow} • COBI GROUP</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#231812] leading-tight">
                {aboutData.title}
              </h1>

              <div className="space-y-1">
                <p className="text-base sm:text-lg font-bold text-[#F37021]">{aboutData.slogan}</p>
                <p className="text-xs sm:text-sm font-semibold text-stone-600 uppercase tracking-wide">
                  {aboutData.subSlogan}
                </p>
              </div>

              <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
                {aboutData.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {aboutData.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs"
                  >
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#F37021]">
                      {st.value}
                    </p>
                    <p className="text-xs text-stone-600 font-medium mt-1 leading-snug">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Dual Image Collage */}
            <div className="lg:col-span-5 space-y-4">
              <button
                type="button"
                onClick={() =>
                  openLightbox([
                    {
                      src: aboutData.mainImage,
                      title: aboutData.title,
                      category: aboutData.eyebrow,
                    },
                    {
                      src: aboutData.cafeImage,
                      title: 'Cobi Bread Bakery Cafe',
                      category: aboutData.eyebrow,
                    },
                  ])
                }
                className="group relative block w-full rounded-3xl overflow-hidden border border-white shadow-xl cursor-zoom-in"
              >
                <img
                  src={aboutData.mainImage}
                  alt={aboutData.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/70 text-white text-[11px] font-bold inline-flex items-center gap-1.5 backdrop-blur-sm">
                  <ZoomIn className="w-3.5 h-3.5" />
                  {t.common.zoomIn}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. FRESH & DELICIOUS EVERY DAY SECTION
         ===================================================================== */}
      <section className="py-16 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <button
                type="button"
                onClick={() =>
                  openLightbox([
                    {
                      src: aboutData.freshSection.image,
                      title: aboutData.freshSection.title,
                      category: t.aboutPage.artTitle,
                      description: aboutData.freshSection.description,
                    },
                  ])
                }
                className="group relative w-full rounded-3xl overflow-hidden border border-stone-200 shadow-lg cursor-zoom-in block"
              >
                <img
                  src={aboutData.freshSection.image}
                  alt={aboutData.freshSection.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </button>
            </div>

            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021] inline-flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                {t.aboutPage.artTitle}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812]">
                {aboutData.freshSection.title}
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                {aboutData.freshSection.description}
              </p>

              <div className="bg-[#FAF7F2] rounded-2xl p-4 border border-stone-200/80 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F37021]">
                  {aboutData.freshSection.productListTitle}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#231812]">
                  {aboutData.freshSection.productListText}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md transition-all"
                >
                  <span>{t.aboutPage.exploreMenuBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/certificates"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-emerald-50 border border-stone-200 text-[#231812] text-xs font-bold transition-all"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{t.aboutPage.viewCertsBtn}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. 3 ECOSYSTEM PILLARS (Central Kitchen / Total Solutions / Academy)
         ===================================================================== */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
              {t.aboutPage.ecosystemEyebrow}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812]">
              {t.aboutPage.ecosystemTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutData.pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col"
              >
                <button
                  type="button"
                  onClick={() =>
                    openLightbox([
                      {
                        src: pillar.image,
                        title: pillar.title,
                        category: t.aboutPage.ecosystemEyebrow,
                        description: pillar.description,
                      },
                    ])
                  }
                  className={`relative aspect-[16/10] w-full overflow-hidden cursor-zoom-in group ${
                    pillar.isDiagram ? 'bg-[#FAF7F2] p-4' : 'bg-stone-100'
                  }`}
                >
                  <img
                    src={pillar.image}
                    alt={pillar.title}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                      pillar.isDiagram ? 'object-contain' : 'object-cover'
                    }`}
                    loading="lazy"
                  />
                </button>
                <div className="p-6 space-y-2.5 flex-1">
                  <span className="text-[11px] font-bold text-[#F37021]">0{idx + 1}</span>
                  <h3 className="font-display text-lg font-bold text-[#231812]">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. MISSION & FOOD SAFETY VALUE CHAIN
         ===================================================================== */}
      <section className="py-16 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
                {t.aboutPage.visionEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812]">
                {aboutData.mission.title} {t.aboutPage.missionHeadingSuffix}
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-stone-600 leading-relaxed">
                {aboutData.mission.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-lg bg-[#FAF7F2]">
                <img
                  src={aboutData.mission.image}
                  alt={aboutData.mission.title}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Food Safety Diagram */}
          <div className="bg-[#FAF7F2] rounded-3xl border border-stone-200/80 p-6 sm:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {t.aboutPage.safetyEyebrow}
                </span>
                <h3 className="font-display text-xl sm:text-3xl font-bold text-[#231812] mt-1">
                  {t.aboutPage.safetyTitle}
                </h3>
              </div>
              <Link
                href="/certificates"
                className="text-xs font-bold text-[#F37021] hover:underline inline-flex items-center gap-1"
              >
                <Award className="w-4 h-4" />
                {t.aboutPage.viewCertsBtn}
              </Link>
            </div>

            <button
              type="button"
              onClick={() =>
                openLightbox([
                  {
                    src: BRAND_ASSETS.foodSafetyDiagram,
                    title: t.aboutPage.safetyTitle,
                    category: t.aboutPage.safetyEyebrow,
                  },
                ])
              }
              className="group relative w-full bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 cursor-zoom-in block"
            >
              <img
                src={BRAND_ASSETS.foodSafetyDiagram}
                alt={t.aboutPage.safetyTitle}
                className="w-full max-h-[420px] object-contain mx-auto"
                loading="lazy"
              />
              <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#F37021]">
                <ZoomIn className="w-3.5 h-3.5" />
                {t.common.zoomDetail}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. TRUSTED PARTNERS & CUSTOMER TESTIMONIALS
         ===================================================================== */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Partners Showcase */}
          <div className="space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
                {t.aboutPage.partnersEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#231812]">
                {t.aboutPage.partnersTitle}
              </h2>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
              <img
                src={BRAND_ASSETS.partnersImage}
                alt={t.aboutPage.partnersTitle}
                className="w-full max-w-4xl mx-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
                {t.aboutPage.reviewsEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812]">
                {t.aboutPage.reviewsTitle}
              </h2>
              <p className="text-sm text-stone-600">{t.aboutPage.reviewsSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {aboutData.testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-stone-200/80 p-6 flex flex-col justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(item.rating)].map((_, sIdx) => (
                        <Star key={sIdx} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#231812]">{item.name}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.aboutPage.verifiedExperience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Partnership CTA */}
          <div className="bg-[#231812] text-white rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h3 className="font-display text-2xl sm:text-3xl font-bold">{t.aboutPage.ctaTitle}</h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {t.aboutPage.ctaDesc}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/b2b"
                className="px-6 py-3.5 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-xs sm:text-sm transition-colors"
              >
                {t.aboutPage.ctaB2b}
              </Link>
              <Link
                href="/stores"
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-colors"
              >
                {t.aboutPage.ctaStores}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ImageLightboxModal
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
