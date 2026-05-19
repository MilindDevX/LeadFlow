import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-accent hover:bg-accent-hover text-white shadow-sm active:scale-[0.98]',
  secondary:
    'bg-secondary text-white hover:bg-secondary/90 shadow-sm active:scale-[0.98]',
  danger:
    'bg-danger text-white hover:bg-danger/90 shadow-sm active:scale-[0.98]',
  ghost:
    'bg-transparent text-muted hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800',
  outline:
    'border border-border bg-white text-slate-700 hover:bg-slate-50 dark:bg-transparent dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={14} />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
};
