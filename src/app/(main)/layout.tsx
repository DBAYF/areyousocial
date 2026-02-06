// Main app layout with navigation

import { Suspense } from 'react'
import { AuthGuard } from '@/components/auth/auth-guard'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { PageContainer } from '@/components/layout/page-container'
import { LoadingState } from '@/components/shared/loading-state'
import { useUiStore } from '@/lib/stores/ui-store'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={true} requireOnboarding={true}>
      <div className="min-h-screen bg-background">
        {/* Header - fixed at top */}
        <Header />

        <div className="flex">
          {/* Sidebar - hidden on mobile */}
          <aside className="hidden lg:block">
            <Sidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1 lg:ml-0">
            <Suspense fallback={<LoadingState />}>
              {children}
            </Suspense>
          </main>
        </div>

        {/* Bottom navigation - mobile only */}
        <BottomNav />
      </div>
    </AuthGuard>
  )
}