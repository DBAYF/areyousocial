// Feed filters component for filtering posts

import { useState } from 'react'
import { POST_TYPES } from '@/lib/utils/constants'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Filter,
  X,
  Users,
  Globe,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react'

interface FeedFiltersProps {
  filters: {
    type?: string[]
    visibility?: 'public' | 'connections' | 'all'
    sortBy?: 'recent' | 'popular' | 'trending'
    timeRange?: 'all' | 'today' | 'week' | 'month'
    tags?: string[]
  }
  onFiltersChange: (filters: FeedFiltersProps['filters']) => void
  availableTags?: string[]
}

export function FeedFilters({ filters, onFiltersChange, availableTags = [] }: FeedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilters = (updates: Partial<FeedFiltersProps['filters']>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const togglePostType = (type: string) => {
    const currentTypes = filters.type || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]

    updateFilters({ type: newTypes.length > 0 ? newTypes : undefined })
  }

  const toggleTag = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]

    updateFilters({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : value !== undefined
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick filters - always visible */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.sortBy === 'trending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ sortBy: filters.sortBy === 'trending' ? undefined : 'trending' })}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending
          </Button>

          <Button
            variant={filters.timeRange === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ timeRange: filters.timeRange === 'today' ? undefined : 'today' })}
          >
            <Clock className="w-4 h-4 mr-1" />
            Today
          </Button>

          <Button
            variant={filters.visibility === 'connections' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({
              visibility: filters.visibility === 'connections' ? undefined : 'connections'
            })}
          >
            <Users className="w-4 h-4 mr-1" />
            Connections
          </Button>
        </div>

        {/* Post type filters */}
        <div>
          <h4 className="text-sm font-medium mb-2">Post Types</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries({
              [POST_TYPES.UPDATE]: 'Updates',
              [POST_TYPES.QUESTION]: 'Questions',
              [POST_TYPES.OPPORTUNITY]: 'Opportunities',
              [POST_TYPES.MILESTONE]: 'Milestones',
              [POST_TYPES.ADVICE_SEEKING]: 'Advice',
            }).map(([type, label]) => (
              <Button
                key={type}
                variant={(filters.type || []).includes(type) ? 'default' : 'outline'}
                size="sm"
                onClick={() => togglePostType(type)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Sort and time range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Sort by</label>
                <Select
                  value={filters.sortBy || 'recent'}
                  onValueChange={(value) => updateFilters({ sortBy: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="trending">Trending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Time range</label>
                <Select
                  value={filters.timeRange || 'all'}
                  onValueChange={(value) => updateFilters({ timeRange: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 10).map(tag => (
                    <Button
                      key={tag}
                      variant={(filters.tags || []).includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </Button>
                  ))}
                  {availableTags.length > 10 && (
                    <Button variant="ghost" size="sm" disabled>
                      +{availableTags.length - 10} more
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.sortBy && filters.sortBy !== 'recent' && (
                <Badge variant="secondary">
                  Sort: {filters.sortBy}
                  <button
                    onClick={() => updateFilters({ sortBy: undefined })}
                    className="ml-1 hover:bg-destructive/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.timeRange && filters.timeRange !== 'all' && (
                <Badge variant="secondary">
                  Time: {filters.timeRange}
                  <button
                    onClick={() => updateFilters({ timeRange: undefined })}
                    className="ml-1 hover:bg-destructive/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {filters.visibility && (
                <Badge variant="secondary">
                  {filters.visibility === 'connections' ? 'Connections only' : filters.visibility}
                  <button
                    onClick={() => updateFilters({ visibility: undefined })}
                    className="ml-1 hover:bg-destructive/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}

              {(filters.type || []).map(type => (
                <Badge key={type} variant="secondary">
                  {type}
                  <button
                    onClick={() => togglePostType(type)}
                    className="ml-1 hover:bg-destructive/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}

              {(filters.tags || []).map(tag => (
                <Badge key={tag} variant="secondary">
                  #{tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-1 hover:bg-destructive/20 rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact filter bar for mobile
export function FeedFilterBar({ filters, onFiltersChange }: FeedFiltersProps) {
  return (
    <div className="flex gap-2 p-4 bg-background border-b overflow-x-auto">
      <Button
        variant={filters.sortBy === 'trending' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFiltersChange({
          ...filters,
          sortBy: filters.sortBy === 'trending' ? undefined : 'trending'
        })}
      >
        <TrendingUp className="w-4 h-4 mr-1" />
        Trending
      </Button>

      <Button
        variant={filters.timeRange === 'today' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFiltersChange({
          ...filters,
          timeRange: filters.timeRange === 'today' ? undefined : 'today'
        })}
      >
        <Clock className="w-4 h-4 mr-1" />
        Today
      </Button>

      <Button
        variant={filters.visibility === 'connections' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFiltersChange({
          ...filters,
          visibility: filters.visibility === 'connections' ? undefined : 'connections'
        })}
      >
        <Users className="w-4 h-4 mr-1" />
        Following
      </Button>
    </div>
  )
}