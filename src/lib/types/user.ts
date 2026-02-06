import { Timestamp } from 'firebase/firestore'
import {
  UserStage,
  UserTag,
  UserRole,
  AccountStatus,
  RiskLevel
} from '@/lib/utils/constants'

// Base user interface
export interface User {
  uid: string
  email?: string
  auth_providers: string[]
  roles: {
    founder: boolean
    mentor: boolean
    admin: boolean
    moderator: boolean
  }
  status: AccountStatus
  created_at: Timestamp
  last_seen: Timestamp
  safety: {
    reports_count: number
    strikes: number
    risk_level: RiskLevel
  }
  notification_token?: string
  notification_prefs: NotificationPrefs
}

// User profile (extended user data)
export interface Profile {
  uid: string
  display_name: string
  username: string
  bio?: string
  avatar_url?: string
  location?: string
  website?: string
  linkedin_url?: string
  twitter_handle?: string

  // Business info
  company_name?: string
  company_description?: string
  company_website?: string
  company_stage: UserStage
  industry: string[]
  tags: UserTag[]

  // Professional info
  title?: string
  years_experience?: number
  previous_companies?: string[]

  // Preferences
  available_for_mentoring: boolean
  seeking_mentorship: boolean
  open_to_opportunities: boolean

  // Verification
  verified: boolean
  verification_badge?: string

  // Stats
  connections_count: number
  posts_count: number
  followers_count: number

  updated_at: Timestamp
}

// Notification preferences
export interface NotificationPrefs {
  email: {
    connections: boolean
    messages: boolean
    opportunities: boolean
    recommendations: boolean
    system: boolean
  }
  push: {
    connections: boolean
    messages: boolean
    opportunities: boolean
    recommendations: boolean
    system: boolean
  }
  in_app: {
    connections: boolean
    messages: boolean
    opportunities: boolean
    recommendations: boolean
    system: boolean
  }
}

// Auth provider types
export type AuthProvider = 'google' | 'apple' | 'email'

// User creation/update data
export interface CreateUserData {
  email: string
  display_name: string
  username: string
}

export interface UpdateProfileData {
  display_name?: string
  username?: string
  bio?: string
  location?: string
  website?: string
  linkedin_url?: string
  twitter_handle?: string
  company_name?: string
  company_description?: string
  company_website?: string
  company_stage?: UserStage
  industry?: string[]
  tags?: UserTag[]
  title?: string
  years_experience?: number
  previous_companies?: string[]
  available_for_mentoring?: boolean
  seeking_mentorship?: boolean
  open_to_opportunities?: boolean
}