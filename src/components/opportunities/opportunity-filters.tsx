// Opportunity filters component for advanced filtering

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils/cn'
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react'

interface OpportunityFiltersProps {
  filters: {
    search?: string
    type?: string[]
    location?: string[]
    remote_possible?: boolean
    experience_level?: string[]
    salary_range?: {
      min: number
      max: number
    }
    equity_range?: {
      min: number
      max: number
    }
    tags?: string[]
    posted_date?: 'today' | 'week' | 'month' | 'all'
    application_status?: 'not_applied' | 'applied' | 'rejected' | 'accepted'
    sort_by?: 'relevance' | 'date' | 'salary' | 'applications'
    sort_order?: 'asc' | 'desc'
  }
  onFiltersChange: (filters: OpportunityFiltersProps['filters']) => void
  availableTags?: string[]
  className?: string
}

const opportunityTypes = [
  { value: 'job', label: 'Jobs' },
  { value: 'investment', label: 'Investment Opportunities' },
  { value: 'partnership', label: 'Partnerships' },
  { value: 'mentorship', label: 'Mentorship' },
  { value: 'internship', label: 'Internships' },
  { value: 'consulting', label: 'Consulting' },
]

const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'mid', label: 'Mid Level' },
  { value: 'senior', label: 'Senior Level' },
  { value: 'executive', label: 'Executive' },
]

const commonLocations = [
  'Remote',
  'San Francisco, CA',
  'New York, NY',
  'Austin, TX',
  'Seattle, WA',
  'London, UK',
  'Berlin, Germany',
  'Toronto, Canada',
  'Singapore',
  'Sydney, Australia',
]

export function OpportunityFilters({
  filters,
  onFiltersChange,
  availableTags = [],
  className
}: OpportunityFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [customLocation, setCustomLocation] = useState('')
  const [salaryMin, setSalaryMin] = useState(filters.salary_range?.min || 0)
  const [salaryMax, setSalaryMax] = useState(filters.salary_range?.max || 300000)

  const updateFilters = (updates: Partial<OpportunityFiltersProps['filters']>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const handleTypeToggle = (type: string) => {
    const currentTypes = filters.type || []
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type]

    updateFilters({ type: newTypes.length > 0 ? newTypes : undefined })
  }

  const handleLocationToggle = (location: string) => {
    const currentLocations = filters.location || []
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter(l => l !== location)
      : [...currentLocations, location]

    updateFilters({ location: newLocations.length > 0 ? newLocations : undefined })
  }

  const handleExperienceToggle = (level: string) => {
    const currentLevels = filters.experience_level || []
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level]

    updateFilters({ experience_level: newLevels.length > 0 ? newLevels : undefined })
  }

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag]

    updateFilters({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const addCustomLocation = () => {
    if (customLocation.trim()) {
      handleLocationToggle(customLocation.trim())
      setCustomLocation('')
    }
  }

  const handleSalaryChange = (values: number[]) => {
    setSalaryMin(values[0])
    setSalaryMax(values[1])
    updateFilters({
      salary_range: values[0] === 0 && values[1] === 300000 ? undefined : {
        min: values[0],
        max: values[1]
      }
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({})
    setSalaryMin(0)
    setSalaryMax(300000)
  }

  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value) ? value.length > 0 : value !== undefined
  )

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {Object.values(filters).reduce((count, value) => {
                  if (Array.isArray(value)) return count + value.length
                  return value !== undefined ? count + 1 : count
                }, 0)}
              </span>
            )}
          </CardTitle>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="search"
              placeholder="Search opportunities..."
              value={filters.search || ''}
              onChange={(e) => updateFilters({ search: e.target.value || undefined })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Opportunity Type */}
        <div className="space-y-3">
          <Label>Opportunity Type</Label>
          <div className="grid grid-cols-2 gap-2">
            {opportunityTypes.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={(filters.type || []).includes(type.value)}
                  onCheckedChange={() => handleTypeToggle(type.value)}
                />
                <Label
                  htmlFor={`type-${type.value}`}
                  className="text-sm cursor-pointer"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Location */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="space-y-3">
            <div className="space-y-3">
              <Label>Location</Label>

              {/* Remote option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={filters.remote_possible || false}
                  onCheckedChange={(checked) => updateFilters({ remote_possible: checked as boolean || undefined })}
                />
                <Label htmlFor="remote" className="text-sm cursor-pointer">
                  Remote work available
                </Label>
              </div>

              {/* Common locations */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Popular Locations</Label>
                <div className="grid grid-cols-2 gap-2">
                  {commonLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={(filters.location || []).includes(location)}
                        onCheckedChange={() => handleLocationToggle(location)}
                      />
                      <Label
                        htmlFor={`location-${location}`}
                        className="text-sm cursor-pointer"
                      >
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom location */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add custom location..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomLocation()
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCustomLocation}
                  disabled={!customLocation.trim()}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-3">
              <Label>Experience Level</Label>
              <div className="grid grid-cols-2 gap-2">
                {experienceLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`experience-${level.value}`}
                      checked={(filters.experience_level || []).includes(level.value)}
                      onCheckedChange={() => handleExperienceToggle(level.value)}
                    />
                    <Label
                      htmlFor={`experience-${level.value}`}
                      className="text-sm cursor-pointer"
                    >
                      {level.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Salary Range */}
            <div className="space-y-3">
              <Label>Salary Range (USD)</Label>
              <div className="px-2">
                <Slider
                  value={[salaryMin, salaryMax]}
                  onValueChange={handleSalaryChange}
                  max={300000}
                  min={0}
                  step={5000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>${salaryMin.toLocaleString()}</span>
                  <span>${salaryMax.toLocaleString()}+</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
              <div className="space-y-3">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 20).map(tag => (
                    <Button
                      key={tag}
                      variant={(filters.tags || []).includes(tag) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTagToggle(tag)}
                      className="h-7 text-xs"
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={filters.sort_by || 'relevance'}
                  onValueChange={(value) => updateFilters({ sort_by: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="date">Date Posted</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="applications">Applications</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Order</Label>
                <Select
                  value={filters.sort_order || 'desc'}
                  onValueChange={(value) => updateFilters({ sort_order: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <div className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  Search: {filters.search}
                  <button
                    onClick={() => updateFilters({ search: undefined })}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {(filters.type || []).map(type => (
                <div key={type} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  {opportunityTypes.find(t => t.value === type)?.label}
                  <button
                    onClick={() => handleTypeToggle(type)}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {filters.remote_possible && (
                <div className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  Remote OK
                  <button
                    onClick={() => updateFilters({ remote_possible: undefined })}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {(filters.location || []).map(location => (
                <div key={location} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  {location}
                  <button
                    onClick={() => handleLocationToggle(location)}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Compact filter bar for mobile
export function OpportunityFilterBar({
  filters,
  onFiltersChange,
  availableTags = []
}: OpportunityFiltersProps) {
  return (
    <div className="flex gap-2 p-4 bg-background border-b overflow-x-auto md:hidden">
      <Select
        value={filters.sort_by || 'relevance'}
        onValueChange={(value) => onFiltersChange({ ...filters, sort_by: value as any })}
      >
        <SelectTrigger className="w-auto min-w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevant</SelectItem>
          <SelectItem value="date">Recent</SelectItem>
          <SelectItem value="salary">Salary</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant={filters.remote_possible ? 'default' : 'outline'}
        size="sm"
        onClick={() => onFiltersChange({
          ...filters,
          remote_possible: !filters.remote_possible
        })}
      >
        Remote
      </Button>

      {availableTags.slice(0, 3).map(tag => (
        <Button
          key={tag}
          variant={(filters.tags || []).includes(tag) ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            const currentTags = filters.tags || []
            const newTags = currentTags.includes(tag)
              ? currentTags.filter(t => t !== tag)
              : [...currentTags, tag]
            onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined })
          }}
        >
          {tag}
        </Button>
      ))}
    </div>
  )
}