import { Timestamp } from 'firebase/firestore'
import { MessageType } from '@/lib/utils/constants'

// Thread (conversation)
export interface Thread {
  id: string
  participants: string[] // User IDs
  participant_profiles: Record<string, ThreadParticipant>
  last_message?: Message
  last_activity: Timestamp
  unread_count: Record<string, number> // user_id -> count
  created_at: Timestamp
  updated_at: Timestamp
}

export interface ThreadParticipant {
  uid: string
  display_name: string
  avatar_url?: string
  last_seen: Timestamp
}

// Individual message
export interface Message {
  id: string
  thread_id: string
  sender_id: string
  type: MessageType
  content: string
  metadata?: MessageMetadata
  read_by: Record<string, Timestamp> // user_id -> read timestamp
  created_at: Timestamp
  updated_at?: Timestamp
}

// Message metadata
export interface MessageMetadata {
  // For AI draft messages
  ai_draft_id?: string
  original_message_id?: string

  // For system messages
  system_action?: string

  // For media messages
  attachments?: MessageAttachment[]
}

export interface MessageAttachment {
  type: 'image' | 'file' | 'link'
  url: string
  filename?: string
  size?: number
  mime_type?: string
}

// Message creation data
export interface CreateMessageData {
  thread_id: string
  content: string
  type?: MessageType
  metadata?: MessageMetadata
}

export interface CreateThreadData {
  participant_ids: string[]
  initial_message?: CreateMessageData
}

// Message filters
export interface MessageFilters {
  thread_id?: string
  sender_id?: string
  type?: MessageType[]
  date_range?: {
    start: Date
    end: Date
  }
  unread_only?: boolean
}

// Thread list item (for UI optimization)
export interface ThreadListItem {
  id: string
  participants: ThreadParticipant[]
  last_message?: {
    content: string
    sender_id: string
    created_at: Timestamp
    type: MessageType
  }
  unread_count: number
  last_activity: Timestamp
}