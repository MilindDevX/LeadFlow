import api from './axios';
import {
  Lead,
  CreateLeadPayload,
  UpdateLeadPayload,
  PaginatedLeadsResponse,
  ApiResponse,
  LeadFilters,
} from '@/types';

export interface LeadStats {
  total: number;
  byStatus: Record<string, number>;
  recentLeads: Lead[];
}

export const leadsApi = {
  getStats: async (): Promise<LeadStats> => {
    const { data } = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return data.data!;
  },

  getLeads: async (filters: Partial<LeadFilters>): Promise<PaginatedLeadsResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.set('page', String(filters.page));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.sort) params.set('sort', filters.sort);

    const { data } = await api.get<PaginatedLeadsResponse>(`/leads?${params.toString()}`);
    return data;
  },

  getLeadById: async (id: string): Promise<Lead> => {
    const { data } = await api.get<ApiResponse<{ lead: Lead }>>(`/leads/${id}`);
    return data.data!.lead;
  },

  createLead: async (payload: CreateLeadPayload): Promise<Lead> => {
    const { data } = await api.post<ApiResponse<{ lead: Lead }>>('/leads', payload);
    return data.data!.lead;
  },

  updateLead: async (id: string, payload: UpdateLeadPayload): Promise<Lead> => {
    const { data } = await api.put<ApiResponse<{ lead: Lead }>>(`/leads/${id}`, payload);
    return data.data!.lead;
  },

  deleteLead: async (id: string): Promise<void> => {
    await api.delete(`/leads/${id}`);
  },

  exportCsv: async (filters: Partial<LeadFilters>): Promise<void> => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);

    const response = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });

    // Trigger browser download
    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `leads_export_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
