'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Truck,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Building2,
} from 'lucide-react';
import { getLocalizedPoliciesData } from '@/data/cobi-content';
import { useTranslation } from '@/i18n';

export default function PoliciesIndexPage() {
  const { t, locale } = useTranslation();
  const policies = getLocalizedPoliciesData(locale);

  const aboutDocs = policies.filter((p) => p.group === 'ABOUT');
  const serviceDocs = policies.filter((p) => p.group === 'SERVICE');

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812]">{t.policiesPage.breadcrumbParent}</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#F37021]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{t.policiesPage.eyebrow}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#231812] tracking-tight">
            {t.policiesPage.indexTitle}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">{t.policiesPage.indexSubtitle}</p>
        </div>

        {/* Group 1: Về chúng tôi & Pháp lý */}
        <section className="space-y-5">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#231812] flex items-center gap-2.5 border-b border-stone-200 pb-3">
            <Shield className="w-5 h-5 text-[#F37021]" />
            <span>{t.policiesPage.groupAboutTitle}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aboutDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/policies/${doc.slug}`}
                className="group bg-white rounded-3xl border border-stone-200/80 p-6 hover:border-[#F37021]/60 hover:shadow-lg transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#F37021]">
                    <span className="inline-flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {doc.updatedAt}
                    </span>
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#231812] group-hover:text-[#F37021] transition-colors leading-snug">
                    {doc.shortTitle}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                    {doc.subtitle}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021] group-hover:underline">
                  <span>{t.policiesPage.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Group 2: Dịch vụ */}
        <section className="space-y-5">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#231812] flex items-center gap-2.5 border-b border-stone-200 pb-3">
            <Truck className="w-5 h-5 text-[#F37021]" />
            <span>{t.policiesPage.groupServiceTitle}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {serviceDocs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/policies/${doc.slug}`}
                className="group bg-white rounded-3xl border border-stone-200/80 p-6 hover:border-[#F37021]/60 hover:shadow-lg transition-all flex flex-col justify-between gap-4"
              >
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-[#F37021] block">
                    {doc.updatedAt}
                  </span>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#231812] group-hover:text-[#F37021] transition-colors leading-snug">
                    {doc.shortTitle}
                  </h3>
                  <p className="text-xs text-stone-500 leading-relaxed line-clamp-3">
                    {doc.subtitle}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021] group-hover:underline">
                  <span>{t.common.viewDetail}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}

            {/* Quick B2B Solution Card */}
            <Link
              href="/b2b"
              className="group bg-[#231812] text-white rounded-3xl p-6 hover:bg-[#2F2119] shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F37021] flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{t.policiesPage.b2bLabel}</span>
                </span>
                <h3 className="font-display text-lg font-bold text-white leading-snug">
                  {t.footer.linkB2b}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">{t.policiesPage.b2bDesc}</p>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F37021]">
                <span>{t.policiesPage.exploreB2b}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
