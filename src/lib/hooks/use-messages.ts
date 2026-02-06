// Messaging hook with real-time updates
"use client"

import { useState, useCallback, useEffect } from 'react'
import { messageService, threadService } from '@/lib/firebase/firestore'
import type { Message, Thread, CreateMessageData, CreateThreadData } from '@/lib/types/message'

export function useMessages(threadId?: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)

  const fetchMessages = useCallback(async (loadMore = false) => {
    if (!threadId) return

    setIsLoading(true)
    setError(null)

    try {
      const queryConstraints = [
        where('thread_id', '==', threadId),
        orderBy('created_at', 'desc')
      ]

      if (loadMore && lastDoc) {
        queryConstraints.push(startAfter(lastDoc))
      }

      const result = await messageService.queryPaginated(
        queryConstraints,
        { limit: 50 },
        loadMore ? { limit: 50, startAfter: lastDoc } : undefined
      )

      const newMessages = result.data.reverse() // Reverse to show oldest first

      if (loadMore) {
        setMessages(prev => [...newMessages, ...prev])
      } else {
        setMessages(newMessages)
      }

      setHasMore(result.hasMore)
      setLastDoc(result.lastDoc)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch messages'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [threadId, lastDoc])

  const sendMessage = useCallback(async (data: CreateMessageData) => {
    setIsLoading(true)
    setError(null)

    try {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await messageService.create(messageId, data)

      // Add to local state immediately for optimistic updates
      const newMessage: Message = {
        id: messageId,
        ...data,
        created_at: new Date(),
      }
      setMessages(prev => [...prev, newMessage])

      setIsLoading(false)
      return messageId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [])

  // Real-time listener for new messages
  useEffect(() => {
    if (!threadId) return

    const unsubscribe = messageService.listen(
      [where('thread_id', '==', threadId), orderBy('created_at', 'desc')],
      (updatedMessages) => {
        setMessages(updatedMessages.reverse())
      }
    )

    return unsubscribe
  }, [threadId])

  return {
    messages,
    isLoading,
    error,
    hasMore,
    fetchMessages,
    sendMessage,
    loadMore: () => fetchMessages(true),
  }
}

export function useThreads(userId?: string) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchThreads = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const userThreads = await threadService.query([
        where('participants', 'array-contains', userId),
        orderBy('last_activity', 'desc')
      ])

      setThreads(userThreads)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch threads'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [userId])

  const createThread = useCallback(async (data: CreateThreadData) => {
    setIsLoading(true)
    setError(null)

    try {
      const threadId = `thread_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await threadService.create(threadId, data)

      // Refresh threads
      await fetchThreads()

      setIsLoading(false)
      return threadId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create thread'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [fetchThreads])

  useEffect(() => {
    fetchThreads()
  }, [fetchThreads])

  return {
    threads,
    isLoading,
    error,
    fetchThreads,
    createThread,
  }
}

export function useThread(threadId: string) {
  const [thread, setThread] = useState<Thread | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchThread = useCallback(async () => {
    if (!threadId) return

    setIsLoading(true)
    setError(null)

    try {
      const threadData = await threadService.get(threadId)
      setThread(threadData)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch thread'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [threadId])

  useEffect(() => {
    fetchThread()
  }, [fetchThread])

  return {
    data: thread,
    isLoading,
    error,
    refetch: fetchThread,
  }
}