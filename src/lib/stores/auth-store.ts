// Auth store using Zustand

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { User } from '@/lib/types/user'
import { signIn, signUp, signInWithGoogle, signInWithApple, signOutUser, resetPassword } from '@/lib/firebase/auth'
import { userService } from '@/lib/firebase/firestore'

interface AuthState {
  // State
  user: User | null
  profile: User['profile'] | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  setUser: (user: User | null) => void
  setProfile: (profile: User['profile'] | null) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        profile: null,
        isLoading: true,
        isAuthenticated: false,
        error: null,

        // Actions
        signIn: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const { user, error } = await signIn(email, password)
            if (error) {
              set({ error: error.message, isLoading: false })
              return
            }
            // User will be set via the auth listener
            set({ isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Sign in failed',
              isLoading: false
            })
          }
        },

        signUp: async (email: string, password: string) => {
          set({ isLoading: true, error: null })
          try {
            const { user, error } = await signUp(email, password)
            if (error) {
              set({ error: error.message, isLoading: false })
              return
            }
            // User will be set via the auth listener
            set({ isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Sign up failed',
              isLoading: false
            })
          }
        },

        signInWithGoogle: async () => {
          set({ isLoading: true, error: null })
          try {
            const { user, error } = await signInWithGoogle()
            if (error) {
              set({ error: error.message, isLoading: false })
              return
            }
            // User will be set via the auth listener
            set({ isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Google sign in failed',
              isLoading: false
            })
          }
        },

        signInWithApple: async () => {
          set({ isLoading: true, error: null })
          try {
            const { user, error } = await signInWithApple()
            if (error) {
              set({ error: error.message, isLoading: false })
              return
            }
            // User will be set via the auth listener
            set({ isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Apple sign in failed',
              isLoading: false
            })
          }
        },

        signOut: async () => {
          set({ isLoading: true, error: null })
          try {
            const { error } = await signOutUser()
            if (error) {
              set({ error: error.message, isLoading: false })
              return
            }
            // Clear state
            set({
              user: null,
              profile: null,
              isAuthenticated: false,
              isLoading: false
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Sign out failed',
              isLoading: false
            })
          }
        },

        resetPassword: async (email: string) => {
          set({ isLoading: true, error: null })
          try {
            const { error } = await resetPassword(email)
            if (error) {
              set({ error: error.message, isLoading: false })
              return
            }
            set({ isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Password reset failed',
              isLoading: false
            })
          }
        },

        setUser: (user: User | null) => {
          set({
            user,
            isAuthenticated: !!user,
            isLoading: false
          })
        },

        setProfile: (profile: User['profile'] | null) => {
          set({ profile })
        },

        setError: (error: string | null) => {
          set({ error })
        },

        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          // Only persist these fields
          user: state.user,
          profile: state.profile,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)

// Selectors
export const useAuthUser = () => useAuthStore((state) => state.user)
export const useAuthProfile = () => useAuthStore((state) => state.profile)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)