import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  hover = false,
  glow = false,
  padding = 'md',
  onClick,
}: GlassCardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'glass-card',
          paddingClasses[padding],
          hover && 'hover-lift cursor-pointer',
          glow && 'glow-effect',
          onClick && 'cursor-pointer',
          className
        )
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}