import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    warning: (message: string) => void;
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((message: string, variant: ToastVariant) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, message, variant }]);
    // Auto-dismiss after 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message: string) => add(message, 'success'),
    error: (message: string) => add(message, 'error'),
    warning: (message: string) => add(message, 'warning'),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast viewport */}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── Toast Item ───────────────────────────────────────────────────────────────

const variantConfig: Record<
  ToastVariant,
  { icon: React.ReactNode; classes: string }
> = {
  success: {
    icon: <CheckCircle2 size={16} className="text-accent flex-shrink-0" />,
    classes: 'border-accent/20 bg-white dark:bg-slate-900',
  },
  error: {
    icon: <XCircle size={16} className="text-danger flex-shrink-0" />,
    classes: 'border-danger/20 bg-white dark:bg-slate-900',
  },
  warning: {
    icon: <AlertTriangle size={16} className="text-warning flex-shrink-0" />,
    classes: 'border-warning/20 bg-white dark:bg-slate-900',
  },
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const config = variantConfig[toast.variant];

  return (
    <div
      className={[
        'flex items-start gap-3 px-4 py-3 rounded-xl border shadow-card-hover animate-slide-up',
        config.classes,
      ].join(' ')}
    >
      {config.icon}
      <p className="flex-1 text-sm text-slate-700 dark:text-slate-200 leading-snug">
        {toast.message}
      </p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-muted hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useToast = (): ToastContextValue['toast'] => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx.toast;
};
