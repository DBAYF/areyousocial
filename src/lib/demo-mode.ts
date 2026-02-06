// Demo mode - runs ReMake without Firebase for UI demonstration

import { useState, useEffect } from 'react'

// Mock user data
export const mockUser = {
  uid: 'demo-user',
  displayName: 'Demo User',
  email: 'demo@example.com',
  photoURL: null,
  emailVerified: true,
}

// Mock posts data
export const mockPosts = [
  {
    id: 'post1',
    title: 'Building my first startup',
    content: 'Excited to share that I just launched my first startup! It\'s been an incredible journey learning about product development, customer acquisition, and scaling a team.',
    author_id: 'demo-user',
    author_name: 'Demo User',
    created_at: new Date(Date.now() - 3600000), // 1 hour ago
    likes_count: 12,
    comments_count: 5,
    type: 'update',
  },
  {
    id: 'post2',
    title: 'Looking for co-founder',
    content: 'Seeking a technical co-founder for my AI-powered healthcare platform. I handle business/product, you handle tech. Serious inquiries only.',
    author_id: 'demo-user2',
    author_name: 'Sarah Chen',
    created_at: new Date(Date.now() - 7200000), // 2 hours ago
    likes_count: 8,
    comments_count: 3,
    type: 'opportunity',
  },
]

// Mock hook for demo mode
export function useDemoAuth() {
  const [user, setUser] = useState(mockUser)
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setUser(mockUser)
    setLoading(false)
  }

  const signOut = async () => {
    setUser(null)
  }

  return { user, loading, signIn, signOut }
}

// Mock posts hook
export function useDemoPosts() {
  const [posts, setPosts] = useState(mockPosts)
  const [loading, setLoading] = useState(false)

  const fetchPosts = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setLoading(false)
  }

  const createPost = async (postData: any) => {
    const newPost = {
      id: `post${Date.now()}`,
      ...postData,
      author_id: mockUser.uid,
      author_name: mockUser.displayName,
      created_at: new Date(),
      likes_count: 0,
      comments_count: 0,
    }
    setPosts(prev => [newPost, ...prev])
  }

  return { posts, loading, fetchPosts, createPost }
}

// Demo mode flag
export const DEMO_MODE = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEMO_MODE === 'true'