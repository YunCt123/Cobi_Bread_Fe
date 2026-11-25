'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Store, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  Loader2,
  KeyRound
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

const loginSchema = z.object({
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);

      const response = await authApi.login({
        email: values.email.trim(),
        password: values.password,
      });

      // Save to store + sync to Cookies & localStorage
      setAuth(response.user, response.accessToken);

      // Auto redirect according to role as specified
      if (redirectParam) {
        router.push(redirectParam);
      } else {
        switch (response.user.role) {
          case 'ADMIN':
            router.push('/admin');
            break;
          case 'BRANCH_MANAGER':
            router.push('/manager');
            break;
          case 'CUSTOMER':
          default:
            router.push('/');
            break;
        }
      }
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err);
      const msg =
        err.response?.data?.message ||
        'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickAccount = (email: string) => {
    setValue('email', email);
    setValue('password', '123456');
    setServerError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/60 via-stone-50 to-amber-100/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/25 group-hover:scale-105 transition-transform">
            <Store className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-stone-900">
            Cobi <span className="text-amber-600">Bread</span>
          </span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-stone-900">
          Đăng nhập hệ thống
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Chưa có tài khoản?{' '}
          <Link href="/register" className="font-semibold text-amber-700 hover:text-amber-800 underline">
            Đăng ký tài khoản mới
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-stone-200/50 rounded-3xl border border-stone-200">
          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="name@cobibread.com"
                  {...register('email')}
                  className={`block w-full pl-11 pr-3 py-2.5 rounded-xl border text-stone-900 text-sm placeholder-stone-400 focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className={`block w-full pl-11 pr-11 py-2.5 rounded-xl border text-stone-900 text-sm placeholder-stone-400 focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 transition-all shadow-md shadow-amber-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Test Accounts Box */}
          <div className="mt-8 pt-6 border-t border-stone-200">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              Tài khoản mẫu để test (Mật khẩu: 123456)
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => fillQuickAccount('admin@cobibread.com')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-purple-300 hover:bg-purple-50/50 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-stone-900">Admin Tổng</p>
                  <p className="text-stone-500 font-mono">admin@cobibread.com</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-medium text-[10px]">
                  /admin
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('manager.q7@cobibread.com')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-blue-300 hover:bg-blue-50/50 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-stone-900">Quản lý Cobi Tower Q7</p>
                  <p className="text-stone-500 font-mono">manager.q7@cobibread.com</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-medium text-[10px]">
                  /manager
                </span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickAccount('customer@cobibread.com')}
                className="w-full text-left p-2.5 rounded-xl border border-stone-200 hover:border-amber-300 hover:bg-amber-50/50 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-stone-900">Khách Hàng</p>
                  <p className="text-stone-500 font-mono">customer@cobibread.com</p>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-medium text-[10px]">
                  / (Storefront)
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            <span>Đang tải trang đăng nhập...</span>
          </div>
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
