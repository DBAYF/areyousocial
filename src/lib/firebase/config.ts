// Firebase configuration and initialization

import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate configuration
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
]

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`
  )
}

// Initialize Firebase app (prevent multiple initializations)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Export the app instance
export { app }

// Environment detection
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
export const isTest = process.env.NODE_ENV === 'test'

// Firebase settings
export const FIREBASE_SETTINGS = {
  // Firestore settings
  firestore: {
    ignoreUndefinedProperties: true,
  },
  // Auth settings
  auth: {
    persistence: 'LOCAL' as const,
  },
  // Storage settings
  storage: {
    maxUploadRetryTime: 30000,
    maxOperationRetryTime: 30000,
  },
} as const

// Collection names (for consistency)
export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  POSTS: 'posts',
  COMMENTS: 'comments',
  LIKES: 'likes',
  THREADS: 'threads',
  MESSAGES: 'messages',
  CONNECTIONS: 'connections',
  OPPORTUNITIES: 'opportunities',
  APPLICATIONS: 'applications',
  SAVED_OPPORTUNITIES: 'saved_opportunities',
  RECOMMENDATIONS: 'recommendations',
  NEXT_MOVES: 'next_moves',
  QUICK_ACTIONS: 'quick_actions',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  AUDIT_LOGS: 'audit_logs',
  USER_ANALYSIS: 'user_analysis',
} as const

// Storage bucket paths
export const STORAGE_PATHS = {
  AVATARS: 'avatars',
  POST_IMAGES: 'post-images',
  OPPORTUNITY_ATTACHMENTS: 'opportunity-attachments',
  MESSAGE_ATTACHMENTS: 'message-attachments',
} as const