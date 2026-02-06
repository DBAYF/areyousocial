// Profile card component for displaying user profiles in lists and grids

import { useState } from 'react'
import Link from 'next/link'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StageBadge } from './stage-badge'
import { ConnectionButton } from '@/components/connections/connection-button'
import { MapPin, Users, MessageSquare } from 'lucide-react'

interface ProfileCardProps {
  user: {
    uid: string
    display_name: string
    username: string
    avatar_url?: string
    location?: string
    company_name?: string
    title?: string
    company_stage?: string
    tags?: string[]
    verified?: boolean
    bio?: string
    connections_count?: number
    mutual_connections?: number
  }
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  className?: string
}

export function ProfileCard({
  user,
  variant = 'default',
  showActions = true,
  className
}: ProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  if (variant === 'compact') {
    return (
      <Card
        className={`transition-all duration-200 hover:shadow-md ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${user.uid}`}>
              <Avatar
                src={user.avatar_url}
                alt={user.display_name}
                size="sm"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/profile/${user.uid}`}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate hover:underline">
                    {user.display_name}
                  </h3>
                  {user.verified && <Badge variant="verified" className="text-xs">✓</Badge>}
                </div>
              </Link>

              <p className="text-sm text-muted-foreground truncate">
                {user.title} {user.company_name && `at ${user.company_name}`}
              </p>

              {user.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{user.location}</span>
                </div>
              )}
            </div>

            {showActions && isHovered && (
              <ConnectionButton userId={user.uid} size="sm" />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'featured') {
    return (
      <Card className={`relative overflow-hidden ${className}`}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />

        <CardContent className="relative p-6">
          <div className="flex items-start gap-4">
            <Link href={`/profile/${user.uid}`}>
              <Avatar
                src={user.avatar_url}
                alt={user.display_name}
                size="lg"
                showOnlineIndicator
                isOnline={true}
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/profile/${user.uid}`}>
                  <h3 className="text-lg font-semibold hover:underline">
                    {user.display_name}
                  </h3>
                </Link>
                {user.verified && <Badge variant="verified">Verified</Badge>}
                {user.company_stage && <StageBadge stage={user.company_stage as any} />}
              </div>

              <p className="text-sm text-muted-foreground mb-2">
                @{user.username}
              </p>

              {user.title && user.company_name && (
                <p className="font-medium text-sm mb-2">
                  {user.title} at {user.company_name}
                </p>
              )}

              {user.bio && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {user.bio}
                </p>
              )}

              {/* Tags */}
              {user.tags && user.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {user.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {user.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{user.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {user.connections_count && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{user.connections_count} connections</span>
                  </div>
                )}

                {user.mutual_connections && user.mutual_connections > 0 && (
                  <span className="text-primary">
                    {user.mutual_connections} mutual
                  </span>
                )}
              </div>
            </div>

            {showActions && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/messages/new?user=${user.uid}`}>
                    <MessageSquare className="w-4 h-4" />
                  </Link>
                </Button>
                <ConnectionButton userId={user.uid} />
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
      className={`transition-all duration-200 hover:shadow-md ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Link href={`/profile/${user.uid}`}>
            <Avatar
              src={user.avatar_url}
              alt={user.display_name}
              size="md"
              showOnlineIndicator
              isOnline={true}
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/profile/${user.uid}`}>
                <h3 className="font-semibold hover:underline">
                  {user.display_name}
                </h3>
              </Link>
              {user.verified && <Badge variant="verified" className="text-xs">✓</Badge>}
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              @{user.username}
            </p>

            {user.title && user.company_name && (
              <p className="text-sm font-medium mb-2">
                {user.title} at {user.company_name}
              </p>
            )}

            {user.location && (
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{user.location}</span>
              </div>
            )}

            {/* Tags */}
            {user.tags && user.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {user.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {user.connections_count && (
                <span>{user.connections_count} connections</span>
              )}
              {user.mutual_connections && user.mutual_connections > 0 && (
                <span className="text-primary font-medium">
                  {user.mutual_connections} mutual
                </span>
              )}
            </div>
          </div>

          {showActions && (
            <ConnectionButton userId={user.uid} />
          )}
        </div>

        {/* Bio preview */}
        {user.bio && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {user.bio}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Profile card skeleton for loading states
export function ProfileCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  if (variant === 'compact') {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-3">
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded animate-pulse w-1/3" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
            </div>
            <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
              <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}