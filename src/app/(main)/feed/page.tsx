// Feed page showing posts with filtering and interactions
"use client"

import React, { useState, Suspense } from 'react'

// Type that matches PostCard expectations
interface PostCardData {
  id: string
  author_id: string
  author: {
    uid: string
    display_name: string
    username: string
    avatar_url?: string
    verified?: boolean
  }
  type: string
  title?: string
  content: string
  images?: string[]
  tags?: string[]
  stats: {
    likes_count: number
    comments_count: number
    shares_count: number
    views_count: number
  }
  liked_by_user?: boolean
  bookmarked_by_user?: boolean
  created_at: Date
  updated_at?: Date
}
import { PageContainer } from '@/components/layout/page-container'
import { PostComposer } from '@/components/feed/post-composer'
import { PostCard, PostCardSkeleton } from '@/components/feed/post-card'
import { FeedFilters, FeedFilterBar } from '@/components/feed/feed-filters'
import { usePosts } from '@/lib/hooks/use-posts'
import { useUiStore } from '@/lib/stores/ui-store'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/shared/loading-state'
import { EmptyState } from '@/components/shared/empty-state'
import { RefreshCw } from 'lucide-react'

// Mock post data
const mockPosts = [
  {
    id: '1',
    author_id: 'user1',
    author: {
      uid: 'user1',
      display_name: 'Alex Rodriguez',
      username: 'alexrodriguez',
      avatar_url: null,
      verified: true,
    },
    type: 'milestone',
    title: 'Reached 10,000 Users!',
    content: 'After 18 months of hard work, we finally hit our first major milestone. The journey has been incredible - from the initial idea to building an MVP, securing funding, and now serving thousands of users.\n\nThe biggest lesson: consistency and listening to users pays off. Thank you to our amazing team, advisors, and most importantly, our users for believing in us.',
    images: [],
    tags: ['milestone', 'growth', 'startup'],
    stats: {
      likes_count: 42,
      comments_count: 15,
      shares_count: 8,
      views_count: 1250,
    },
    liked_by_user: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    author_id: 'user2',
    author: {
      uid: 'user2',
      display_name: 'Sarah Chen',
      username: 'sarahchen',
      avatar_url: null,
      verified: true,
    },
    type: 'question',
    content: 'What are your thoughts on AI regulation in fintech? We\'re building AI-powered credit scoring and want to ensure compliance. Any experiences or recommendations?',
    images: [],
    tags: ['ai', 'fintech', 'regulation', 'compliance'],
    stats: {
      likes_count: 23,
      comments_count: 34,
      shares_count: 5,
      views_count: 892,
    },
    liked_by_user: true,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: '3',
    author_id: 'user3',
    author: {
      uid: 'user3',
      display_name: 'Mike Johnson',
      username: 'mikejohnson',
      avatar_url: null,
      verified: false,
    },
    type: 'opportunity',
    title: 'Senior Product Manager - HealthTech',
    content: 'We\'re looking for an experienced PM to lead our patient engagement platform. You\'ll work on:\n\n• Product strategy and roadmap\n• Cross-functional team leadership\n• User research and data analysis\n• Stakeholder management\n\n5+ years experience required. Competitive salary + equity.',
    images: [],
    tags: ['healthtech', 'product', 'remote', 'equity'],
    stats: {
      likes_count: 18,
      comments_count: 7,
      shares_count: 12,
      views_count: 567,
    },
    liked_by_user: false,
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: '4',
    author_id: 'user4',
    author: {
      uid: 'user4',
      display_name: 'Lisa Wong',
      username: 'lisawong',
      avatar_url: null,
      verified: false,
    },
    type: 'update',
    content: 'Just wrapped up our seed round! $2.5M led by great VCs who really get our vision. Time to scale the team and execute on our roadmap.\n\nHuge thanks to all the mentors and advisors who helped us get here. The entrepreneurial journey is tough but incredibly rewarding.',
    images: ['https://images.unsplash.com/photo-1553484771-047a44eee27b?w=400&h=300&fit=crop'],
    tags: ['funding', 'seed', 'growth', 'team'],
    stats: {
      likes_count: 67,
      comments_count: 28,
      shares_count: 15,
      views_count: 2100,
    },
    liked_by_user: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
]

interface FeedPageProps {
  searchParams: Promise<{
    compose?: string
    filter?: string
  }>
}

function FeedContent({ searchParams }: FeedPageProps) {
  const [searchParamsResolved, setSearchParamsResolved] = useState<{ compose?: string; filter?: string } | null>(null)

  // Resolve searchParams Promise
  React.useEffect(() => {
    searchParams.then(setSearchParamsResolved)
  }, [searchParams])

  const [showComposer, setShowComposer] = useState(false)

  // Update showComposer when searchParams are resolved
  React.useEffect(() => {
    if (searchParamsResolved) {
      setShowComposer(!!searchParamsResolved.compose)
    }
  }, [searchParamsResolved])
  const { posts, isLoading, error, hasMore, loadMore } = usePosts({
    limit: 10,
    realtime: true,
  })
  const { addToast } = useUiStore()

  // Transform posts to match PostCard interface
  const transformPost = (post: any): PostCardData => ({
    ...post,
    created_at: post.created_at instanceof Date ? post.created_at : new Date(post.created_at?.toDate?.() || post.created_at),
    updated_at: post.updated_at instanceof Date ? post.updated_at : new Date(post.updated_at?.toDate?.() || post.updated_at),
    stats: {
      likes_count: post.stats?.likes_count || 0,
      comments_count: post.stats?.comments_count || 0,
      shares_count: post.stats?.shares_count || 0,
      views_count: post.stats?.views_count || 0,
    }
  })

  // Use mock data if no real posts
  const displayPosts: PostCardData[] = posts.length > 0
    ? posts.map(transformPost)
    : mockPosts.map(transformPost)

  const [filters, setFilters] = useState<{
    type?: string[]
    visibility?: 'public' | 'connections' | 'all'
    sortBy?: 'recent' | 'popular' | 'trending'
    timeRange?: 'all' | 'today' | 'week' | 'month'
    tags?: string[]
  }>({
    sortBy: 'recent',
  })

  const handlePostSuccess = (postId: string) => {
    addToast({
      type: 'success',
      title: 'Post created',
      description: 'Your post has been shared with the community.',
    })
    setShowComposer(false)
  }

  const handleLike = (postId: string) => {
    // Handle like in real app
    console.log('Like post:', postId)
  }

  const handleBookmark = (postId: string) => {
    // Handle bookmark in real app
    console.log('Bookmark post:', postId)
  }

  const handleShare = (postId: string) => {
    // Handle share in real app
    console.log('Share post:', postId)
  }

  const handleReport = (postId: string) => {
    addToast({
      type: 'info',
      title: 'Report submitted',
      description: 'Thank you for helping keep our community safe.',
    })
  }

  const filteredPosts = displayPosts.filter(post => {
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(post.type)) return false
    }

    if (filters.tags && filters.tags.length > 0) {
      const postTags = post.tags || []
      if (!filters.tags.some(tag => postTags.includes(tag))) return false
    }

    return true
  })

  if (error) {
    return (
      <PageContainer>
        <EmptyState
          title="Failed to load feed"
          description="There was an error loading the posts. Please try again."
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Feed</h1>
          <Button
            variant="outline"
            onClick={() => setShowComposer(!showComposer)}
          >
            {showComposer ? 'Cancel' : 'Write Post'}
          </Button>
        </div>

        {/* Post Composer */}
        {showComposer && (
          <PostComposer
            onSuccess={handlePostSuccess}
            onCancel={() => setShowComposer(false)}
            placeholder="Share your thoughts, ask questions, or post opportunities..."
          />
        )}

        {/* Mobile Filter Bar */}
        <div className="md:hidden">
          <FeedFilterBar filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:block">
          <FeedFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableTags={['startup', 'funding', 'ai', 'healthtech', 'product', 'engineering', 'growth']}
          />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading && displayPosts.length === 0 ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              title="No posts found"
              description="Try adjusting your filters or check back later for new content."
              action={{
                label: "Create first post",
                onClick: () => setShowComposer(true),
              }}
            />
          ) : (
            <>
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onReport={handleReport}
                />
              ))}

              {/* Load More */}
              {hasMore && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load More Posts'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default function FeedPage({ searchParams }: FeedPageProps) {
  return (
    <Suspense fallback={<LoadingState />}>
      <FeedContent searchParams={searchParams} />
    </Suspense>
  )
}