// Utility functions for validation and data sanitization

import { FILE_LIMITS } from './constants'

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Username validation (alphanumeric, underscore, dash, 3-30 chars)
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
  return usernameRegex.test(username)
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Phone number validation (basic)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// File validation
export function isValidImageFile(file: File): boolean {
  return FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type) &&
         file.size <= FILE_LIMITS.MAX_AVATAR_SIZE
}

export function isValidPostImageFile(file: File): boolean {
  return FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type) &&
         file.size <= FILE_LIMITS.MAX_POST_IMAGE_SIZE
}

// Password strength validation
export function getPasswordStrength(password: string): {
  score: number
  feedback: string[]
} {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score++
  else feedback.push('At least 8 characters')

  if (/[a-z]/.test(password)) score++
  else feedback.push('Lowercase letter')

  if (/[A-Z]/.test(password)) score++
  else feedback.push('Uppercase letter')

  if (/\d/.test(password)) score++
  else feedback.push('Number')

  if (/[^a-zA-Z\d]/.test(password)) score++
  else feedback.push('Special character')

  return { score, feedback }
}

// Text sanitization
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>{}]/g, '') // Remove potentially dangerous characters
}

// Company name validation
export function isValidCompanyName(name: string): boolean {
  return name.length >= 2 && name.length <= 100 && /^[a-zA-Z0-9\s&.-]+$/.test(name)
}

// Bio validation
export function isValidBio(bio: string): boolean {
  return bio.length <= 500 // Max 500 characters
}

// Website URL validation with common prefixes
export function normalizeWebsiteUrl(url: string): string | null {
  if (!url.trim()) return null

  let normalizedUrl = url.trim()

  // Add protocol if missing
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  // Validate the URL
  try {
    const urlObj = new URL(normalizedUrl)
    return urlObj.toString()
  } catch {
    return null
  }
}

// LinkedIn URL validation
export function isValidLinkedInUrl(url: string): boolean {
  const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/
  return linkedinRegex.test(url)
}

// Twitter handle validation
export function normalizeTwitterHandle(handle: string): string | null {
  if (!handle.trim()) return null

  // Remove @ if present
  const cleanHandle = handle.replace(/^@/, '')

  // Validate handle format
  if (!/^[a-zA-Z0-9_]{1,15}$/.test(cleanHandle)) {
    return null
  }

  return cleanHandle
}

// Tag validation
export function validateTags(tags: string[], maxTags: number = 10): {
  valid: string[]
  invalid: string[]
} {
  const valid: string[] = []
  const invalid: string[] = []

  for (const tag of tags.slice(0, maxTags)) {
    const cleanTag = tag.trim().toLowerCase()
    if (cleanTag.length >= 2 && cleanTag.length <= 30 && /^[a-zA-Z0-9\s\-_]+$/.test(cleanTag)) {
      valid.push(cleanTag)
    } else {
      invalid.push(tag)
    }
  }

  return { valid, invalid }
}

// Experience years validation
export function isValidExperienceYears(years: number): boolean {
  return Number.isInteger(years) && years >= 0 && years <= 50
}

// Salary range validation
export function isValidSalaryRange(min: number, max: number, currency: string): boolean {
  const validCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  return min > 0 && max > min && max <= 10000000 && validCurrencies.includes(currency.toUpperCase())
}

// Equity range validation
export function isValidEquityRange(min: number, max: number): boolean {
  return min >= 0 && max > min && max <= 100
}