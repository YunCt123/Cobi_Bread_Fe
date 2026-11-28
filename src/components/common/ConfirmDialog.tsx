'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isPending = false,
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { locale } = useTranslation();

  if (!open) return null;

  const resolvedConfirm = confirmLabel || (locale === 'en' ? 'Confirm' : 'Xác nhận');
  const resolvedCancel = cancelLabel || (locale === 'en' ? 'Cancel' : 'Hủy');

  const btnColors =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white'
      : variant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 text-white'
      : 'bg-[#231812] hover:bg-[#3A281E] text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#E8DFD1] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#231812]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {description && <p className="mt-3 text-sm leading-relaxed text-[#6E5D4F]">{description}</p>}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-xl border border-[#E8DFD1] bg-white px-4 py-2 text-xs font-semibold text-[#5C4D40] hover:bg-[#FAF6F0]"
          >
            {resolvedCancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition disabled:opacity-50 ${btnColors}`}
          >
            {resolvedConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
