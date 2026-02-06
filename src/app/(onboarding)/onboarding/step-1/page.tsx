// Onboarding Step 1: Basic Info
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile } from '@/lib/hooks/use-profile'
import { onboardingStep1Schema, type OnboardingStep1Data } from '@/lib/validations/profile-schemas'
import { LoadingState } from '@/components/shared/loading-state'
import { User, MapPin, Globe, Linkedin, Twitter } from 'lucide-react'

export default function OnboardingStep1() {
  const router = useRouter()
  const { updateProfile, isLoading, error } = useProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OnboardingStep1Data>({
    resolver: zodResolver(onboardingStep1Schema),
    defaultValues: {
      display_name: '',
      username: '',
      bio: '',
      location: '',
      website: '',
      linkedin_url: '',
      twitter_handle: '',
    },
  })

  const displayName = watch('display_name')

  const onSubmit = async (data: OnboardingStep1Data) => {
    setIsSubmitting(true)

    const success = await updateProfile({
      display_name: data.display_name,
      username: data.username,
      bio: data.bio,
      location: data.location,
      website: data.website,
      linkedin_url: data.linkedin_url,
      twitter_handle: data.twitter_handle,
    })

    if (success) {
      router.push('/onboarding/step-2')
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Tell us about yourself</h1>
        <p className="text-muted-foreground">
          This information will be visible on your public profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Display Name and Username */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Your display name and unique username
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name *</Label>
                <Input
                  id="display_name"
                  placeholder="John Doe"
                  {...register('display_name')}
                  error={errors.display_name?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  {...register('username')}
                  error={errors.username?.message}
                />
                <p className="text-xs text-muted-foreground">
                  Your unique identifier: @{displayName?.toLowerCase().replace(/\s+/g, '') || 'username'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Bio</CardTitle>
            <CardDescription>
              Tell others about yourself in 500 characters or less
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="bio"
              placeholder="I'm a founder building the next generation of..."
              {...register('bio')}
              error={errors.bio?.message}
              showCharCount
              maxLength={500}
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Location and Website */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Location & Website
            </CardTitle>
            <CardDescription>
              Optional information to help others connect with you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  {...register('location')}
                  error={errors.location?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Website
                </Label>
                <Input
                  id="website"
                  placeholder="https://yourwebsite.com"
                  {...register('website')}
                  error={errors.website?.message}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Connect your professional profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedin_url"
                  placeholder="https://linkedin.com/in/username"
                  {...register('linkedin_url')}
                  error={errors.linkedin_url?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter_handle" className="flex items-center gap-2">
                  <Twitter className="w-4 h-4" />
                  Twitter
                </Label>
                <Input
                  id="twitter_handle"
                  placeholder="@username"
                  {...register('twitter_handle')}
                  error={errors.twitter_handle?.message}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}