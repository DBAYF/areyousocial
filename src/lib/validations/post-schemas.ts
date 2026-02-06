// Post validation schemas

import { z } from 'zod'

// Base post schema
export const postSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content must be less than 10,000 characters'),
  images: z.array(z.string().url()).max(10, 'Maximum 10 images allowed').optional(),
  tags: z.array(z.string().min(1).max(50)).max(10, 'Maximum 10 tags allowed').optional(),
  metadata: z.record(z.any()).optional(),
  visibility: z.enum(['public', 'connections', 'private']).default('public'),
  allow_comments: z.boolean().default(true),
  allow_reactions: z.boolean().default(true),
})

// Create post schema
export const createPostSchema = postSchema.extend({
  // Additional validation for creation
})

// Update post schema
export const updatePostSchema = postSchema.partial().extend({
  // Only allow updating specific fields
})

// Comment schema
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment must be less than 1,000 characters'),
  parent_id: z.string().optional(), // For nested replies
  images: z.array(z.string().url()).max(3, 'Maximum 3 images allowed').optional(),
})

// Like/reaction schema
export const reactionSchema = z.object({
  type: z.enum(['like', 'love', 'laugh', 'wow', 'sad', 'angry']),
})

// Report schema
export const reportPostSchema = z.object({
  reason: z.enum([
    'spam',
    'harassment',
    'inappropriate_content',
    'copyright_violation',
    'false_information',
    'other'
  ]),
  description: z.string().min(10, 'Please provide a detailed description').max(500),
})

// Search and filter schemas
export const postSearchSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author_id: z.string().optional(),
  visibility: z.enum(['public', 'connections']).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  sort_by: z.enum(['newest', 'oldest', 'most_liked', 'most_commented']).default('newest'),
  limit: z.number().min(1).max(100).default(20),
})

export type PostInput = z.infer<typeof postSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type ReactionInput = z.infer<typeof reactionSchema>
export type ReportPostInput = z.infer<typeof reportPostSchema>
export type PostSearchInput = z.infer<typeof postSearchSchema>