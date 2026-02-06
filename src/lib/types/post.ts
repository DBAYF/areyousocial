import { Timestamp } from 'firebase/firestore'
import { PostType } from '@/lib/utils/constants'

// Base post interface
export interface Post {
  id: string
  author_id: string
  author: {
    uid: string
    display_name: string
    username: string
    avatar_url?: string
    verified?: boolean
  }
  type: PostType
  title?: string
  content: string
  images?: string[]
  tags?: string[]
  metadata?: PostMetadata
  stats: PostStats
  liked_by_user?: boolean
  visibility: 'public' | 'connections' | 'private'
  created_at: Timestamp | Date
  updated_at?: Timestamp | Date
}

// Post metadata (type-specific data)
export interface PostMetadata {
  // For opportunity posts
  opportunity_id?: string

  // For milestone posts
  milestone_type?: string

  // For question posts
  question_category?: string

  // For advice seeking posts
  advice_categories?: string[]
}

// Post statistics
export interface PostStats {
  likes_count: number
  comments_count: number
  shares_count: number
  views_count: number
}

// Post engagement
export interface PostLike {
  id: string
  post_id: string
  user_id: string
  created_at: Timestamp
}

export interface PostComment {
  id: string
  post_id: string
  author_id: string
  content: string
  parent_comment_id?: string // For nested replies
  likes_count: number
  created_at: Timestamp
  updated_at: Timestamp
}

// Post creation/update data
export interface CreatePostData {
  type: PostType
  title?: string
  content: string
  images?: File[]
  tags?: string[]
  metadata?: PostMetadata
  visibility?: 'public' | 'connections' | 'private'
}

export interface UpdatePostData {
  title?: string
  content?: string
  images?: string[]
  tags?: string[]
  metadata?: PostMetadata
  visibility?: 'public' | 'connections' | 'private'
}

// Post filters
export interface PostFilters {
  type?: PostType[]
  tags?: string[]
  author_id?: string
  visibility?: 'public' | 'connections' | 'private'
  date_range?: {
    start: Date
    end: Date
  }
  sort_by?: 'created_at' | 'likes_count' | 'comments_count' | 'views_count'
  sort_order?: 'asc' | 'desc'
}