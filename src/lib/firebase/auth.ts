// Firebase Authentication helpers

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateEmail,
  deleteUser,
  GoogleAuthProvider,
  AppleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
  AuthError,
} from 'firebase/auth'
import { auth } from './config'

// Auth providers
export const googleProvider = new GoogleAuthProvider()
export const appleProvider = new AppleAuthProvider()

// Configure providers
googleProvider.setCustomParameters({
  prompt: 'select_account',
})

appleProvider.addScope('email')
appleProvider.addScope('name')

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

// Sign up with email and password
export async function signUp(email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

// Sign in with Apple
export async function signInWithApple() {
  try {
    const result = await signInWithPopup(auth, appleProvider)
    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error: error as AuthError }
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Send password reset email
export async function resetPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    return { error: null }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Update password (requires recent authentication)
export async function updateUserPassword(newPassword: string) {
  if (!auth.currentUser) {
    return { error: { code: 'auth/no-current-user' } as AuthError }
  }

  try {
    await updatePassword(auth.currentUser, newPassword)
    return { error: null }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Update email (requires recent authentication)
export async function updateUserEmail(newEmail: string) {
  if (!auth.currentUser) {
    return { error: { code: 'auth/no-current-user' } as AuthError }
  }

  try {
    await updateEmail(auth.currentUser, newEmail)
    return { error: null }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Delete user account
export async function deleteUserAccount() {
  if (!auth.currentUser) {
    return { error: { code: 'auth/no-current-user' } as AuthError }
  }

  try {
    await deleteUser(auth.currentUser)
    return { error: null }
  } catch (error) {
    return { error: error as AuthError }
  }
}

// Auth state listener
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!auth.currentUser
}

// Get ID token
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null

  try {
    return await auth.currentUser.getIdToken(forceRefresh)
  } catch (error) {
    console.error('Failed to get ID token:', error)
    return null
  }
}

// Auth error messages
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled.',
  'auth/account-exists-with-different-credential': 'Account exists with different sign-in method.',
  'auth/credential-already-in-use': 'This credential is already associated with another account.',
  'auth/requires-recent-login': 'Please sign in again to perform this action.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completion.',
}

// Get user-friendly error message
export function getAuthErrorMessage(error: AuthError): string {
  return AUTH_ERROR_MESSAGES[error.code] || 'An unexpected error occurred. Please try again.'
}