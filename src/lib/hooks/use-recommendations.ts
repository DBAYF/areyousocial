// Recommendations hook (free Firebase tier compatible)

import { useState, useCallback } from 'react'
import type { Recommendation } from '@/lib/types/recommendation'

export function useRecommendations(userId?: string) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = useCallback(async (type: 'connection' | 'opportunity' | 'content' | 'skill' = 'connection') => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/recommendations?userId=${userId}&type=${type}&limit=10`)

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const dismissRecommendation = useCallback(async (recommendationId: string) => {
    // In free version, just remove from local state
    // Could be enhanced to store dismissed recommendations in localStorage
    setRecommendations(prev => prev.filter(r => r.id !== recommendationId))
  }, [])

  const refreshRecommendations = useCallback(async (type: 'connection' | 'opportunity' | 'content' | 'skill' = 'connection') => {
    await fetchRecommendations(type)
  }, [fetchRecommendations])

  return {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    dismissRecommendation,
    refreshRecommendations,
  }
}