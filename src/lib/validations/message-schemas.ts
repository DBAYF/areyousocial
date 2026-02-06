// Validation schemas for messaging features

import { z } from 'zod'
import { sanitizeText } from '@/lib/utils/validators'

export const sendMessageSchema = z.object({
  thread_id: z.string().min(1, 'Thread ID is required'),
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long (max 2000 characters)')
    .transform(sanitizeText),
  type: z.enum(['text', 'system', 'ai_draft']).default('text'),
  metadata: z.record(z.any()).optional(),
})

export type SendMessageData = z.infer<typeof sendMessageSchema>

export const createThreadSchema = z.object({
  participants: z
    .array(z.string())
    .min(2, 'At least 2 participants required')
    .max(50, 'Too many participants (max 50)'),
  initial_message: sendMessageSchema.optional(),
  metadata: z.record(z.any()).optional(),
})

export type CreateThreadData = z.infer<typeof createThreadSchema>

export const updateThreadSchema = z.object({
  thread_id: z.string().min(1, 'Thread ID is required'),
  name: z.string().max(100, 'Name too long').optional(),
  description: z.string().max(500, 'Description too long').optional(),
  settings: z.object({
    muted: z.boolean().optional(),
    archived: z.boolean().optional(),
    pinned: z.boolean().optional(),
  }).optional(),
})

export type UpdateThreadData = z.infer<typeof updateThreadSchema>

export const messageReactionSchema = z.object({
  message_id: z.string().min(1, 'Message ID is required'),
  reaction: z.string().min(1, 'Reaction is required').max(10, 'Reaction too long'),
  action: z.enum(['add', 'remove']),
})

export type MessageReactionData = z.infer<typeof messageReactionSchema>

export const typingIndicatorSchema = z.object({
  thread_id: z.string().min(1, 'Thread ID is required'),
  user_id: z.string().min(1, 'User ID is required'),
  is_typing: z.boolean(),
})

export type TypingIndicatorData = z.infer<typeof typingIndicatorSchema>