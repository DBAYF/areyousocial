// Loading state components

import { cn } from "@/lib/utils/cn"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText } from "@/components/ui/skeleton"

interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 space-y-4",
      className
    )}>
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  )
}

export function PageLoadingState({ message }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState message={message} />
    </div>
  )
}

export function InlineLoadingState({ message, className }: LoadingStateProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Spinner size="sm" />
      {message && (
        <span className="text-sm text-muted-foreground">
          {message}
        </span>
      )}
    </div>
  )
}

// Loading skeletons for different content types
export function PostCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <SkeletonAvatar />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <SkeletonText lines={3} />
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

export function ProfileCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <SkeletonAvatar size="lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="flex space-x-6">
        <div className="space-y-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-3 w-8" />
        </div>
      </div>
    </div>
  )
}

export function MessageSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-xs p-3 rounded-lg space-y-2 ${i % 2 === 0 ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}>
            <SkeletonText lines={2} />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}