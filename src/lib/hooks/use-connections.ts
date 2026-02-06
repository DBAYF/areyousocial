// Connections management hook

import { useState, useCallback } from 'react'
import { connectionService } from '@/lib/firebase/firestore'
import type { Connection, CreateConnectionRequestData } from '@/lib/types/connection'

export function useConnections(userId?: string) {
  const [connections, setConnections] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConnections = useCallback(async () => {
    const targetId = userId
    if (!targetId) return

    setIsLoading(true)
    setError(null)

    try {
      const userConnections = await connectionService.query([
        where('requester_id', '==', targetId),
        orderBy('created_at', 'desc')
      ])

      const receivedConnections = await connectionService.query([
        where('addressee_id', '==', targetId),
        orderBy('created_at', 'desc')
      ])

      setConnections([...userConnections, ...receivedConnections])
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch connections'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [userId])

  const sendConnectionRequest = useCallback(async (data: CreateConnectionRequestData) => {
    setIsLoading(true)
    setError(null)

    try {
      const connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await connectionService.create(connectionId, {
        ...data,
        status: 'pending'
      })

      setIsLoading(false)
      return connectionId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send connection request'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [])

  const acceptConnection = useCallback(async (connectionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await connectionService.update(connectionId, {
        status: 'connected',
        accepted_at: new Date()
      })

      // Update local state
      setConnections(prev => prev.map(conn =>
        conn.id === connectionId
          ? { ...conn, status: 'connected', accepted_at: new Date() }
          : conn
      ))

      setIsLoading(false)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept connection'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [])

  const rejectConnection = useCallback(async (connectionId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await connectionService.update(connectionId, {
        status: 'blocked'
      })

      // Update local state
      setConnections(prev => prev.map(conn =>
        conn.id === connectionId ? { ...conn, status: 'blocked' } : conn
      ))

      setIsLoading(false)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject connection'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [])

  return {
    connections,
    isLoading,
    error,
    fetchConnections,
    sendConnectionRequest,
    acceptConnection,
    rejectConnection,
  }
}