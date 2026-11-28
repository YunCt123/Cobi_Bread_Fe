'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface QuickSearchProps {
  open: boolean;
  onClose: () => void;
}

export function QuickSearch({ open, onClose }: QuickSearchProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div className="border-t border-[#ECE3D5] bg-[#FAF7F2] px-4 py-3">
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl items-center gap-2">
        <Search className="h-4 w-4 text-[#8A7560]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.common.searchPlaceholder}
          className="flex-1 bg-transparent text-sm text-[#231812] outline-none placeholder:text-[#9E8B76]"
          autoFocus
        />
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-[#8A7560] hover:bg-[#EFE7DA]"
        >
          <X className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
