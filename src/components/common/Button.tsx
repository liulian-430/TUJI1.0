import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  ripple?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  ripple = true,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variantClasses = {
    primary: 'glass-button',
    secondary: 'bg-gray-500/20 backdrop-blur-sm border border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-500/30',
    outline: 'bg-transparent border border-indigo-500/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10',
    ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-500/10',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={twMerge(
        clsx(
          'rounded-xl font-medium transition-all duration-200',
          'flex items-center justify-center gap-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          ripple && 'ripple-effect',
          className
        )
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}