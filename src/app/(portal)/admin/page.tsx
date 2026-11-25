'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  LogOut, 
  Building2, 
  Plus, 
  Search, 
  Activity, 
  Users, 
  Layers,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { AdminNav } from '@/components/AdminNav';
import { useAuthStore } from '@/stores/auth.store';
import { branchesApi } from '@/lib/api';
import { Branch } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, logout, isHydrated } = useAuthStore();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!isHydrated) return;

      // If no user or non-admin tries to access, redirect
      if (!user) {
        router.push('/login?redirect=/admin');
        return;
      }

      if (user.role !== 'ADMIN') {
        if (user.role === 'BRANCH_MANAGER') {
          router.push('/manager');
        } else {
          router.push('/');
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await branchesApi.getBranches();
        setBranches(data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách chi nhánh:', err);
        setError('Không thể tải danh sách chi nhánh từ máy chủ backend (http://localhost:3001).');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isHydrated, user?.id, user?.role, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <AdminNav />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                  Role: ADMIN
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Toàn Quyền Hệ Thống
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Xin chào, {user?.fullName || 'Administrator'}!
              </h1>
              <p className="text-sm text-stone-600">
                Email quản trị: <span className="font-semibold text-stone-800">{user?.email}</span> • Phụ trách giám sát toàn bộ 5 chi nhánh Cobi Bread.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center min-w-[120px]">
                <span className="text-xs text-stone-500 font-semibold block">Chi nhánh</span>
                <span className="text-2xl font-bold text-stone-900">{branches.length}</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center min-w-[120px]">
                <span className="text-xs text-stone-500 font-semibold block">Thành phố</span>
                <span className="text-2xl font-bold text-stone-900">3</span>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-center min-w-[120px]">
                <span className="text-xs text-stone-500 font-semibold block">Trạng thái API</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mt-1 inline-block">
                  Sẵn sàng
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Branches Management Table & Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-600" />
                Quản lý 5 Chi Nhánh Cobi Bread
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Dữ liệu đồng bộ trực tiếp từ cơ sở dữ liệu qua endpoint <code className="text-purple-700 font-mono">GET /branches</code>
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm chi nhánh hoặc thành phố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-stone-200 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
              />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Branches Table */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-stone-600">
                <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500 font-semibold border-y border-stone-200">
                  <tr>
                    <th scope="col" className="px-4 py-3.5">STT</th>
                    <th scope="col" className="px-4 py-3.5">Tên Chi Nhánh</th>
                    <th scope="col" className="px-4 py-3.5">Khu vực / Thành phố</th>
                    <th scope="col" className="px-4 py-3.5">Địa chỉ</th>
                    <th scope="col" className="px-4 py-3.5">Giờ hoạt động</th>
                    <th scope="col" className="px-4 py-3.5">Số điện thoại</th>
                    <th scope="col" className="px-4 py-3.5 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBranches.map((branch, index) => (
                    <tr key={branch.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-4 py-4 font-mono text-xs text-stone-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 font-semibold text-stone-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                          <Store className="w-3.5 h-3.5" />
                        </div>
                        <span>{branch.name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-medium bg-stone-100 text-stone-800">
                          {branch.city}
                        </span>
                      </td>
                      <td className="px-4 py-4 max-w-xs truncate text-xs text-stone-600">
                        {branch.address}
                      </td>
                      <td className="px-4 py-4 text-xs font-medium text-stone-700 whitespace-nowrap">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          {branch.openHours}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs font-mono whitespace-nowrap text-stone-800">
                        {branch.phone}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Hoạt động
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBranches.length === 0 && (
                <div className="text-center py-10 text-stone-400 text-sm">
                  Không tìm thấy chi nhánh phù hợp với từ khóa &ldquo;{searchTerm}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
