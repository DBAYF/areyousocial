// Onboarding Step 2: Venture Details
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProfile } from '@/lib/hooks/use-profile'
import { onboardingStep2Schema, type OnboardingStep2Data } from '@/lib/validations/profile-schemas'
import { USER_STAGES } from '@/lib/utils/constants'
import { LoadingState } from '@/components/shared/loading-state'
import { Building, Globe } from 'lucide-react'

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'Real Estate',
  'Food & Beverage',
  'Transportation',
  'Energy',
  'Entertainment',
  'Other',
]

export default function OnboardingStep2() {
  const router = useRouter()
  const { updateProfile, isLoading, error } = useProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OnboardingStep2Data>({
    resolver: zodResolver(onboardingStep2Schema),
    defaultValues: {
      company_name: '',
      company_description: '',
      company_website: '',
      company_stage: USER_STAGES.IDEA,
      industry: [],
    },
  })

  const selectedIndustries = watch('industry')

  const onSubmit = async (data: OnboardingStep2Data) => {
    setIsSubmitting(true)

    const success = await updateProfile({
      company_name: data.company_name,
      company_description: data.company_description,
      company_website: data.company_website,
      company_stage: data.company_stage,
      industry: data.industry,
    })

    if (success) {
      router.push('/onboarding/step-3')
    }

    setIsSubmitting(false)
  }

  const toggleIndustry = (industry: string) => {
    const current = selectedIndustries || []
    if (current.includes(industry)) {
      setValue('industry', current.filter(i => i !== industry))
    } else {
      setValue('industry', [...current, industry])
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Tell us about your venture</h1>
        <p className="text-muted-foreground">
          Help us match you with relevant opportunities and connections
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Company Information
            </CardTitle>
            <CardDescription>
              Basic details about your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="Acme Corp"
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

            <div className="space-y-2">
              <Label htmlFor="company_website" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Company Website
              </Label>
              <Input
                id="company_website"
                placeholder="https://yourcompany.com"
                {...register('company_website')}
                error={errors.company_website?.message}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Business Stage</CardTitle>
            <CardDescription>
              Where are you in your entrepreneurial journey?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setValue('company_stage', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your business stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={USER_STAGES.IDEA}>Idea Stage</SelectItem>
                <SelectItem value={USER_STAGES.MVP}>MVP</SelectItem>
                <SelectItem value={USER_STAGES.EARLY_TRACTION}>Early Traction</SelectItem>
                <SelectItem value={USER_STAGES.GROWTH}>Growth</SelectItem>
                <SelectItem value={USER_STAGES.SCALE}>Scale</SelectItem>
                <SelectItem value={USER_STAGES.EXIT}>Exit</SelectItem>
              </SelectContent>
            </Select>
            {errors.company_stage && (
              <p className="text-sm text-destructive mt-1">{errors.company_stage.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Industry Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Industry</CardTitle>
            <CardDescription>
              Select the industries that best describe your business
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {industries.map((industry) => (
                <Button
                  key={industry}
                  type="button"
                  variant={selectedIndustries?.includes(industry) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleIndustry(industry)}
                  className="justify-start"
                >
                  {industry}
                </Button>
              ))}
            </div>
            {errors.industry && (
              <p className="text-sm text-destructive mt-2">{errors.industry.message}</p>
            )}
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
            onClick={() => router.push('/onboarding/step-1')}
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