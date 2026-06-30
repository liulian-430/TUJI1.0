import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-600',
  error: 'bg-red-500/20 border-red-500/30 text-red-600',
  warning: 'bg-amber-500/20 border-amber-500/30 text-amber-600',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-600',
};

export function ToastContainer() {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={twMerge(
              clsx(
                'glass-card p-4 flex items-center gap-3 animate-slide-down',
                'max-w-sm',
                colorMap[toast.type]
              )
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}