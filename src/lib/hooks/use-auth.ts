// Auth hook with Firebase listener
"use client"

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'
import { useAuthStore } from '@/lib/stores/auth-store'
import { userService, profileService } from '@/lib/firebase/firestore'
import type { User as FirebaseUser } from 'firebase/auth'

export function useAuth() {
  const {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
    setUser,
    setProfile,
    setLoading,
    setError,
  } = useAuthStore()

  useEffect(() => {
    // Set up Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const userData = await userService.get(firebaseUser.uid)

          if (userData) {
            setUser(userData)
          } else {
            // User exists in Firebase Auth but not in Firestore
            // This might happen during signup before profile creation
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              auth_providers: [],
              roles: {
                founder: false,
                mentor: false,
                admin: false,
                moderator: false,
              },
              status: 'active',
              created_at: new Date(),
              last_seen: new Date(),
              safety: {
                reports_count: 0,
                strikes: 0,
                risk_level: 'low',
              },
              notification_prefs: {
                email: {
                  connections: true,
                  messages: true,
                  opportunities: true,
                  recommendations: true,
                  system: true,
                },
                push: {
                  connections: true,
                  messages: true,
                  opportunities: true,
                  recommendations: true,
                  system: true,
                },
                in_app: {
                  connections: true,
                  messages: true,
                  opportunities: true,
                  recommendations: true,
                  system: true,
                },
              },
            })
          }

          // Try to fetch profile
          try {
            const profileData = await profileService.get(firebaseUser.uid)
            setProfile(profileData)
          } catch (profileError) {
            // Profile might not exist yet (during onboarding)
            console.warn('Profile not found:', profileError)
            setProfile(null)
          }
        } else {
          // User is signed out
          setUser(null)
          setProfile(null)
        }

        setLoading(false)
      } catch (error) {
        console.error('Auth state change error:', error)
        setError('Failed to load user data')
        setLoading(false)
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [setUser, setProfile, setLoading, setError])

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    error,
  }
}

// Hook for checking if user needs onboarding
export function useNeedsOnboarding() {
  const { user, profile } = useAuth()

  if (!user) return false
  if (!profile) return true // No profile means needs onboarding

  // Check if essential profile fields are filled
  const hasBasicInfo = profile.display_name && profile.username
  const hasBusinessInfo = profile.company_stage && profile.tags?.length

  return !hasBasicInfo || !hasBusinessInfo
}

// Hook for user permissions
export function usePermissions() {
  const { user } = useAuth()

  return {
    isFounder: user?.roles.founder || false,
    isMentor: user?.roles.mentor || false,
    isAdmin: user?.roles.admin || false,
    isModerator: user?.roles.moderator || false,
    canPost: user?.status === 'active',
    canConnect: user?.status === 'active',
    canMessage: user?.status === 'active',
    canAccessAdmin: user?.roles.admin || user?.roles.moderator || false,
  }
}