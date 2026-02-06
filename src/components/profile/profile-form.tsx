// Profile form component for editing user profiles

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TagSelector } from './tag-selector'
import { useProfile } from '@/lib/hooks/use-profile'
import { completeProfileSchema, type CompleteProfileData } from '@/lib/validations/profile-schemas'
import { USER_STAGES } from '@/lib/utils/constants'
import { LoadingState } from '@/components/shared/loading-state'
import { User, Building, Target, MapPin, Globe, Linkedin, Twitter, Save } from 'lucide-react'

interface ProfileFormProps {
  initialData?: Partial<CompleteProfileData>
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProfileForm({ initialData, onSuccess, onCancel }: ProfileFormProps) {
  const { updateProfile, isLoading, error } = useProfile()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm<CompleteProfileData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      display_name: initialData?.display_name || '',
      username: initialData?.username || '',
      bio: initialData?.bio || '',
      location: initialData?.location || '',
      website: initialData?.website || '',
      linkedin_url: initialData?.linkedin_url || '',
      twitter_handle: initialData?.twitter_handle || '',
      company_name: initialData?.company_name || '',
      company_description: initialData?.company_description || '',
      company_website: initialData?.company_website || '',
      company_stage: initialData?.company_stage || USER_STAGES.IDEA,
      industry: initialData?.industry || [],
      tags: initialData?.tags || [],
      title: initialData?.title || '',
      years_experience: initialData?.years_experience || undefined,
      previous_companies: initialData?.previous_companies || [],
      available_for_mentoring: initialData?.available_for_mentoring || false,
      seeking_mentorship: initialData?.seeking_mentorship || false,
      open_to_opportunities: initialData?.open_to_opportunities || false,
    },
  })

  const tags = watch('tags')
  const availableForMentoring = watch('available_for_mentoring')
  const seekingMentorship = watch('seeking_mentorship')
  const openToOpportunities = watch('open_to_opportunities')

  const onSubmit = async (data: CompleteProfileData) => {
    const success = await updateProfile(data)
    if (success) {
      onSuccess?.()
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
          <CardDescription>
            Your public profile information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name *</Label>
              <Input
                id="display_name"
                placeholder="Your full name"
                {...register('display_name')}
                error={errors.display_name?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                placeholder="yourusername"
                {...register('username')}
                error={errors.username?.message}
              />
              <p className="text-xs text-muted-foreground">
                Your unique identifier: @{watch('username') || 'username'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell others about yourself..."
              {...register('bio')}
              error={errors.bio?.message}
              showCharCount
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, Country"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin_url"
                placeholder="https://linkedin.com/in/yourprofile"
                {...register('linkedin_url')}
                error={errors.linkedin_url?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter_handle" className="flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter Handle
              </Label>
              <Input
                id="twitter_handle"
                placeholder="@yourhandle"
                {...register('twitter_handle')}
                error={errors.twitter_handle?.message}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Professional Information
          </CardTitle>
          <CardDescription>
            Your work experience and company details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Current Title</Label>
            <Input
              id="title"
              placeholder="Founder, Developer, Designer..."
              {...register('title')}
              error={errors.title?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name">Company Name</Label>
            <Input
              id="company_name"
              placeholder="Your company name"
              {...register('company_name')}
              error={errors.company_name?.message}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_description">Company Description</Label>
            <Textarea
              id="company_description"
              placeholder="Describe what your company does..."
              {...register('company_description')}
              error={errors.company_description?.message}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_website">Company Website</Label>
              <Input
                id="company_website"
                placeholder="https://yourcompany.com"
                {...register('company_website')}
                error={errors.company_website?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_stage">Company Stage</Label>
              <select
                id="company_stage"
                {...register('company_stage')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value={USER_STAGES.IDEA}>Idea Stage</option>
                <option value={USER_STAGES.MVP}>MVP</option>
                <option value={USER_STAGES.EARLY_TRACTION}>Early Traction</option>
                <option value={USER_STAGES.GROWTH}>Growth</option>
                <option value={USER_STAGES.SCALE}>Scale</option>
                <option value={USER_STAGES.EXIT}>Exit</option>
              </select>
              {errors.company_stage && (
                <p className="text-sm text-destructive">{errors.company_stage.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests & Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Interests & Skills
          </CardTitle>
          <CardDescription>
            Help others find you based on your interests and expertise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagSelector
            selectedTags={tags}
            onTagsChange={(newTags) => setValue('tags', newTags)}
            error={errors.tags?.message}
          />
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>
            Let others know how they can connect with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Available for mentoring</Label>
              <p className="text-sm text-muted-foreground">
                Help guide other founders with your experience
              </p>
            </div>
            <Switch
              checked={availableForMentoring}
              onCheckedChange={(checked) => setValue('available_for_mentoring', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Seeking mentorship</Label>
              <p className="text-sm text-muted-foreground">
                Get advice from experienced entrepreneurs
              </p>
            </div>
            <Switch
              checked={seekingMentorship}
              onCheckedChange={(checked) => setValue('seeking_mentorship', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Open to opportunities</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about relevant jobs and partnerships
              </p>
            </div>
            <Switch
              checked={openToOpportunities}
              onCheckedChange={(checked) => setValue('open_to_opportunities', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Error message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
          {error}
        </div>
      )}

      {/* Form actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}