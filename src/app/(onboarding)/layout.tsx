// Onboarding layout with progress indicator

import { Suspense } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import { LoadingState } from '@/components/shared/loading-state'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} requireOnboarding={false}>
      <div className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <Suspense fallback={<LoadingState />}>
              <OnboardingProgress />
            </Suspense>
            <div className="bg-card rounded-lg border shadow-sm p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}