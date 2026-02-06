// Notification store using Zustand

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { NotificationType } from '@/lib/utils/constants'

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  created_at: Date
  read_at?: Date
}

interface NotificationState {
  // State
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null

  // Pagination
  hasMore: boolean
  lastFetchedAt?: Date

  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  removeNotification: (notificationId: string) => void
  clearNotifications: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateUnreadCount: () => void
  setHasMore: (hasMore: boolean) => void
  setLastFetchedAt: (date: Date) => void
}

export const useNotificationStore = create<NotificationState>()(
  devtools(
    (set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      hasMore: true,

      // Actions
      setNotifications: (notifications: Notification[]) => {
        set({ notifications })
        get().updateUnreadCount()
      },

      addNotification: (notification: Notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications]
        }))
        get().updateUnreadCount()
      },

      markAsRead: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true, read_at: new Date() }
              : notification
          )
        }))
        get().updateUnreadCount()
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(notification => ({
            ...notification,
            read: true,
            read_at: new Date()
          }))
        }))
        set({ unreadCount: 0 })
      },

      removeNotification: (notificationId: string) => {
        set((state) => ({
          notifications: state.notifications.filter(
            notification => notification.id !== notificationId
          )
        }))
        get().updateUnreadCount()
      },

      clearNotifications: () => {
        set({ notifications: [], unreadCount: 0 })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      updateUnreadCount: () => {
        const state = get()
        const unreadCount = state.notifications.filter(n => !n.read).length
        set({ unreadCount })
      },

      setHasMore: (hasMore: boolean) => {
        set({ hasMore })
      },

      setLastFetchedAt: (date: Date) => {
        set({ lastFetchedAt: date })
      },
    }),
    {
      name: 'notification-store',
    }
  )
)

// Selectors
export const useNotifications = () => useNotificationStore((state) => state.notifications)
export const useUnreadCount = () => useNotificationStore((state) => state.unreadCount)
export const useNotificationLoading = () => useNotificationStore((state) => state.isLoading)
export const useNotificationError = () => useNotificationStore((state) => state.error)

// Helper functions
export const createNotification = (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, any>
): Omit<Notification, 'id'> => ({
  user_id: userId,
  type,
  title,
  message,
  data,
  read: false,
  created_at: new Date(),
})