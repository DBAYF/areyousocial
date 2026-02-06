// Comment section component for post comments

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatRelativeTime } from '@/lib/utils/format-date'
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Flag
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Mock comment data
interface Comment {
  id: string
  author: {
    uid: string
    display_name: string
    username: string
    avatar_url?: string
    verified?: boolean
  }
  content: string
  likes_count: number
  liked_by_user?: boolean
  created_at: Date
  replies?: Comment[]
  parent_id?: string
}

const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      uid: 'user2',
      display_name: 'Sarah Chen',
      username: 'sarahchen',
      avatar_url: null,
      verified: true,
    },
    content: 'This is amazing! Congratulations on the milestone. What was the biggest challenge you faced?',
    likes_count: 5,
    liked_by_user: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    replies: [
      {
        id: '1-1',
        author: {
          uid: 'user1',
          display_name: 'Alex Rodriguez',
          username: 'alexrodriguez',
          avatar_url: null,
          verified: false,
        },
        content: 'Thanks Sarah! The biggest challenge was definitely scaling the infrastructure while maintaining performance.',
        likes_count: 2,
        liked_by_user: true,
        created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        parent_id: '1',
      }
    ]
  },
  {
    id: '2',
    author: {
      uid: 'user3',
      display_name: 'Mike Johnson',
      username: 'mikejohnson',
      avatar_url: null,
      verified: false,
    },
    content: 'Great work! Any plans for expansion into new markets?',
    likes_count: 3,
    liked_by_user: false,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  }
]

interface CommentSectionProps {
  postId: string
  comments?: Comment[]
  onAddComment?: (postId: string, content: string, parentId?: string) => void
  onLikeComment?: (commentId: string) => void
  onReportComment?: (commentId: string) => void
}

export function CommentSection({
  postId,
  comments = mockComments,
  onAddComment,
  onLikeComment,
  onReportComment
}: CommentSectionProps) {
  const { user, profile } = useAuthStore()
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    onAddComment?.(postId, newComment.trim())
    setNewComment('')
  }

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return

    onAddComment?.(postId, replyContent.trim(), parentId)
    setReplyContent('')
    setReplyingTo(null)
  }

  return (
    <div className="space-y-4">
      {/* Add comment */}
      <div className="flex gap-3">
        <Avatar
          src={profile?.avatar_url}
          alt={profile?.display_name || user?.email || 'User'}
          size="sm"
        />
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
            className="resize-none"
          />
          {newComment.trim() && (
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSubmitComment}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Comment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={() => onLikeComment?.(comment.id)}
            onReply={() => setReplyingTo(comment.id)}
            onReport={() => onReportComment?.(comment.id)}
          />
        ))}
      </div>

      {/* Load more comments */}
      {comments.length > 0 && (
        <div className="text-center">
          <Button variant="ghost" size="sm">
            Load more comments
          </Button>
        </div>
      )}
    </div>
  )
}

interface CommentItemProps {
  comment: Comment
  onLike: () => void
  onReply: () => void
  onReport: () => void
  isReply?: boolean
}

function CommentItem({ comment, onLike, onReply, onReport, isReply = false }: CommentItemProps) {
  const { user } = useAuthStore()
  const [isLiked, setIsLiked] = useState(comment.liked_by_user || false)
  const [likesCount, setLikesCount] = useState(comment.likes_count)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const isOwnComment = user?.uid === comment.author.uid

  const handleLike = () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    onLike()
  }

  const handleSubmitReply = () => {
    if (!replyContent.trim()) return
    // Handle reply submission
    setReplyContent('')
    setShowReplyForm(false)
  }

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : ''}`}>
      <div className="flex gap-3">
        <Avatar
          src={comment.author.avatar_url}
          alt={comment.author.display_name}
          size="sm"
        />

        <div className="flex-1 space-y-2">
          {/* Comment header */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.display_name}</span>
            {comment.author.verified && (
              <span className="text-xs text-primary">✓</span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>

          {/* Comment content */}
          <p className="text-sm leading-relaxed">{comment.content}</p>

          {/* Comment actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 px-2 text-xs ${isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Heart className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likesCount > 0 && likesCount}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isOwnComment && (
                  <DropdownMenuItem>Edit comment</DropdownMenuItem>
                )}
                {!isOwnComment && (
                  <DropdownMenuItem onClick={onReport}>
                    <Flag className="w-4 h-4 mr-2" />
                    Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Reply form */}
          {showReplyForm && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <Textarea
                placeholder={`Reply to ${comment.author.display_name}...`}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={2}
                className="mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowReplyForm(false)
                    setReplyContent('')
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitReply}
                  disabled={!replyContent.trim()}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={() => onLikeComment?.(reply.id)}
              onReply={() => setReplyingTo(reply.id)}
              onReport={() => onReportComment?.(reply.id)}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  )
}