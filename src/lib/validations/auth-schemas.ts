// Validation schemas for authentication forms

import { z } from 'zod'
import { isValidEmail, isValidUsername, isValidPassword } from '@/lib/utils/validators'

// Base auth schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^a-zA-Z\d]/, 'Password must contain at least one special character')

export const confirmPasswordSchema = z
  .string()
  .min(1, 'Please confirm your password')

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Sign up form schema
export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
      }),
    subscribeNewsletter: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SignupFormData = z.infer<typeof signupSchema>

// Password reset schema
export const resetPasswordSchema = z.object({
  email: emailSchema,
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: confirmPasswordSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// Update email schema
export const updateEmailSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required to change email'),
})

export type UpdateEmailFormData = z.infer<typeof updateEmailSchema>

// OAuth provider schema
export const oauthProviderSchema = z.enum(['google', 'apple'])

export type OAuthProvider = z.infer<typeof oauthProviderSchema>