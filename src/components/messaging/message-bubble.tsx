// Message bubble component for displaying individual messages
"use client"

import { useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'
import { formatMessageTime } from '@/lib/utils/format-date'
import {
  Heart,
  MoreHorizontal,
  Reply,
  Flag,
  Check,
  CheckCheck,
  Clock,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MessageBubbleProps {
  message: {
    id: string
    sender_id: string
    sender: {
      uid: string
      display_name: string
      avatar_url?: string
      verified?: boolean
    }
    content: string
    type: 'text' | 'system' | 'ai_draft'
    status?: 'sending' | 'sent' | 'delivered' | 'read'
    created_at: Date
    edited_at?: Date
    reactions?: Array<{
      emoji: string
      count: number
      users: string[]
    }>
    attachments?: Array<{
      type: 'image' | 'file' | 'link'
      url: string
      filename?: string
      size?: number
    }>
    reply_to?: {
      id: string
      sender_name: string
      content: string
    }
  }
  isCurrentUser: boolean
  showAvatar?: boolean
  showTimestamp?: boolean
  onReaction?: (messageId: string, emoji: string) => void
  onReply?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onReport?: (messageId: string) => void
}

export function MessageBubble({
  message,
  isCurrentUser,
  showAvatar = true,
  showTimestamp = true,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  onReport,
}: MessageBubbleProps) {
  const [showReactions, setShowReactions] = useState(false)

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-muted-foreground" />
      case 'sent':
        return <Check className="w-3 h-3 text-muted-foreground" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-primary" />
      default:
        return null
    }
  }

  const handleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji)
    setShowReactions(false)
  }

  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '😡']

  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      'flex gap-3 mb-4 group',
      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      {/* Avatar */}
      {showAvatar && !isCurrentUser && (
        <Avatar
          src={message.sender.avatar_url}
          alt={message.sender.display_name}
          size="sm"
        />
      )}

      {/* Message content */}
      <div className={cn(
        'max-w-[70%] space-y-1',
        isCurrentUser ? 'items-end' : 'items-start'
      )}>
        {/* Sender name (for group chats) */}
        {!isCurrentUser && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs font-medium text-muted-foreground">
              {message.sender.display_name}
            </span>
            {message.sender.verified && (
              <Badge variant="verified" className="text-xs">✓</Badge>
            )}
            {message.type === 'ai_draft' && (
              <Badge variant="secondary" className="text-xs">AI</Badge>
            )}
          </div>
        )}

        {/* Reply reference */}
        {message.reply_to && (
          <div className={cn(
            'text-xs p-2 rounded border-l-2 bg-muted/50',
            isCurrentUser ? 'border-l-primary' : 'border-l-muted-foreground'
          )}>
            <div className="font-medium">{message.reply_to.sender_name}</div>
            <div className="truncate">{message.reply_to.content}</div>
          </div>
        )}

        {/* Message bubble */}
        <div className="relative group">
          <div className={cn(
            'px-4 py-2 rounded-2xl max-w-full break-words',
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-sm'
              : 'bg-muted rounded-bl-sm',
            message.type === 'ai_draft' && 'border border-primary/20'
          )}>
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="space-y-2 mb-2">
                {message.attachments.map((attachment, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border">
                    {attachment.type === 'image' ? (
                      <img
                        src={attachment.url}
                        alt={attachment.filename || 'Attachment'}
                        className="max-w-full h-auto cursor-pointer hover:opacity-90"
                        onClick={() => window.open(attachment.url, '_blank')}
                      />
                    ) : (
                      <div className="p-3 bg-background/50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                            📎
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {attachment.filename}
                            </div>
                            {attachment.size && (
                              <div className="text-xs text-muted-foreground">
                                {(attachment.size / 1024 / 1024).toFixed(1)} MB
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Message text */}
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>

            {/* Edited indicator */}
            {message.edited_at && (
              <div className="text-xs opacity-70 mt-1">(edited)</div>
            )}
          </div>

          {/* Message actions (hover) */}
          <div className={cn(
            'absolute top-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
            isCurrentUser ? '-left-12' : '-right-12'
          )}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full"
              onClick={() => setShowReactions(!showReactions)}
            >
              <Heart className="w-3 h-3" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isCurrentUser ? 'end' : 'start'}>
                <DropdownMenuItem onClick={() => onReply?.(message.id)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                {!isCurrentUser && (
                  <DropdownMenuItem onClick={() => onReport?.(message.id)}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
                {isCurrentUser && (
                  <>
                    <DropdownMenuItem onClick={() => onEdit?.(message.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(message.id)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Quick reactions */}
          {showReactions && (
            <div className={cn(
              'absolute top-8 flex gap-1 p-2 bg-popover border rounded-lg shadow-md',
              isCurrentUser ? 'right-0' : 'left-0'
            )}>
              {quickReactions.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="w-8 h-8 hover:bg-muted rounded flex items-center justify-center text-sm"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, index) => (
              <button
                key={index}
                onClick={() => handleReaction(reaction.emoji)}
                className="flex items-center gap-1 bg-muted/50 hover:bg-muted px-2 py-1 rounded-full text-xs"
              >
                <span>{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </button>
            ))}
          </div>
        )}

        {/* Timestamp and status */}
        <div className={cn(
          'flex items-center gap-1 mt-1 text-xs text-muted-foreground',
          isCurrentUser ? 'justify-end' : 'justify-start'
        )}>
          {showTimestamp && (
            <span>{formatMessageTime(message.created_at)}</span>
          )}
          {isCurrentUser && getStatusIcon()}
        </div>
      </div>
    </div>
  )
}