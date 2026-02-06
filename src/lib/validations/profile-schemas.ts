// Validation schemas for profile forms and onboarding

import { z } from 'zod'
import { USER_STAGES, USER_TAGS } from '@/lib/utils/constants'
import {
  isValidUsername,
  isValidUrl,
  validateTags,
  isValidExperienceYears,
  sanitizeText
} from '@/lib/utils/validators'

// Base profile field schemas
export const displayNameSchema = z
  .string()
  .min(1, 'Display name is required')
  .max(50, 'Display name must be less than 50 characters')
  .transform(sanitizeText)

export const usernameSchema = z
  .string()
  .min(1, 'Username is required')
  .refine(isValidUsername, 'Username must be 3-30 characters, alphanumeric with underscores and dashes only')

export const bioSchema = z
  .string()
  .max(500, 'Bio must be less than 500 characters')
  .optional()
  .transform(val => val ? sanitizeText(val) : undefined)

export const locationSchema = z
  .string()
  .max(100, 'Location must be less than 100 characters')
  .optional()
  .transform(val => val ? sanitizeText(val) : undefined)

export const websiteSchema = z
  .string()
  .optional()
  .refine(val => !val || isValidUrl(val), 'Please enter a valid website URL')

export const linkedinSchema = z
  .string()
  .optional()
  .refine(val => !val || /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(val),
    'Please enter a valid LinkedIn profile URL')

export const twitterHandleSchema = z
  .string()
  .optional()
  .transform(val => val ? val.replace(/^@/, '') : undefined)
  .refine(val => !val || /^[a-zA-Z0-9_]{1,15}$/.test(val),
    'Twitter handle must be 1-15 characters, alphanumeric with underscores only')

export const companyNameSchema = z
  .string()
  .max(100, 'Company name must be less than 100 characters')
  .optional()
  .transform(val => val ? sanitizeText(val) : undefined)

export const companyDescriptionSchema = z
  .string()
  .max(1000, 'Company description must be less than 1000 characters')
  .optional()
  .transform(val => val ? sanitizeText(val) : undefined)

export const companyWebsiteSchema = z
  .string()
  .optional()
  .refine(val => !val || isValidUrl(val), 'Please enter a valid company website URL')

export const companyStageSchema = z
  .enum([
    USER_STAGES.IDEA,
    USER_STAGES.MVP,
    USER_STAGES.EARLY_TRACTION,
    USER_STAGES.GROWTH,
    USER_STAGES.SCALE,
    USER_STAGES.EXIT,
  ])

export const industrySchema = z
  .array(z.string())
  .min(1, 'Please select at least one industry')
  .max(5, 'Please select no more than 5 industries')

export const tagsSchema = z
  .array(z.enum([
    USER_TAGS.PRODUCT,
    USER_TAGS.ENGINEERING,
    USER_TAGS.DESIGN,
    USER_TAGS.MARKETING,
    USER_TAGS.SALES,
    USER_TAGS.FINANCE,
    USER_TAGS.LEGAL,
    USER_TAGS.OPERATIONS,
    USER_TAGS.SAAS,
    USER_TAGS.ECOMMERCE,
    USER_TAGS.FINTECH,
    USER_TAGS.HEALTHTECH,
    USER_TAGS.EDTECH,
    USER_TAGS.FOODTECH,
    USER_TAGS.PROPTECH,
    USER_TAGS.GREENTECH,
    USER_TAGS.STARTUP,
    USER_TAGS.SCALEUP,
    USER_TAGS.ENTERPRISE,
    USER_TAGS.AI_ML,
    USER_TAGS.BLOCKCHAIN,
    USER_TAGS.IOT,
    USER_TAGS.MOBILE,
    USER_TAGS.WEB,
    USER_TAGS.DATA,
  ]))
  .min(1, 'Please select at least one tag')
  .max(10, 'Please select no more than 10 tags')

export const titleSchema = z
  .string()
  .max(100, 'Title must be less than 100 characters')
  .optional()
  .transform(val => val ? sanitizeText(val) : undefined)

export const experienceSchema = z
  .number()
  .min(0, 'Experience cannot be negative')
  .max(50, 'Experience cannot exceed 50 years')
  .optional()
  .refine(val => val === undefined || isValidExperienceYears(val), 'Invalid experience value')

export const previousCompaniesSchema = z
  .array(z.string().max(100, 'Company name must be less than 100 characters'))
  .max(10, 'Cannot add more than 10 previous companies')
  .optional()
  .transform(val => val ? val.map(sanitizeText) : undefined)

export const mentoringAvailabilitySchema = z.boolean()

export const mentorshipSeekingSchema = z.boolean()

export const opportunitiesOpenSchema = z.boolean()

// Onboarding step schemas

// Step 1: Basic info
export const onboardingStep1Schema = z.object({
  display_name: displayNameSchema,
  username: usernameSchema,
  bio: bioSchema.optional(),
  location: locationSchema.optional(),
  website: websiteSchema.optional(),
  linkedin_url: linkedinSchema.optional(),
  twitter_handle: twitterHandleSchema.optional(),
})

export type OnboardingStep1Data = z.infer<typeof onboardingStep1Schema>

// Step 2: Venture details
export const onboardingStep2Schema = z.object({
  company_name: companyNameSchema.optional(),
  company_description: companyDescriptionSchema.optional(),
  company_website: companyWebsiteSchema.optional(),
  company_stage: companyStageSchema,
  industry: industrySchema,
})

export type OnboardingStep2Data = z.infer<typeof onboardingStep2Schema>

// Step 3: Focus areas
export const onboardingStep3Schema = z.object({
  tags: tagsSchema,
  title: titleSchema.optional(),
  years_experience: experienceSchema.optional(),
  previous_companies: previousCompaniesSchema.optional(),
})

export type OnboardingStep3Data = z.infer<typeof onboardingStep3Schema>

// Step 4: Goals
export const onboardingStep4Schema = z.object({
  available_for_mentoring: mentoringAvailabilitySchema,
  seeking_mentorship: mentorshipSeekingSchema,
  open_to_opportunities: opportunitiesOpenSchema,
})

export type OnboardingStep4Data = z.infer<typeof onboardingStep4Schema>

// Complete profile schema
export const completeProfileSchema = z.object({
  display_name: displayNameSchema,
  username: usernameSchema,
  bio: bioSchema,
  location: locationSchema,
  website: websiteSchema,
  linkedin_url: linkedinSchema,
  twitter_handle: twitterHandleSchema,
  company_name: companyNameSchema,
  company_description: companyDescriptionSchema,
  company_website: companyWebsiteSchema,
  company_stage: companyStageSchema,
  industry: industrySchema,
  tags: tagsSchema,
  title: titleSchema,
  years_experience: experienceSchema,
  previous_companies: previousCompaniesSchema,
  available_for_mentoring: mentoringAvailabilitySchema,
  seeking_mentorship: mentorshipSeekingSchema,
  open_to_opportunities: opportunitiesOpenSchema,
})

export type CompleteProfileData = z.infer<typeof completeProfileSchema>