// Tag selector component for selecting user interests and expertise

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { USER_TAGS } from '@/lib/utils/constants'
import { X, Plus } from 'lucide-react'

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  maxTags?: number
  label?: string
  error?: string
  helperText?: string
  className?: string
}

const tagCategories = {
  'Technical Skills': [
    USER_TAGS.PRODUCT,
    USER_TAGS.ENGINEERING,
    USER_TAGS.DESIGN,
    USER_TAGS.MARKETING,
    USER_TAGS.SALES,
    USER_TAGS.FINANCE,
    USER_TAGS.LEGAL,
    USER_TAGS.OPERATIONS,
  ],
  'Industries': [
    USER_TAGS.SAAS,
    USER_TAGS.ECOMMERCE,
    USER_TAGS.FINTECH,
    USER_TAGS.HEALTHTECH,
    USER_TAGS.EDTECH,
    USER_TAGS.FOODTECH,
    USER_TAGS.PROPTECH,
    USER_TAGS.GREENTECH,
  ],
  'Business Stage': [
    USER_TAGS.STARTUP,
    USER_TAGS.SCALEUP,
    USER_TAGS.ENTERPRISE,
  ],
  'Specializations': [
    USER_TAGS.AI_ML,
    USER_TAGS.BLOCKCHAIN,
    USER_TAGS.IOT,
    USER_TAGS.MOBILE,
    USER_TAGS.WEB,
    USER_TAGS.DATA,
  ],
}

const tagLabels: Record<string, string> = {
  [USER_TAGS.PRODUCT]: 'Product',
  [USER_TAGS.ENGINEERING]: 'Engineering',
  [USER_TAGS.DESIGN]: 'Design',
  [USER_TAGS.MARKETING]: 'Marketing',
  [USER_TAGS.SALES]: 'Sales',
  [USER_TAGS.FINANCE]: 'Finance',
  [USER_TAGS.LEGAL]: 'Legal',
  [USER_TAGS.OPERATIONS]: 'Operations',
  [USER_TAGS.SAAS]: 'SaaS',
  [USER_TAGS.ECOMMERCE]: 'E-commerce',
  [USER_TAGS.FINTECH]: 'Fintech',
  [USER_TAGS.HEALTHTECH]: 'Healthtech',
  [USER_TAGS.EDTECH]: 'Edtech',
  [USER_TAGS.FOODTECH]: 'Foodtech',
  [USER_TAGS.PROPTECH]: 'Proptech',
  [USER_TAGS.GREENTECH]: 'Greentech',
  [USER_TAGS.STARTUP]: 'Startup',
  [USER_TAGS.SCALEUP]: 'Scale-up',
  [USER_TAGS.ENTERPRISE]: 'Enterprise',
  [USER_TAGS.AI_ML]: 'AI/ML',
  [USER_TAGS.BLOCKCHAIN]: 'Blockchain',
  [USER_TAGS.IOT]: 'IoT',
  [USER_TAGS.MOBILE]: 'Mobile',
  [USER_TAGS.WEB]: 'Web',
  [USER_TAGS.DATA]: 'Data',
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  maxTags = 10,
  label = 'Select your interests and expertise',
  error,
  helperText,
  className,
}: TagSelectorProps) {
  const [customTag, setCustomTag] = useState('')

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else if (selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim()) && selectedTags.length < maxTags) {
      onTagsChange([...selectedTags, customTag.trim()])
      setCustomTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div className={cn('space-y-4', className)}>
      {label && (
        <Label className={cn(error && 'text-destructive')}>
          {label}
          <span className="text-sm text-muted-foreground ml-1">
            ({selectedTags.length}/{maxTags})
          </span>
        </Label>
      )}

      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {tagLabels[tag] || tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag categories */}
      <div className="space-y-4">
        {Object.entries(tagCategories).map(([category, tags]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagToggle(tag)}
                  disabled={!selectedTags.includes(tag) && selectedTags.length >= maxTags}
                  className="h-8"
                >
                  {tagLabels[tag]}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom tag input */}
      <div className="space-y-2">
        <Label className="text-sm">Add custom tag (optional)</Label>
        <div className="flex gap-2">
          <Input
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            placeholder="Enter a custom tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddCustomTag()
              }
            }}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddCustomTag}
            disabled={!customTag.trim() || selectedTags.length >= maxTags}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error and helper text */}
      {(error || helperText) && (
        <div className={cn(
          'text-xs',
          error ? 'text-destructive' : 'text-muted-foreground'
        )}>
          {error || helperText}
        </div>
      )}
    </div>
  )
}