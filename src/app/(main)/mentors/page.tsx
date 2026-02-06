// Mentors page - browse and connect with mentors
"use client"

import { useState, Suspense } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { MentorCard, MentorCardSkeleton } from '@/components/mentors/mentor-card'
import { MentorFilters } from '@/components/mentors/mentor-filters'
import { IntroRequestFlow } from '@/components/mentors/intro-request-flow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingState } from '@/components/shared/loading-state'
import { EmptyState } from '@/components/shared/empty-state'
import { useUiStore } from '@/lib/stores/ui-store'
import {
  Search,
  Users,
  Star,
  TrendingUp,
  Award,
  Clock,
  MessageSquare,
  Filter,
  Plus,
  Crown,
} from 'lucide-react'

// Mock mentors data
const mockMentors = [
  {
    uid: 'mentor1',
    display_name: 'Sarah Chen',
    username: 'sarahchen',
    avatar_url: null,
    location: 'San Francisco, CA',
    title: 'VP of Product',
    company_name: 'TechFlow Inc.',
    bio: 'Former startup founder turned product executive. Helped 50+ founders navigate product-market fit challenges.',
    expertise: ['Product Strategy', 'User Research', 'Growth Hacking'],
    years_experience: 12,
    mentoring_experience: 8,
    available_for_mentoring: true,
    seeking_mentorship: false,
    mentoring_style: 'structured' as const,
    preferred_mentee_stage: ['mvp', 'early_traction', 'growth'] as const,
    languages_spoken: ['English', 'Mandarin'],
    rating: 4.9,
    mentees_helped: 47,
    response_time_hours: 4,
    hourly_rate: 150,
    verified: true,
    featured: true,
  },
  {
    uid: 'mentor2',
    display_name: 'Marcus Johnson',
    username: 'marcusjohnson',
    avatar_url: null,
    location: 'New York, NY',
    title: 'CEO & Co-founder',
    company_name: 'ScaleUp Ventures',
    bio: 'Serial entrepreneur who raised $50M+ in venture funding. Specializes in fundraising, team building, and scaling.',
    expertise: ['Fundraising', 'Team Building', 'Scaling', 'Leadership'],
    years_experience: 15,
    mentoring_experience: 6,
    available_for_mentoring: true,
    seeking_mentorship: false,
    mentoring_style: 'casual' as const,
    preferred_mentee_stage: ['early_traction', 'growth', 'scale'] as const,
    languages_spoken: ['English'],
    rating: 4.8,
    mentees_helped: 32,
    response_time_hours: 12,
    hourly_rate: 200,
    verified: true,
    featured: false,
  },
  {
    uid: 'mentor3',
    display_name: 'Dr. Emily Rodriguez',
    username: 'emilyrodriguez',
    avatar_url: null,
    location: 'Austin, TX',
    title: 'Chief Scientist',
    company_name: 'BioTech Solutions',
    bio: 'PhD in Biotechnology with 20+ years in life sciences. Helps founders navigate regulatory and scientific challenges.',
    expertise: ['Biotechnology', 'Regulatory', 'R&D', 'IP Strategy'],
    years_experience: 20,
    mentoring_experience: 10,
    available_for_mentoring: true,
    seeking_mentorship: false,
    mentoring_style: 'hands_on' as const,
    preferred_mentee_stage: ['idea', 'mvp'] as const,
    languages_spoken: ['English', 'Spanish'],
    rating: 4.7,
    mentees_helped: 28,
    response_time_hours: 24,
    hourly_rate: 175,
    verified: true,
    featured: false,
  },
  {
    uid: 'mentor4',
    display_name: 'Alex Kim',
    username: 'alexkim',
    avatar_url: null,
    location: 'Seattle, WA',
    title: 'Engineering Director',
    company_name: 'CloudScale',
    bio: 'Led engineering teams at 3 different unicorns. Expert in scaling engineering organizations and technical leadership.',
    expertise: ['Engineering Leadership', 'System Architecture', 'Team Scaling'],
    years_experience: 18,
    mentoring_experience: 7,
    available_for_mentoring: false,
    seeking_mentorship: false,
    mentoring_style: 'structured' as const,
    preferred_mentee_stage: ['growth', 'scale'] as const,
    languages_spoken: ['English', 'Korean'],
    rating: 4.9,
    mentees_helped: 41,
    response_time_hours: 6,
    verified: true,
    featured: false,
  },
]

function MentorsContent() {
  const [selectedMentor, setSelectedMentor] = useState<typeof mockMentors[0] | null>(null)
  const [showRequestFlow, setShowRequestFlow] = useState(false)
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    expertise: undefined as string[] | undefined,
    experience_level: undefined as string[] | undefined,
    availability: undefined as 'available' | 'waitlist' | 'unavailable' | undefined,
    mentoring_style: undefined as string[] | undefined,
    location: undefined as string[] | undefined,
    languages: undefined as string[] | undefined,
    rating: undefined as number | undefined,
    max_response_time: undefined as number | undefined,
    max_hourly_rate: undefined as number | undefined,
    verified_only: undefined as boolean | undefined,
    sort_by: 'relevance' as 'relevance' | 'rating' | 'experience' | 'response_time' | 'rate',
    sort_order: 'desc' as 'asc' | 'desc',
  })

  const { addToast } = useUiStore()

  const handleViewProfile = (mentorId: string) => {
    // Navigate to mentor profile
    console.log('View profile:', mentorId)
  }

  const handleConnect = (mentorId: string) => {
    const mentor = mockMentors.find(m => m.uid === mentorId)
    if (mentor) {
      setSelectedMentor(mentor)
      setShowRequestFlow(true)
    }
  }

  const handleMessage = (mentorId: string) => {
    // Navigate to messages
    console.log('Message mentor:', mentorId)
  }

  const handleRequestSubmit = (requestData: any) => {
    console.log('Mentorship request:', requestData)
    addToast({
      type: 'success',
      title: 'Request sent!',
      description: 'Your mentorship request has been submitted.',
    })
  }

  // Filter and sort mentors
  const filteredMentors = mockMentors.filter(mentor => {
    // Search filter
    if (searchQuery && !mentor.display_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }

    // Availability filter
    if (filters.availability) {
      const available = mentor.available_for_mentoring
      if (filters.availability === 'available' && !available) return false
      if (filters.availability === 'unavailable' && available) return false
    }

    // Verified filter
    if (filters.verified_only && !mentor.verified) return false

    // Rating filter
    if (filters.rating && mentor.rating < filters.rating) return false

    // Response time filter
    if (filters.max_response_time && mentor.response_time_hours > filters.max_response_time) return false

    // Hourly rate filter
    if (filters.max_hourly_rate && mentor.hourly_rate && mentor.hourly_rate > filters.max_hourly_rate) return false

    return true
  }).sort((a, b) => {
    switch (filters.sort_by) {
      case 'rating':
        return filters.sort_order === 'asc' ? a.rating - b.rating : b.rating - a.rating
      case 'experience':
        return filters.sort_order === 'asc' ? a.years_experience - b.years_experience : b.years_experience - a.years_experience
      case 'response_time':
        return filters.sort_order === 'asc' ? a.response_time_hours - b.response_time_hours : b.response_time_hours - a.response_time_hours
      case 'rate':
        const aRate = a.hourly_rate || 0
        const bRate = b.hourly_rate || 0
        return filters.sort_order === 'asc' ? aRate - bRate : bRate - aRate
      default: // relevance
        // Prioritize available mentors, then by rating
        if (a.available_for_mentoring && !b.available_for_mentoring) return -1
        if (!a.available_for_mentoring && b.available_for_mentoring) return 1
        return b.rating - a.rating
    }
  })

  const featuredMentors = filteredMentors.filter(m => m.featured)
  const regularMentors = filteredMentors.filter(m => !m.featured)

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mentors</h1>
            <p className="text-muted-foreground">
              Connect with experienced entrepreneurs and industry experts
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Become a Mentor
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">247</p>
                  <p className="text-xs text-muted-foreground">Active Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Star className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
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
                  <p className="text-2xl font-bold">1,200+</p>
                  <p className="text-xs text-muted-foreground">Mentees Helped</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">6h</p>
                  <p className="text-xs text-muted-foreground">Avg Response</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <MentorFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableExpertise={[
                'Product Management', 'Engineering', 'Design', 'Marketing', 'Sales',
                'Finance', 'Legal', 'Operations', 'AI/ML', 'Healthcare', 'Fintech',
                'E-commerce', 'SaaS', 'Startup Growth', 'Fundraising', 'Team Building'
              ]}
            />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search mentors by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">Browse All</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="my_mentors">My Mentors</TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-6">
                {/* Featured Mentors Banner */}
                {featuredMentors.length > 0 && (
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-primary" />
                        Featured Mentors
                      </CardTitle>
                      <CardDescription>
                        Highly rated mentors available for new relationships
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featuredMentors.map((mentor) => (
                          <MentorCard
                            key={mentor.uid}
                            mentor={mentor}
                            variant="compact"
                            onConnect={handleConnect}
                            onMessage={handleMessage}
                            onViewProfile={handleViewProfile}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* All Mentors Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      All Mentors ({filteredMentors.length})
                    </h2>
                  </div>

                  {filteredMentors.length === 0 ? (
                    <EmptyState
                      title="No mentors found"
                      description="Try adjusting your filters or search terms."
                      action={{
                        label: "Clear filters",
                        onClick: () => setFilters({}),
                      }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMentors.map((mentor) => (
                        <MentorCard
                          key={mentor.uid}
                          mentor={mentor}
                          onConnect={handleConnect}
                          onMessage={handleMessage}
                          onViewProfile={handleViewProfile}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="featured" className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {featuredMentors.map((mentor) => (
                    <MentorCard
                      key={mentor.uid}
                      mentor={mentor}
                      variant="featured"
                      onConnect={handleConnect}
                      onMessage={handleMessage}
                      onViewProfile={handleViewProfile}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="my_mentors" className="space-y-6">
                <EmptyState
                  title="No mentorship relationships yet"
                  description="Start by browsing mentors and sending connection requests."
                  action={{
                    label: "Browse mentors",
                    onClick: () => setActiveTab('browse'),
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Intro Request Flow Modal */}
      {selectedMentor && (
        <IntroRequestFlow
          mentor={{
            uid: selectedMentor.uid,
            display_name: selectedMentor.display_name,
            avatar_url: selectedMentor.avatar_url,
            title: selectedMentor.title,
            company_name: selectedMentor.company_name,
            expertise: selectedMentor.expertise,
          }}
          isOpen={showRequestFlow}
          onClose={() => {
            setShowRequestFlow(false)
            setSelectedMentor(null)
          }}
          onSubmit={handleRequestSubmit}
        />
      )}
    </PageContainer>
  )
}

export default function MentorsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <MentorsContent />
    </Suspense>
  )
}