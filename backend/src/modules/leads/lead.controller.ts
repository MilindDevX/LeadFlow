import { Response } from 'express';
import * as leadService from './lead.service';
import { AuthenticatedRequest, LeadQueryParams } from '../../types';

/**
 * GET /api/leads/stats
 * Returns dashboard aggregate stats — total, by-status counts, recent 5 leads.
 */
export const getStats = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  const stats = await leadService.getStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
};

/**
 * GET /api/leads
 * Supports filtering, search, sort, and pagination via query params.
 */
export const getLeads = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const query = req.query as LeadQueryParams;
  const result = await leadService.getLeads(query);

  res.status(200).json({
    success: true,
    ...result,
  });
};

/**
 * GET /api/leads/export/csv
 * Streams a CSV file of all leads matching current filters.
 * Admin only.
 */
export const exportCsv = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const query = req.query as LeadQueryParams;
  const csv = await leadService.exportLeadsAsCsv(query);

  const date = new Date().toISOString().split('T')[0];
  const filename = `leads_export_${date}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
};

/**
 * GET /api/leads/:id
 */
export const getLeadById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const lead = await leadService.getLeadById(req.params.id);

  res.status(200).json({
    success: true,
    data: { lead },
  });
};

/**
 * POST /api/leads
 */
export const createLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const lead = await leadService.createLead(req.body, req.user!);

  res.status(201).json({
    success: true,
    message: 'Lead created successfully',
    data: { lead },
  });
};

/**
 * PUT /api/leads/:id
 */
export const updateLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const lead = await leadService.updateLead(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Lead updated successfully',
    data: { lead },
  });
};

/**
 * DELETE /api/leads/:id
 * Admin only.
 */
export const deleteLead = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await leadService.deleteLead(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Lead deleted successfully',
  });
};
