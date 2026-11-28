'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  Calendar,
  User,
  ArrowLeft,
  CheckCircle2,
  Share2,
  ZoomIn,
  Check,
  Sparkles,
} from 'lucide-react';
import { getLocalizedNewsArticles } from '@/data/cobi-content';
import ImageLightboxModal, { LightboxItem } from '@/components/common/ImageLightboxModal';
import { useTranslation } from '@/i18n';

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useTranslation();

  const articles = getLocalizedNewsArticles(locale);
  const article = articles.find((a) => a.slug === slug);

  const [copiedToast, setCopiedToast] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!article) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center space-y-4 border border-stone-200 shadow-xs">
          <h1 className="font-display text-xl font-bold text-[#231812]">
            {t.newsDetailPage.notFoundTitle}
          </h1>
          <p className="text-xs text-stone-500">{t.newsDetailPage.notFoundDesc}</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F37021] text-white text-xs font-bold hover:bg-[#D95D14]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.newsDetailPage.backToList}</span>
          </Link>
        </div>
      </div>
    );
  }

  const relatedArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const galleryLightboxItems: LightboxItem[] = article.gallery.map((src, i) => ({
    src,
    title: `${article.title} (${i + 1})`,
    category: article.category,
  }));

  const handleCopyUrl = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Copied Toast */}
        {copiedToast && (
          <div className="fixed bottom-6 right-6 z-40 bg-[#231812] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{t.newsDetailPage.copiedToast}</span>
          </div>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
          <Link href="/" className="hover:text-[#F37021]">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/news" className="hover:text-[#F37021]">
            {t.common.news}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812] truncate max-w-md">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Main Article Content */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-orange-50 text-[#F37021] border border-orange-200 text-[11px] font-bold">
                  {article.category}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F37021]" />
                  {article.date}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#F37021]" />
                  {t.newsDetailPage.postedBy} <strong className="text-[#231812]">{article.author}</strong>
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl font-bold text-[#231812] leading-snug">
                {article.title}
              </h1>

              <p className="text-sm sm:text-base font-medium text-stone-600 leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200/70">
                {article.excerpt}
              </p>
            </div>

            {/* Hero Thumbnail */}
            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="group relative w-full rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 block cursor-zoom-in"
            >
              <img
                src={article.thumbnail}
                alt={article.title}
                className="w-full max-h-[460px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
              <span className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/75 text-white text-[11px] font-bold inline-flex items-center gap-1.5 backdrop-blur-sm">
                <ZoomIn className="w-3.5 h-3.5" />
                {t.common.zoomIn}
              </span>
            </button>

            {/* Body Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed">
              {article.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Highlights */}
            {article.highlights && article.highlights.length > 0 && (
              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 space-y-3">
                <h2 className="font-display text-base font-bold text-[#231812] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F37021]" />
                  <span>{t.newsDetailPage.highlightsTitle}</span>
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {article.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Event & Product Gallery */}
            {article.gallery.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <h2 className="font-display text-lg font-bold text-[#231812]">
                  {t.newsDetailPage.galleryTitle}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {article.gallery.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 cursor-zoom-in"
                    >
                      <img
                        src={imgUrl}
                        alt={`${article.title} gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-stone-100">
              <Link
                href="/news"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t.newsDetailPage.backToList}</span>
              </Link>
            </div>
          </article>

          {/* RIGHT: Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Share Card */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-3">
              <h3 className="font-display text-base font-bold text-[#231812] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#F37021]" />
                <span>{t.newsDetailPage.shareTitle}</span>
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                {t.newsDetailPage.shareDesc}
              </p>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-orange-50 border border-stone-200 text-xs font-bold text-[#231812] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedToast ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">{t.newsDetailPage.copiedBtn}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#F37021]" />
                    <span>{t.newsDetailPage.copyLinkBtn}</span>
                  </>
                )}
              </button>
            </div>

            {/* Latest News */}
            <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-xs space-y-4">
              <h3 className="font-display text-base font-bold text-[#231812]">
                {t.newsDetailPage.latestTitle}
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/news/${rel.slug}`}
                    className="group flex items-start gap-3 pb-3 border-b border-stone-100 last:border-0 last:pb-0"
                  >
                    <img
                      src={rel.thumbnail}
                      alt={rel.title}
                      className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] font-bold text-[#F37021] block">
                        {rel.date}
                      </span>
                      <h4 className="text-xs font-bold text-[#231812] group-hover:text-[#F37021] line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Bakery CTA Card */}
            <div className="bg-[#231812] text-white rounded-3xl p-6 space-y-3 shadow-md">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFA062]">
                {t.newsDetailPage.ctaTag}
              </span>
              <h3 className="font-display text-lg font-bold leading-snug">
                {t.newsDetailPage.ctaTitle}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">{t.newsDetailPage.ctaDesc}</p>
              <div className="space-y-2 pt-1">
                <Link
                  href="/products"
                  className="block w-full py-2.5 px-4 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-center text-xs font-bold transition-colors"
                >
                  {t.newsDetailPage.ctaMenu}
                </Link>
                <Link
                  href="/b2b"
                  className="block w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-center text-xs font-bold transition-colors"
                >
                  {t.newsDetailPage.ctaB2b}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <ImageLightboxModal
        items={galleryLightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
