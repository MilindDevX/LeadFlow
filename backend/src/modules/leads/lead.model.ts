import mongoose, { Schema, Document } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../../types';

export interface ILeadDocument extends Omit<ILead, '_id'>, Document {}

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Lost'] satisfies LeadStatus[],
      default: 'New',
    },
    source: {
      type: String,
      enum: ['Website', 'Instagram', 'Referral'] satisfies LeadSource[],
      required: [true, 'Lead source is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes for query performance ────────────────────────────────────────────

// Text index enables efficient name/email search
leadSchema.index({ name: 'text', email: 'text' });

// Compound index for common filter combinations
leadSchema.index({ status: 1, source: 1, createdAt: -1 });

const Lead = mongoose.model<ILeadDocument>('Lead', leadSchema);

export default Lead;
