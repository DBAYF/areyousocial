// App providers wrapper

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/toast'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { OfflineBanner } from '@/components/shared/offline-banner'
import { useAuth } from '@/lib/hooks/use-auth'
import { useUiStore } from '@/lib/stores/ui-store'
import { LoadingState } from '@/components/shared/loading-state'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false
        }
        return failureCount < 3
      },
    },
  },
})

function AppProviders({ children }: { children: React.ReactNode }) {
  const { isLoading: authLoading } = useAuth()
  const { globalLoading } = useUiStore()

  // Show global loading state
  if (authLoading || globalLoading) {
    return <LoadingState message="Initializing app..." />
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <OfflineBanner />
        {children}
        <Toaster />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export { AppProviders as Providers }