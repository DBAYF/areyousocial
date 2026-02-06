// Own profile page

import { Suspense } from 'react'
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
  Edit
} from 'lucide-react'
import Link from 'next/link'

function ProfileContent() {
  const { user, profile, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingState />
  }

  if (!user || !profile) {
    return (
      <EmptyState
        title="Profile not found"
        description="Unable to load your profile information."
      />
    )
  }

  // Mock activity data - in real app this would come from hooks
  const recentActivity = [
    {
      id: '1',
      type: 'post',
      title: 'Shared an update about our latest funding round',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      engagement: { likes: 12, comments: 5, shares: 2 }
    },
    {
      id: '2',
      type: 'connection',
      title: 'Connected with Sarah Chen from HealthTech Inc',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Celebrated reaching 1000 users milestone',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      engagement: { likes: 28, comments: 12, shares: 8 }
    }
  ]

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader isOwnProfile={true} />

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">247</p>
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
                  <p className="text-2xl font-bold">42</p>
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
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-muted-foreground">Profile Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs text-muted-foreground">Days Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Summary</CardTitle>
                  <CardDescription>
                    Key information about your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {profile.company_name && (
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">
                          <span className="font-medium">Company:</span> {profile.company_name}
                        </span>
                      </div>
                    )}

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

                    {profile.tags && profile.tags.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Skills & Interests:</span>
                        <div className="flex flex-wrap gap-1">
                          {profile.tags.slice(0, 6).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {profile.tags.length > 6 && (
                            <Badge variant="secondary" className="text-xs">
                              +{profile.tags.length - 6} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <Link href="/profile/edit">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks to grow your network
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/feed?compose=true">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Share an update
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/search?type=people">
                      <Users className="w-4 h-4 mr-2" />
                      Find connections
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/mentors">
                      <Users className="w-4 h-4 mr-2" />
                      Browse mentors
                    </Link>
                  </Button>

                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/opportunities">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View opportunities
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest interactions and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-b-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp.toLocaleDateString()} at {activity.timestamp.toLocaleTimeString()}
                        </p>
                        {activity.engagement && (
                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span>{activity.engagement.likes} likes</span>
                            <span>{activity.engagement.comments} comments</span>
                            <span>{activity.engagement.shares} shares</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Views</CardTitle>
                  <CardDescription>
                    People who viewed your profile this week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">127</div>
                  <p className="text-sm text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connection Requests</CardTitle>
                  <CardDescription>
                    People interested in connecting with you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">23</div>
                  <p className="text-sm text-muted-foreground">8 pending responses</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Profile Optimization</CardTitle>
                <CardDescription>
                  Suggestions to improve your profile visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Add a profile picture</p>
                    <p className="text-sm text-muted-foreground">
                      Profiles with photos get 3x more views
                    </p>
                  </div>
                  <Badge variant="secondary">Optional</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Complete your bio</p>
                    <p className="text-sm text-muted-foreground">
                      Tell others about your journey and goals
                    </p>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Add more skills</p>
                    <p className="text-sm text-muted-foreground">
                      Help others find you based on expertise
                    </p>
                  </div>
                  <Badge variant="success">Complete</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProfileContent />
    </Suspense>
  )
}