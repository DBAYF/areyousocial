import { Timestamp } from 'firebase/firestore'
import { OpportunityStatus } from '@/lib/utils/constants'

// Opportunity (job, investment, partnership, etc.)
export interface Opportunity {
  id: string
  creator_id: string
  title: string
  description: string
  type: OpportunityType
  category: string
  tags: string[]

  // Company info
  company_name?: string
  company_website?: string
  company_description?: string

  // Location and work arrangement
  location?: string
  remote_possible: boolean
  work_arrangement: 'remote' | 'hybrid' | 'onsite'

  // Compensation and benefits
  compensation_type?: 'salary' | 'equity' | 'both'
  salary_range?: {
    min: number
    max: number
    currency: string
  }
  equity_range?: {
    min: number
    max: number
  }
  benefits?: string[]

  // Requirements
  required_skills: string[]
  preferred_skills?: string[]
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  education_requirements?: string[]

  // Application process
  application_deadline?: Timestamp
  application_process?: string
  contact_email?: string

  // Status and visibility
  status: OpportunityStatus
  visibility: 'public' | 'connections' | 'invite_only'
  featured: boolean

  // Metadata
  views_count: number
  applications_count: number
  saves_count: number

  created_at: Timestamp
  updated_at: Timestamp
  expires_at?: Timestamp
}

// Opportunity types
export type OpportunityType =
  | 'job'
  | 'investment'
  | 'partnership'
  | 'mentorship'
  | 'advisory'
  | 'internship'
  | 'consulting'
  | 'other'

// Opportunity application
export interface OpportunityApplication {
  id: string
  opportunity_id: string
  applicant_id: string
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected' | 'withdrawn'
  cover_letter?: string
  resume_url?: string
  portfolio_urls?: string[]
  additional_info?: Record<string, any>
  applied_at: Timestamp
  reviewed_at?: Timestamp
  decision_at?: Timestamp
}

// Saved opportunity
export interface SavedOpportunity {
  id: string
  user_id: string
  opportunity_id: string
  saved_at: Timestamp
  notes?: string
}

// Opportunity filters
export interface OpportunityFilters {
  type?: OpportunityType[]
  category?: string[]
  tags?: string[]
  location?: string[]
  remote_possible?: boolean
  experience_level?: string[]
  compensation_type?: string[]
  salary_range?: {
    min?: number
    max?: number
  }
  status?: OpportunityStatus[]
  visibility?: string[]
  featured_only?: boolean
  creator_id?: string
  sort_by?: 'created_at' | 'expires_at' | 'applications_count' | 'views_count'
  sort_order?: 'asc' | 'desc'
}

// Opportunity creation data
export interface CreateOpportunityData {
  title: string
  description: string
  type: OpportunityType
  category: string
  tags: string[]
  company_name?: string
  company_website?: string
  company_description?: string
  location?: string
  remote_possible: boolean
  work_arrangement: 'remote' | 'hybrid' | 'onsite'
  compensation_type?: 'salary' | 'equity' | 'both'
  salary_range?: {
    min: number
    max: number
    currency: string
  }
  equity_range?: {
    min: number
    max: number
  }
  benefits?: string[]
  required_skills: string[]
  preferred_skills?: string[]
  experience_level: 'entry' | 'mid' | 'senior' | 'executive'
  education_requirements?: string[]
  application_deadline?: Date
  application_process?: string
  contact_email?: string
  visibility: 'public' | 'connections' | 'invite_only'
  expires_at?: Date
}