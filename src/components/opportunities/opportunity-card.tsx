// Opportunity card component for displaying job/investment/partnership opportunities

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format-date'
import {
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  TrendingUp,
  Briefcase,
  Target,
  Handshake,
  GraduationCap,
  UserCheck,
} from 'lucide-react'

interface OpportunityCardProps {
  opportunity: {
    id: string
    title: string
    description: string
    type: 'job' | 'investment' | 'partnership' | 'mentorship' | 'internship' | 'consulting' | 'other'
    category: string
    tags: string[]
    location?: string
    remote_possible: boolean
    work_arrangement: 'remote' | 'hybrid' | 'onsite'
    compensation_type?: 'salary' | 'equity' | 'both'
    salary_range?: {
      min: number
      max: number
      currency: string
    }
    equity_range?: {
      min: number
      max: number
    }
    experience_level: 'entry' | 'mid' | 'senior' | 'executive'
    creator: {
      uid: string
      display_name: string
      company_name?: string
      avatar_url?: string
      verified?: boolean
    }
    application_deadline?: Date
    created_at: Date
    views_count: number
    applications_count: number
    featured?: boolean
    saved?: boolean
  }
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  onSave?: (opportunityId: string) => void
  onApply?: (opportunityId: string) => void
  onView?: (opportunityId: string) => void
  className?: string
}

const typeConfig = {
  job: {
    icon: Briefcase,
    color: 'bg-blue-100 text-blue-700',
    label: 'Job',
  },
  investment: {
    icon: TrendingUp,
    color: 'bg-green-100 text-green-700',
    label: 'Investment',
  },
  partnership: {
    icon: Handshake,
    color: 'bg-purple-100 text-purple-700',
    label: 'Partnership',
  },
  mentorship: {
    icon: UserCheck,
    color: 'bg-orange-100 text-orange-700',
    label: 'Mentorship',
  },
  internship: {
    icon: GraduationCap,
    color: 'bg-pink-100 text-pink-700',
    label: 'Internship',
  },
  consulting: {
    icon: Target,
    color: 'bg-indigo-100 text-indigo-700',
    label: 'Consulting',
  },
  other: {
    icon: Briefcase,
    color: 'bg-gray-100 text-gray-700',
    label: 'Other',
  },
}

const experienceLevelLabels = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior Level',
  executive: 'Executive',
}

export function OpportunityCard({
  opportunity,
  variant = 'default',
  showActions = true,
  onSave,
  onApply,
  onView,
  className,
}: OpportunityCardProps) {
  const [isSaved, setIsSaved] = useState(opportunity.saved || false)
  const [isHovered, setIsHovered] = useState(false)

  const typeInfo = typeConfig[opportunity.type]
  const TypeIcon = typeInfo.icon

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newSaved = !isSaved
    setIsSaved(newSaved)
    onSave?.(opportunity.id)
  }

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onApply?.(opportunity.id)
  }

  const formatSalary = () => {
    if (!opportunity.salary_range) return null
    const { min, max, currency } = opportunity.salary_range
    if (min === max) return `${currency} ${min.toLocaleString()}`
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  const formatEquity = () => {
    if (!opportunity.equity_range) return null
    const { min, max } = opportunity.equity_range
    if (min === max) return `${min}%`
    return `${min}% - ${max}%`
  }

  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'hover:shadow-md transition-all duration-200 cursor-pointer',
          isHovered && 'scale-[1.02]',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onView?.(opportunity.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn('p-2 rounded-lg', typeInfo.color)}>
              <TypeIcon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-sm line-clamp-1">
                  {opportunity.title}
                </h3>
                {showActions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSave}
                    className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-3 h-3 text-primary" />
                    ) : (
                      <Bookmark className="w-3 h-3" />
                    )}
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-2">
                {opportunity.creator.company_name || opportunity.creator.display_name}
              </p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {opportunity.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{opportunity.location}</span>
                  </div>
                )}

                {opportunity.salary_range && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span>{formatSalary()}</span>
                  </div>
                )}

                <span>{experienceLevelLabels[opportunity.experience_level]}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className={cn(
        'relative overflow-hidden border-2',
        opportunity.featured ? 'border-primary/50 bg-primary/5' : 'border-muted',
        className
      )}>
        {opportunity.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <div className={cn('p-3 rounded-lg', typeInfo.color)}>
              <TypeIcon className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{opportunity.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {opportunity.creator.company_name || opportunity.creator.display_name}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{typeInfo.label}</Badge>
                <Badge variant="outline">{opportunity.category}</Badge>
                <Badge variant="outline">{experienceLevelLabels[opportunity.experience_level]}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {opportunity.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {opportunity.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{opportunity.location}</span>
                </div>
              )}

              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{opportunity.applications_count} applicants</span>
              </div>

              {opportunity.application_deadline && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {formatDate(opportunity.application_deadline)}</span>
                </div>
              )}
            </div>

            {opportunity.salary_range && (
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-medium">{formatSalary()}</span>
              </div>
            )}

            {opportunity.equity_range && (
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="font-medium">Equity: {formatEquity()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave}>
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-1" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-1" />
                    Save
                  </>
                )}
              </Button>

              <Button size="sm" onClick={handleApply}>
                Apply Now
              </Button>
            </div>

            <Link href={`/opportunities/${opportunity.id}`}>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      className={cn(
        'hover:shadow-md transition-all duration-200 cursor-pointer',
        isHovered && 'scale-[1.02]',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView?.(opportunity.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={opportunity.creator.avatar_url}
              alt={opportunity.creator.display_name}
              size="sm"
            />
            <div>
              <p className="font-medium text-sm">{opportunity.creator.display_name}</p>
              <p className="text-xs text-muted-foreground">
                {opportunity.creator.company_name && `${opportunity.creator.company_name} • `}
                {formatDate(opportunity.created_at)}
              </p>
            </div>
          </div>

          {showActions && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Title and type */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('p-1 rounded', typeInfo.color)}>
                <TypeIcon className="w-3 h-3" />
              </div>
              <Badge variant="secondary" className="text-xs">
                {typeInfo.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {experienceLevelLabels[opportunity.experience_level]}
              </Badge>
            </div>

            <h3 className="font-semibold text-base mb-2">{opportunity.title}</h3>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {opportunity.description}
            </p>
          </div>

          {/* Location and compensation */}
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {opportunity.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{opportunity.location}</span>
                {opportunity.remote_possible && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    Remote OK
                  </Badge>
                )}
              </div>
            )}

            {opportunity.salary_range && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatSalary()}</span>
              </div>
            )}

            {opportunity.equity_range && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{formatEquity()} equity</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {opportunity.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {opportunity.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {opportunity.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{opportunity.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats and actions */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{opportunity.views_count} views</span>
              <span>{opportunity.applications_count} applicants</span>
              {opportunity.application_deadline && (
                <span>Deadline: {formatDate(opportunity.application_deadline)}</span>
              )}
            </div>

            {showActions && (
              <Button size="sm" onClick={handleApply}>
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for opportunity card loading state
export function OpportunityCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  if (variant === 'compact') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-muted rounded animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              <div className="flex gap-2">
                <div className="h-3 bg-muted rounded animate-pulse w-16" />
                <div className="h-3 bg-muted rounded animate-pulse w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-32" />
            <div className="h-3 bg-muted rounded animate-pulse w-24" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse w-2/3" />
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-4/5" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
          <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex gap-4">
            <div className="h-3 bg-muted rounded animate-pulse w-12" />
            <div className="h-3 bg-muted rounded animate-pulse w-16" />
          </div>
          <div className="h-8 bg-muted rounded animate-pulse w-20" />
        </div>
      </CardContent>
    </Card>
  )
}