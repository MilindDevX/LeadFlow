import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('leadflow_theme') === 'dark' ||
      (!localStorage.getItem('leadflow_theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('leadflow_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('leadflow_theme', 'light');
    }
  }, [isDark]);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border dark:border-slate-800 bg-surface dark:bg-slate-950">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button
          onClick={() => setIsDark((d) => !d)}
          className="w-9 h-9 rounded-lg border border-border dark:border-slate-700 flex items-center justify-center text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle dark mode"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};
