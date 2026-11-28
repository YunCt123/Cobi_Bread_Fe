'use client';

import React, { useEffect } from 'react';
import { X, Film, ExternalLink } from 'lucide-react';
import { BRAND_ASSETS, extractYouTubeId, getYouTubeEmbedUrl } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoUrl = BRAND_ASSETS.heroVideoUrl,
  title,
  description,
}: VideoModalProps) {
  const { t } = useTranslation();

  const resolvedTitle = title || t.home.videoModalTitle;
  const resolvedDesc = description || t.home.videoModalDesc;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const youtubeId = extractYouTubeId(videoUrl);
  const embedUrl = youtubeId ? getYouTubeEmbedUrl(videoUrl, true) : videoUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={resolvedTitle}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-950/90 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-5xl bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 bg-stone-900/95 text-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#F37021] text-white flex items-center justify-center shrink-0">
              <Film className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold leading-tight truncate">
                {resolvedTitle}
              </h3>
              <p className="text-[11px] text-stone-400 truncate">
                {resolvedDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.modals.closeVideo}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {youtubeId ? (
            <iframe
              src={embedUrl}
              title={resolvedTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              controls
              autoPlay
              playsInline
              poster={BRAND_ASSETS.heroImage}
              className="w-full h-full object-cover"
            >
              <source src={videoUrl} type="video/mp4" />
              {t.modals.videoBrowserUnsupported}
            </video>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.modals.videoFooterNote}</span>
          {youtubeId && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F37021] font-semibold hover:underline inline-flex items-center gap-1"
            >
              <span>{t.modals.watchOnYoutube}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
