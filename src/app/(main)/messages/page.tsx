// Messages inbox page
"use client"

import { useState, Suspense } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { ThreadList } from '@/components/messaging/thread-list'
import { MessageBubble } from '@/components/messaging/message-bubble'
import { MessageInput } from '@/components/messaging/message-input'
import { AIDraftModal } from '@/components/messaging/ai-draft-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/shared/loading-state'
import { EmptyState } from '@/components/shared/empty-state'
import { useMessages } from '@/lib/hooks/use-messages'
import { useUiStore } from '@/lib/stores/ui-store'
import { MessageSquare, Users, Plus } from 'lucide-react'

function MessagesContent() {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [showAIDraft, setShowAIDraft] = useState(false)
  const { addToast } = useUiStore()

  // Mock data - replace with real hooks
  const { messages, isLoading: messagesLoading } = useMessages(selectedThreadId || undefined)
  const { threads, isLoading: threadsLoading } = { threads: [], isLoading: false } // Mock

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId)
  }

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

  const handleNewMessage = () => {
    // Open new message composer
    console.log('New message')
  }

  if (threadsLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading messages..." />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Thread List Sidebar */}
        <div className="w-80 flex-shrink-0">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </CardTitle>
                <Button size="sm" onClick={handleNewMessage}>
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              </div>
              <CardDescription>
                Connect and collaborate with entrepreneurs
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <ThreadList
                selectedThreadId={selectedThreadId}
                onThreadSelect={handleThreadSelect}
                className="border-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Message Area */}
        <div className="flex-1">
          <Card className="h-full flex flex-col">
            {selectedThreadId ? (
              <>
                {/* Message Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Sarah Chen</CardTitle>
                      <CardDescription>Active now</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* Messages List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      {messagesLoading ? (
                        <LoadingState message="Loading messages..." />
                      ) : messages.length > 0 ? (
                        messages.map((message) => (
                          <MessageBubble
                            key={message.id}
                            message={message}
                            isCurrentUser={message.sender_id === 'user1'} // Mock current user
                            onReaction={(messageId, emoji) => {
                              console.log('Reaction:', messageId, emoji)
                            }}
                            onReply={(messageId) => {
                              console.log('Reply to:', messageId)
                            }}
                          />
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <MessageInput
                      onSendMessage={handleSendMessage}
                      placeholder="Type your message..."
                      showAI={true}
                    />
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon={<MessageSquare className="w-16 h-16 opacity-50" />}
                  title="Select a conversation"
                  description="Choose a thread from the sidebar to start messaging"
                  action={{
                    label: "Start new conversation",
                    onClick: handleNewMessage,
                  }}
                />
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* AI Draft Modal */}
      <AIDraftModal
        isOpen={showAIDraft}
        onClose={() => setShowAIDraft(false)}
        onSendDraft={handleAIDraft}
        conversationContext={{
          recipientName: 'Sarah Chen',
          relationship: 'Professional connection',
          recentTopics: ['AI', 'Startups', 'Mentorship'],
          tone: 'professional',
        }}
      />
    </PageContainer>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <MessagesContent />
    </Suspense>
  )
}