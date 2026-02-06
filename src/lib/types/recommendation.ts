import { Timestamp } from 'firebase/firestore'

// Recommendation/AI suggestion
export interface Recommendation {
  id: string
  user_id: string
  type: RecommendationType
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: string
  action_required: boolean
  action_url?: string
  action_text?: string
  metadata?: Record<string, any>
  dismissed: boolean
  completed: boolean
  created_at: Timestamp
  expires_at?: Timestamp
}

// Recommendation types
export type RecommendationType =
  | 'connect'
  | 'opportunity'
  | 'skill_development'
  | 'network_expansion'
  | 'content_creation'
  | 'milestone_celebration'
  | 'profile_improvement'
  | 'mentorship'
  | 'funding'
  | 'partnership'

// Next moves (AI-generated action items)
export interface NextMove {
  id: string
  user_id: string
  title: string
  description: string
  category: 'immediate' | 'short_term' | 'long_term'
  estimated_time: 'quick' | 'hours' | 'days' | 'weeks' | 'months'
  difficulty: 'easy' | 'medium' | 'hard'
  impact: 'low' | 'medium' | 'high'
  prerequisites?: string[]
  resources?: NextMoveResource[]
  completed: boolean
  completed_at?: Timestamp
  created_at: Timestamp
}

export interface NextMoveResource {
  type: 'article' | 'video' | 'tool' | 'course' | 'person' | 'event'
  title: string
  url?: string
  description?: string
}

// Quick action (immediate, actionable item)
export interface QuickAction {
  id: string
  user_id: string
  type: QuickActionType
  title: string
  description: string
  action_url: string
  action_text: string
  icon?: string
  color?: string
  priority: number
  expires_at?: Timestamp
  completed: boolean
  created_at: Timestamp
}

export type QuickActionType =
  | 'send_message'
  | 'update_profile'
  | 'apply_opportunity'
  | 'join_event'
  | 'complete_onboarding'
  | 'review_connections'
  | 'post_update'

// Recommendation filters
export interface RecommendationFilters {
  user_id: string
  type?: RecommendationType[]
  priority?: string[]
  category?: string[]
  completed?: boolean
  dismissed?: boolean
  date_range?: {
    start: Date
    end: Date
  }
}

// AI analysis result
export interface UserAnalysis {
  user_id: string
  profile_completeness: number // 0-100
  network_strength: number // 0-100
  opportunity_match_score: number // 0-100
  skill_gaps: string[]
  recommended_connections: string[]
  recommended_skills: string[]
  market_insights: string[]
  generated_at: Timestamp
}