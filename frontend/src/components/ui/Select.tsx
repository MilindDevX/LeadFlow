import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={[
          'w-full h-9 rounded-lg border text-sm bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-3 transition-colors appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent',
          error
            ? 'border-danger focus:ring-danger/20 focus:border-danger'
            : 'border-border dark:border-slate-700',
          className,
        ].join(' ')}
        {...props}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
