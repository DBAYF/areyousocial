// Opportunities page - main marketplace for jobs, investments, and partnerships
"use client"

import { useState, Suspense } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { OpportunityCard, OpportunityCardSkeleton } from '@/components/opportunities/opportunity-card'
import { OpportunityFilters, OpportunityFilterBar } from '@/components/opportunities/opportunity-filters'
import { OpportunityDetail } from '@/components/opportunities/opportunity-detail'
import { SaveLinkModal } from '@/components/opportunities/save-link-modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/shared/loading-state'
import { EmptyState } from '@/components/shared/empty-state'
import { useOpportunities } from '@/lib/hooks/use-opportunities'
import { useUiStore } from '@/lib/stores/ui-store'
import {
  Search,
  Filter,
  Plus,
  Bookmark,
  TrendingUp,
  Users,
  Target,
  Briefcase,
  ExternalLink,
  BarChart3,
} from 'lucide-react'

// Mock opportunities data
const mockOpportunities = [
  {
    id: '1',
    title: 'Senior Product Manager',
    description: 'Lead product strategy for our AI-powered healthcare platform. Work with cross-functional teams to deliver innovative solutions that improve patient outcomes.',
    type: 'job' as const,
    category: 'Healthcare',
    tags: ['product', 'ai', 'healthcare', 'leadership'],
    location: 'San Francisco, CA',
    remote_possible: true,
    work_arrangement: 'hybrid' as const,
    compensation_type: 'both' as const,
    salary_range: { min: 150000, max: 200000, currency: 'USD' },
    equity_range: { min: 0.5, max: 1.0 },
    experience_level: 'senior' as const,
    required_skills: ['Product Management', 'Agile', 'Data Analysis', 'Healthcare Domain'],
    preferred_skills: ['AI/ML', 'Startup Experience', 'Technical Background'],
    creator: {
      uid: 'user1',
      display_name: 'Sarah Chen',
      company_name: 'MediFlow',
      avatar_url: null,
      verified: true,
    },
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views_count: 234,
    applications_count: 12,
    featured: true,
  },
  {
    id: '2',
    title: 'Seed Investment Opportunity',
    description: 'Join our mission to revolutionize sustainable energy storage. We\'re seeking strategic investors who understand the cleantech market and want to be part of the green revolution.',
    type: 'investment' as const,
    category: 'Clean Energy',
    tags: ['cleantech', 'sustainability', 'investment', 'green'],
    location: 'Austin, TX',
    remote_possible: false,
    work_arrangement: 'onsite' as const,
    equity_range: { min: 5, max: 10 },
    experience_level: 'executive' as const,
    creator: {
      uid: 'user2',
      display_name: 'Mike Johnson',
      company_name: 'GreenStorage Inc.',
      avatar_url: null,
      verified: true,
    },
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    views_count: 456,
    applications_count: 8,
    featured: false,
  },
  {
    id: '3',
    title: 'Partnership: AI Content Platform',
    description: 'We\'re looking for marketing agencies and content creators to partner with our AI writing platform. Help us reach more users while monetizing your audience.',
    type: 'partnership' as const,
    category: 'Marketing',
    tags: ['partnership', 'marketing', 'ai', 'content'],
    remote_possible: true,
    work_arrangement: 'remote' as const,
    experience_level: 'mid' as const,
    creator: {
      uid: 'user3',
      display_name: 'Lisa Wong',
      company_name: 'WriteAI',
      avatar_url: null,
      verified: false,
    },
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    views_count: 123,
    applications_count: 15,
    featured: false,
  },
  {
    id: '4',
    title: 'Frontend Developer',
    description: 'Build the next generation of fintech applications. Work with modern technologies including React, TypeScript, and cloud infrastructure.',
    type: 'job' as const,
    category: 'Technology',
    tags: ['frontend', 'react', 'typescript', 'fintech'],
    location: 'New York, NY',
    remote_possible: true,
    work_arrangement: 'hybrid' as const,
    compensation_type: 'both' as const,
    salary_range: { min: 120000, max: 160000, currency: 'USD' },
    equity_range: { min: 0.25, max: 0.5 },
    experience_level: 'mid' as const,
    required_skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
    preferred_skills: ['Next.js', 'Tailwind CSS', 'GraphQL'],
    creator: {
      uid: 'user4',
      display_name: 'David Kim',
      company_name: 'FinTech Solutions',
      avatar_url: null,
      verified: true,
    },
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    views_count: 345,
    applications_count: 23,
    featured: false,
  },
]

function OpportunitiesContent() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof mockOpportunities[0] | null>(null)
  const [showSaveLinkModal, setShowSaveLinkModal] = useState(false)
  const [activeTab, setActiveTab] = useState('browse')
  const [filters, setFilters] = useState({
    search: '',
    type: undefined as string[] | undefined,
    location: undefined as string[] | undefined,
    remote_possible: undefined as boolean | undefined,
    experience_level: undefined as string[] | undefined,
    salary_range: undefined,
    tags: undefined as string[] | undefined,
    sort_by: 'relevance' as 'relevance' | 'date' | 'salary' | 'applications',
    sort_order: 'desc' as 'asc' | 'desc',
  })

  const { opportunities, isLoading, error } = useOpportunities(filters)
  const { addToast } = useUiStore()

  // Use mock data if no real opportunities
  const displayOpportunities = opportunities.length > 0 ? opportunities : mockOpportunities

  const handleViewOpportunity = (opportunityId: string) => {
    const opportunity = displayOpportunities.find(opp => opp.id === opportunityId)
    if (opportunity) {
      setSelectedOpportunity(opportunity)
    }
  }

  const handleApply = (opportunityId: string) => {
    addToast({
      type: 'success',
      title: 'Application started',
      description: 'Redirecting to application form...',
    })
    // In real app, navigate to application form
  }

  const handleSave = (opportunityId: string) => {
    addToast({
      type: 'success',
      title: 'Opportunity saved',
      description: 'Added to your saved opportunities.',
    })
  }

  const handleShare = (opportunityId: string) => {
    addToast({
      type: 'info',
      title: 'Link copied',
      description: 'Opportunity link copied to clipboard.',
    })
  }

  const handleReport = (opportunityId: string) => {
    addToast({
      type: 'info',
      title: 'Report submitted',
      description: 'Thank you for helping keep our community safe.',
    })
  }

  const handleSaveExternalLink = (data: any) => {
    console.log('Save external opportunity:', data)
    // Handle saving external opportunity
  }

  const filteredOpportunities = displayOpportunities.filter(opp => {
    // Apply search filter
    if (filters.search && !opp.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !opp.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }

    // Apply type filter
    if (filters.type && filters.type.length > 0 && !filters.type.includes(opp.type)) {
      return false
    }

    // Apply location filter
    if (filters.location && filters.location.length > 0) {
      const hasMatchingLocation = filters.location.some(loc =>
        opp.location?.toLowerCase().includes(loc.toLowerCase()) ||
        (loc === 'Remote' && opp.remote_possible)
      )
      if (!hasMatchingLocation) return false
    }

    // Apply remote filter
    if (filters.remote_possible !== undefined && opp.remote_possible !== filters.remote_possible) {
      return false
    }

    // Apply experience level filter
    if (filters.experience_level && filters.experience_level.length > 0 &&
        !filters.experience_level.includes(opp.experience_level)) {
      return false
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      const oppTags = opp.tags || []
      if (!filters.tags.some(tag => oppTags.includes(tag))) return false
    }

    return true
  })

  // Sort opportunities
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    switch (filters.sort_by) {
      case 'date':
        return filters.sort_order === 'asc'
          ? a.created_at.getTime() - b.created_at.getTime()
          : b.created_at.getTime() - a.created_at.getTime()
      case 'salary':
        const aSalary = a.salary_range?.max || 0
        const bSalary = b.salary_range?.max || 0
        return filters.sort_order === 'asc' ? aSalary - bSalary : bSalary - aSalary
      case 'applications':
        return filters.sort_order === 'asc'
          ? a.applications_count - b.applications_count
          : b.applications_count - a.applications_count
      default: // relevance
        // For demo, prioritize featured, then by creation date
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.created_at.getTime() - a.created_at.getTime()
    }
  })

  const featuredOpportunities = sortedOpportunities.filter(opp => opp.featured)
  const regularOpportunities = sortedOpportunities.filter(opp => !opp.featured)

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          title="Failed to load opportunities"
          description="There was an error loading opportunities. Please try again."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Opportunities</h1>
            <p className="text-muted-foreground">
              Discover jobs, investments, and partnerships in the entrepreneurial ecosystem
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSaveLinkModal(true)}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Save Link
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Post Opportunity
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">247</p>
                  <p className="text-xs text-muted-foreground">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89</p>
                  <p className="text-xs text-muted-foreground">Investments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Users className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-xs text-muted-foreground">Partnerships</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">73%</p>
                  <p className="text-xs text-muted-foreground">Response Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <OpportunityFilters
              filters={filters}
              onFiltersChange={setFilters}
              availableTags={['product', 'engineering', 'design', 'marketing', 'sales', 'finance', 'legal', 'operations', 'ai', 'healthcare', 'fintech', 'saas', 'startup', 'scaleup']}
            />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Bar */}
            <div className="lg:hidden mb-4">
              <OpportunityFilterBar
                filters={filters}
                onFiltersChange={setFilters}
                availableTags={['product', 'engineering', 'design', 'marketing', 'ai', 'healthcare']}
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse">Browse All</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="applied">Applied</TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-6">
                {/* Featured Opportunities */}
                {featuredOpportunities.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">Featured Opportunities</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {featuredOpportunities.map((opportunity) => (
                        <OpportunityCard
                          key={opportunity.id}
                          opportunity={opportunity}
                          variant="featured"
                          onView={handleViewOpportunity}
                          onApply={handleApply}
                          onSave={handleSave}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* All Opportunities */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      All Opportunities ({sortedOpportunities.length})
                    </h2>
                  </div>

                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <OpportunityCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : sortedOpportunities.length === 0 ? (
                    <EmptyState
                      title="No opportunities found"
                      description="Try adjusting your filters or check back later for new opportunities."
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sortedOpportunities.map((opportunity) => (
                        <OpportunityCard
                          key={opportunity.id}
                          opportunity={opportunity}
                          onView={handleViewOpportunity}
                          onApply={handleApply}
                          onSave={handleSave}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="saved" className="space-y-6">
                <EmptyState
                  title="No saved opportunities"
                  description="Save opportunities you're interested in to access them quickly later."
                  action={{
                    label: "Browse opportunities",
                    onClick: () => setActiveTab('browse'),
                  }}
                />
              </TabsContent>

              <TabsContent value="applied" className="space-y-6">
                <EmptyState
                  title="No applications yet"
                  description="Track your job applications and follow up on opportunities you've applied to."
                  action={{
                    label: "Browse opportunities",
                    onClick: () => setActiveTab('browse'),
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      {selectedOpportunity && (
        <OpportunityDetail
          opportunity={selectedOpportunity}
          isOpen={true}
          onClose={() => setSelectedOpportunity(null)}
          onApply={handleApply}
          onSave={handleSave}
          onShare={handleShare}
          onReport={handleReport}
        />
      )}

      {/* Save Link Modal */}
      <SaveLinkModal
        isOpen={showSaveLinkModal}
        onClose={() => setShowSaveLinkModal(false)}
        onSave={handleSaveExternalLink}
      />
    </PageContainer>
  )
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OpportunitiesContent />
    </Suspense>
  )
}