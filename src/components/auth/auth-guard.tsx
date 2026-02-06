// Auth guard component for protecting routes
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { LoadingState } from '@/components/shared/loading-state'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireOnboarding?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireOnboarding = false,
  redirectTo,
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return // Still loading, don't redirect yet

    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't
      const loginUrl = redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : '/login'
      router.push(loginUrl)
      return
    }

    if (!requireAuth && isAuthenticated) {
      // User is authenticated but this is a public-only route
      router.push(redirectTo || '/home')
      return
    }

    if (requireOnboarding && isAuthenticated && user && !user.profile) {
      // User needs onboarding but hasn't completed it
      router.push('/onboarding')
      return
    }
  }, [isAuthenticated, isLoading, user, requireAuth, requireOnboarding, redirectTo, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return fallback || <LoadingState message="Checking authentication..." />
  }

  // Don't render children if redirecting
  if (requireAuth && !isAuthenticated) {
    return fallback || <LoadingState message="Redirecting to login..." />
  }

  if (!requireAuth && isAuthenticated) {
    return fallback || <LoadingState message="Redirecting..." />
  }

  if (requireOnboarding && isAuthenticated && user && !user.profile) {
    return fallback || <LoadingState message="Redirecting to onboarding..." />
  }

  return <>{children}</>
}

// Higher-order component for protecting pages
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<AuthGuardProps, 'children'> = {}
) {
  return function AuthProtectedComponent(props: P) {
    return (
      <AuthGuard {...options}>
        <Component {...props} />
      </AuthGuard>
    )
  }
}

// Admin guard for admin-only routes
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    if (!user?.roles.admin) {
      router.push('/home') // Redirect to home if not admin
      return
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return <LoadingState message="Checking permissions..." />
  }

  if (!isAuthenticated || !user?.roles.admin) {
    return <LoadingState message="Access denied" />
  }

  return <>{children}</>
}