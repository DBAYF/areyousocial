// Thread item component - simplified version since most logic is in ThreadList

import { cn } from '@/lib/utils/cn'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/lib/utils/format-date'

interface ThreadItemProps {
  thread: {
    id: string
    participants: Array<{
      uid: string
      display_name: string
      avatar_url?: string
    }>
    last_message?: {
      content: string
      sender_id: string
      created_at: Date
      type: string
    }
    last_activity: Date
    unread_count: Record<string, number>
  }
  isSelected?: boolean
  currentUserId?: string
  onClick?: () => void
}

export function ThreadItem({
  thread,
  isSelected = false,
  currentUserId = 'user2', // Mock current user
  onClick
}: ThreadItemProps) {
  const unreadCount = thread.unread_count[currentUserId] || 0
  const hasUnread = unreadCount > 0

  const otherParticipants = thread.participants.filter(p => p.uid !== currentUserId)
  const displayName = otherParticipants.length === 1
    ? otherParticipants[0].display_name
    : `${otherParticipants.length} participants`

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b',
        isSelected && 'bg-muted',
        hasUnread && 'bg-primary/5'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative">
          {otherParticipants.length === 1 ? (
            <Avatar
              src={otherParticipants[0].avatar_url}
              alt={otherParticipants[0].display_name}
              size="sm"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-medium">
                {otherParticipants.length}
              </span>
            </div>
          )}
          {hasUnread && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={cn(
              'text-sm font-medium truncate',
              hasUnread && 'font-semibold'
            )}>
              {displayName}
            </h3>
            {thread.last_message && (
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(thread.last_message.created_at)}
              </span>
            )}
          </div>

          {thread.last_message && (
            <p className={cn(
              'text-xs truncate',
              hasUnread ? 'text-foreground font-medium' : 'text-muted-foreground'
            )}>
              {thread.last_message.sender_id === currentUserId && 'You: '}
              {thread.last_message.content}
            </p>
          )}

          {hasUnread && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}