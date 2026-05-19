import { Router } from 'express';
import * as leadController from './lead.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import {
  validate,
  createLeadSchema,
  updateLeadSchema,
  leadIdSchema,
} from './lead.schema';

const router = Router();

// All lead routes require authentication
router.use(authenticate);

// ─── Special routes (must be before /:id) ────────────────────────────────────
router.get('/stats', leadController.getStats);
router.get('/export/csv', requireRole('admin'), leadController.exportCsv);

// ─── CRUD ─────────────────────────────────────────────────────────────────────
router.get('/', leadController.getLeads);
router.post('/', validate(createLeadSchema), leadController.createLead);
router.get('/:id', validate(leadIdSchema), leadController.getLeadById);
router.put('/:id', validate(updateLeadSchema), leadController.updateLead);
router.delete('/:id', validate(leadIdSchema), requireRole('admin'), leadController.deleteLead);

export default router;
