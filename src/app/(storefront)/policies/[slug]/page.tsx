'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronRight,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  MapPin,
  ZoomIn,
  FileText,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { getLocalizedPoliciesData } from '@/data/cobi-content';
import ImageLightboxModal, { LightboxItem } from '@/components/common/ImageLightboxModal';
import { useTranslation } from '@/i18n';

export default function PolicyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t, locale } = useTranslation();

  const policies = getLocalizedPoliciesData(locale);
  const policy = policies.find((p) => p.slug === slug);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!policy) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 max-w-md text-center space-y-4 border border-stone-200 shadow-xs">
          <h1 className="font-display text-xl font-bold text-[#231812]">
            {t.policiesPage.notFoundTitle}
          </h1>
          <p className="text-xs text-stone-500">{t.policiesPage.notFoundDesc}</p>
          <Link
            href="/policies"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#F37021] text-white text-xs font-bold hover:bg-[#D95D14]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.policiesPage.backToList}</span>
          </Link>
        </div>
      </div>
    );
  }

  const aboutDocs = policies.filter((p) => p.group === 'ABOUT');
  const serviceDocs = policies.filter((p) => p.group === 'SERVICE');

  const attachmentLightboxItems: LightboxItem[] = (policy.attachments || []).map((att) => ({
    src: att.image,
    title: att.title,
    category: policy.shortTitle,
    description: att.caption,
  }));

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
          <Link href="/" className="hover:text-[#F37021] transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/policies" className="hover:text-[#F37021] transition-colors">
            {t.policiesPage.breadcrumbParent}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-[#231812] truncate">{policy.shortTitle}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: Navigation between Policies */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-stone-200/80 p-5 shadow-xs space-y-5">
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 mb-2">
                  {t.policiesPage.sidebarAboutTitle}
                </h3>
                <nav className="space-y-1">
                  {aboutDocs.map((item) => {
                    const isActive = item.slug === policy.slug;
                    return (
                      <Link
                        key={item.slug}
                        href={`/policies/${item.slug}`}
                        className={`block px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                          isActive
                            ? 'bg-[#231812] text-white font-bold shadow-xs'
                            : 'text-stone-700 hover:bg-orange-50 hover:text-[#F37021]'
                        }`}
                      >
                        {item.shortTitle}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-3 border-t border-stone-100">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-3 mb-2">
                  {t.policiesPage.sidebarServiceTitle}
                </h3>
                <nav className="space-y-1">
                  <Link
                    href="/b2b"
                    className="block px-3.5 py-2.5 rounded-xl text-xs text-stone-700 hover:bg-orange-50 hover:text-[#F37021] transition-colors"
                  >
                    {t.footer.linkB2b}
                  </Link>
                  {serviceDocs.map((item) => {
                    const isActive = item.slug === policy.slug;
                    return (
                      <Link
                        key={item.slug}
                        href={`/policies/${item.slug}`}
                        className={`block px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                          isActive
                            ? 'bg-[#F37021] text-white font-bold shadow-xs'
                            : 'text-stone-700 hover:bg-orange-50 hover:text-[#F37021]'
                        }`}
                      >
                        {item.shortTitle}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Quick Hotline Box */}
            <div className="bg-[#231812] text-white rounded-3xl p-5 space-y-2.5 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#F37021]">
                {t.policiesPage.supportTitle}
              </span>
              <p className="font-bold text-sm">{t.footer.companyName}</p>
              <p className="text-stone-300">
                {t.footer.supportHotline} <strong className="text-white">03 567 567 20</strong>
              </p>
              <p className="text-stone-300">
                Email:{' '}
                <a href="mailto:cobionline@cobione.com" className="text-[#F37021] hover:underline">
                  cobionline@cobione.com
                </a>
              </p>
            </div>
          </aside>

          {/* RIGHT MAIN ARTICLE */}
          <article className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-10 shadow-xs space-y-8">
            <header className="space-y-3 border-b border-stone-100 pb-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#F37021] border border-orange-200 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {policy.group === 'ABOUT'
                    ? t.policiesPage.badgePolicy
                    : t.policiesPage.badgeService}
                </span>
                <span className="text-xs text-stone-400 font-medium">{policy.updatedAt}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#231812] leading-snug">
                {policy.title}
              </h1>

              <p className="text-sm text-stone-600 leading-relaxed">{policy.subtitle}</p>
            </header>

            {/* Sections */}
            <div className="space-y-7">
              {policy.sections.map((section, idx) => (
                <section key={idx} className="space-y-3">
                  {section.heading && (
                    <h2 className="font-display text-lg sm:text-xl font-bold text-[#231812]">
                      {section.heading}
                    </h2>
                  )}

                  {section.paragraphs?.map((para, pIdx) => (
                    <p key={pIdx} className="text-sm text-stone-700 leading-relaxed">
                      {para}
                    </p>
                  ))}

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="space-y-2 pt-1">
                      {section.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-sm text-stone-700 leading-relaxed"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#F37021] shrink-0 mt-1" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.note && (
                    <div className="bg-[#FAF7F2] border-l-4 border-[#F37021] rounded-r-xl p-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
                      {section.note}
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Attachments (e.g. ERC scan, Diagrams) */}
            {policy.attachments && policy.attachments.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-stone-100">
                <h2 className="font-display text-lg font-bold text-[#231812] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#F37021]" />
                  <span>{t.policiesPage.attachmentsTitle}</span>
                </h2>

                <div className="grid grid-cols-1 gap-5">
                  {policy.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="bg-[#FAF7F2] rounded-2xl border border-stone-200/80 p-4 sm:p-5 space-y-3"
                    >
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="group relative w-full bg-white rounded-xl overflow-hidden border border-stone-200 cursor-zoom-in block p-3"
                      >
                        <img
                          src={att.image}
                          alt={att.title}
                          className={`mx-auto transition-transform duration-300 group-hover:scale-[1.02] ${
                            att.isDiagram ? 'max-h-[380px] object-contain' : 'max-h-[540px] object-contain'
                          }`}
                          loading="lazy"
                        />
                        <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-[#F37021] text-xs font-bold border border-orange-200">
                          <ZoomIn className="w-3.5 h-3.5" />
                          {t.common.zoomDetail}
                        </span>
                      </button>
                      <div className="space-y-1">
                        <p className="text-xs sm:text-sm font-bold text-[#231812]">{att.title}</p>
                        {att.caption && <p className="text-xs text-stone-500">{att.caption}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Official Contact Box */}
            {policy.contactBox && (
              <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-5 sm:p-6 space-y-2.5 text-xs sm:text-sm text-stone-700">
                <p className="font-bold text-[#231812] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#F37021]" />
                  <span>{policy.contactBox.company}</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
                  <span>{policy.contactBox.address}</span>
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1.5 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#F37021]" />
                    <span>
                      {t.policiesPage.telPrefix}{' '}
                      <strong className="text-[#231812]">{policy.contactBox.phone}</strong>
                    </span>
                  </span>
                  {policy.contactBox.hotline && (
                    <span>
                      Hotline:{' '}
                      <strong className="text-[#231812]">{policy.contactBox.hotline}</strong>
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-[#F37021]" />
                    <a
                      href={`mailto:${policy.contactBox.email}`}
                      className="text-[#F37021] font-semibold hover:underline"
                    >
                      {policy.contactBox.email}
                    </a>
                  </span>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      <ImageLightboxModal
        items={attachmentLightboxItems}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
}
