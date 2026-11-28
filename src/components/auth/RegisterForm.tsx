'use client';

import { getApiErrorMessage } from '@/utils/error';
import { useTranslation } from '@/i18n';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { authApi } from '@/services';
import { useAuthStore } from '@/stores/auth.store';
import { BRAND_ASSETS } from '@/data/cobi-content';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Vui lòng nhập địa chỉ email hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { t } = useTranslation();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      setSuccessMessage(null);

      // 1. Gọi API đăng ký
      await authApi.register({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      setSuccessMessage('Đăng ký thành công! Đang tự động đăng nhập...');

      // 2. Tự động đăng nhập
      const loginRes = await authApi.login({
        email: values.email.trim(),
        password: values.password,
      });

      setAuth(loginRes.user, loginRes.accessToken);

      // Role CUSTOMER mặc định chuyển về trang chủ
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: unknown) {
      console.error('Lỗi đăng ký:', err);
      const msg =
        getApiErrorMessage(err, "") ||
        'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.';
      setServerError(Array.isArray(msg) ? msg.join(', ') : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center justify-center group">
          <img
            src={BRAND_ASSETS.logo}
            alt="COBI BREAD"
            className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-[#231812] font-display">
          {t.auth.registerHeading}
        </h2>
        <p className="mt-2 text-sm text-[#6E5C50]">
          {t.auth.hasAccount}{' '}
          <Link href="/login" className="font-semibold text-[#F37021] hover:text-[#D95D14] underline">
            {t.auth.loginNowLink}
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-stone-200/50 rounded-3xl border border-stone-200">
          
          {/* Server Success Alert */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Server Error Alert */}
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.auth.fullNameLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <UserIcon className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  {...register('fullName')}
                  className={`block w-full pl-11 pr-3 py-2.5 rounded-xl border text-stone-900 text-sm placeholder-stone-400 focus:outline-none transition-colors ${
                    errors.fullName
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-stone-300 focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/20'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.auth.emailLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="email@example.com"
                  {...register('email')}
                  className={`block w-full pl-11 pr-3 py-2.5 rounded-xl border text-stone-900 text-sm placeholder-stone-400 focus:outline-none transition-colors ${
                    errors.email
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-stone-300 focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.auth.passwordMinLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`block w-full pl-11 pr-11 py-2.5 rounded-xl border text-stone-900 text-sm placeholder-stone-400 focus:outline-none transition-colors ${
                    errors.password
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-stone-300 focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.auth.confirmPasswordLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`block w-full pl-11 pr-3 py-2.5 rounded-xl border text-stone-900 text-sm placeholder-stone-400 focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-stone-300 focus:border-[#F37021] focus:ring-2 focus:ring-[#F37021]/20'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm text-white bg-[#F37021] hover:bg-[#D95D14] active:bg-[#B94B0B] transition-all shadow-md shadow-[#F37021]/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.auth.registering}</span>
                </>
              ) : (
                <>
                  <span>{t.auth.registerBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
