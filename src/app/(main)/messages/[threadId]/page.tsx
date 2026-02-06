// Individual thread view page
"use client"

import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PageContainer } from '@/components/layout/page-container'
import { MessageBubble } from '@/components/messaging/message-bubble'
import { MessageInput } from '@/components/messaging/message-input'
import { AIDraftModal } from '@/components/messaging/ai-draft-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/shared/loading-state'
import { useMessages } from '@/lib/hooks/use-messages'
import { useUiStore } from '@/lib/stores/ui-store'
import { ArrowLeft, MoreHorizontal, Phone, Video, Info } from 'lucide-react'
import Link from 'next/link'

interface ThreadPageProps {
  params: Promise<{
    threadId: string
  }>
}

// Mock messages data
const mockMessages = [
  {
    id: '1',
    sender_id: 'user2',
    sender: {
      uid: 'user2',
      display_name: 'Sarah Chen',
      avatar_url: null,
      verified: true,
    },
    content: 'Hi Alex! Thanks for reaching out. I saw your post about AI in healthcare and found it really interesting.',
    type: 'text' as const,
    status: 'read' as const,
    created_at: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: '2',
    sender_id: 'user1',
    sender: {
      uid: 'user1',
      display_name: 'Alex Rodriguez',
      avatar_url: null,
      verified: false,
    },
    content: 'Hi Sarah! Thank you! I\'m really passionate about how AI can improve healthcare outcomes. What aspects are you most interested in?',
    type: 'text' as const,
    status: 'read' as const,
    created_at: new Date(Date.now() - 8 * 60 * 1000),
  },
  {
    id: '3',
    sender_id: 'user2',
    sender: {
      uid: 'user2',
      display_name: 'Sarah Chen',
      avatar_url: null,
      verified: true,
    },
    content: 'I\'m particularly focused on diagnostic accuracy and patient triage. We\'ve been working on an AI system that can help reduce wait times in emergency rooms.',
    type: 'text' as const,
    status: 'read' as const,
    created_at: new Date(Date.now() - 5 * 60 * 1000),
    attachments: [
      {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
        filename: 'ai-healthcare-demo.png',
      }
    ],
  },
  {
    id: '4',
    sender_id: 'user1',
    sender: {
      uid: 'user1',
      display_name: 'Alex Rodriguez',
      avatar_url: null,
      verified: false,
    },
    content: 'That sounds incredible! Emergency room triage is such a critical area. How has the adoption been so far?',
    type: 'text' as const,
    status: 'sent' as const,
    created_at: new Date(Date.now() - 2 * 60 * 1000),
  },
]

function ThreadContent({ params }: { params: { threadId: string } }) {
  const threadId = params.threadId
  const { messages, isLoading } = useMessages(threadId)
  const { addToast } = useUiStore()
  const [showAIDraft, setShowAIDraft] = useState(false)

  // Mock thread data
  const thread = {
    id: threadId,
    participants: [
      { uid: 'user1', display_name: 'Alex Rodriguez', avatar_url: null },
      { uid: 'user2', display_name: 'Sarah Chen', avatar_url: null },
    ],
    participant_profiles: {
      user1: { uid: 'user1', display_name: 'Alex Rodriguez', avatar_url: null, last_seen: new Date() },
      user2: { uid: 'user2', display_name: 'Sarah Chen', avatar_url: null, last_seen: new Date() },
    },
  }

  const currentUserId = 'user1' // Mock current user
  const otherParticipant = thread.participants.find(p => p.uid !== currentUserId)

  const handleSendMessage = (content: string, attachments?: File[]) => {
    // Handle sending message
    addToast({
      type: 'success',
      title: 'Message sent',
      description: 'Your message has been delivered.',
    })
  }

  const handleAIDraft = (draft: string) => {
    // Handle AI draft
    console.log('AI Draft:', draft)
    setShowAIDraft(false)
  }

  const handleReaction = (messageId: string, emoji: string) => {
    console.log('Reaction:', messageId, emoji)
  }

  const handleReply = (messageId: string) => {
    console.log('Reply to:', messageId)
  }

  const handleEdit = (messageId: string) => {
    console.log('Edit:', messageId)
  }

  const handleDelete = (messageId: string) => {
    console.log('Delete:', messageId)
  }

  const handleReport = (messageId: string) => {
    addToast({
      type: 'info',
      title: 'Report submitted',
      description: 'Thank you for helping keep our community safe.',
    })
  }

  if (isLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading conversation..." />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="h-[calc(100vh-8rem)] max-w-4xl mx-auto">
        <Card className="h-full flex flex-col">
          {/* Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/messages">
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </Link>
                </Button>

                <div className="flex items-center gap-3">
                  <Avatar
                    src={otherParticipant?.avatar_url}
                    alt={otherParticipant?.display_name}
                    size="sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold">{otherParticipant?.display_name}</h2>
                      <Badge variant="secondary" className="text-xs">
                        Active now
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Founder at HealthTech Inc.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {mockMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={message.sender_id === currentUserId}
                    onReaction={handleReaction}
                    onReply={handleReply}
                    onEdit={message.sender_id === currentUserId ? handleEdit : undefined}
                    onDelete={message.sender_id === currentUserId ? handleDelete : undefined}
                    onReport={message.sender_id !== currentUserId ? handleReport : undefined}
                  />
                ))}

                {/* Typing indicator */}
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground text-xs px-3 py-2 rounded-lg">
                    Sarah is typing...
                  </div>
                </div>
              </div>

              {/* Message Input */}
              <MessageInput
                onSendMessage={handleSendMessage}
                placeholder={`Message ${otherParticipant?.display_name}...`}
                showAI={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Draft Modal */}
      <AIDraftModal
        isOpen={showAIDraft}
        onClose={() => setShowAIDraft(false)}
        onSendDraft={handleAIDraft}
        conversationContext={{
          recipientName: otherParticipant?.display_name || 'Recipient',
          relationship: 'Professional connection',
          recentTopics: ['AI', 'Healthcare', 'Startups'],
          tone: 'professional',
        }}
      />
    </PageContainer>
  )
}

export default async function ThreadPage({ params }: ThreadPageProps) {
  // Await params in Next.js 15+
  const resolvedParams = await params

  // Validate thread ID
  if (!resolvedParams.threadId || !resolvedParams.threadId.startsWith('thread_')) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <ThreadContent params={resolvedParams} />
    </Suspense>
  )
}