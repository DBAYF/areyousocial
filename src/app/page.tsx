// Root page with routing logic

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { useNeedsOnboarding } from '@/lib/hooks/use-auth'
import { LoadingState } from '@/components/shared/loading-state'

export default function RootPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const needsOnboarding = useNeedsOnboarding()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (needsOnboarding) {
      router.push('/onboarding')
      return
    }

    // User is authenticated and has completed onboarding
    router.push('/home')
  }, [isAuthenticated, isLoading, needsOnboarding, router])

  return <LoadingState message="Loading ReMake..." />
}