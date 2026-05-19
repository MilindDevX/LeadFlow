import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/ui/Feedback';
import { useToast } from '@/components/ui/Toast';
import { useDeleteLead } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/auth.store';
import { Lead } from '@/types';

// ─── Lead Table ───────────────────────────────────────────────────────────────

interface LeadTableProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({ leads, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border dark:border-slate-800">
            {['Name', 'Email', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border dark:divide-slate-800">
          {leads.map((lead) => (
            <LeadRow key={lead._id} lead={lead} onEdit={onEdit} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── Lead Row ─────────────────────────────────────────────────────────────────

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
}

const LeadRow: React.FC<LeadRowProps> = ({ lead, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const toast = useToast();
  const deleteMutation = useDeleteLead();

  const isAdmin = user?.role === 'admin';

  const formattedDate = new Date(lead.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(lead._id);
      toast.success(`"${lead.name}" was deleted`);
    } catch {
      toast.error('Failed to delete lead. Please try again.');
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <tr
        className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer"
        onClick={() => navigate(`/leads/${lead._id}`)}
      >
        {/* Name */}
        <td className="px-4 py-3.5">
          <span className="font-medium text-slate-800 dark:text-slate-200">{lead.name}</span>
        </td>

        {/* Email */}
        <td className="px-4 py-3.5">
          <span className="text-muted font-mono text-xs">{lead.email}</span>
        </td>

        {/* Status */}
        <td className="px-4 py-3.5">
          <Badge variant={lead.status}>{lead.status}</Badge>
        </td>

        {/* Source */}
        <td className="px-4 py-3.5">
          <Badge variant={lead.source}>{lead.source}</Badge>
        </td>

        {/* Created */}
        <td className="px-4 py-3.5">
          <span className="text-muted text-xs">{formattedDate}</span>
        </td>

        {/* Actions */}
        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
          <div className="relative flex items-center gap-1">
            <button
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="p-1.5 rounded-md text-muted hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all"
              title="View details"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onEdit(lead)}
              className="p-1.5 rounded-md text-muted hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-all"
              title="Edit lead"
            >
              <Pencil size={14} />
            </button>
            {isAdmin && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-md text-muted hover:bg-danger-light hover:text-danger opacity-0 group-hover:opacity-100 transition-all"
                title="Delete lead"
              >
                <Trash2 size={14} />
              </button>
            )}
            {/* Fallback: 3-dot menu for touch devices */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-md text-muted hover:bg-slate-200 dark:hover:bg-slate-700 sm:hidden"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-10 w-36 bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-lg shadow-card-hover py-1 animate-fade-in">
                <button
                  onClick={() => { navigate(`/leads/${lead._id}`); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Eye size={13} /> View
                </button>
                <button
                  onClick={() => { onEdit(lead); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Pencil size={13} /> Edit
                </button>
                {isAdmin && (
                  <button
                    onClick={() => { setConfirmDelete(true); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger-light"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </td>
      </tr>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${lead.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
      />
    </>
  );
};
