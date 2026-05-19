import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { LeadForm } from '@/components/leads/LeadForm';
import { PageLoader, ErrorState } from '@/components/ui/Feedback';
import { useToast } from '@/components/ui/Toast';
import { useLead, useUpdateLead } from '@/hooks/useLeads';
import { UpdateLeadPayload } from '@/types';

const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: lead, isLoading, isError, refetch } = useLead(id!);
  const updateMutation = useUpdateLead();

  const handleEdit = async (payload: UpdateLeadPayload) => {
    try {
      await updateMutation.mutateAsync({ id: id!, payload });
      setIsEditOpen(false);
      toast.success('Lead updated successfully');
    } catch {
      toast.error('Failed to update lead. Please try again.');
    }
  };

  if (isLoading) return (
    <div className="flex flex-col h-full">
      <Header title="Lead Details" />
      <PageLoader />
    </div>
  );

  if (isError || !lead) return (
    <div className="flex flex-col h-full">
      <Header title="Lead Details" />
      <ErrorState message="Lead not found or could not be loaded." onRetry={refetch} />
    </div>
  );

  const Field: React.FC<{ label: string; value?: string; mono?: boolean }> = ({
    label,
    value,
    mono,
  }) => (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-1">{label}</p>
      <p
        className={[
          'text-sm text-slate-800 dark:text-slate-200',
          mono ? 'font-mono' : '',
        ].join(' ')}
      >
        {value || <span className="text-muted italic">—</span>}
      </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Lead Details"
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<Pencil size={14} />}
            onClick={() => setIsEditOpen(true)}
          >
            Edit
          </Button>
        }
      />

      <div className="p-8">
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-1.5 text-sm text-muted hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Leads
        </button>

        <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-card">
          {/* Lead header */}
          <div className="px-6 py-5 border-b border-border dark:border-slate-800 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {lead.name}
              </h2>
              <p className="text-sm text-muted font-mono mt-0.5">{lead.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={lead.source}>{lead.source}</Badge>
              <Badge variant={lead.status}>{lead.status}</Badge>
            </div>
          </div>

          {/* Fields */}
          <div className="px-6 py-5 grid grid-cols-2 gap-6">
            <Field label="Status" value={lead.status} />
            <Field label="Source" value={lead.source} />
            <Field
              label="Created"
              value={new Date(lead.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />
            <Field
              label="Last Updated"
              value={new Date(lead.updatedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            />
            <Field label="Lead ID" value={lead._id} mono />
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="px-6 pb-5">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Notes</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-3 leading-relaxed">
                {lead.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Lead">
        <LeadForm
          defaultValues={lead}
          onSubmit={handleEdit}
          onCancel={() => setIsEditOpen(false)}
          isSubmitting={updateMutation.isPending}
          submitLabel="Save Changes"
        />
      </Modal>
    </div>
  );
};

export default LeadDetail;
