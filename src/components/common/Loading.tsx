import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

export function Loading({ fullScreen = false, message }: LoadingProps) {
  const isLoading = useUIStore((state) => state.isLoading);
  const loadingMessage = useUIStore((state) => state.loadingMessage);

  if (!isLoading && !fullScreen) return null;

  const displayMessage = message || loadingMessage;

  return (
    <div
      className={twMerge(
        clsx(
          'flex flex-col items-center justify-center gap-3',
          fullScreen
            ? 'fixed inset-0 z-50 bg-black/30 backdrop-blur-sm'
            : 'py-8'
        )
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      {displayMessage && (
        <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
          {displayMessage}
        </p>
      )}
    </div>
  );
}

// Loading Spinner 小型版本
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2
      className={twMerge(clsx('animate-spin text-indigo-500', sizeClasses[size]))}
    />
  );
}