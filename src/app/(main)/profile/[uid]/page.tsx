// Other user profile page
"use client"

import React, { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { PageContainer } from '@/components/layout/page-container'
import { ProfileHeader } from '@/components/profile/profile-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingState } from '@/components/shared/loading-state'
import { EmptyState } from '@/components/shared/empty-state'
import {
  Calendar,
  MapPin,
  Globe,
  Linkedin,
  Twitter,
  Users,
  MessageSquare,
  TrendingUp,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface ProfilePageProps {
  params: Promise<{
    uid: string
  }>
}

function ProfileContent({ params }: { params: { uid: string } }) {
  const { user: currentUser } = useAuth()
  const userId = params.uid

  // Check if viewing own profile
  if (currentUser?.uid === userId) {
    // Redirect to own profile page would happen here
    // For now, we'll show the same content
  }

  // Mock profile data - in real app this would come from a profile hook
  const profile = {
    uid: userId,
    display_name: 'Alex Rodriguez',
    username: 'alexrodriguez',
    bio: 'Serial entrepreneur building the future of fintech. Previously founded two successful startups. Passionate about blockchain, AI, and sustainable investing.',
    avatar_url: null,
    location: 'Austin, TX',
    website: 'https://alexrodriguez.dev',
    linkedin_url: 'https://linkedin.com/in/alexrodriguez',
    twitter_handle: 'alexrodriguez',
    company_name: 'BlockChain Ventures',
    company_description: 'Leading the next wave of decentralized finance solutions',
    company_stage: 'growth' as const,
    title: 'CEO & Co-founder',
    tags: ['fintech', 'blockchain', 'ai', 'leadership', 'investing'],
    available_for_mentoring: true,
    seeking_mentorship: false,
    open_to_opportunities: false,
    verified: true,
    connections_count: 512,
    posts_count: 89,
    followers_count: 2847,
    joined_date: new Date('2022-03-15'),
    mutual_connections: 12,
    is_connected: false,
  }

  // Mock posts data
  const recentPosts = [
    {
      id: '1',
      type: 'update',
      content: 'Excited to announce our Series A funding round! $15M to accelerate our growth in the DeFi space. Huge thanks to our amazing team and investors.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      engagement: { likes: 45, comments: 23, shares: 12 }
    },
    {
      id: '2',
      type: 'question',
      content: 'What are your thoughts on the current state of DeFi regulation? How do you see it evolving in the next 2-3 years?',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      engagement: { likes: 28, comments: 67, shares: 8 }
    },
    {
      id: '3',
      type: 'milestone',
      content: 'Celebrating 10,000 active users on our platform! This milestone represents countless hours of hard work and the trust our community has placed in us.',
      timestamp: new Date(Date.now() - 1 * 7 * 24 * 60 * 60 * 1000),
      engagement: { likes: 89, comments: 34, shares: 45 }
    }
  ]

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader userId={userId} />

        {/* Connection Status & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {profile.mutual_connections > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{profile.mutual_connections} mutual connections</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Joined {profile.joined_date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button>
              Connect
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.connections_count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.posts_count}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{profile.followers_count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <ExternalLink className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground">Trust Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company & Background */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Background</CardTitle>
                  <CardDescription>
                    Career highlights and current ventures
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">{profile.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      at {profile.company_name}
                    </p>
                    <p className="text-sm">{profile.company_description}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Skills & Interests</h4>
                    <div className="flex flex-wrap gap-1">
                      {profile.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Availability</h4>
                    <div className="flex flex-wrap gap-2">
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
                </CardContent>
              </Card>

              {/* Contact & Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Links</CardTitle>
                  <CardDescription>
                    Ways to connect and learn more
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {profile.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    )}

                    {profile.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}

                    {profile.linkedin_url && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}

                    {profile.twitter_handle && (
                      <div className="flex items-center gap-3">
                        <Twitter className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={`https://twitter.com/${profile.twitter_handle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          @{profile.twitter_handle}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest posts and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <div key={post.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm">{post.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {post.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs text-muted-foreground ml-5">
                        <span>{post.engagement.likes} likes</span>
                        <span>{post.engagement.comments} comments</span>
                        <span>{post.engagement.shares} shares</span>
                      </div>

                      {post !== recentPosts[recentPosts.length - 1] && (
                        <div className="border-b ml-5" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Insights</CardTitle>
                <CardDescription>
                  How {profile.display_name} connects with the community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {profile.mutual_connections}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Mutual Connections
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      23
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Shared Interests
                    </div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      4.8
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Community Rating
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    Connect with {profile.display_name} to expand your network and discover new opportunities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Await params in Next.js 15+
  const resolvedParams = await params

  // Validate user ID
  if (!resolvedParams.uid || resolvedParams.uid.length < 6) {
    notFound()
  }

  return (
    <Suspense fallback={<LoadingState />}>
      <ProfileContent params={resolvedParams} />
    </Suspense>
  )
}