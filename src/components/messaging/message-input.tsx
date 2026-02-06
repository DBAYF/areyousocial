// Message input component with rich features
"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils/cn'
import { useUiStore } from '@/lib/stores/ui-store'
import {
  Send,
  Paperclip,
  Image,
  Smile,
  Sparkles,
  Mic,
  MicOff,
  Square,
} from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void
  onTypingStart?: () => void
  onTypingStop?: () => void
  placeholder?: string
  disabled?: boolean
  showAI?: boolean
  maxLength?: number
}

export function MessageInput({
  onSendMessage,
  onTypingStart,
  onTypingStop,
  placeholder = "Type a message...",
  disabled = false,
  showAI = true,
  maxLength = 2000,
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useUiStore()

  const handleInputChange = useCallback((value: string) => {
    setMessage(value)

    if (value && !isTyping) {
      setIsTyping(true)
      onTypingStart?.()
    } else if (!value && isTyping) {
      setIsTyping(false)
      onTypingStop?.()
    }
  }, [isTyping, onTypingStart, onTypingStop])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage && attachments.length === 0) return

    onSendMessage(trimmedMessage, attachments)

    // Reset state
    setMessage('')
    setAttachments([])
    setIsTyping(false)
    onTypingStop?.()

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const validFiles = Array.from(files).filter(file => {
      // Basic validation - in real app use proper validators
      const isValidType = file.type.startsWith('image/') ||
                         file.type === 'application/pdf' ||
                         file.type.startsWith('text/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB

      if (!isValidType) {
        addToast({
          type: 'error',
          title: 'Invalid file type',
          description: 'Please select images, PDFs, or text files only.',
        })
        return false
      }

      if (!isValidSize) {
        addToast({
          type: 'error',
          title: 'File too large',
          description: 'Files must be smaller than 10MB.',
        })
        return false
      }

      return true
    })

    setAttachments(prev => [...prev, ...validFiles].slice(0, 10)) // Max 10 files
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleAIAssist = () => {
    // Open AI draft modal
    console.log('Open AI draft modal')
  }

  const startRecording = () => {
    setIsRecording(true)
    // Voice recording logic would go here
    addToast({
      type: 'info',
      title: 'Voice recording',
      description: 'Recording started...',
    })
  }

  const stopRecording = () => {
    setIsRecording(false)
    // Process recorded audio
    addToast({
      type: 'success',
      title: 'Voice message',
      description: 'Voice message sent!',
    })
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }

  return (
    <div className="border-t bg-background p-4 space-y-3">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {attachments.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-lg border flex items-center justify-center">
                  <Paperclip className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={() => removeAttachment(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-3">
        {/* File attachment button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </Button>

        {/* Voice recording button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={cn(
            'shrink-0',
            isRecording && 'text-red-500 animate-pulse'
          )}
        >
          {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              handleInputChange(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            className="min-h-[40px] max-h-[120px] resize-none pr-12"
            rows={1}
          />

          {/* Character count */}
          {message.length > maxLength * 0.8 && (
            <div className="absolute bottom-2 right-12 text-xs text-muted-foreground">
              {message.length}/{maxLength}
            </div>
          )}

          {/* Emoji button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute bottom-1 right-1 h-8 w-8 p-0"
            disabled={disabled}
          >
            <Smile className="w-4 h-4" />
          </Button>
        </div>

        {/* AI assist button */}
        {showAI && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIAssist}
            disabled={disabled}
            className="shrink-0"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        )}

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachments.length === 0)}
          size="sm"
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.txt,.doc,.docx"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Typing indicator placeholder */}
      {isTyping && (
        <div className="text-xs text-muted-foreground">
          Typing...
        </div>
      )}
    </div>
  )
}