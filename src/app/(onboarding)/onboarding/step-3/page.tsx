// Onboarding Step 3: Focus Areas
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile } from '@/lib/hooks/use-profile'
import { TagSelector } from '@/components/profile/tag-selector'
import { onboardingStep3Schema, type OnboardingStep3Data } from '@/lib/validations/profile-schemas'
import { LoadingState } from '@/components/shared/loading-state'
import { Target, Briefcase, Clock } from 'lucide-react'

export default function OnboardingStep3() {
  const router = useRouter()
  const { updateProfile, isLoading, error } = useProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OnboardingStep3Data>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      tags: [],
      title: '',
      years_experience: undefined,
      previous_companies: [],
    },
  })

  const tags = watch('tags')
  const previousCompanies = watch('previous_companies') || []

  const onSubmit = async (data: OnboardingStep3Data) => {
    setIsSubmitting(true)

    const success = await updateProfile({
      tags: data.tags,
      title: data.title,
      years_experience: data.years_experience,
      previous_companies: data.previous_companies,
    })

    if (success) {
      router.push('/onboarding/step-4')
    }

    setIsSubmitting(false)
  }

  const addCompany = () => {
    const newCompanies = [...previousCompanies, '']
    setValue('previous_companies', newCompanies)
  }

  const updateCompany = (index: number, value: string) => {
    const newCompanies = [...previousCompanies]
    newCompanies[index] = value
    setValue('previous_companies', newCompanies)
  }

  const removeCompany = (index: number) => {
    const newCompanies = previousCompanies.filter((_, i) => i !== index)
    setValue('previous_companies', newCompanies)
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Your interests and experience</h1>
        <p className="text-muted-foreground">
          Help us understand your background and what you're looking for
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tags/Interests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Interests & Skills
            </CardTitle>
            <CardDescription>
              Select areas that interest you or where you have expertise
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

        {/* Professional Experience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Professional Experience
            </CardTitle>
            <CardDescription>
              Tell us about your background (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Current/Previous Title</Label>
              <Input
                id="title"
                placeholder="Founder, Developer, Designer..."
                {...register('title')}
                error={errors.title?.message}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="years_experience" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Years of Experience
              </Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="50"
                placeholder="0"
                {...register('years_experience', { valueAsNumber: true })}
                error={errors.years_experience?.message}
              />
            </div>

            <div className="space-y-2">
              <Label>Previous Companies</Label>
              {previousCompanies.map((company, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Company name"
                    value={company}
                    onChange={(e) => updateCompany(index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCompany(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCompany}
                disabled={previousCompanies.length >= 5}
              >
                Add Company
              </Button>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/onboarding/step-2')}
          >
            Back
          </Button>
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