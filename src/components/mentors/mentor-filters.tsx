// Mentor filters component for finding specific mentors

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import { Filter, X, Star, Clock, DollarSign } from 'lucide-react'

interface MentorFiltersProps {
  filters: {
    expertise?: string[]
    experience_level?: string[]
    availability?: 'available' | 'waitlist' | 'unavailable'
    mentoring_style?: string[]
    location?: string[]
    languages?: string[]
    rating?: number
    max_response_time?: number
    max_hourly_rate?: number
    verified_only?: boolean
    sort_by?: 'relevance' | 'rating' | 'experience' | 'response_time' | 'rate'
    sort_order?: 'asc' | 'desc'
  }
  onFiltersChange: (filters: MentorFiltersProps['filters']) => void
  availableExpertise?: string[]
  className?: string
}

const expertiseAreas = [
  'Product Management',
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Legal',
  'Operations',
  'AI/ML',
  'Healthcare',
  'Fintech',
  'E-commerce',
  'SaaS',
  'Startup Growth',
  'Fundraising',
  'Team Building',
  'Leadership',
  'Strategy',
]

const experienceLevels = [
  { value: '1-3', label: '1-3 years' },
  { value: '3-5', label: '3-5 years' },
  { value: '5-10', label: '5-10 years' },
  { value: '10+', label: '10+ years' },
]

const mentoringStyles = [
  { value: 'structured', label: 'Structured' },
  { value: 'casual', label: 'Casual' },
  { value: 'hands_on', label: 'Hands-on' },
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

const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Portuguese',
  'Arabic',
  'Hindi',
  'Russian',
]

export function MentorFilters({
  filters,
  onFiltersChange,
  availableExpertise = expertiseAreas,
  className
}: MentorFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [customLocation, setCustomLocation] = useState('')
  const [ratingMin, setRatingMin] = useState(filters.rating || 3)
  const [responseTimeMax, setResponseTimeMax] = useState(filters.max_response_time || 48)
  const [hourlyRateMax, setHourlyRateMax] = useState(filters.max_hourly_rate || 500)

  const updateFilters = (updates: Partial<MentorFiltersProps['filters']>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const handleExpertiseToggle = (expertise: string) => {
    const currentExpertise = filters.expertise || []
    const newExpertise = currentExpertise.includes(expertise)
      ? currentExpertise.filter(e => e !== expertise)
      : [...currentExpertise, expertise]

    updateFilters({ expertise: newExpertise.length > 0 ? newExpertise : undefined })
  }

  const handleExperienceToggle = (level: string) => {
    const currentLevels = filters.experience_level || []
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter(l => l !== level)
      : [...currentLevels, level]

    updateFilters({ experience_level: newLevels.length > 0 ? newLevels : undefined })
  }

  const handleStyleToggle = (style: string) => {
    const currentStyles = filters.mentoring_style || []
    const newStyles = currentStyles.includes(style)
      ? currentStyles.filter(s => s !== style)
      : [...currentStyles, style]

    updateFilters({ mentoring_style: newStyles.length > 0 ? newStyles : undefined })
  }

  const handleLocationToggle = (location: string) => {
    const currentLocations = filters.location || []
    const newLocations = currentLocations.includes(location)
      ? currentLocations.filter(l => l !== location)
      : [...currentLocations, location]

    updateFilters({ location: newLocations.length > 0 ? newLocations : undefined })
  }

  const handleLanguageToggle = (language: string) => {
    const currentLanguages = filters.languages || []
    const newLanguages = currentLanguages.includes(language)
      ? currentLanguages.filter(l => l !== language)
      : [...currentLanguages, language]

    updateFilters({ languages: newLanguages.length > 0 ? newLanguages : undefined })
  }

  const addCustomLocation = () => {
    if (customLocation.trim()) {
      handleLocationToggle(customLocation.trim())
      setCustomLocation('')
    }
  }

  const handleRatingChange = (value: number[]) => {
    setRatingMin(value[0])
    updateFilters({ rating: value[0] })
  }

  const handleResponseTimeChange = (value: number[]) => {
    setResponseTimeMax(value[0])
    updateFilters({ max_response_time: value[0] })
  }

  const handleHourlyRateChange = (value: number[]) => {
    setHourlyRateMax(value[0])
    updateFilters({ max_hourly_rate: value[0] })
  }

  const clearAllFilters = () => {
    onFiltersChange({})
    setRatingMin(3)
    setResponseTimeMax(48)
    setHourlyRateMax(500)
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
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Availability */}
        <div className="space-y-3">
          <Label>Availability</Label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'available', label: 'Available' },
              { value: 'waitlist', label: 'Waitlist' },
              { value: 'unavailable', label: 'Unavailable' },
            ].map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`availability-${option.value}`}
                  checked={filters.availability === option.value}
                  onCheckedChange={(checked) =>
                    updateFilters({ availability: checked ? option.value as any : undefined })
                  }
                />
                <Label
                  htmlFor={`availability-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Only */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="verified-only"
            checked={filters.verified_only || false}
            onCheckedChange={(checked) => updateFilters({ verified_only: checked as boolean || undefined })}
          />
          <Label htmlFor="verified-only" className="text-sm cursor-pointer">
            Verified mentors only
          </Label>
        </div>

        {/* Expertise */}
        <div className="space-y-3">
          <Label>Expertise Areas</Label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {availableExpertise.map((expertise) => (
              <div key={expertise} className="flex items-center space-x-2">
                <Checkbox
                  id={`expertise-${expertise}`}
                  checked={(filters.expertise || []).includes(expertise)}
                  onCheckedChange={() => handleExpertiseToggle(expertise)}
                />
                <Label
                  htmlFor={`expertise-${expertise}`}
                  className="text-sm cursor-pointer"
                >
                  {expertise}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Mentoring Style */}
        <div className="space-y-3">
          <Label>Mentoring Style</Label>
          <div className="grid grid-cols-3 gap-2">
            {mentoringStyles.map((style) => (
              <div key={style.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`style-${style.value}`}
                  checked={(filters.mentoring_style || []).includes(style.value)}
                  onCheckedChange={() => handleStyleToggle(style.value)}
                />
                <Label
                  htmlFor={`style-${style.value}`}
                  className="text-sm cursor-pointer"
                >
                  {style.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Experience Level */}
        <div className="space-y-3">
          <Label>Mentor Experience</Label>
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

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            {/* Rating */}
            <div className="space-y-3">
              <Label>Minimum Rating</Label>
              <div className="px-2">
                <Slider
                  value={[ratingMin]}
                  onValueChange={(value) => handleRatingChange(value)}
                  max={5}
                  min={3}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{ratingMin.toFixed(1)} stars</span>
                  <span>5.0 stars</span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="space-y-3">
              <Label>Max Response Time (hours)</Label>
              <div className="px-2">
                <Slider
                  value={[responseTimeMax]}
                  onValueChange={(value) => handleResponseTimeChange(value)}
                  max={72}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>1h</span>
                  <span>{responseTimeMax}h</span>
                </div>
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="space-y-3">
              <Label>Max Hourly Rate (USD)</Label>
              <div className="px-2">
                <Slider
                  value={[hourlyRateMax]}
                  onValueChange={(value) => handleHourlyRateChange(value)}
                  max={1000}
                  min={0}
                  step={25}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>Free</span>
                  <span>${hourlyRateMax}</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label>Location</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
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

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom location..."
                  value={customLocation}
                  onChange={(e) => setCustomLocation(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addCustomLocation()
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-input rounded-md"
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

            {/* Languages */}
            <div className="space-y-3">
              <Label>Languages</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={`language-${language}`}
                      checked={(filters.languages || []).includes(language)}
                      onCheckedChange={() => handleLanguageToggle(language)}
                    />
                    <Label
                      htmlFor={`language-${language}`}
                      className="text-sm cursor-pointer"
                    >
                      {language}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

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
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="response_time">Response Time</SelectItem>
                    <SelectItem value="rate">Hourly Rate</SelectItem>
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
                    <SelectItem value="desc">High to Low</SelectItem>
                    <SelectItem value="asc">Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Active filters display */}
        {hasActiveFilters && (
          <div className="pt-4 border-t">
            <Label className="text-sm font-medium mb-2 block">Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.availability && (
                <div className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  Availability: {filters.availability}
                  <button
                    onClick={() => updateFilters({ availability: undefined })}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {filters.verified_only && (
                <div className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  Verified only
                  <button
                    onClick={() => updateFilters({ verified_only: undefined })}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {(filters.expertise || []).map(expertise => (
                <div key={expertise} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  {expertise}
                  <button
                    onClick={() => handleExpertiseToggle(expertise)}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {(filters.mentoring_style || []).map(style => (
                <div key={style} className="bg-muted px-2 py-1 rounded text-sm flex items-center gap-1">
                  {mentoringStyles.find(s => s.value === style)?.label}
                  <button
                    onClick={() => handleStyleToggle(style)}
                    className="hover:bg-destructive/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

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