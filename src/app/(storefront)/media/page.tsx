'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Play,
  Film,
  Image as ImageIcon,
  ExternalLink,
  ZoomIn,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { getLocalizedMediaData, MediaVideo } from '@/data/cobi-content';
import VideoModal from '@/components/common/VideoModal';
import ImageLightboxModal, { LightboxItem } from '@/components/common/ImageLightboxModal';
import { useTranslation } from '@/i18n';

export default function MediaPage() {
  const { t, locale } = useTranslation();
  const mediaData = getLocalizedMediaData(locale);

  const [activeTab, setActiveTab] = useState<'ALL' | 'VIDEO' | 'IMAGE'>('ALL');
  const [rawImageCategory, setActiveImageCategory] = useState<string>('ALL');
  const [playingVideo, setPlayingVideo] = useState<MediaVideo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const imageCategories = useMemo(
    () => Array.from(new Set(mediaData.images.map((img) => img.category))),
    [mediaData.images]
  );
  const activeImageCategory =
    rawImageCategory === 'ALL' || imageCategories.includes(rawImageCategory)
      ? rawImageCategory
      : 'ALL';

  const filteredImages =
    activeImageCategory === 'ALL'
      ? mediaData.images
      : mediaData.images.filter((img) => img.category === activeImageCategory);

  const lightboxItems: LightboxItem[] = filteredImages.map((img) => ({
    src: img.src,
    title: img.title,
    category: img.category,
    description: img.description,
  }));

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812]">{t.common.media}</span>
        </nav>

        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#F37021]">
            <Film className="w-3.5 h-3.5" />
            <span>{t.mediaPage.eyebrow}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#231812] tracking-tight">
            {t.mediaPage.title}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">{t.mediaPage.subtitle}</p>
        </div>

        {/* Media Type Tabs */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${
              activeTab === 'ALL'
                ? 'bg-[#231812] text-white border-[#231812] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#F37021] hover:text-[#F37021]'
            }`}
          >
            {t.mediaPage.tabAll}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('VIDEO')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'VIDEO'
                ? 'bg-[#F37021] text-white border-[#F37021] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#F37021] hover:text-[#F37021]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>
              {t.mediaPage.tabVideos} ({mediaData.videos.length})
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('IMAGE')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
              activeTab === 'IMAGE'
                ? 'bg-[#F37021] text-white border-[#F37021] shadow-sm'
                : 'bg-white text-stone-700 border-stone-200 hover:border-[#F37021] hover:text-[#F37021]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>
              {t.mediaPage.tabImages} ({mediaData.images.length})
            </span>
          </button>
        </div>

        {/* =====================================================================
            VIDEO GALLERY SECTION
           ===================================================================== */}
        {(activeTab === 'ALL' || activeTab === 'VIDEO') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h2 className="font-display text-2xl font-bold text-[#231812] flex items-center gap-2">
                <Film className="w-5 h-5 text-[#F37021]" />
                <span>{t.mediaPage.videoHeading}</span>
              </h2>
              <span className="text-xs font-semibold text-stone-500">
                {mediaData.videos.length} {t.mediaPage.videoCountSuffix}
              </span>
            </div>

            {/* Featured First Video */}
            {mediaData.videos[0] && (
              <div className="bg-[#231812] text-white rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-white/10 shadow-xl">
                <button
                  type="button"
                  onClick={() => setPlayingVideo(mediaData.videos[0])}
                  className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[260px] bg-black overflow-hidden group cursor-pointer"
                >
                  <img
                    src={mediaData.videos[0].fallbackThumbnail}
                    alt={mediaData.videos[0].title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-[#F37021] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </span>
                  </div>
                </button>

                <div className="lg:col-span-5 p-7 sm:p-10 flex flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#FFA062]">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t.mediaPage.featuredVideoTag}
                    </span>
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug">
                      {mediaData.videos[0].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                      {mediaData.videos[0].description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(mediaData.videos[0])}
                      className="px-5 py-3 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{t.mediaPage.playNow}</span>
                    </button>
                    <a
                      href={mediaData.videos[0].youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>{t.mediaPage.openYoutube}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Remaining Videos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mediaData.videos.slice(1).map((vid) => (
                <div
                  key={vid.id}
                  className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#F37021]/60 transition-all"
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(vid)}
                      className="relative aspect-video w-full bg-stone-900 overflow-hidden block cursor-pointer"
                    >
                      <img
                        src={vid.fallbackThumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <span className="w-12 h-12 rounded-full bg-[#F37021]/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </span>
                      </div>
                    </button>

                    <div className="p-5 space-y-2">
                      <h3 className="font-display text-base font-bold text-[#231812] line-clamp-2 leading-snug">
                        {vid.title}
                      </h3>
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setPlayingVideo(vid)}
                      className="font-bold text-[#F37021] hover:underline cursor-pointer"
                    >
                      {t.mediaPage.watchNow} →
                    </button>
                    <a
                      href={vid.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-500 hover:text-[#231812] inline-flex items-center gap-1"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =====================================================================
            PHOTO GALLERY SECTION
           ===================================================================== */}
        {(activeTab === 'ALL' || activeTab === 'IMAGE') && (
          <section className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <h2 className="font-display text-2xl font-bold text-[#231812] flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#F37021]" />
                <span>{t.mediaPage.galleryHeading}</span>
              </h2>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveImageCategory('ALL')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    activeImageCategory === 'ALL'
                      ? 'bg-[#231812] text-white'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-[#F37021]'
                  }`}
                >
                  {t.mediaPage.allImageCats}
                </button>
                {imageCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveImageCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                      activeImageCategory === cat
                        ? 'bg-[#F37021] text-white'
                        : 'bg-white text-stone-600 border border-stone-200 hover:border-[#F37021]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredImages.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setLightboxIndex(idx)}
                  className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:border-[#F37021]/60 hover:shadow-lg transition-all text-left cursor-zoom-in flex flex-col"
                >
                  <div className="relative aspect-[4/3] w-full bg-stone-100 overflow-hidden">
                    <img
                      src={img.src}
                      alt={img.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-[#231812] text-[10px] font-bold">
                      {img.category}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-bold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-3 h-3" />
                      {t.common.zoomIn}
                    </span>
                  </div>
                  <div className="p-5 space-y-1">
                    <h3 className="font-display text-sm sm:text-base font-bold text-[#231812] group-hover:text-[#F37021] transition-colors line-clamp-1">
                      {img.title}
                    </h3>
                    {img.description && (
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {img.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Modals */}
      <VideoModal
        isOpen={Boolean(playingVideo)}
        onClose={() => setPlayingVideo(null)}
        videoUrl={playingVideo?.youtubeUrl}
        title={playingVideo?.title}
        description={playingVideo?.description}
      />

      <ImageLightboxModal
        items={lightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
