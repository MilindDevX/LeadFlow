import React from 'react';
import { LeadStatus, LeadSource } from '@/types';

type BadgeVariant = LeadStatus | LeadSource | 'admin' | 'sales_user' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<string, string> = {
  // Lead Status
  New: 'bg-info-light text-info dark:bg-blue-900/40 dark:text-blue-300',
  Contacted: 'bg-warning-light text-warning dark:bg-yellow-900/40 dark:text-yellow-300',
  Qualified: 'bg-accent-light text-accent dark:bg-emerald-900/40 dark:text-emerald-300',
  Lost: 'bg-danger-light text-danger dark:bg-red-900/40 dark:text-red-300',
  // Lead Source
  Website: 'bg-secondary-light text-secondary dark:bg-indigo-900/40 dark:text-indigo-300',
  Instagram: 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-300',
  Referral: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
  // Role
  admin: 'bg-secondary-light text-secondary dark:bg-indigo-900/40 dark:text-indigo-300',
  sales_user: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  // Default
  default: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const classes = variantClasses[variant] ?? variantClasses.default;

  return (
    <span
      className={[
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
        classes,
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
};
