// Validation schemas for settings forms

import { z } from 'zod'

// Account settings schemas
export const updateEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Current password is required'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z\d]/, 'Password must contain at least one special character'),
  confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
})

// Privacy settings schema
export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'connections', 'private']),
  activityVisibility: z.boolean(),
  searchVisibility: z.boolean(),
  analyticsConsent: z.boolean(),
  marketingConsent: z.boolean(),
  researchConsent: z.boolean(),
})

// Notification settings schema
export const notificationSettingsSchema = z.object({
  // Email notifications
  emailConnections: z.boolean(),
  emailMessages: z.boolean(),
  emailMentorship: z.boolean(),
  emailOpportunities: z.boolean(),
  emailSystem: z.boolean(),
  emailMarketing: z.boolean(),

  // Push notifications
  pushConnections: z.boolean(),
  pushMessages: z.boolean(),
  pushMentorship: z.boolean(),
  pushOpportunities: z.boolean(),
  pushSystem: z.boolean(),

  // In-app notifications
  inAppConnections: z.boolean(),
  inAppMessages: z.boolean(),
  inAppMentorship: z.boolean(),
  inAppOpportunities: z.boolean(),
  inAppRecommendations: z.boolean(),
  inAppAchievements: z.boolean(),

  // Advanced settings
  frequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']),
  quietHours: z.boolean(),
  quietStart: z.string(),
  quietEnd: z.string(),
  soundEnabled: z.boolean(),
  vibrationEnabled: z.boolean(),
})

// Appearance settings schema
export const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  fontSize: z.enum(['small', 'medium', 'large']),
  dateFormat: z.enum(['MDY', 'DMY', 'YMD']),
  timeFormat: z.enum(['12h', '24h']),
  timezone: z.string(),
  animations: z.boolean(),
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
  compactMode: z.boolean(),
})

// Integration settings schemas
export const webhookSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  events: z.array(z.string()).min(1, 'Select at least one event'),
  secret: z.string().optional(),
  active: z.boolean(),
})

export const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
  expiresAt: z.date().optional(),
})

// Data management schemas
export const dataExportSchema = z.object({
  format: z.enum(['json', 'csv', 'pdf']),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }).optional(),
  includeDeleted: z.boolean(),
})

export const dataDeletionSchema = z.object({
  reason: z.string().min(10, 'Please provide a reason for deletion'),
  confirmDeletion: z.boolean().refine(val => val === true, 'You must confirm deletion'),
  feedback: z.string().max(500, 'Feedback too long').optional(),
})