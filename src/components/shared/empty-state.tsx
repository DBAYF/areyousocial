// Empty state component for when there's no data to display

import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent" | "success" | "warning" | "danger"
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 space-y-4",
      className
    )}>
      {icon && (
        <div className="text-muted-foreground">
          {icon}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground max-w-md">
            {description}
          </p>
        )}
      </div>

      {action && (
        <Button
          variant={action.variant || "default"}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Specialized empty states for common scenarios

export function EmptyPosts({ onCreatePost }: { onCreatePost?: () => void }) {
  return (
    <EmptyState
      icon={<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">📝</div>}
      title="No posts yet"
      description="Share your startup journey, ask for advice, or post opportunities to connect with the community."
      action={onCreatePost ? {
        label: "Create your first post",
        onClick: onCreatePost
      } : undefined}
    />
  )
}

export function EmptyConnections({ onFindPeople }: { onFindPeople?: () => void }) {
  return (
    <EmptyState
      icon={<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">🤝</div>}
      title="No connections yet"
      description="Connect with founders and mentors in your industry to build meaningful relationships."
      action={onFindPeople ? {
        label: "Find people to connect with",
        onClick: onFindPeople
      } : undefined}
    />
  )
}

export function EmptyMessages({ onStartConversation }: { onStartConversation?: () => void }) {
  return (
    <EmptyState
      icon={<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">💬</div>}
      title="No messages yet"
      description="Start conversations with your connections to get advice, share updates, or collaborate."
      action={onStartConversation ? {
        label: "Start a conversation",
        onClick: onStartConversation
      } : undefined}
    />
  )
}

export function EmptyOpportunities({ onCreateOpportunity }: { onCreateOpportunity?: () => void }) {
  return (
    <EmptyState
      icon={<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">🚀</div>}
      title="No opportunities yet"
      description="Post jobs, seek investments, or share partnership opportunities with the community."
      action={onCreateOpportunity ? {
        label: "Post an opportunity",
        onClick: onCreateOpportunity
      } : undefined}
    />
  )
}

export function EmptySearch({ query }: { query: string }) {
  return (
    <EmptyState
      icon={<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">🔍</div>}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms.`}
    />
  )
}