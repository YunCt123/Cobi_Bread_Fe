'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/i18n';

export interface LightboxItem {
  src: string;
  title: string;
  category?: string;
  description?: string;
}

interface ImageLightboxModalProps {
  items: LightboxItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate?: (index: number) => void;
}

export default function ImageLightboxModal({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: ImageLightboxModalProps) {
  const { t } = useTranslation();
  const isOpen = currentIndex !== null && items[currentIndex] !== undefined;

  useEffect(() => {
    if (!isOpen || currentIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && items.length > 1 && onNavigate) {
        onNavigate((currentIndex + 1) % items.length);
      } else if (e.key === 'ArrowLeft' && items.length > 1 && onNavigate) {
        onNavigate((currentIndex - 1 + items.length) % items.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  if (!isOpen || currentIndex === null) return null;

  const currentItem = items[currentIndex];
  const hasMultiple = items.length > 1 && Boolean(onNavigate);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={currentItem.title}
    >
      <div
        className="max-w-5xl w-full bg-[#18120F]/95 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentItem.category && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F37021] text-white shrink-0">
                {currentItem.category}
              </span>
            )}
            <span className="text-xs font-semibold text-stone-300 tabular-nums shrink-0">
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.modals.closeLightbox}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fixed Height Viewport Container */}
        <div className="relative h-[65vh] sm:h-[75vh] flex items-center justify-center bg-black/40 rounded-xl overflow-hidden">
          <img
            src={currentItem.src}
            alt={currentItem.title}
            className="max-h-full max-w-full w-auto h-auto object-contain select-none"
          />

          {hasMultiple && onNavigate && (
            <>
              <button
                type="button"
                onClick={() => onNavigate((currentIndex - 1 + items.length) % items.length)}
                aria-label={t.modals.prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#F37021] text-white border border-white/15 transition-colors cursor-pointer shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate((currentIndex + 1) % items.length)}
                aria-label={t.modals.nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#F37021] text-white border border-white/15 transition-colors cursor-pointer shadow-lg"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}
        </div>

        {/* Caption Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white pt-1">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
              {currentItem.title}
            </h3>
            {currentItem.description && (
              <p className="text-xs text-stone-300 mt-0.5 line-clamp-2">
                {currentItem.description}
              </p>
            )}
          </div>
          <span className="text-[11px] text-stone-400 shrink-0 hidden sm:inline">
            {hasMultiple ? t.modals.lightboxHintMulti : t.modals.lightboxHintSingle}
          </span>
        </div>
      </div>
    </div>
  );
}
