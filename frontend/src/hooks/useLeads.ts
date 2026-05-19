import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads.api';
import { LeadFilters, CreateLeadPayload, UpdateLeadPayload } from '@/types';

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const leadKeys = {
  all: ['leads'] as const,
  stats: ['leads', 'stats'] as const,
  list: (filters: Partial<LeadFilters>) => ['leads', 'list', filters] as const,
  detail: (id: string) => ['leads', 'detail', id] as const,
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: leadKeys.stats,
    queryFn: leadsApi.getStats,
    staleTime: 60_000,
  });
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useLeads = (filters: Partial<LeadFilters>) => {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => leadsApi.getLeads(filters),
    placeholderData: (prev) => prev, // Keep previous data while fetching next page
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: () => leadsApi.getLeadById(id),
    enabled: !!id,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeadPayload) => leadsApi.createLead(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: leadKeys.stats });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeadPayload }) =>
      leadsApi.updateLead(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: leadKeys.stats });
      queryClient.invalidateQueries({ queryKey: leadKeys.detail(id) });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
      queryClient.invalidateQueries({ queryKey: leadKeys.stats });
    },
  });
};
