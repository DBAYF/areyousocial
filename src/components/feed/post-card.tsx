// Post card component for displaying individual posts in the feed

import { useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useUiStore } from '@/lib/stores/ui-store'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PostTypeIndicator } from './post-type-selector'
import { CommentSection } from './comment-section'
import { formatDate, formatRelativeTime } from '@/lib/utils/format-date'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  Eye,
  TrendingUp
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PostCardProps {
  post: {
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
  showComments?: boolean
  onLike?: (postId: string) => void
  onBookmark?: (postId: string) => void
  onShare?: (postId: string) => void
  onReport?: (postId: string) => void
}

export function PostCard({
  post,
  showComments = false,
  onLike,
  onBookmark,
  onShare,
  onReport
}: PostCardProps) {
  const { user } = useAuthStore()
  const { addToast } = useUiStore()
  const [isLiked, setIsLiked] = useState(post.liked_by_user || false)
  const [isBookmarked, setIsBookmarked] = useState(post.bookmarked_by_user || false)
  const [likesCount, setLikesCount] = useState(post.stats.likes_count)
  const [showFullContent, setShowFullContent] = useState(false)
  const [showCommentSection, setShowCommentSection] = useState(showComments)

  const isOwnPost = user?.uid === post.author_id
  const shouldTruncate = post.content.length > 300
  const displayContent = showFullContent || !shouldTruncate
    ? post.content
    : post.content.slice(0, 300) + '...'

  const handleLike = async () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)

    try {
      onLike?.(post.id)
    } catch (error) {
      // Revert on error
      setIsLiked(!newLiked)
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
      addToast({
        type: 'error',
        title: 'Failed to like post',
        description: 'Please try again.',
      })
    }
  }

  const handleBookmark = async () => {
    const newBookmarked = !isBookmarked
    setIsBookmarked(newBookmarked)

    try {
      onBookmark?.(post.id)
    } catch (error) {
      // Revert on error
      setIsBookmarked(!newBookmarked)
      addToast({
        type: 'error',
        title: 'Failed to bookmark post',
        description: 'Please try again.',
      })
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${post.author.display_name}'s post`,
        text: post.content.slice(0, 100) + (post.content.length > 100 ? '...' : ''),
        url: `${window.location.origin}/post/${post.id}`,
      })
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)
      addToast({
        type: 'success',
        title: 'Link copied',
        description: 'Post link has been copied to clipboard.',
      })
    }

    onShare?.(post.id)
  }

  const handleReport = () => {
    onReport?.(post.id)
    addToast({
      type: 'info',
      title: 'Report submitted',
      description: 'Thank you for helping keep our community safe.',
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${post.author.uid}`}>
              <Avatar
                src={post.author.avatar_url}
                alt={post.author.display_name}
                size="sm"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${post.author.uid}`}
                  className="font-semibold hover:underline"
                >
                  {post.author.display_name}
                </Link>
                {post.author.verified && (
                  <Badge variant="verified" className="text-xs">✓</Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href={`/profile/${post.author.uid}`}
                  className="hover:underline"
                >
                  @{post.author.username}
                </Link>
                <span>•</span>
                <span title={formatDate(post.created_at)}>
                  {formatRelativeTime(post.created_at)}
                </span>
                <PostTypeIndicator type={post.type} />
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isOwnPost && (
                <DropdownMenuItem>
                  Edit post
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleBookmark}>
                <Bookmark className="w-4 h-4 mr-2" />
                {isBookmarked ? 'Remove bookmark' : 'Bookmark'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              {!isOwnPost && (
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post title for certain types */}
        {post.title && (
          <h3 className="text-lg font-semibold mt-2">{post.title}</h3>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post content */}
        <div className="space-y-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>

          {shouldTruncate && !showFullContent && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowFullContent(true)}
              className="p-0 h-auto text-primary"
            >
              Read more
            </Button>
          )}

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-2 rounded-lg overflow-hidden ${
              post.images.length === 1 ? 'grid-cols-1' :
              post.images.length === 2 ? 'grid-cols-2' :
              'grid-cols-2'
            }`}>
              {post.images.slice(0, 4).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity cursor-pointer"
                  onClick={() => {
                    // Open image modal or lightbox
                    console.log('Open image:', image)
                  }}
                />
              ))}
              {post.images.length > 4 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  +{post.images.length - 4} more
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Engagement stats */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.stats.views_count.toLocaleString()}</span>
            </div>

            {post.stats.likes_count > 0 && (
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{likesCount.toLocaleString()}</span>
              </div>
            )}

            {post.stats.comments_count > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.stats.comments_count.toLocaleString()}</span>
              </div>
            )}

            {post.stats.shares_count > 0 && (
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4" />
                <span>{post.stats.shares_count.toLocaleString()}</span>
              </div>
            )}
          </div>

          {post.stats.likes_count > 10 && (
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">Popular</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount > 0 && <span>{likesCount}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCommentSection(!showCommentSection)}
              className="gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {post.stats.comments_count > 0 && <span>{post.stats.comments_count}</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              {post.stats.shares_count > 0 && <span>{post.stats.shares_count}</span>}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={isBookmarked ? 'text-primary' : ''}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Comments section */}
        {showCommentSection && (
          <div className="mt-4 pt-4 border-t">
            <CommentSection postId={post.id} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Skeleton for post card loading state
export function PostCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
            <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        </div>

        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded animate-pulse w-16" />
          <div className="h-6 bg-muted rounded animate-pulse w-20" />
        </div>

        <div className="flex gap-4">
          <div className="h-8 bg-muted rounded animate-pulse w-16" />
          <div className="h-8 bg-muted rounded animate-pulse w-16" />
          <div className="h-8 bg-muted rounded animate-pulse w-16" />
        </div>
      </CardContent>
    </Card>
  )
}