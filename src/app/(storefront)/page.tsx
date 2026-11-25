'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Play,
  ArrowRight,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Truck,
  PackageCheck,
  ChefHat,
  Sparkles,
  Award,
  Newspaper,
  Calendar,
} from 'lucide-react';
import { categoriesApi, productsApi } from '@/lib/api';
import { Category, Product } from '@/types';
import { useBranchStore } from '@/stores/branch.store';
import ProductCard from '@/components/ProductCard';
import VideoModal from '@/components/VideoModal';
import {
  BRAND_ASSETS,
  getCategoryThumbnail,
  getLocalizedAboutData,
  getLocalizedNewsArticles,
} from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedCategoryName,
  getLocalizedBranchName,
} from '@/i18n';

type FilterTab = 'ALL' | 'CROISSANT' | 'FROZEN' | 'SWEET' | 'SAVORY';

export default function HomePage() {
  const { t, locale } = useTranslation();
  const { selectedBranch } = useBranchStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const aboutData = getLocalizedAboutData(locale);
  const newsArticles = getLocalizedNewsArticles(locale);

  // Fetch 9 categories with ?lang=
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories', locale],
    queryFn: () => categoriesApi.getAll(locale),
  });

  // Fetch featured products with ?lang=
  const { data: productsRes, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['home-products', locale],
    queryFn: () => productsApi.getAll({ limit: 40, lang: locale }),
  });

  const allProducts: Product[] = useMemo(() => {
    if (!productsRes) return [];
    if (Array.isArray(productsRes)) return productsRes;
    if ('items' in productsRes && Array.isArray((productsRes as { items?: Product[] }).items)) {
      return (productsRes as { items: Product[] }).items;
    }
    if ('data' in productsRes && Array.isArray((productsRes as { data?: Product[] }).data)) {
      return (productsRes as { data: Product[] }).data;
    }
    return [];
  }, [productsRes]);

  const filteredProducts = useMemo(() => {
    if (!allProducts.length) return [];

    let list = allProducts;
    if (activeTab === 'FROZEN') {
      list = allProducts.filter((p) => p.storageType === 'FROZEN');
    } else if (activeTab === 'CROISSANT') {
      list = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes('croissant') ||
          p.name.toLowerCase().includes('sừng bò') ||
          (p.category?.slug || '').includes('croissant')
      );
    } else if (activeTab === 'SWEET') {
      list = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes('kem') ||
          p.name.toLowerCase().includes('sữa') ||
          p.name.toLowerCase().includes('ngọt') ||
          p.name.toLowerCase().includes('chocolate') ||
          p.name.toLowerCase().includes('bông lan') ||
          (p.category?.slug || '').includes('kem-tuoi') ||
          (p.category?.slug || '').includes('bong-lan')
      );
    } else if (activeTab === 'SAVORY') {
      list = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes('pocket') ||
          p.name.toLowerCase().includes('que') ||
          p.name.toLowerCase().includes('mặn') ||
          p.name.toLowerCase().includes('gà') ||
          p.name.toLowerCase().includes('phô mai') ||
          (p.category?.slug || '').includes('pocket') ||
          (p.category?.slug || '').includes('que')
      );
    }

    return list.slice(0, 8);
  }, [allProducts, activeTab]);

  const featuredTabs: { key: FilterTab; label: string }[] = [
    { key: 'ALL', label: t.home.tabAll },
    { key: 'CROISSANT', label: t.home.tabCroissant },
    { key: 'FROZEN', label: t.home.tabFrozen },
    { key: 'SWEET', label: t.home.tabSweet },
    { key: 'SAVORY', label: t.home.tabSavory },
  ];

  return (
    <div className="bg-[#FAF7F2] text-[#231812]">
      {/* =====================================================================
          1. HERO BANNER SECTION
         ===================================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#FFF4E9] to-[#FCE9D8] border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-orange-200 shadow-2xs text-xs font-bold text-[#F37021]">
                <ChefHat className="w-4 h-4" />
                <span>{aboutData.eyebrow} • COBI GROUP</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.14] text-[#231812]">
                {t.home.heroTitlePrefix}{' '}
                <span className="text-[#F37021] block sm:inline mt-1 sm:mt-0">
                  {t.home.heroTitleHighlight}
                </span>
              </h1>

              <p className="text-sm sm:text-base text-stone-600 max-w-2xl leading-relaxed">
                {aboutData.paragraphs[0]}
              </p>

              {/* Selected Branch Reminder Bar */}
              <div className="inline-flex flex-wrap items-center gap-2.5 bg-white/90 border border-stone-200/90 rounded-2xl px-4 py-2.5 shadow-xs text-xs">
                <MapPin className="w-4 h-4 text-[#F37021] shrink-0" />
                <span className="text-stone-500 font-medium">{t.home.servingBranch}</span>
                <span className="font-bold text-[#231812]">
                  {mounted && selectedBranch
                    ? getLocalizedBranchName(selectedBranch, locale)
                    : 'Cobi Bread Flagship'}
                </span>
                <Link
                  href="/stores"
                  className="text-[#F37021] font-bold hover:underline ml-1"
                >
                  {t.common.change} →
                </Link>
              </div>

              {/* Hero CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-sm shadow-lg shadow-[#F37021]/25 transition-all"
                >
                  <span>{t.home.ctaExploreMenu}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/b2b"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#231812] hover:bg-stone-800 text-white font-bold text-sm shadow-md transition-all"
                >
                  <span>{t.home.ctaOrderB2b}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white hover:bg-orange-50 border border-stone-200 text-[#231812] font-bold text-sm transition-all cursor-pointer shadow-xs"
                >
                  <span className="w-6 h-6 rounded-full bg-[#F37021]/15 text-[#F37021] flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-[#F37021]" />
                  </span>
                  <span>{t.home.ctaWatchVideo}</span>
                </button>
              </div>
            </div>

            {/* Hero Right Framed Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/80 bg-[#231812] group">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={BRAND_ASSETS.heroImage}
                    alt={t.home.heroCardTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1.5">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#FFA062]">
                    {t.home.heroCardEyebrow}
                  </span>
                  <h2 className="font-display text-xl sm:text-2xl font-bold leading-snug">
                    {t.home.heroCardTitle}
                  </h2>
                  <p className="text-xs text-stone-200 leading-relaxed line-clamp-2">
                    {t.home.heroCardDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. 9 FEATURED PRODUCT CATEGORIES BAR
         ===================================================================== */}
      <section className="py-12 sm:py-14 bg-white border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-7">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F37021]">
                COBI BREAD MENU
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#231812] mt-1">
                {t.home.categoriesBarTitle}
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#F37021] hover:underline inline-flex items-center gap-1"
            >
              {t.home.viewFullMenu}
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.slice(0, 9).map((cat) => {
              const displayName = getLocalizedCategoryName(cat, locale);
              return (
                <Link
                  key={cat.id}
                  href={`/products?categorySlug=${cat.slug}`}
                  className="group bg-[#FAF7F2] hover:bg-orange-50/80 border border-stone-200/80 hover:border-[#F37021]/50 rounded-2xl p-2.5 flex flex-col items-center text-center gap-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-black/5 shrink-0">
                    <img
                      src={getCategoryThumbnail(cat.slug, cat.name)}
                      alt={displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-[#231812] group-hover:text-[#F37021] leading-tight line-clamp-2">
                    {displayName}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. ABOUT US & CENTRAL KITCHEN SECTION
         ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Image Side */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-lg bg-white">
                <img
                  src={aboutData.mainImage}
                  alt={t.home.factoryTitle}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-stone-200/90 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F37021] flex items-center justify-center shrink-0">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#231812] truncate">
                    {t.home.factoryTitle}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {t.home.factorySubtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div className="lg:col-span-6 space-y-5 lg:pl-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
                {aboutData.eyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812] leading-tight">
                {aboutData.title}
              </h2>
              <p className="text-sm font-semibold text-[#A85016] tracking-wide">
                {aboutData.subSlogan}
              </p>

              <div className="space-y-3 text-sm text-stone-600 leading-relaxed">
                {aboutData.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {aboutData.stats.map((st, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-2xs"
                  >
                    <p className="font-display text-xl sm:text-2xl font-bold text-[#F37021]">
                      {st.value}
                    </p>
                    <p className="text-[11px] text-stone-600 font-medium mt-0.5 leading-snug">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#F37021] hover:text-[#D95D14] hover:underline"
                >
                  <span>{t.home.aboutLinkMore}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. B2B WHOLESALE BANNER
         ===================================================================== */}
      <section className="py-12 bg-[#231812] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#2D2018] via-[#3A281D] to-[#231812] border border-white/10 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FFA062]">
                <Sparkles className="w-3.5 h-3.5" />
                {t.home.b2bBannerTag}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                {t.home.b2bBannerTitle}
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                {t.home.b2bBannerDesc}
              </p>
            </div>

            <Link
              href="/b2b"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl bg-[#F37021] hover:bg-[#D95D14] text-white font-bold text-sm shadow-xl shadow-[#F37021]/25 transition-all shrink-0"
            >
              <span>{t.home.b2bBannerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. RECOMMENDED PRODUCTS BY COBI BREAD (WITH TABS)
         ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
                {t.home.featuredEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812] mt-1">
                {t.home.featuredTitle}
              </h2>
              <p className="text-sm text-stone-600 mt-1">{t.home.featuredSubtitle}</p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-[#F37021] text-xs font-bold text-[#231812] hover:text-[#F37021] transition-colors shrink-0"
            >
              <span>{t.home.viewAllProducts}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
            {featuredTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  activeTab === tab.key
                    ? 'bg-[#231812] text-white border-[#231812] shadow-sm'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-[#F37021] hover:text-[#F37021]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-stone-200 p-4 h-80 animate-pulse"
                >
                  <div className="bg-stone-100 rounded-2xl h-44 mb-4" />
                  <div className="bg-stone-100 h-4 w-3/4 rounded mb-2" />
                  <div className="bg-stone-100 h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center text-sm text-stone-500">
              {t.home.noMatchingProducts}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================================
          6. 3 SERVICE PILLARS
         ===================================================================== */}
      <section className="py-14 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl bg-[#FAF7F2] border border-stone-200/80 p-6 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 text-[#F37021] flex items-center justify-center">
                <ChefHat className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#231812]">
                {t.home.pillar1Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.home.pillar1Desc}
              </p>
            </div>

            <div className="rounded-3xl bg-[#FAF7F2] border border-stone-200/80 p-6 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#231812]">
                {t.home.pillar2Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.home.pillar2Desc}
              </p>
            </div>

            <div className="rounded-3xl bg-[#FAF7F2] border border-stone-200/80 p-6 space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#231812]">
                {t.home.pillar3Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.home.pillar3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. WHY CHOOSE COBI BREAD (5 CARDS)
         ===================================================================== */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F37021]">
              {t.home.whyEyebrow}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812]">
              {t.home.whyTitle}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">{t.home.whySubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="space-y-2.5">
                <h3 className="font-display text-lg font-bold text-[#231812]">
                  {t.home.whyCard1Title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t.home.whyCard1Desc}
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-bold text-cyan-800">
                {t.home.whyCard1Footer}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-2.5 shadow-xs">
              <h3 className="font-display text-lg font-bold text-[#231812]">
                {t.home.whyCard2Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.home.whyCard2Desc}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-2.5 shadow-xs">
              <h3 className="font-display text-lg font-bold text-[#231812]">
                {t.home.whyCard3Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.home.whyCard3Desc}
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-2.5 shadow-xs">
              <h3 className="font-display text-lg font-bold text-[#231812]">
                {t.home.whyCard4Title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {t.home.whyCard4Desc}
              </p>
            </div>

            <div className="md:col-span-2 bg-gradient-to-br from-emerald-50/80 via-white to-orange-50/70 rounded-3xl border border-emerald-200/80 p-6 flex flex-col justify-between gap-4 shadow-xs">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <h3 className="font-display text-lg font-bold text-[#231812]">
                    {t.home.whyCard5Title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t.home.whyCard5Desc}
                </p>
              </div>
              <div>
                <Link
                  href="/certificates"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-[#F37021] hover:underline"
                >
                  <Award className="w-4 h-4" />
                  <span>{t.home.whyCard5Link}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. NEWS & UPDATES SECTION
         ===================================================================== */}
      <section className="py-16 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F37021] flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5" />
                {t.home.newsEyebrow}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-[#231812] mt-1">
                {t.home.newsTitle}
              </h2>
            </div>

            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021] hover:underline"
            >
              <span>{t.home.viewAllNews}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsArticles.slice(0, 3).map((article, idx) => (
              <Link
                key={article.slug}
                href={`/news/${article.slug}`}
                className="group bg-[#FAF7F2] rounded-3xl border border-stone-200/80 overflow-hidden hover:border-[#F37021]/60 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                    <img
                      src={article.thumbnail}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {idx === 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F37021] text-white">
                          {t.home.featuredBadge}
                        </span>
                      )}
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-[#231812]">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <Calendar className="w-3.5 h-3.5 text-[#F37021]" />
                      <span>{article.date}</span>
                    </div>
                    <h3 className="font-display text-base font-bold text-[#231812] group-hover:text-[#F37021] transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F37021] group-hover:underline">
                    {t.home.readArticle}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video Intro Modal */}
      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </div>
  );
}
