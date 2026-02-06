// Profile CRUD operations hook

import { useState, useCallback } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { profileService } from '@/lib/firebase/firestore'
import { uploadAvatar } from '@/lib/firebase/storage'
import type { Profile, UpdateProfileData } from '@/lib/types/user'

export function useProfile(userId?: string) {
  const { user: currentUser, setProfile } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const targetUserId = userId || currentUser?.uid
  const isOwnProfile = !userId || userId === currentUser?.uid

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) return null

    setIsLoading(true)
    setError(null)

    try {
      const profile = await profileService.get(targetUserId)
      setIsLoading(false)
      return profile
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [targetUserId])

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    if (!targetUserId || !isOwnProfile) {
      setError('Cannot update profile')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      await profileService.update(targetUserId, data)

      // Update local store if it's the current user's profile
      if (isOwnProfile) {
        const currentProfile = await profileService.get(targetUserId)
        setProfile(currentProfile)
      }

      setIsLoading(false)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [targetUserId, isOwnProfile, setProfile])

  const uploadProfileAvatar = useCallback(async (file: File) => {
    if (!targetUserId || !isOwnProfile) {
      setError('Cannot upload avatar')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await uploadAvatar(targetUserId, file)

      // Update profile with new avatar URL
      await profileService.update(targetUserId, { avatar_url: result.url })

      // Update local store
      const currentProfile = await profileService.get(targetUserId)
      setProfile(currentProfile)

      setIsLoading(false)
      return result.url
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar'
      setError(errorMessage)
      setIsLoading(false)
      return null
    }
  }, [targetUserId, isOwnProfile, setProfile])

  const createProfile = useCallback(async (data: Omit<Profile, 'uid'>) => {
    if (!targetUserId || !isOwnProfile) {
      setError('Cannot create profile')
      return false
    }

    setIsLoading(true)
    setError(null)

    try {
      await profileService.create(targetUserId, data)

      // Update local store
      const profile = await profileService.get(targetUserId)
      setProfile(profile)

      setIsLoading(false)
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile'
      setError(errorMessage)
      setIsLoading(false)
      return false
    }
  }, [targetUserId, isOwnProfile, setProfile])

  return {
    fetchProfile,
    updateProfile,
    uploadProfileAvatar,
    createProfile,
    isLoading,
    error,
    isOwnProfile,
  }
}

// Hook for profile statistics
export function useProfileStats(userId?: string) {
  const [stats, setStats] = useState({
    connectionsCount: 0,
    postsCount: 0,
    followersCount: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    const targetId = userId
    if (!targetId) return

    setIsLoading(true)
    setError(null)

    try {
      // These would be implemented with actual queries
      // For now, return mock data
      setStats({
        connectionsCount: 42,
        postsCount: 15,
        followersCount: 128,
      })
      setIsLoading(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stats'
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [userId])

  return {
    stats,
    fetchStats,
    isLoading,
    error,
  }
}