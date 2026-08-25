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
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  }[size];

  const variantClasses = {
    default: 'bg-slate-800/40 text-slate-300 border border-slate-700/60 hover:border-slate-600 hover:text-white',
    accent: 'bg-blue-500/10 text-blue-400 border border-blue-500/25 hover:bg-blue-500/15 hover:border-blue-500/40',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/15',
    outline: 'bg-transparent text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700',
    subtle: 'bg-[#18181f]/80 text-slate-400 border border-slate-800/90 hover:border-slate-700 hover:text-slate-300',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-md tracking-tight transition-all duration-150 whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
