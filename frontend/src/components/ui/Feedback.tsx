import React from 'react';
import { Loader2, Inbox, AlertTriangle } from 'lucide-react';
import { Button } from './Button';

// ─── Spinner ──────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?: number;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, className = '' }) => (
  <Loader2
    size={size}
    className={`animate-spin text-accent ${className}`}
  />
);

// ─── Full Page Loader ─────────────────────────────────────────────────────────

export const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size={28} />
  </div>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try adjusting your filters or create a new record.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
      <Inbox size={24} className="text-muted" />
    </div>
    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
    <p className="text-sm text-muted max-w-xs mb-4">{description}</p>
    {action}
  </div>
);

// ─── Error State ──────────────────────────────────────────────────────────────

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mb-4">
      <AlertTriangle size={24} className="text-danger" />
    </div>
    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Error</h3>
    <p className="text-sm text-muted max-w-xs mb-4">{message}</p>
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-xl shadow-modal border border-border dark:border-slate-800 p-6 animate-slide-up">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-danger-light flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-danger" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">
              {title}
            </h3>
            <p className="text-sm text-muted">{message}</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
