import React from 'react';

interface TechBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'outline' | 'subtle' | 'navy' | 'cyan' | 'dark' | 'dark-accent';
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
    default: 'bg-slate-100 text-[#253247] border border-slate-200 hover:border-slate-300 hover:bg-slate-200/70',
    accent: 'bg-[#0877E8]/10 text-[#0877E8] border border-[#0877E8]/25 hover:bg-[#0877E8]/15',
    navy: 'bg-[#061B3A]/10 text-[#061B3A] border border-[#061B3A]/20',
    cyan: 'bg-[#00D4E8]/15 text-[#0369a1] border border-[#00D4E8]/30',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    outline: 'bg-transparent text-slate-600 border border-slate-300 hover:border-slate-400 hover:text-slate-800',
    subtle: 'bg-white text-slate-600 border border-slate-200 shadow-xs hover:border-slate-300',
    dark: 'bg-white/10 text-slate-200 border border-white/15 hover:bg-white/15',
    'dark-accent': 'bg-[#0877E8]/20 text-[#00D4E8] border border-[#00D4E8]/30',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-md tracking-tight transition-all duration-150 whitespace-nowrap ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
