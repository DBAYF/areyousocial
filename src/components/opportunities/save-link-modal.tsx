// Save link modal for saving external opportunities

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUiStore } from '@/lib/stores/ui-store'
import { saveExternalOpportunitySchema, type SaveExternalOpportunityData } from '@/lib/validations/opportunity-schemas'
import { cn } from '@/lib/utils/cn'
import { Link, ExternalLink, Plus, X, Loader2 } from 'lucide-react'

interface SaveLinkModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: SaveExternalOpportunityData) => void
  initialUrl?: string
}

export function SaveLinkModal({
  isOpen,
  onClose,
  onSave,
  initialUrl = ''
}: SaveLinkModalProps) {
  const { addToast } = useUiStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false)
  const [fetchedMetadata, setFetchedMetadata] = useState<{
    title?: string
    description?: string
    image?: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SaveExternalOpportunityData>({
    resolver: zodResolver(saveExternalOpportunitySchema),
    defaultValues: {
      url: initialUrl,
      title: '',
      description: '',
      company: '',
      location: '',
      type: undefined,
      tags: [],
      notes: '',
    },
  })

  const url = watch('url')
  const tags = watch('tags') || []

  const fetchMetadata = async (url: string) => {
    if (!url || !url.startsWith('http')) return

    setIsFetchingMetadata(true)
    try {
      // In a real implementation, you might use a service like OpenGraph or a backend API
      // For now, we'll simulate fetching metadata
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock metadata based on URL
      const mockMetadata = {
        title: 'Senior Product Manager at TechCorp',
        description: 'Join our team to lead product development for our AI-powered platform. 5+ years experience required.',
        image: 'https://images.unsplash.com/photo-1553484771-047a44eee27b?w=400&h=300&fit=crop',
      }

      setFetchedMetadata(mockMetadata)

      // Auto-fill form fields with fetched data
      if (mockMetadata.title) setValue('title', mockMetadata.title)
      if (mockMetadata.description) setValue('description', mockMetadata.description)

    } catch (error) {
      console.error('Failed to fetch metadata:', error)
    } finally {
      setIsFetchingMetadata(false)
    }
  }

  const handleUrlChange = (newUrl: string) => {
    setValue('url', newUrl)
    setFetchedMetadata(null)
    if (newUrl) {
      fetchMetadata(newUrl)
    }
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !tags.includes(tag.trim())) {
      setValue('tags', [...tags, tag.trim()])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setValue('tags', tags.filter(tag => tag !== tagToRemove))
  }

  const onSubmit = async (data: SaveExternalOpportunityData) => {
    setIsLoading(true)

    try {
      await onSave(data)
      addToast({
        type: 'success',
        title: 'Opportunity saved',
        description: 'The opportunity has been added to your collection.',
      })
      reset()
      setFetchedMetadata(null)
      onClose()
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to save opportunity',
        description: 'Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    setFetchedMetadata(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Save External Opportunity
          </DialogTitle>
          <DialogDescription>
            Paste a link to save an opportunity from external sources like job boards or company career pages.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <Label htmlFor="url">Opportunity URL *</Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="url"
                type="url"
                placeholder="https://company.com/careers/job-title"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="pl-10"
                error={errors.url?.message}
              />
            </div>
            {isFetchingMetadata && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching opportunity details...
              </div>
            )}
          </div>

          {/* Preview Card */}
          {fetchedMetadata && (
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {fetchedMetadata.image && (
                    <img
                      src={fetchedMetadata.image}
                      alt="Opportunity preview"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-sm mb-1">{fetchedMetadata.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {fetchedMetadata.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Senior Product Manager"
              {...register('title')}
              error={errors.title?.message}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the opportunity..."
              {...register('description')}
              error={errors.description?.message}
              rows={3}
            />
          </div>

          {/* Company and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Company name"
                {...register('company')}
                error={errors.company?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State/Country"
                {...register('location')}
                error={errors.location?.message}
              />
            </div>
          </div>

          {/* Type and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Opportunity Type</Label>
              <Select onValueChange={(value) => setValue('type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job">Job</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="mentorship">Mentorship</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      addTag(input.value)
                      input.value = ''
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Personal Notes</Label>
            <Textarea
              id="notes"
              placeholder="Why are you interested? Any follow-up needed?"
              {...register('notes')}
              error={errors.notes?.message}
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Opportunity'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}