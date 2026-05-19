import { FilterQuery } from 'mongoose';
import Lead, { ILeadDocument } from './lead.model';
import { LeadQueryParams, IUserPublic } from '../../types';
import { AppError } from '../../middleware/error.middleware';

interface CreateLeadPayload {
  name: string;
  email: string;
  status?: string;
  source: string;
  notes?: string;
}

interface UpdateLeadPayload {
  name?: string;
  email?: string;
  status?: string;
  source?: string;
  notes?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export const getStats = async () => {
  const [statusCounts, recentLeads, total] = await Promise.all([
    Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Lead.find().sort({ createdAt: -1 }).limit(5).lean(),
    Lead.countDocuments(),
  ]);

  // Normalize aggregate result into a plain object with all statuses present
  const byStatus: Record<string, number> = {
    New: 0,
    Contacted: 0,
    Qualified: 0,
    Lost: 0,
  };
  for (const item of statusCounts) {
    byStatus[item._id as string] = item.count as number;
  }

  return { total, byStatus, recentLeads };
};

// ─── Get Leads (filtered, searched, sorted, paginated) ───────────────────────

export const getLeads = async (query: LeadQueryParams) => {
  const {
    page = '1',
    limit = '10',
    status,
    source,
    search,
    sort = 'latest',
  } = query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const filter: FilterQuery<ILeadDocument> = {};

  if (status) {
    const statuses = status.split(',').map((s) => s.trim());
    filter.status = { $in: statuses };
  }

  if (source) {
    const sources = source.split(',').map((s) => s.trim());
    filter.source = { $in: sources };
  }

  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const sortOrder = sort === 'oldest' ? 1 : -1;

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  return {
    data: leads,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

// ─── Get Single Lead ──────────────────────────────────────────────────────────

export const getLeadById = async (id: string) => {
  const lead = await Lead.findById(id).lean();
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

// ─── Create Lead ──────────────────────────────────────────────────────────────

export const createLead = async (payload: CreateLeadPayload, user: IUserPublic) => {
  const lead = await Lead.create({ ...payload, createdBy: user._id });
  return lead;
};

// ─── Update Lead ──────────────────────────────────────────────────────────────

export const updateLead = async (id: string, payload: UpdateLeadPayload) => {
  const lead = await Lead.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  ).lean();

  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

// ─── Delete Lead ──────────────────────────────────────────────────────────────

export const deleteLead = async (id: string) => {
  const lead = await Lead.findByIdAndDelete(id).lean();
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

// ─── CSV Export ───────────────────────────────────────────────────────────────

export const exportLeadsAsCsv = async (query: LeadQueryParams): Promise<string> => {
  const { status, source, search } = query;

  const filter: FilterQuery<ILeadDocument> = {};

  if (status) {
    const statuses = status.split(',').map((s) => s.trim());
    filter.status = { $in: statuses };
  }
  if (source) {
    const sources = source.split(',').map((s) => s.trim());
    filter.source = { $in: sources };
  }
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const leads = await Lead.find(filter).sort({ createdAt: -1 }).lean();

  const headers = ['ID', 'Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
  const rows = leads.map((lead) => [
    lead._id.toString(),
    escapeCsvField(lead.name),
    escapeCsvField(lead.email),
    lead.status,
    lead.source,
    escapeCsvField(lead.notes ?? ''),
    new Date(lead.createdAt).toISOString(),
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
};

const escapeCsvField = (value: string): string => {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};
