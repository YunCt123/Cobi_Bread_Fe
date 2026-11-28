'use client';

import { Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/utils/cn';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-[#E6DCD2] bg-[#FAF6F0] p-0.5 text-xs font-bold',
        className
      )}
    >
      <Globe className="ml-2 mr-1 h-3.5 w-3.5 text-[#8A7560]" />
      <button
        type="button"
        onClick={() => setLocale('vi')}
        className={cn(
          'rounded-full px-2.5 py-1 transition',
          locale === 'vi'
            ? 'bg-[#231812] text-white shadow-xs'
            : 'text-[#6E5D4F] hover:text-[#231812]'
        )}
      >
        VI
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={cn(
          'rounded-full px-2.5 py-1 transition',
          locale === 'en'
            ? 'bg-[#231812] text-white shadow-xs'
            : 'text-[#6E5D4F] hover:text-[#231812]'
        )}
      >
        EN
      </button>
    </div>
  );
}
