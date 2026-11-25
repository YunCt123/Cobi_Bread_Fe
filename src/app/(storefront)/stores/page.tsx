'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Navigation, 
  Sparkles,
  Building,
  AlertCircle
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { branchesApi } from '@/lib/api';
import { Branch } from '@/types';
import { useBranchStore } from '@/stores/branch.store';

export default function StoresPage() {
  const { selectedBranch, setSelectedBranch } = useBranchStore();
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const { data: branches = [], isLoading, error } = useQuery<Branch[]>({
    queryKey: ['branches'],
    queryFn: branchesApi.getBranches,
  });

  const handleSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setSuccessToast(`Đã chọn chi nhánh: ${branch.name}`);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />

      <main className="flex-1">
        {/* Banner */}
        <section className="bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-stone-50 py-12 border-b border-amber-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
              <Store className="w-3.5 h-3.5 text-amber-700" />
              Điểm Đến Thưởng Thức Bánh Tươi
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
              Hệ Thống 5 Cửa Hàng Cobi Bread
            </h1>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto">
              Không gian tiệm bánh hiện đại, ấm cúng cùng lò nướng bánh tại chỗ phục vụ cư dân tại TP. Hồ Chí Minh, Hà Nội và Long An.
            </p>
          </div>
        </section>

        {/* Selected Notification Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{successToast}</span>
          </div>
        )}

        {/* 5 Branches Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Active selection reminder banner */}
          {selectedBranch && (
            <div className="mb-8 p-5 rounded-3xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-amber-800 font-bold">
                    Chi nhánh bạn đang chọn đặt bánh
                  </p>
                  <p className="text-base font-bold text-stone-900">
                    {selectedBranch.name} • <span className="font-normal text-stone-600">{selectedBranch.address}, {selectedBranch.city}</span>
                  </p>
                </div>
              </div>
              <Link
                href="/products"
                className="px-4 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-700 text-xs font-bold transition-all shrink-0 self-start sm:self-auto flex items-center gap-1.5"
              >
                <span>Đặt bánh từ chi nhánh này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-white border border-stone-200 animate-pulse p-6 space-y-4" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>Không thể kết nối đến máy chủ backend để lấy danh sách chi nhánh. Vui lòng kiểm tra cổng 3001.</span>
            </div>
          )}

          {/* Branches Cards */}
          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => {
                const isSelected = selectedBranch?.id === branch.id;
                return (
                  <div
                    key={branch.id}
                    className={`rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                        : 'bg-white border-stone-200 hover:border-amber-300 hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* Top Header Card */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
                          isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {branch.city}
                        </span>

                        {isSelected && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                            Đang chọn
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-stone-900 leading-snug">
                        {branch.name}
                      </h3>

                      <div className="mt-4 space-y-3 text-xs sm:text-sm text-stone-600">
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{branch.address}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-stone-800">{branch.openHours}</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                          <a href={`tel:${branch.phone}`} className="hover:text-amber-700 font-medium">
                            {branch.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Button */}
                    <div className="mt-6 pt-4 border-t border-stone-100">
                      {isSelected ? (
                        <div className="w-full py-2.5 px-4 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Chi nhánh của bạn</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSelect(branch)}
                          className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-amber-600 hover:text-white text-stone-800 text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                          <Navigation className="w-4 h-4" />
                          <span>Chọn làm chi nhánh của tôi</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
