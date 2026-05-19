// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'sales_user';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadPayload {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadPayload {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
  notes?: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedLeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface LeadFilters {
  search: string;
  status: string;   // comma-separated or empty
  source: string;   // comma-separated or empty
  sort: 'latest' | 'oldest';
  page: number;
}

export const DEFAULT_FILTERS: LeadFilters = {
  search: '',
  status: '',
  source: '',
  sort: 'latest',
  page: 1,
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];
