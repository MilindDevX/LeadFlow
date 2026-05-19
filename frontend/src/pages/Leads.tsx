import React, { useState } from 'react';
import { Plus, Download } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LeadTable } from '@/components/leads/LeadTable';
import { LeadFiltersBar } from '@/components/leads/LeadFilters';
import { LeadForm } from '@/components/leads/LeadForm';
import { Pagination } from '@/components/leads/Pagination';
import { PageLoader, EmptyState, ErrorState } from '@/components/ui/Feedback';
import { useToast } from '@/components/ui/Toast';
import { useLeads, useCreateLead, useUpdateLead } from '@/hooks/useLeads';
import { useDebounce } from '@/hooks/useDebounce';
import { leadsApi } from '@/api/leads.api';
import { useAuthStore } from '@/store/auth.store';
import {
  Lead,
  LeadFilters,
  DEFAULT_FILTERS,
  CreateLeadPayload,
  UpdateLeadPayload,
} from '@/types';

const Leads: React.FC = () => {
  const { user } = useAuthStore();
  const toast = useToast();
  const isAdmin = user?.role === 'admin';

  // ── Filter state ─────────────────────────────────────────────────────────────
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const activeFilters = { ...filters, search: debouncedSearch };

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // ── Data ──────────────────────────────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useLeads(activeFilters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleFilterChange = (updates: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleCreateSubmit = async (formData: CreateLeadPayload) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsCreateOpen(false);
      toast.success('Lead created successfully');
    } catch {
      toast.error('Failed to create lead. Please try again.');
    }
  };

  const handleEditSubmit = async (formData: UpdateLeadPayload) => {
    if (!editingLead) return;
    try {
      await updateMutation.mutateAsync({ id: editingLead._id, payload: formData });
      setEditingLead(null);
      toast.success('Lead updated successfully');
    } catch {
      toast.error('Failed to update lead. Please try again.');
    }
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      await leadsApi.exportCsv(activeFilters);
      toast.success('CSV export downloaded');
    } catch {
      toast.error('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      <Header
        title="Leads"
        subtitle={
          data
            ? `${data.pagination.total} lead${data.pagination.total !== 1 ? 's' : ''} total`
            : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                icon={<Download size={14} />}
                onClick={handleExportCsv}
                loading={isExporting}
              >
                Export CSV
              </Button>
            )}
            <Button
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsCreateOpen(true)}
            >
              New Lead
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-5 flex-1 animate-fade-in">
        {/* Filters */}
        <LeadFiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchChange}
          searchInput={searchInput}
        />

        {/* Table card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800 shadow-card overflow-hidden">
          {isLoading ? (
            <PageLoader />
          ) : isError ? (
            <ErrorState onRetry={refetch} />
          ) : !data || data.data.length === 0 ? (
            <EmptyState
              title="No leads found"
              description={
                debouncedSearch || filters.status || filters.source
                  ? 'No leads match your filters. Try adjusting or clearing them.'
                  : 'Get started by adding your first lead.'
              }
              action={
                <Button
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => setIsCreateOpen(true)}
                >
                  Add Lead
                </Button>
              }
            />
          ) : (
            <>
              <LeadTable leads={data.data} onEdit={setEditingLead} />
              <div className="px-4 py-4 border-t border-border dark:border-slate-800">
                <Pagination
                  pagination={data.pagination}
                  onPageChange={(page) => handleFilterChange({ page })}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Lead"
        size="md"
      >
        <LeadForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateOpen(false)}
          isSubmitting={createMutation.isPending}
          submitLabel="Create Lead"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingLead}
        onClose={() => setEditingLead(null)}
        title="Edit Lead"
        size="md"
      >
        {editingLead && (
          <LeadForm
            defaultValues={editingLead}
            onSubmit={handleEditSubmit}
            onCancel={() => setEditingLead(null)}
            isSubmitting={updateMutation.isPending}
            submitLabel="Save Changes"
          />
        )}
      </Modal>
    </div>
  );
};

export default Leads;
