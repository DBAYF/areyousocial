// App-wide constants and configuration

export const APP_CONFIG = {
  name: 'ReMake',
  version: '1.0.0',
  description: 'Entrepreneur social platform for founders and mentors',
} as const

// User stages in the entrepreneurial journey
export const USER_STAGES = {
  IDEA: 'idea',
  MVP: 'mvp',
  EARLY_TRACTION: 'early_traction',
  GROWTH: 'growth',
  SCALE: 'scale',
  EXIT: 'exit',
} as const

export type UserStage = typeof USER_STAGES[keyof typeof USER_STAGES]

// Tags for user interests and expertise
export const USER_TAGS = {
  // Technical Skills
  PRODUCT: 'product',
  ENGINEERING: 'engineering',
  DESIGN: 'design',
  MARKETING: 'marketing',
  SALES: 'sales',
  FINANCE: 'finance',
  LEGAL: 'legal',
  OPERATIONS: 'operations',

  // Industries
  SAAS: 'saas',
  ECOMMERCE: 'ecommerce',
  FINTECH: 'fintech',
  HEALTHTECH: 'healthtech',
  EDTECH: 'edtech',
  FOODTECH: 'foodtech',
  PROPTECH: 'proptech',
  GREENTECH: 'greentech',

  // Business Stages
  STARTUP: 'startup',
  SCALEUP: 'scaleup',
  ENTERPRISE: 'enterprise',

  // Specializations
  AI_ML: 'ai_ml',
  BLOCKCHAIN: 'blockchain',
  IOT: 'iot',
  MOBILE: 'mobile',
  WEB: 'web',
  DATA: 'data',
} as const

export type UserTag = typeof USER_TAGS[keyof typeof USER_TAGS]

// Post types
export const POST_TYPES = {
  UPDATE: 'update',
  QUESTION: 'question',
  OPPORTUNITY: 'opportunity',
  MILESTONE: 'milestone',
  ADVICE_SEEKING: 'advice_seeking',
} as const

export type PostType = typeof POST_TYPES[keyof typeof POST_TYPES]

// Connection statuses
export const CONNECTION_STATUSES = {
  NONE: 'none',
  PENDING: 'pending',
  CONNECTED: 'connected',
  BLOCKED: 'blocked',
} as const

export type ConnectionStatus = typeof CONNECTION_STATUSES[keyof typeof CONNECTION_STATUSES]

// Opportunity statuses
export const OPPORTUNITY_STATUSES = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  EXPIRED: 'expired',
} as const

export type OpportunityStatus = typeof OPPORTUNITY_STATUSES[keyof typeof OPPORTUNITY_STATUSES]

// Message types
export const MESSAGE_TYPES = {
  TEXT: 'text',
  SYSTEM: 'system',
  AI_DRAFT: 'ai_draft',
} as const

export type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES]

// User roles
export const USER_ROLES = {
  FOUNDER: 'founder',
  MENTOR: 'mentor',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES]

// Notification types
export const NOTIFICATION_TYPES = {
  CONNECTION_REQUEST: 'connection_request',
  CONNECTION_ACCEPTED: 'connection_accepted',
  MESSAGE: 'message',
  POST_LIKE: 'post_like',
  POST_COMMENT: 'post_comment',
  OPPORTUNITY_MATCH: 'opportunity_match',
  RECOMMENDATION: 'recommendation',
} as const

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES]

// Safety risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const

export type RiskLevel = typeof RISK_LEVELS[keyof typeof RISK_LEVELS]

// User account statuses
export const ACCOUNT_STATUSES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const

export type AccountStatus = typeof ACCOUNT_STATUSES[keyof typeof ACCOUNT_STATUSES]

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

// File upload limits
export const FILE_LIMITS = {
  MAX_AVATAR_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_POST_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const

// Rate limiting
export const RATE_LIMITS = {
  MESSAGES_PER_MINUTE: 30,
  CONNECTIONS_PER_DAY: 50,
  POSTS_PER_HOUR: 10,
} as const

// UI constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
  MODAL_ANIMATION_DURATION: 200,
} as const