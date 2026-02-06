// Opportunities CRUD hook

import { useState, useCallback } from 'react'
import { opportunityService, applicationService } from '@/lib/firebase/firestore'
import type { Opportunity, CreateOpportunityData, OpportunityApplication } from '@/lib/types/opportunity'

export function useOpportunities(filters?: any) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      let queryConstraints: any[] = []

      if (filters?.type) {
        queryConstraints.push(where('type', '==', filters.type))
      }

      if (filters?.status) {
        queryConstraints.push(where('status', '==', filters.status))
      }

      queryConstraints.push(orderBy('created_at', 'desc'))

      const opps = await opportunityService.query(queryConstraints)
      setOpportunities(opps)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch opportunities'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [filters])

  const createOpportunity = useCallback(async (data: CreateOpportunityData) => {
    setIsLoading(true)
    setError(null)

    try {
      const opportunityId = `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await opportunityService.create(opportunityId, data)

      setIsLoading(false)
      return opportunityId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create opportunity'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [])

  return {
    opportunities,
    isLoading,
    error,
    fetchOpportunities,
    createOpportunity,
  }
}

export function useOpportunityApplications(opportunityId?: string) {
  const [applications, setApplications] = useState<OpportunityApplication[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = useCallback(async () => {
    if (!opportunityId) return

    setIsLoading(true)
    setError(null)

    try {
      const apps = await applicationService.query([
        where('opportunity_id', '==', opportunityId),
        orderBy('created_at', 'desc')
      ])

      setApplications(apps)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch applications'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [opportunityId])

  return {
    applications,
    isLoading,
    error,
    fetchApplications,
  }
}