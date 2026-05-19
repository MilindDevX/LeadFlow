import { z } from 'zod';
import { validate } from '../auth/auth.schema';

const leadStatuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
const leadSources = ['Website', 'Instagram', 'Referral'] as const;

export const createLeadSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Lead name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Lead email is required' })
      .email('Please provide a valid email address'),
    status: z
      .enum(leadStatuses, { errorMap: () => ({ message: 'Invalid status' }) })
      .optional()
      .default('New'),
    source: z.enum(leadSources, { errorMap: () => ({ message: 'Invalid source' }) }),
    notes: z
      .string()
      .max(1000, 'Notes cannot exceed 1000 characters')
      .optional(),
  }),
});

export const updateLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).trim().optional(),
    email: z.string().email('Please provide a valid email address').optional(),
    status: z.enum(leadStatuses).optional(),
    source: z.enum(leadSources).optional(),
    notes: z.string().max(1000).optional(),
  }),
  params: z.object({
    id: z.string().length(24, 'Invalid lead ID'),
  }),
});

export const leadIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid lead ID'),
  }),
});

// Re-export validate from auth schema (shared utility)
export { validate };
