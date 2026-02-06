import { Timestamp } from 'firebase/firestore'
import { ConnectionStatus } from '@/lib/utils/constants'

// Connection between users
export interface Connection {
  id: string
  requester_id: string
  addressee_id: string
  status: ConnectionStatus
  requested_at: Timestamp
  accepted_at?: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
}

// Connection request data
export interface CreateConnectionRequestData {
  addressee_id: string
  message?: string // Optional message with the request
}

// Connection with profile data (for UI)
export interface ConnectionWithProfile extends Connection {
  requester_profile: {
    uid: string
    display_name: string
    avatar_url?: string
    title?: string
    company_name?: string
  }
  addressee_profile: {
    uid: string
    display_name: string
    avatar_url?: string
    title?: string
    company_name?: string
  }
}

// Connection filters
export interface ConnectionFilters {
  status?: ConnectionStatus[]
  user_id?: string // Filter connections for a specific user
  mutual_only?: boolean
  date_range?: {
    start: Date
    end: Date
  }
}

// Connection statistics
export interface ConnectionStats {
  total_connections: number
  pending_requests: number
  sent_requests: number
  mutual_connections: number
}