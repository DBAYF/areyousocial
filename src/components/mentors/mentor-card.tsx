// Mentor card component for displaying mentor profiles

import { useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils/cn'
import {
  Users,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  Clock,
  Award,
  TrendingUp,
} from 'lucide-react'

interface MentorCardProps {
  mentor: {
    uid: string
    display_name: string
    username: string
    avatar_url?: string
    location?: string
    title?: string
    company_name?: string
    bio?: string
    expertise: string[]
    years_experience: number
    mentoring_experience: number
    available_for_mentoring: boolean
    seeking_mentorship: boolean
    mentoring_style: 'structured' | 'casual' | 'hands_on'
    preferred_mentee_stage: ('idea' | 'mvp' | 'early_traction' | 'growth' | 'scale')[]
    languages_spoken: string[]
    rating: number
    mentees_helped: number
    response_time_hours: number
    hourly_rate?: number
    verified: boolean
    featured?: boolean
  }
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  onConnect?: (mentorId: string) => void
  onMessage?: (mentorId: string) => void
  onViewProfile?: (mentorId: string) => void
  className?: string
}

const mentoringStyleLabels = {
  structured: 'Structured',
  casual: 'Casual',
  hands_on: 'Hands-on',
}

const stageLabels = {
  idea: 'Idea Stage',
  mvp: 'MVP',
  early_traction: 'Early Traction',
  growth: 'Growth',
  scale: 'Scale',
}

export function MentorCard({
  mentor,
  variant = 'default',
  showActions = true,
  onConnect,
  onMessage,
  onViewProfile,
  className,
}: MentorCardProps) {
  const [isHovered, setIsHovered] = useState(false)

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
        onClick={() => onViewProfile?.(mentor.uid)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${mentor.uid}`}>
              <Avatar
                src={mentor.avatar_url}
                alt={mentor.display_name}
                size="sm"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${mentor.uid}`}
                  className="font-semibold truncate hover:underline"
                >
                  {mentor.display_name}
                </Link>
                {mentor.verified && <Badge variant="verified" className="text-xs">✓</Badge>}
              </div>

              <p className="text-sm text-muted-foreground truncate">
                {mentor.title} at {mentor.company_name}
              </p>

              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{mentor.rating.toFixed(1)}</span>
                </div>
                <span>{mentor.mentees_helped} mentees</span>
                <span>{mentor.response_time_hours}h response</span>
              </div>
            </div>

            {showActions && mentor.available_for_mentoring && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onConnect?.(mentor.uid)
                }}
              >
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className={cn(
        'relative overflow-hidden border-2',
        mentor.featured ? 'border-primary/50 bg-primary/5' : 'border-muted',
        className
      )}>
        {mentor.featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary text-primary-foreground">
              Featured Mentor
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start gap-4">
            <Link href={`/profile/${mentor.uid}`}>
              <Avatar
                src={mentor.avatar_url}
                alt={mentor.display_name}
                size="lg"
                showOnlineIndicator
                isOnline={mentor.available_for_mentoring}
              />
            </Link>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/profile/${mentor.uid}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {mentor.display_name}
                </Link>
                {mentor.verified && <Badge variant="verified">Verified</Badge>}
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                {mentor.title} at {mentor.company_name}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{mentoringStyleLabels[mentor.mentoring_style]}</Badge>
                <Badge variant="outline">{mentor.years_experience} years exp.</Badge>
                <Badge variant="outline">{mentor.mentoring_experience} mentoring</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                  <span>({mentor.mentees_helped} mentees)</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{mentor.response_time_hours}h response</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {mentor.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {mentor.bio}
            </p>
          )}

          <div className="space-y-3 mb-4">
            <div>
              <h4 className="font-medium text-sm mb-2">Expertise</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.expertise.slice(0, 4).map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {mentor.expertise.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{mentor.expertise.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2">Helps with</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.preferred_mentee_stage.map(stage => (
                  <Badge key={stage} variant="outline" className="text-xs">
                    {stageLabels[stage]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onMessage?.(mentor.uid)}>
                <MessageSquare className="w-4 h-4 mr-1" />
                Message
              </Button>

              <Button
                size="sm"
                onClick={() => onConnect?.(mentor.uid)}
                disabled={!mentor.available_for_mentoring}
              >
                {mentor.available_for_mentoring ? 'Request Mentoring' : 'Unavailable'}
              </Button>
            </div>

            {mentor.hourly_rate && (
              <div className="text-sm font-medium">
                ${mentor.hourly_rate}/hour
              </div>
            )}
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
      onClick={() => onViewProfile?.(mentor.uid)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={mentor.avatar_url}
              alt={mentor.display_name}
              size="md"
              showOnlineIndicator
              isOnline={mentor.available_for_mentoring}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{mentor.display_name}</h3>
                {mentor.verified && <Badge variant="verified" className="text-xs">✓</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                {mentor.title} at {mentor.company_name}
              </p>
              {mentor.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{mentor.location}</span>
                </div>
              )}
            </div>
          </div>

          {mentor.hourly_rate && (
            <div className="text-right">
              <div className="text-sm font-medium">${mentor.hourly_rate}/hour</div>
              <div className="text-xs text-muted-foreground">Rate</div>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Rating and stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{mentor.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{mentor.mentees_helped} mentees</span>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{mentor.response_time_hours}h avg</span>
            </div>
          </div>

          {/* Bio */}
          {mentor.bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {mentor.bio}
            </p>
          )}

          {/* Expertise */}
          <div>
            <h4 className="font-medium text-sm mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-1">
              {mentor.expertise.slice(0, 3).map(skill => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {mentor.expertise.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{mentor.expertise.length - 3}
                </Badge>
              )}
            </div>
          </div>

          {/* Mentoring style and availability */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {mentoringStyleLabels[mentor.mentoring_style]}
              </Badge>
              {mentor.available_for_mentoring ? (
                <Badge variant="success" className="text-xs">
                  Available
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Unavailable
                </Badge>
              )}
            </div>

            {showActions && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMessage?.(mentor.uid)
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onConnect?.(mentor.uid)
                  }}
                  disabled={!mentor.available_for_mentoring}
                >
                  Connect
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Skeleton for mentor card loading state
export function MentorCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  if (variant === 'compact') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
              <div className="flex gap-2">
                <div className="h-3 bg-muted rounded animate-pulse w-12" />
                <div className="h-3 bg-muted rounded animate-pulse w-16" />
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
          <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-muted rounded animate-pulse w-32" />
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
          <div className="h-4 bg-muted rounded animate-pulse w-20" />
          <div className="h-4 bg-muted rounded animate-pulse w-24" />
        </div>

        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />

        <div className="flex gap-1">
          <div className="h-6 bg-muted rounded animate-pulse w-16" />
          <div className="h-6 bg-muted rounded animate-pulse w-20" />
          <div className="h-6 bg-muted rounded animate-pulse w-14" />
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <div className="h-6 bg-muted rounded animate-pulse w-20" />
          <div className="flex gap-2">
            <div className="h-8 bg-muted rounded animate-pulse w-16" />
            <div className="h-8 bg-muted rounded animate-pulse w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}