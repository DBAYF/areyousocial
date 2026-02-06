// Page container wrapper component

import { cn } from '@/lib/utils/cn'
import { OfflineBanner } from '@/components/shared/offline-banner'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  showOfflineBanner?: boolean
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function PageContainer({
  children,
  className,
  maxWidth = 'xl',
  padding = 'md',
  showOfflineBanner = true,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      {showOfflineBanner && <OfflineBanner />}

      <div className={cn(
        "mx-auto",
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}>
        {children}
      </div>
    </div>
  )
}

// Centered page container for auth/onboarding pages
export function CenteredPageContainer({
  children,
  className,
  maxWidth = 'sm',
}: Omit<PageContainerProps, 'padding' | 'showOfflineBanner'>) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className={cn(
        "w-full",
        maxWidthClasses[maxWidth],
        className
      )}>
        {children}
      </div>
    </div>
  )
}

// Full width container for specific layouts
export function FullWidthContainer({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  )
}