'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { BRAND_ASSETS } from '@/data/cobi-content';

export function HeroBanner() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-[#231812] text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C67C3B]/40 bg-[#C67C3B]/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#E8B378]">
            <Sparkles className="h-3.5 w-3.5" />
            {t.home.heroCardEyebrow}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
            {t.home.heroTitlePrefix}{' '}
            <span className="text-[#E8B378]">{t.home.heroTitleHighlight}</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#D8CBB8] sm:text-base">
            {t.home.heroCardTitle}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-[#C67C3B] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#A86224]"
            >
              {t.home.ctaExploreMenu}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/b2b"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              {t.home.ctaOrderB2b}
            </Link>
          </div>
        </div>
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/15">
          <Image
            src={BRAND_ASSETS.heroImage}
            alt="Cobi Bread Artisan Bakery"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
