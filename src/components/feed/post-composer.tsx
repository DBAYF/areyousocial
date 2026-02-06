// Post composer component for creating new posts

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useUiStore } from '@/lib/stores/ui-store'
import { usePosts } from '@/lib/hooks/use-posts'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { PostTypeSelector } from './post-type-selector'
import { createPostSchema, type CreatePostData } from '@/lib/validations/post-schemas'
import { Image, X, Plus, Sparkles } from 'lucide-react'

interface PostComposerProps {
  onSuccess?: (postId: string) => void
  onCancel?: () => void
  placeholder?: string
  autoFocus?: boolean
}

export function PostComposer({
  onSuccess,
  onCancel,
  placeholder = "What's on your mind?",
  autoFocus = false
}: PostComposerProps) {
  const { user, profile } = useAuthStore()
  const { addToast } = useUiStore()
  const { createPost } = usePosts()
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreatePostData>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      type: 'update',
      title: '',
      content: '',
      images: [],
      tags: [],
      visibility: 'public',
    },
  })

  const content = watch('content')
  const postType = watch('type')

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleCancel = () => {
    setIsExpanded(false)
    reset()
    setSelectedImages([])
    onCancel?.()
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validImages = files.filter(file => {
      // Basic validation - in real app use the validators utility
      return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB
    })

    setSelectedImages(prev => [...prev, ...validImages].slice(0, 4)) // Max 4 images
  }

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: CreatePostData) => {
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const postData: CreatePostData = {
        ...data,
        content: content.trim(),
        images: selectedImages,
      }

      const postId = await createPost(postData)

      if (postId) {
        addToast({
          type: 'success',
          title: 'Post created',
          description: 'Your post has been shared with the community.',
        })

        onSuccess?.(postId)
        handleCancel()
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to create post',
        description: 'Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isExpanded) {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleExpand}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={profile?.avatar_url}
              alt={profile?.display_name || user?.email || 'User'}
              size="sm"
            />
            <div className="flex-1 text-muted-foreground">
              {placeholder}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Sparkles className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={profile?.avatar_url}
                alt={profile?.display_name || user?.email || 'User'}
                size="sm"
              />
              <div>
                <p className="font-medium text-sm">
                  {profile?.display_name || 'You'}
                </p>
                <PostTypeSelector
                  value={postType}
                  onChange={(type) => setValue('type', type)}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <Textarea
            placeholder={placeholder}
            {...register('content')}
            error={errors.content?.message}
            rows={4}
            autoFocus={autoFocus}
            className="border-none resize-none focus-visible:ring-0 p-0 text-base"
          />

          {/* Title for certain post types */}
          {(postType === 'milestone' || postType === 'opportunity') && (
            <input
              type="text"
              placeholder="Add a title..."
              {...register('title')}
              className="w-full border-none p-0 text-lg font-medium placeholder:text-muted-foreground focus:outline-none"
            />
          )}

          {/* Selected Images */}
          {selectedImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <span>
                    <Image className="w-4 h-4 mr-2" />
                    Photo
                  </span>
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Draft
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {content?.length || 0}/1000
              </span>
              <Button
                type="submit"
                size="sm"
                disabled={!content?.trim() || isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

// Quick post composer for mobile/small spaces
export function QuickPostComposer({ onSuccess }: { onSuccess?: () => void }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg z-50"
      >
        <Plus className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-background rounded-t-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create Post</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <PostComposer
            onSuccess={() => {
              setIsOpen(false)
              onSuccess?.()
            }}
            onCancel={() => setIsOpen(false)}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}