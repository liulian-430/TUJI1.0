import { useToastStore, type ToastType } from '../../store/useToastStore';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const iconMap: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colorMap: Record<ToastType, string> = {
  success: 'bg-emerald-500',
  error: 'bg-rose-500',
  info: 'bg-primary-mid',
  warning: 'bg-amber-500',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={`${colorMap[toast.type]} text-white px-4 py-3 rounded-2xl shadow-2xl flex items-start gap-3 pointer-events-auto animate-[slideDown_0.3s_ease-out]`}
            style={{ animation: 'slideDown 0.3s ease-out' }}
          >
            <Icon size={20} className="flex-shrink-0 mt-0.5" />
            <p className="flex-1 text-sm font-medium leading-relaxed">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 hover:bg-white/20 rounded-full p-0.5 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
