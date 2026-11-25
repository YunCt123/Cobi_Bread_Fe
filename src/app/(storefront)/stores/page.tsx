'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  ExternalLink,
  Store,
  Loader2,
  Navigation,
  ChevronRight,
} from 'lucide-react';
import { branchesApi } from '@/lib/api';
import { Branch } from '@/types';
import { useBranchStore } from '@/stores/branch.store';
import { getBranchVisualMeta } from '@/data/cobi-content';
import {
  useTranslation,
  getLocalizedBranchName,
  getLocalizedBranchAddress,
  getLocalizedBranchCity,
} from '@/i18n';

export default function StoresPage() {
  const { t, locale } = useTranslation();
  const { selectedBranch, setSelectedBranch } = useBranchStore();
  const [mounted, setMounted] = useState(false);
  const [justSelectedId, setJustSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: branches = [], isLoading, isError } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
  });

  const activeBranch = mounted ? selectedBranch : null;

  const handleSelectBranch = (branch: Branch) => {
    setSelectedBranch(branch);
    setJustSelectedId(branch.id);
    setTimeout(() => setJustSelectedId(null), 2500);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#F37021]">
            <Store className="w-3.5 h-3.5" />
            <span>{t.storesPage.badge}</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#231812] tracking-tight">
            {t.storesPage.title}
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">{t.storesPage.subtitle}</p>
        </div>

        {/* Toast Feedback */}
        {justSelectedId && (
          <div className="fixed bottom-6 right-6 z-40 bg-[#231812] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              {t.storesPage.toastSelectedPrefix}{' '}
              {activeBranch ? getLocalizedBranchName(activeBranch, locale) : ''}
            </span>
          </div>
        )}

        {/* Active Branch Reminder */}
        {activeBranch && (
          <div className="bg-white rounded-3xl border-2 border-[#F37021]/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#F37021] flex items-center justify-center shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F37021]">
                  {t.storesPage.activeReminderLabel}
                </span>
                <h2 className="font-display text-lg font-bold text-[#231812]">
                  {getLocalizedBranchName(activeBranch, locale)}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {getLocalizedBranchAddress(activeBranch, locale)}
                  {activeBranch.city ? `, ${getLocalizedBranchCity(activeBranch, locale)}` : ''}
                </p>
              </div>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
            >
              <span>{t.storesPage.orderFromBranch}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Loading & Error */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin text-[#F37021]" />
            <span className="text-sm font-semibold">{t.common.loading}</span>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-3xl p-8 text-center text-sm text-red-600 border border-red-200">
            {t.common.backendError}
          </div>
        ) : (
          /* 5 Branches Grid with Real Branch Photos + Embedded Google Maps */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {branches.map((branch, index) => {
              const isSelected = activeBranch?.id === branch.id;
              const visualMeta = getBranchVisualMeta(branch);
              const branchName = getLocalizedBranchName(branch, locale);
              const branchAddress = getLocalizedBranchAddress(branch, locale);
              const branchCity = getLocalizedBranchCity(branch, locale);

              return (
                <div
                  key={branch.id}
                  className={`bg-white rounded-3xl border overflow-hidden transition-all flex flex-col justify-between shadow-xs ${
                    isSelected
                      ? 'border-[#F37021] ring-2 ring-[#F37021]/20'
                      : 'border-stone-200/80 hover:border-[#F37021]/60'
                  }`}
                >
                  {/* Real Branch Photo */}
                  <div className="relative aspect-[16/9] w-full bg-stone-100 overflow-hidden border-b border-stone-100">
                    <img
                      src={visualMeta.image}
                      alt={branchName}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-[#231812]/90 text-white flex items-center justify-center font-bold text-xs shadow-md backdrop-blur-sm">
                        0{index + 1}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.storesPage.selectedTag}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Branch Info + Google Maps Embed */}
                  <div className="p-6 space-y-5 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                          COBI BREAD BAKERY CAFE
                        </span>
                        <h3 className="font-display text-xl font-bold text-[#231812] mt-0.5">
                          {branchName}
                        </h3>
                      </div>

                      <div className="space-y-2.5 text-xs text-stone-600">
                        <p className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            {branchAddress}
                            {branchCity ? `, ${branchCity}` : ''}
                          </span>
                        </p>

                        <p className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-[#F37021] shrink-0" />
                          <a
                            href={`tel:${branch.phone}`}
                            className="font-bold text-[#231812] hover:text-[#F37021] hover:underline"
                          >
                            {branch.phone}
                          </a>
                        </p>

                        <p className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-[#F37021] shrink-0" />
                          <span>{branch.openHours}</span>
                        </p>
                      </div>

                      {/* Embedded Interactive Google Map */}
                      <div className="rounded-2xl overflow-hidden border border-stone-200/80 bg-stone-100 h-48 relative">
                        <iframe
                          title={`${t.storesPage.mapTitlePrefix} ${branch.name}`}
                          src={visualMeta.mapEmbedUrl}
                          className="w-full h-full border-0"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectBranch(branch)}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-[#231812] hover:bg-stone-800 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {isSelected
                            ? t.storesPage.yourBranchBtn
                            : t.storesPage.selectBranchBtn}
                        </span>
                      </button>

                      <a
                        href={visualMeta.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-4 rounded-xl border border-stone-200 hover:border-[#F37021] text-xs font-bold text-[#231812] hover:text-[#F37021] transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>{t.storesPage.openInMaps}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
