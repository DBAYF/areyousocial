// Profile header component for user profiles
"use client"

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useUiStore } from '@/lib/stores/ui-store'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StageBadge } from './stage-badge'
import { ConnectionButton } from '@/components/connections/connection-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent } from '@/components/ui/card'
import {
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Calendar,
  MoreHorizontal,
  Mail,
  Share2,
  Flag,
} from 'lucide-react'
import { formatDate } from '@/lib/utils/format-date'

interface ProfileHeaderProps {
  userId?: string
  isOwnProfile?: boolean
  showActions?: boolean
  compact?: boolean
}

export function ProfileHeader({
  userId,
  isOwnProfile = false,
  showActions = true,
  compact = false
}: ProfileHeaderProps) {
  const { user: currentUser } = useAuthStore()
  const { openModal } = useUiStore()
  const [isFollowing, setIsFollowing] = useState(false)

  // Mock profile data - in real app this would come from props or hooks
  const profile = {
    uid: userId || currentUser?.uid || 'user1',
    display_name: 'Sarah Chen',
    username: 'sarahchen',
    bio: 'Building the future of healthcare technology. Previously at HealthTech Inc. Passionate about AI and entrepreneurship.',
    avatar_url: null,
    location: 'San Francisco, CA',
    website: 'https://sarahchen.dev',
    linkedin_url: 'https://linkedin.com/in/sarahchen',
    twitter_handle: 'sarahchen',
    company_name: 'MediFlow',
    company_stage: 'early_traction' as const,
    title: 'Founder & CEO',
    tags: ['healthtech', 'ai', 'saas'],
    available_for_mentoring: true,
    seeking_mentorship: false,
    open_to_opportunities: true,
    verified: true,
    connections_count: 247,
    posts_count: 42,
    followers_count: 1250,
    joined_date: new Date('2023-01-15'),
  }

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile.display_name} - ReMake`,
        text: `Check out ${profile.display_name}'s profile on ReMake`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification
    }
  }

  const handleReportProfile = () => {
    openModal('report-user', { userId: profile.uid, userName: profile.display_name })
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4">
        <Avatar
          src={profile.avatar_url}
          alt={profile.display_name}
          size="sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{profile.display_name}</h3>
            {profile.verified && <Badge variant="verified" className="text-xs">✓</Badge>}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {profile.title} at {profile.company_name}
          </p>
        </div>
        {!isOwnProfile && (
          <ConnectionButton userId={profile.uid} variant="compact" />
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar and basic info */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <Avatar
              src={profile.avatar_url}
              alt={profile.display_name}
              size="2xl"
              showOnlineIndicator
              isOnline={true}
            />

            {showActions && (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {isOwnProfile ? (
                  <Button asChild className="w-full sm:w-auto">
                    <a href="/profile/edit">Edit Profile</a>
                  </Button>
                ) : (
                  <>
                    <ConnectionButton userId={profile.uid} />
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Profile details */}
          <div className="flex-1 space-y-4">
            {/* Name and verification */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{profile.display_name}</h1>
              {profile.verified && <Badge variant="verified">Verified</Badge>}
              <StageBadge stage={profile.company_stage} />
            </div>

            {/* Username */}
            <p className="text-muted-foreground">@{profile.username}</p>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm leading-relaxed max-w-2xl">{profile.bio}</p>
            )}

            {/* Company and title */}
            <div className="space-y-1">
              <h2 className="font-semibold text-lg">
                {profile.title} at {profile.company_name}
              </h2>
            </div>

            {/* Tags */}
            {profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.tags.slice(0, 5).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {profile.tags.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{profile.tags.length - 5} more
                  </Badge>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="font-semibold">{profile.connections_count}</span>
                <span className="text-muted-foreground ml-1">connections</span>
              </div>
              <div>
                <span className="font-semibold">{profile.posts_count}</span>
                <span className="text-muted-foreground ml-1">posts</span>
              </div>
              <div>
                <span className="font-semibold">{profile.followers_count.toLocaleString()}</span>
                <span className="text-muted-foreground ml-1">followers</span>
              </div>
            </div>

            {/* Location and social links */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}

              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
              )}

              {profile.twitter_handle && (
                <a
                  href={`https://twitter.com/${profile.twitter_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span>@{profile.twitter_handle}</span>
                </a>
              )}
            </div>

            {/* Joined date and availability */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(profile.joined_date)}</span>
              </div>

              {profile.available_for_mentoring && (
                <Badge variant="success" className="text-xs">
                  Available for mentoring
                </Badge>
              )}

              {profile.seeking_mentorship && (
                <Badge variant="info" className="text-xs">
                  Seeking mentorship
                </Badge>
              )}

              {profile.open_to_opportunities && (
                <Badge variant="warning" className="text-xs">
                  Open to opportunities
                </Badge>
              )}
            </div>
          </div>

          {/* Actions menu */}
          {showActions && (
            <div className="flex flex-col gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleShareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share profile
                  </DropdownMenuItem>
                  {!isOwnProfile && (
                    <DropdownMenuItem onClick={handleReportProfile}>
                      <Flag className="w-4 h-4 mr-2" />
                      Report user
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}