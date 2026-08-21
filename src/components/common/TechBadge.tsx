import React from 'react';

interface TechBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'xs';
  className?: string;
}

export const TechBadge: React.FC<TechBadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-xs',
  }[size];

  const variantClasses = {
    default: 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700',
    accent: 'bg-blue-600/10 text-blue-400 border border-blue-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    outline: 'bg-transparent text-slate-400 border border-slate-800 hover:text-slate-200',
    subtle: 'bg-[#18181B] text-slate-400 border border-slate-800/80',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md tracking-wide transition-colors whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
