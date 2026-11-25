'use client';

import React, { useEffect } from 'react';
import { X, Play, Sparkles, Film } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-stone-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 bg-stone-900/90 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C67C3B] text-white flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold leading-tight">
                COBI BREAD — Tinh Hoa Bánh Mì Thủ Công & Công Nghệ Cấp Đông
              </h3>
              <p className="text-[11px] text-stone-400">
                Thương hiệu bánh ngọt cao cấp thuộc COBI GROUP
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          <video
            controls
            autoPlay
            playsInline
            poster="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&auto=format&fit=crop"
            className="w-full h-full object-cover"
          >
            {/* Direct reliable mp4 video of bakery artisans / baking process */}
            <source 
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4" 
              type="video/mp4" 
            />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        </div>

        {/* Footer info note */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Quy trình sản xuất khép kín tại nhà máy Cobi Home & hệ thống 5 chi nhánh.</span>
          <span className="text-[#C67C3B] font-semibold">100% Tiêu chuẩn ISO 22000 & HACCP</span>
        </div>
      </div>
    </div>
  );
}
