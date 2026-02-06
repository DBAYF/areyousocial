// Thread list component for displaying conversation threads

import { useState, useMemo } from 'react'
import { useThreads } from '@/lib/hooks/use-messages'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils/cn'
import { formatRelativeTime } from '@/lib/utils/format-date'
import {
  Search,
  Archive,
  MoreHorizontal,
  Pin,
  VolumeX,
  Trash2,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock thread data - replace with real data from hook
const mockThreads = [
  {
    id: 'thread_1',
    participants: [
      { uid: 'user1', display_name: 'Sarah Chen', avatar_url: null },
      { uid: 'user2', display_name: 'Alex Rodriguez', avatar_url: null },
    ],
    participant_profiles: {
      user1: { uid: 'user1', display_name: 'Sarah Chen', avatar_url: null, last_seen: new Date() },
      user2: { uid: 'user2', display_name: 'Alex Rodriguez', avatar_url: null, last_seen: new Date() },
    },
    last_message: {
      content: 'That sounds like a great opportunity! Let me know if you need any help with the pitch.',
      sender_id: 'user1',
      created_at: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      type: 'text' as const,
    },
    last_activity: new Date(Date.now() - 30 * 60 * 1000),
    unread_count: { user2: 2 },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'thread_2',
    participants: [
      { uid: 'user3', display_name: 'Mike Johnson', avatar_url: null },
    ],
    participant_profiles: {
      user3: { uid: 'user3', display_name: 'Mike Johnson', avatar_url: null, last_seen: new Date() },
    },
    last_message: {
      content: 'Thanks for the introduction! Looking forward to our call next week.',
      sender_id: 'user3',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      type: 'text' as const,
    },
    last_activity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    unread_count: {},
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
]

interface ThreadListProps {
  selectedThreadId?: string
  onThreadSelect: (threadId: string) => void
  className?: string
}

export function ThreadList({ selectedThreadId, onThreadSelect, className }: ThreadListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived'>('all')

  // Use mock data for now - replace with real hook later
  const threads = useMemo(() => {
    let filtered = mockThreads

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(thread =>
        thread.participants.some(p =>
          p.display_name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        thread.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply status filter
    if (filter === 'unread') {
      filtered = filtered.filter(thread =>
        Object.values(thread.unread_count).some(count => count > 0)
      )
    }

    // Sort by last activity
    return filtered.sort((a, b) =>
      b.last_activity.getTime() - a.last_activity.getTime()
    )
  }, [searchQuery, filter])

  return (
    <div className={cn('flex flex-col h-full bg-background border-r', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Badge variant="secondary" className="text-xs">
            {threads.filter(t => Object.values(t.unread_count).some(c => c > 0)).length} unread
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'archived', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              'flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors',
              filter === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Thread list */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {threads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No conversations found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try adjusting your search</p>
              )}
            </div>
          ) : (
            threads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={thread.id === selectedThreadId}
                onClick={() => onThreadSelect(thread.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

interface ThreadItemProps {
  thread: typeof mockThreads[0]
  isSelected: boolean
  onClick: () => void
}

function ThreadItem({ thread, isSelected, onClick }: ThreadItemProps) {
  const currentUserId = 'user2' // Mock current user
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
        'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
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
            <div className="flex items-center gap-2">
              {thread.last_message && (
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(thread.last_message.created_at)}
                </span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <VolumeX className="w-4 h-4 mr-2" />
                    Mute
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
        </div>
      </div>
    </div>
  )
}