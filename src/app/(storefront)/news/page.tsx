'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, User, ChevronRight, Newspaper, ArrowRight } from 'lucide-react';
import { getLocalizedNewsArticles } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

export default function NewsPage() {
  const { t, locale } = useTranslation();
  const articles = getLocalizedNewsArticles(locale);

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Reset category filter to ALL when switching locale so labels never go stale
  useEffect(() => {
    setSelectedCategory('ALL');
  }, [locale]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.category)));
    return unique;
  }, [articles]);

  const filteredArticles =
    selectedCategory === 'ALL'
      ? articles
      : articles.filter((article) => article.category === selectedCategory);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812]">{t.common.news}</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#F37021]">
            <Newspaper className="w-3.5 h-3.5" />
            <span>{t.newsPage.eyebrow}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#231812] tracking-tight">
            {t.newsPage.title}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">{t.newsPage.subtitle}</p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              selectedCategory === 'ALL'
                ? 'bg-[#231812] text-white border-[#231812] shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#F37021] hover:text-[#F37021]'
            }`}
          >
            {t.newsPage.allCategory}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-[#F37021] text-white border-[#F37021] shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-[#F37021] hover:text-[#F37021]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/news/${article.slug}`}
              className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden hover:border-[#F37021]/60 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-stone-100 overflow-hidden">
                  <img
                    src={article.thumbnail}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-[#231812] text-[10px] font-bold shadow-xs">
                    {article.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#F37021]" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#F37021]" />
                      {article.author}
                    </span>
                  </div>

                  <h2 className="font-display text-lg font-bold text-[#231812] group-hover:text-[#F37021] transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021] group-hover:underline">
                  <span>{t.newsPage.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
