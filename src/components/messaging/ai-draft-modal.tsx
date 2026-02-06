// AI draft modal for message composition assistance
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/cn'
import { Sparkles, RefreshCw, Copy, CheckCircle } from 'lucide-react'

interface AIDraftModalProps {
  isOpen: boolean
  onClose: () => void
  onSendDraft: (draft: string) => void
  conversationContext?: {
    recipientName: string
    relationship: string
    recentTopics: string[]
    tone: 'professional' | 'friendly' | 'casual'
  }
}

export function AIDraftModal({
  isOpen,
  onClose,
  onSendDraft,
  conversationContext
}: AIDraftModalProps) {
  const [intent, setIntent] = useState('')
  const [tone, setTone] = useState<'professional' | 'friendly' | 'casual'>('professional')
  const [customInstructions, setCustomInstructions] = useState('')
  const [generatedDraft, setGeneratedDraft] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const intents = [
    { value: 'introduction', label: 'Introduction', description: 'Introduce yourself and start a conversation' },
    { value: 'follow_up', label: 'Follow Up', description: 'Follow up on a previous discussion' },
    { value: 'collaboration', label: 'Collaboration', description: 'Propose working together' },
    { value: 'mentorship', label: 'Mentorship', description: 'Request or offer mentorship' },
    { value: 'opportunity', label: 'Opportunity', description: 'Share or discuss opportunities' },
    { value: 'question', label: 'Question', description: 'Ask a specific question' },
    { value: 'gratitude', label: 'Gratitude', description: 'Express thanks or appreciation' },
    { value: 'custom', label: 'Custom', description: 'Write your own intent' },
  ]

  const generateDraft = async () => {
    if (!intent) return

    setIsGenerating(true)

    // Simulate AI generation - in real app, call AI service
    await new Promise(resolve => setTimeout(resolve, 2000))

    const drafts = {
      introduction: `Hi ${conversationContext?.recipientName || 'there'}! I came across your profile and was impressed by your work in ${conversationContext?.recentTopics?.[0] || 'technology'}. I'd love to connect and learn more about your experience.`,
      follow_up: `Following up on our previous conversation about ${conversationContext?.recentTopics?.[0] || 'your project'}. I wanted to share some additional thoughts and see if you'd be open to discussing this further.`,
      collaboration: `I've been thinking about our potential collaboration on ${conversationContext?.recentTopics?.[0] || 'this project'}. I'd love to explore how we might work together to create something impactful.`,
      mentorship: `I've been following your journey and would greatly value your insights as a mentor. Would you be open to a brief conversation about my goals in ${conversationContext?.recentTopics?.[0] || 'this field'}?`,
      opportunity: `I came across an opportunity that I think would be perfect for someone with your background in ${conversationContext?.recentTopics?.[0] || 'this area'}. Would you be interested in learning more?`,
      question: `I have a question about ${conversationContext?.recentTopics?.[0] || 'your experience'} that I'd love your perspective on. Would you mind sharing your thoughts?`,
      gratitude: `I wanted to express my gratitude for our conversation and the insights you shared. Your perspective on ${conversationContext?.recentTopics?.[0] || 'this topic'} has been incredibly helpful.`,
    }

    let draft = drafts[intent as keyof typeof drafts] || 'Hello! I\'d like to connect and chat about potential opportunities.'

    // Apply tone adjustments
    if (tone === 'friendly') {
      draft = draft.replace(/Hi/, 'Hey').replace(/I'd/, 'I\'d')
    } else if (tone === 'casual') {
      draft = draft.replace(/Hi/, 'Hey').replace(/I'd/, 'I\'d').replace(/Would you/, 'Wanna')
    }

    // Apply custom instructions
    if (customInstructions) {
      draft += `\n\n${customInstructions}`
    }

    setGeneratedDraft(draft)
    setIsGenerating(false)
  }

  const handleSendDraft = () => {
    onSendDraft(generatedDraft)
    onClose()
  }

  const handleCopyDraft = async () => {
    await navigator.clipboard.writeText(generatedDraft)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleRegenerate = () => {
    generateDraft()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Message Assistant
          </DialogTitle>
          <DialogDescription>
            Let AI help you craft the perfect message based on your conversation context.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Context Display */}
          {conversationContext && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Conversation Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Recipient:</span>
                  <span className="text-sm">{conversationContext.recipientName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Relationship:</span>
                  <span className="text-sm">{conversationContext.relationship}</span>
                </div>
                {conversationContext.recentTopics.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Recent Topics:</span>
                    <div className="flex gap-1">
                      {conversationContext.recentTopics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Intent Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">What would you like to say?</label>
            <div className="grid grid-cols-2 gap-2">
              {intents.map((item) => (
                <button
                  key={item.value}
                  onClick={() => setIntent(item.value)}
                  className={cn(
                    'p-3 text-left border rounded-lg hover:bg-muted/50 transition-colors',
                    intent === item.value && 'border-primary bg-primary/5'
                  )}
                >
                  <div className="font-medium text-sm">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Tone Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Message Tone</label>
            <Select value={tone} onValueChange={(value: any) => setTone(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Additional Instructions (Optional)</label>
            <Textarea
              placeholder="Any specific details or context you'd like to include..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={2}
            />
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button
              onClick={generateDraft}
              disabled={!intent || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Draft
                </>
              )}
            </Button>

            {generatedDraft && (
              <>
                <Button variant="outline" onClick={handleRegenerate}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={handleCopyDraft}>
                  {isCopied ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Generated Draft */}
          {generatedDraft && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Generated Message</label>
              <Card>
                <CardContent className="p-4">
                  <Textarea
                    value={generatedDraft}
                    onChange={(e) => setGeneratedDraft(e.target.value)}
                    rows={6}
                    className="border-none p-0 focus-visible:ring-0 resize-none"
                  />
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={handleSendDraft} className="flex-1">
                  Send Message
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}