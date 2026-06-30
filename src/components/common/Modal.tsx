import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { useEffect, useCallback } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
}: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* 内容 */}
      <div
        className={twMerge(
          clsx(
            'relative glass-card animate-scale-in',
            'w-full mx-4',
            sizeClasses[size]
          )
        )}
      >
        {/* 标题栏 */}
        {(title || showClose) && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            {title && (
              <h2 className="text-lg font-semibold gradient-text">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}