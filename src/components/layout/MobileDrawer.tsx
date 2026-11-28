'use client';

import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function MobileDrawer({ open, onClose, title, children }: MobileDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 z-10 flex w-80 max-w-[85vw] flex-col bg-[#FAF7F2] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E8DFD1] px-4 py-3.5">
          <span className="font-display text-base font-bold text-[#231812]">
            {title || 'Cobi Bread'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#6E5D4F] hover:bg-[#EFE7DA]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
