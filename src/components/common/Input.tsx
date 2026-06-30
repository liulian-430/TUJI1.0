import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  suffix?: ReactNode;
  glass?: boolean;
}

export function Input({
  label,
  error,
  icon,
  suffix,
  glass = true,
  className,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </div>
        )}
        <input
          className={twMerge(
            clsx(
              'w-full transition-all duration-200',
              glass ? 'glass-input' : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3',
              icon && 'pl-10',
              suffix && 'pr-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )
          )}
          {...props}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}