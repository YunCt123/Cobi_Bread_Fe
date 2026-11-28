'use client';

import { getApiErrorMessage } from '@/utils/error';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Building2,
  User as UserIcon,
  Lock,
  Unlock,
  X,
  Store,
  Mail,
  Loader2,
  AlertTriangle,
  Edit3,
} from 'lucide-react';
import { PortalShell } from '@/components/layout/PortalShell';
import { useAuthStore } from '@/stores/auth.store';
import { usersApi, branchesApi } from '@/services';
import { Branch, CreateUserInput, Role, User } from '@/types';
import { useTranslation, getLocalizedBranchName } from '@/i18n';

const SEEDED_FALLBACK_USERS: User[] = [
  {
    id: 'seed-admin-1',
    email: 'admin@cobibread.com',
    fullName: 'Quản Trị Viên Cobi Bread',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2026-11-24T06:30:00.000Z',
  },
  {
    id: 'seed-mgr-q7',
    email: 'manager.q7@cobibread.com',
    fullName: 'Quản Lý Cobi Bread Tower Q7',
    role: 'BRANCH_MANAGER',
    isActive: true,
    createdAt: '2026-11-24T06:32:00.000Z',
  },
  {
    id: 'seed-cust-1',
    email: 'customer@cobibread.com',
    fullName: 'Khách hàng Cobi Bread',
    role: 'CUSTOMER',
    isActive: true,
    createdAt: '2026-11-24T07:00:00.000Z',
  },
];

export function AdminUsersView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser, isHydrated } = useAuthStore();
  const { locale } = useTranslation();

  const [roleTab, setRoleTab] = useState<'ALL' | Role>('ALL');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [togglingUser, setTogglingUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<CreateUserInput>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'BRANCH_MANAGER',
    branchId: '',
  });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!currentUser) {
      router.push('/login?redirect=/admin/users');
      return;
    }
    if (currentUser.role !== 'ADMIN') {
      router.push(currentUser.role === 'BRANCH_MANAGER' ? '/manager' : '/');
    }
  }, [isHydrated, currentUser, router]);

  const { data: branches = [] } = useQuery<Branch[]>({
    queryKey: ['branches', locale],
    queryFn: () => branchesApi.getBranches(locale),
    enabled: Boolean(isHydrated && currentUser?.role === 'ADMIN'),
  });

  const { data: apiUsers = [], isLoading } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: () => usersApi.getAll(),
    enabled: Boolean(isHydrated && currentUser?.role === 'ADMIN'),
  });

  const allUsers: User[] = useMemo(() => {
    if (apiUsers.length > 0) return apiUsers;
    const defaultQ7 = branches.find((b) => b.name.includes('Tower')) || branches[0];
    return SEEDED_FALLBACK_USERS.map((u) =>
      u.role === 'BRANCH_MANAGER' && defaultQ7
        ? { ...u, branchId: defaultQ7.id, branch: defaultQ7 }
        : u
    );
  }, [apiUsers, branches]);

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      if (roleTab !== 'ALL' && u.role !== roleTab) return false;
      if (!debouncedSearch) return true;
      const hay = `${u.fullName} ${u.email} ${u.role} ${u.branch?.name || ''}`.toLowerCase();
      return hay.includes(debouncedSearch);
    });
  }, [allUsers, roleTab, debouncedSearch]);

  const counts = useMemo(
    () => ({
      ALL: allUsers.length,
      CUSTOMER: allUsers.filter((u) => u.role === 'CUSTOMER').length,
      BRANCH_MANAGER: allUsers.filter((u) => u.role === 'BRANCH_MANAGER').length,
      ADMIN: allUsers.filter((u) => u.role === 'ADMIN').length,
    }),
    [allUsers]
  );

  const createMutation = useMutation({
    mutationFn: (payload: CreateUserInput) => usersApi.create(payload),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(
        locale === 'en'
          ? `Account created for ${created.email}`
          : `Đã tạo tài khoản ${created.email} thành công!`
      );
      setIsCreateModalOpen(false);
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Failed to create account';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateUserInput> }) =>
      usersApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(locale === 'en' ? 'Account updated!' : 'Đã cập nhật thông tin tài khoản!');
      setEditingUser(null);
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Failed to update user';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      usersApi.toggleActive(id, isActive),
    onSuccess: (_res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(
        vars.isActive
          ? locale === 'en'
            ? 'Account unlocked'
            : 'Đã mở khóa tài khoản thành công'
          : locale === 'en'
          ? 'Account locked'
          : 'Đã khóa tài khoản người dùng'
      );
      setTogglingUser(null);
    },
    onError: (err: unknown) => {
      const msg = getApiErrorMessage(err, "") || 'Could not update account status';
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg);
      setTogglingUser(null);
    },
  });

  const openCreateManagerModal = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'BRANCH_MANAGER',
      branchId: branches[0]?.id || '',
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone?.trim() || undefined,
      role: formData.role,
      branchId: formData.role === 'BRANCH_MANAGER' ? formData.branchId || null : null,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    updateMutation.mutate({
      id: editingUser.id,
      payload: {
        fullName: editingUser.fullName,
        role: editingUser.role,
        branchId: editingUser.role === 'BRANCH_MANAGER' ? editingUser.branchId || null : null,
      },
    });
  };

  return (
    <PortalShell roleMode="ADMIN">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F37021]">
              {locale === 'en' ? 'Identity & Access Management' : 'Quản Trị Người Dùng & Phân Quyền'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#231812] mt-0.5">
              {locale === 'en'
                ? 'Users, Branch Managers & Admins'
                : 'Quản Lý Tài Khoản & Manager Chi Nhánh'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {locale === 'en'
                ? 'Provision Branch Manager accounts assigned to each of the 5 stores and control access status.'
                : 'Tạo tài khoản Manager gán trực tiếp vào từng chi nhánh trong 5 cơ sở Cobi Bread và kiểm soát khóa/mở khóa.'}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateManagerModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md shadow-[#F37021]/20 transition-all cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {locale === 'en' ? 'Create Manager Account' : 'Tạo tài khoản Manager'}
            </span>
          </button>
        </div>

        {/* Role Tabs + Search Input */}
        <div className="bg-white rounded-2xl p-4 border border-black/5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              {
                id: 'ALL' as const,
                label: locale === 'en' ? 'All Users' : 'Tất cả',
                count: counts.ALL,
              },
              {
                id: 'CUSTOMER' as const,
                label: locale === 'en' ? 'Customers' : 'Khách hàng',
                count: counts.CUSTOMER,
              },
              {
                id: 'BRANCH_MANAGER' as const,
                label: locale === 'en' ? 'Branch Managers' : 'Manager chi nhánh',
                count: counts.BRANCH_MANAGER,
              },
              {
                id: 'ADMIN' as const,
                label: locale === 'en' ? 'Admins' : 'Admin',
                count: counts.ADMIN,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRoleTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  roleTab === tab.id
                    ? 'bg-[#231812] text-white'
                    : 'bg-[#F8F7F4] text-stone-600 hover:text-[#231812]'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                locale === 'en' ? 'Search name or email...' : 'Tìm theo họ tên hoặc email...'
              }
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F8F7F4] border border-black/5 text-xs focus:outline-none focus:border-[#F37021]"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-black/5 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-10 space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-14 rounded-xl bg-stone-100 animate-pulse" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Users className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-bold text-[#231812]">
                {locale === 'en' ? 'No matching users found' : 'Không tìm thấy tài khoản nào'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#F8F7F4] text-[11px] uppercase tracking-wider text-stone-500 font-bold border-b border-stone-200/70">
                  <tr>
                    <th className="px-5 py-3.5">
                      {locale === 'en' ? 'User / Email' : 'Người Dùng & Email'}
                    </th>
                    <th className="px-5 py-3.5">{locale === 'en' ? 'Role' : 'Vai Trò'}</th>
                    <th className="px-5 py-3.5">
                      {locale === 'en' ? 'Assigned Branch' : 'Chi Nhánh Phụ Trách'}
                    </th>
                    <th className="px-5 py-3.5">
                      {locale === 'en' ? 'Status' : 'Trạng Thái'}
                    </th>
                    <th className="px-5 py-3.5 text-right">
                      {locale === 'en' ? 'Actions' : 'Thao Tác'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map((u) => {
                    const isActive = u.isActive !== false;
                    const assignedBranch =
                      u.branch || branches.find((b) => b.id === u.branchId) || null;

                    return (
                      <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[#231812] text-white font-bold text-xs flex items-center justify-center shrink-0">
                              {u.fullName ? u.fullName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#231812] truncate">{u.fullName}</p>
                              <p className="text-xs text-stone-500 font-mono flex items-center gap-1 truncate">
                                <Mail className="w-3 h-3 text-stone-400" />
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          {u.role === 'ADMIN' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              ADMIN
                            </span>
                          ) : u.role === 'BRANCH_MANAGER' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                              <Building2 className="w-3.5 h-3.5" />
                              BRANCH_MANAGER
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold">
                              <UserIcon className="w-3.5 h-3.5" />
                              CUSTOMER
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-xs">
                          {u.role === 'ADMIN' ? (
                            <span className="font-semibold text-purple-700">
                              {locale === 'en' ? 'All 5 Branches (HQ)' : 'Toàn bộ 5 chi nhánh'}
                            </span>
                          ) : assignedBranch ? (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-[#231812]">
                              <Store className="w-3.5 h-3.5 text-[#F37021]" />
                              {getLocalizedBranchName(assignedBranch, locale)}
                            </span>
                          ) : (
                            <span className="text-stone-400">---</span>
                          )}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? 'bg-emerald-500' : 'bg-red-500'
                              }`}
                            />
                            {isActive
                              ? locale === 'en'
                                ? 'Active'
                                : 'Hoạt động'
                              : locale === 'en'
                              ? 'Locked'
                              : 'Đã khóa'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingUser(u)}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-[#F37021] text-xs font-bold text-stone-700 hover:text-[#F37021] inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>{locale === 'en' ? 'Assign' : 'Phân quyền'}</span>
                            </button>

                            {u.email !== currentUser?.email && (
                              <button
                                type="button"
                                onClick={() => setTogglingUser(u)}
                                className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${
                                  isActive
                                    ? 'border-red-200 bg-red-50/60 text-red-700 hover:bg-red-100'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                }`}
                              >
                                {isActive ? (
                                  <>
                                    <Lock className="w-3.5 h-3.5" />
                                    <span>{locale === 'en' ? 'Lock' : 'Khóa'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-3.5 h-3.5" />
                                    <span>{locale === 'en' ? 'Unlock' : 'Mở khóa'}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Manager Account Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/10 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-[#231812] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#F37021]" />
                <span>
                  {locale === 'en' ? 'Create Manager Account' : 'Tạo Tài Khoản Manager Chi Nhánh'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {locale === 'en' ? 'Full Name *' : 'Họ và tên *'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nguyễn Văn Quản Lý"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="manager.aeon@cobibread.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 font-mono text-xs focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {locale === 'en' ? 'Initial Password *' : 'Mật khẩu khởi tạo *'}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#F37021]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Role *' : 'Vai trò *'}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
                  >
                    <option value="BRANCH_MANAGER">BRANCH_MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="CUSTOMER">CUSTOMER</option>
                  </select>
                </div>

                {formData.role === 'BRANCH_MANAGER' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                      {locale === 'en' ? 'Branch *' : 'Chi nhánh gán *'}
                    </label>
                    <select
                      required
                      value={formData.branchId || ''}
                      onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#F37021]"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {getLocalizedBranchName(b, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {locale === 'en' ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold shadow-md shadow-[#F37021]/20 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {createMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{locale === 'en' ? 'Create Account' : 'Tạo tài khoản'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Role & Assigned Branch Modal */}
      {editingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-black/10 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-[#231812]">
                {locale === 'en' ? 'Update Role & Branch Assignment' : 'Phân Quyền & Gán Chi Nhánh'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {locale === 'en' ? 'Full Name' : 'Họ và tên'}
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, fullName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  {locale === 'en' ? 'System Role' : 'Vai trò hệ thống'}
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value as Role })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="BRANCH_MANAGER">BRANCH_MANAGER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {editingUser.role === 'BRANCH_MANAGER' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    {locale === 'en' ? 'Assigned Branch' : 'Chi nhánh phụ trách'}
                  </label>
                  <select
                    value={editingUser.branchId || branches[0]?.id || ''}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, branchId: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {getLocalizedBranchName(b, locale)} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                >
                  {locale === 'en' ? 'Cancel' : 'Hủy'}
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-[#F37021] hover:bg-[#D95D14] text-white text-xs font-bold cursor-pointer"
                >
                  {locale === 'en' ? 'Save Assignment' : 'Lưu phân quyền'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lock / Unlock Account AlertDialog */}
      {togglingUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-black/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#231812]">
                  {togglingUser.isActive !== false
                    ? locale === 'en'
                      ? 'Lock User Account?'
                      : 'Xác nhận khóa tài khoản?'
                    : locale === 'en'
                    ? 'Unlock User Account?'
                    : 'Mở khóa tài khoản?'}
                </h3>
                <p className="text-xs text-stone-500 font-mono">{togglingUser.email}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {togglingUser.isActive !== false
                ? locale === 'en'
                  ? 'This user will not be able to sign in or perform operations while locked.'
                  : 'Khi bị khóa, tài khoản này sẽ tạm thời không thể đăng nhập hoặc thao tác trên hệ thống.'
                : locale === 'en'
                ? 'Restore full login and role access for this user account.'
                : 'Khôi phục quyền đăng nhập và thao tác bình thường cho tài khoản này.'}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTogglingUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
              >
                {locale === 'en' ? 'Cancel' : 'Hủy bỏ'}
              </button>
              <button
                type="button"
                disabled={toggleStatusMutation.isPending}
                onClick={() =>
                  toggleStatusMutation.mutate({
                    id: togglingUser.id,
                    isActive: togglingUser.isActive === false,
                  })
                }
                className={`px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 ${
                  togglingUser.isActive !== false
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {toggleStatusMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{locale === 'en' ? 'Confirm' : 'Xác nhận'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}

export default AdminUsersView;
