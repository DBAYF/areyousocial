// Push notifications hook

import { useEffect, useState } from 'react'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { app } from '@/lib/firebase/config'
import { useAuthStore } from '@/lib/stores/auth-store'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [token, setToken] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  const getFCMToken = async () => {
    if (!isSupported || permission !== 'granted') return null

    try {
      const messaging = getMessaging(app)
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FCM_VAPID_KEY,
      })

      if (currentToken) {
        setToken(currentToken)
        return currentToken
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error)
    }

    return null
  }

  const setupMessageListener = () => {
    if (!isSupported) return null

    try {
      const messaging = getMessaging(app)
      return onMessage(messaging, (payload) => {
        console.log('Received foreground message:', payload)

        // Show browser notification
        if (permission === 'granted') {
          new Notification(payload.notification?.title || 'New notification', {
            body: payload.notification?.body,
            icon: '/favicon.ico',
          })
        }
      })
    } catch (error) {
      console.error('Failed to setup message listener:', error)
      return null
    }
  }

  useEffect(() => {
    if (isSupported && permission === 'granted') {
      getFCMToken()
      setupMessageListener()
    }
  }, [isSupported, permission])

  return {
    isSupported,
    permission,
    token,
    requestPermission,
    getFCMToken,
  }
}