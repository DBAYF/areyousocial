// Posts hook with pagination and real-time updates

import { useState, useCallback, useEffect } from 'react'
import { postService } from '@/lib/firebase/firestore'
import type { Post, CreatePostData, UpdatePostData, PostFilters } from '@/lib/types/post'

interface UsePostsOptions {
  filters?: PostFilters
  limit?: number
  realtime?: boolean
}

export function usePosts(options: UsePostsOptions = {}) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [lastDoc, setLastDoc] = useState<any>(null)

  const { filters, limit = 20, realtime = false } = options

  const fetchPosts = useCallback(async (loadMore = false) => {
    setIsLoading(true)
    setError(null)

    try {
      let queryConstraints: any[] = []

      // Apply filters
      if (filters?.type?.length) {
        queryConstraints.push(where('type', 'in', filters.type))
      }

      if (filters?.author_id) {
        queryConstraints.push(where('author_id', '==', filters.author_id))
      }

      if (filters?.visibility) {
        queryConstraints.push(where('visibility', '==', filters.visibility))
      }

      // Add ordering
      queryConstraints.push(orderBy('created_at', 'desc'))

      if (loadMore && lastDoc) {
        queryConstraints.push(startAfter(lastDoc))
      }

      const result = await postService.queryPaginated(
        queryConstraints,
        { limit },
        loadMore ? { limit, startAfter: lastDoc } : undefined
      )

      if (loadMore) {
        setPosts(prev => [...prev, ...result.data])
      } else {
        setPosts(result.data)
      }

      setHasMore(result.hasMore)
      setLastDoc(result.lastDoc)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch posts'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [filters, limit, lastDoc])

  const createPost = useCallback(async (data: CreatePostData) => {
    setIsLoading(true)
    setError(null)

    try {
      const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      await postService.create(postId, data)

      // Refresh posts
      await fetchPosts()

      setIsLoading(false)
      return postId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [fetchPosts])

  const updatePost = useCallback(async (postId: string, data: UpdatePostData) => {
    setIsLoading(true)
    setError(null)

    try {
      await postService.update(postId, data)

      // Update local state
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, ...data } : post
      ))

      setIsLoading(false)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update post'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [])

  const deletePost = useCallback(async (postId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await postService.delete(postId)

      // Remove from local state
      setPosts(prev => prev.filter(post => post.id !== postId))

      setIsLoading(false)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete post'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [])

  // Set up real-time listener if enabled
  useEffect(() => {
    if (!realtime) return

    let queryConstraints: any[] = []

    // Apply filters for real-time updates
    if (filters?.type?.length) {
      queryConstraints.push(where('type', 'in', filters.type))
    }

    if (filters?.author_id) {
      queryConstraints.push(where('author_id', '==', filters.author_id))
    }

    if (filters?.visibility) {
      queryConstraints.push(where('visibility', '==', filters.visibility))
    }

    queryConstraints.push(orderBy('created_at', 'desc'))

    const unsubscribe = postService.listen(
      queryConstraints,
      (updatedPosts) => {
        setPosts(updatedPosts)
      },
      { limit }
    )

    return unsubscribe
  }, [realtime, filters, limit])

  return {
    posts,
    isLoading,
    error,
    hasMore,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    loadMore: () => fetchPosts(true),
  }
}

// Hook for single post
export function usePost(postId: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPost = useCallback(async () => {
    if (!postId) return

    setIsLoading(true)
    setError(null)

    try {
      const postData = await postService.get(postId)
      setPost(postData)
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch post'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return {
    data: post,
    isLoading,
    error,
    refetch: fetchPost,
  }
}