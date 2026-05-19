import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full h-9 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder:text-muted transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
            error
              ? 'border-danger focus:ring-danger/20 focus:border-danger'
              : 'border-border dark:border-slate-700',
            icon ? 'pl-9 pr-3' : 'px-3',
            className,
          ].join(' ')}
          {...props}
        />
      </div>
      {error && (
        <p className="text-xs text-danger flex items-center gap-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
