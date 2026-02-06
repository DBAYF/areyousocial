// Validation schemas for opportunity features

import { z } from 'zod'
import { sanitizeText } from '@/lib/utils/validators'

export const createOpportunitySchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .transform(sanitizeText),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .transform(sanitizeText),
  type: z.enum(['job', 'investment', 'partnership', 'mentorship', 'internship', 'consulting', 'other']),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).min(1, 'At least one tag is required').max(10, 'Maximum 10 tags allowed'),
  location: z.string().max(100, 'Location too long').optional(),
  remote_possible: z.boolean().default(false),
  work_arrangement: z.enum(['remote', 'hybrid', 'onsite']).default('remote'),
  compensation_type: z.enum(['salary', 'equity', 'both']).optional(),
  salary_range: z.object({
    min: z.number().min(0, 'Minimum salary cannot be negative'),
    max: z.number().min(1, 'Maximum salary must be greater than 0'),
    currency: z.string().length(3, 'Currency must be 3 characters'),
  }).optional(),
  equity_range: z.object({
    min: z.number().min(0, 'Minimum equity cannot be negative').max(100, 'Equity cannot exceed 100%'),
    max: z.number().min(0.01, 'Maximum equity must be greater than 0').max(100, 'Equity cannot exceed 100%'),
  }).optional(),
  benefits: z.array(z.string().max(100, 'Benefit description too long')).max(20, 'Too many benefits').optional(),
  required_skills: z.array(z.string().max(50, 'Skill name too long')).min(1, 'At least one skill required').max(20, 'Too many skills'),
  preferred_skills: z.array(z.string().max(50, 'Skill name too long')).max(20, 'Too many skills').optional(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']),
  education_requirements: z.array(z.string().max(200, 'Education requirement too long')).max(10, 'Too many requirements').optional(),
  application_deadline: z.date().optional(),
  application_process: z.string().max(1000, 'Application process description too long').optional(),
  contact_email: z.string().email('Invalid email address').optional(),
  visibility: z.enum(['public', 'connections', 'invite_only']).default('public'),
  expires_at: z.date().optional(),
})

export type CreateOpportunityData = z.infer<typeof createOpportunitySchema>

export const applyOpportunitySchema = z.object({
  opportunity_id: z.string().min(1, 'Opportunity ID is required'),
  cover_letter: z
    .string()
    .max(2000, 'Cover letter must be less than 2000 characters')
    .optional()
    .transform(val => val ? sanitizeText(val) : undefined),
  resume_url: z.string().url('Invalid resume URL').optional(),
  portfolio_urls: z.array(z.string().url('Invalid portfolio URL')).max(5, 'Maximum 5 portfolio links').optional(),
  additional_info: z.record(z.any()).optional(),
  availability_date: z.date().optional(),
  salary_expectation: z.number().min(0, 'Salary expectation cannot be negative').optional(),
})

export type ApplyOpportunityData = z.infer<typeof applyOpportunitySchema>

export const updateOpportunitySchema = z.object({
  opportunity_id: z.string().min(1, 'Opportunity ID is required'),
  title: z.string().min(5).max(100).transform(sanitizeText).optional(),
  description: z.string().min(50).max(2000).transform(sanitizeText).optional(),
  type: z.enum(['job', 'investment', 'partnership', 'mentorship', 'internship', 'consulting', 'other']).optional(),
  category: z.string().min(1).optional(),
  tags: z.array(z.string()).min(1).max(10).optional(),
  location: z.string().max(100).optional(),
  remote_possible: z.boolean().optional(),
  work_arrangement: z.enum(['remote', 'hybrid', 'onsite']).optional(),
  compensation_type: z.enum(['salary', 'equity', 'both']).optional(),
  salary_range: z.object({
    min: z.number().min(0),
    max: z.number().min(1),
    currency: z.string().length(3),
  }).optional(),
  equity_range: z.object({
    min: z.number().min(0).max(100),
    max: z.number().min(0.01).max(100),
  }).optional(),
  benefits: z.array(z.string().max(100)).max(20).optional(),
  required_skills: z.array(z.string().max(50)).min(1).max(20).optional(),
  preferred_skills: z.array(z.string().max(50)).max(20).optional(),
  experience_level: z.enum(['entry', 'mid', 'senior', 'executive']).optional(),
  education_requirements: z.array(z.string().max(200)).max(10).optional(),
  application_deadline: z.date().optional(),
  application_process: z.string().max(1000).optional(),
  contact_email: z.string().email().optional(),
  visibility: z.enum(['public', 'connections', 'invite_only']).optional(),
  expires_at: z.date().optional(),
})

export type UpdateOpportunityData = z.infer<typeof updateOpportunitySchema>

export const saveExternalOpportunitySchema = z.object({
  url: z.string().url('Invalid URL'),
  title: z.string().min(5, 'Title too short').max(200, 'Title too long').optional(),
  description: z.string().max(1000, 'Description too long').optional(),
  company: z.string().max(100, 'Company name too long').optional(),
  location: z.string().max(100, 'Location too long').optional(),
  type: z.enum(['job', 'investment', 'partnership', 'mentorship', 'internship', 'consulting', 'other']).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  notes: z.string().max(500, 'Notes too long').optional(),
})

export type SaveExternalOpportunityData = z.infer<typeof saveExternalOpportunitySchema>