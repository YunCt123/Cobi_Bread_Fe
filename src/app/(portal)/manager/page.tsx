'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  LogOut, 
  ShieldCheck, 
  Package, 
  TrendingUp, 
  Users, 
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { branchesApi, authApi } from '@/lib/api';
import { Branch } from '@/types';
import { BRAND_ASSETS } from '@/data/cobi-content';

export default function ManagerDashboardPage() {
  const router = useRouter();
  const { user, logout, isHydrated, updateUser } = useAuthStore();
  const [branchDetails, setBranchDetails] = useState<Branch | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!isHydrated) return;

      // If no user or customer tries to access, redirect
      if (!user) {
        router.push('/login?redirect=/manager');
        return;
      }

      if (user.role === 'CUSTOMER') {
        router.push('/');
        return;
      }

      try {
        setLoading(true);
        // Refresh me data to ensure fresh branch details
        const me = await authApi.getMe();
        updateUser(me);

        if (me.branchId) {
          const b = await branchesApi.getBranchById(me.branchId);
          setBranchDetails(b);
        }
      } catch (err) {
        console.error('Lỗi tải thông tin chi nhánh phụ trách:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isHydrated, user?.id, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand & Portal Title */}
            <div className="flex items-center gap-3">
              <img
                src={BRAND_ASSETS.logo}
                alt="COBI BREAD"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="hidden sm:block pl-3 border-l border-stone-200">
                <span className="text-sm font-bold text-[#231812] leading-tight block">
                  Manager Portal
                </span>
                <span className="text-xs text-[#6E5C50] font-medium">
                  Trang quản trị vận hành chi nhánh
                </span>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-[#F37021]" />
                <span>Xem Cửa Hàng</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Welcome Banner & Assigned Branch Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  Role: BRANCH_MANAGER
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đang hoạt động
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Xin chào, {user?.fullName || 'Quản lý chi nhánh'}!
              </h1>
              <p className="text-sm text-stone-600">
                Tài khoản phụ trách: <span className="font-semibold text-stone-800">{user?.email}</span>
              </p>
            </div>

            {/* Assigned Branch Capsule */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 rounded-2xl p-5 min-w-[320px]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">
                <Store className="w-4 h-4 text-blue-600" />
                Chi Nhánh Phụ Trách
              </div>

              {loading ? (
                <div className="space-y-2 animate-pulse mt-2">
                  <div className="h-5 w-40 bg-blue-200 rounded" />
                  <div className="h-4 w-52 bg-blue-100 rounded" />
                </div>
              ) : branchDetails ? (
                <div className="mt-2 space-y-2">
                  <h3 className="text-xl font-bold text-blue-950">
                    {branchDetails.name}
                  </h3>
                  <div className="text-xs text-stone-600 space-y-1">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
                      <span>{branchDetails.address}, {branchDetails.city}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-medium text-stone-800">{branchDetails.openHours}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{branchDetails.phone}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Chưa liên kết chi nhánh cụ thể. Vui lòng liên hệ Admin.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Operational Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
              <span>Đơn hàng hôm nay</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">42 đơn</p>
            <p className="text-xs text-emerald-600 font-medium">↑ +14% so với hôm qua</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
              <span>Doanh thu ngày</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">6.850.000 đ</p>
            <p className="text-xs text-emerald-600 font-medium">Đạt 85% chỉ tiêu ca</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
              <span>Mẻ bánh mới nướng</span>
              <Store className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">8 mẻ bánh</p>
            <p className="text-xs text-stone-500 font-medium">Mẻ gần nhất: 10:30 Croissant</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
              <span>Nhân sự ca trực</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-stone-900">5 nhân viên</p>
            <p className="text-xs text-stone-500 font-medium">2 Bếp bánh, 3 Thu ngân</p>
          </div>
        </div>

        {/* Detailed Branch Information Card */}
        {branchDetails && (
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              Thông tin chi tiết chi nhánh
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold uppercase">Mã chi nhánh (ID)</span>
                <p className="font-mono text-xs text-stone-800 mt-1">{branchDetails.id}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold uppercase">Khu vực / Thành phố</span>
                <p className="font-semibold text-stone-800 mt-1">{branchDetails.city}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold uppercase">Địa chỉ kinh doanh</span>
                <p className="text-stone-800 mt-1">{branchDetails.address}</p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                <span className="text-xs text-stone-500 font-semibold uppercase">Giờ mở cửa & Điện thoại</span>
                <p className="text-stone-800 mt-1">{branchDetails.openHours} • Hotline: {branchDetails.phone}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
