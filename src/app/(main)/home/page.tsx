// Home/Dashboard page
"use client"

import { useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import { PageContainer } from '@/components/layout/page-container'
import { RecommendationCard, ConnectionRecommendationCard, OpportunityRecommendationCard } from '@/components/recommendations/recommendation-card'
import { NextMovesPanel } from '@/components/recommendations/next-moves-panel'
import { QuickActions } from '@/components/recommendations/quick-actions'
import { useRecommendations } from '@/lib/hooks/use-recommendations'
import { useUiStore } from '@/lib/stores/ui-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { LoadingState } from '@/components/shared/loading-state'
import { EmptyState } from '@/components/shared/empty-state'
import {
  TrendingUp,
  Users,
  MessageSquare,
  Target,
  Calendar,
  Plus,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function HomePage() {
  const { recommendations, isLoading: recommendationsLoading } = useRecommendations()
  const { addToast } = useUiStore()
  const [activeTab, setActiveTab] = useState('overview')

  const handleRecommendationAction = (action: string) => {
    addToast({
      type: 'success',
      title: 'Action completed',
      description: `Recommendation ${action} completed successfully.`,
    })
  }

  const handleQuickAction = (actionId: string, action: string) => {
    addToast({
      type: 'info',
      title: 'Action triggered',
      description: `Quick action ${actionId} triggered.`,
    })
  }

  const handleNextMoveComplete = (moveId: string) => {
    addToast({
      type: 'success',
      title: 'Progress made!',
      description: 'Next move completed. Keep up the great work!',
    })
  }

  if (recommendationsLoading) {
    return (
      <PageContainer>
        <LoadingState message="Loading your dashboard..." />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here's what's happening in your entrepreneurial journey.
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Share Update
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-muted-foreground">Profile complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-xs text-muted-foreground">Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Messages</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Target className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-muted-foreground">Opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="recommendations">For You</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions - Left Column */}
              <div className="lg:col-span-1">
                <QuickActions onActionClick={handleQuickAction} />
              </div>

              {/* Main Content - Right Columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Next Moves */}
                <NextMovesPanel
                  nextMoves={[
                    {
                      id: '1',
                      user_id: 'current-user',
                      title: 'Complete your founder profile',
                      description: 'Add more details about your startup journey to attract better matches',
                      category: 'immediate' as const,
                      estimated_time: 'quick' as const,
                      difficulty: 'easy' as const,
                      impact: 'high' as const,
                      completed: false,
                      created_at: Timestamp.fromDate(new Date()),
                    },
                    {
                      id: '2',
                      user_id: 'current-user',
                      title: 'Connect with 3 fellow founders',
                      description: 'Expand your network by connecting with entrepreneurs in your industry',
                      category: 'immediate' as const,
                      estimated_time: 'hours' as const,
                      difficulty: 'medium' as const,
                      impact: 'high' as const,
                      completed: false,
                      created_at: Timestamp.fromDate(new Date()),
                    },
                    {
                      id: '3',
                      user_id: 'current-user',
                      title: 'Post about your startup journey',
                      description: 'Share your story and insights to help others and attract opportunities',
                      category: 'short_term' as const,
                      estimated_time: 'hours' as const,
                      difficulty: 'easy' as const,
                      impact: 'medium' as const,
                      completed: false,
                      created_at: Timestamp.fromDate(new Date()),
                    }
                  ]}
                  onMoveComplete={handleNextMoveComplete}
                />

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest interactions and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar size="sm" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Sarah Chen</span> sent you a connection request
                          </p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Accept
                        </Button>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Target className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            You applied to <span className="font-medium">Senior Product Manager</span> at TechCorp
                          </p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>

                      <div className="flex items-start gap-3">
                        <Avatar size="sm" />
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Mike Johnson</span> commented on your post
                          </p>
                          <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">AI Recommendations</h2>
                </div>

                <ConnectionRecommendationCard
                  recommendation={{} as any}
                  onAction={handleRecommendationAction}
                />

                <OpportunityRecommendationCard
                  recommendation={{} as any}
                  onAction={handleRecommendationAction}
                />

                <RecommendationCard
                  recommendation={{
                    id: '1',
                    user_id: 'user1',
                    type: 'skill_development',
                    title: 'Improve your pitch skills',
                    description: 'Based on your profile, consider taking a pitch training course to better communicate your vision.',
                    priority: 'medium',
                    category: 'Growth',
                    action_required: true,
                    action_url: '/courses/pitch-training',
                    action_text: 'Explore courses',
                    dismissed: false,
                    completed: false,
                    created_at: Timestamp.fromDate(new Date()),
                  }}
                  onAction={handleRecommendationAction}
                />
              </div>

              {/* Personalized Insights */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Personalized Insights</h2>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Network Growth</h3>
                        <p className="text-sm text-muted-foreground">
                          Your network has grown 23% this month. Keep connecting with relevant people!
                        </p>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Network Stats
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                        <Target className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Opportunity Match</h3>
                        <p className="text-sm text-muted-foreground">
                          You have 3 high-match opportunities in your area. Check them out!
                        </p>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Opportunities
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
                <CardDescription>
                  See what's happening in your network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyState
                  icon={<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">📊</div>}
                  title="Activity feed coming soon"
                  description="We'll show you updates from your connections and network here."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
}