// Onboarding Step 4: Goals
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useProfile } from '@/lib/hooks/use-profile'
import { onboardingStep4Schema, type OnboardingStep4Data } from '@/lib/validations/profile-schemas'
import { LoadingState } from '@/components/shared/loading-state'
import { Target, Users, Lightbulb, CheckCircle } from 'lucide-react'

export default function OnboardingStep4() {
  const router = useRouter()
  const { updateProfile, isLoading, error } = useProfile()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OnboardingStep4Data>({
    resolver: zodResolver(onboardingStep4Schema),
    defaultValues: {
      available_for_mentoring: false,
      seeking_mentorship: false,
      open_to_opportunities: false,
    },
  })

  const availableForMentoring = watch('available_for_mentoring')
  const seekingMentorship = watch('seeking_mentorship')
  const openToOpportunities = watch('open_to_opportunities')

  const onSubmit = async (data: OnboardingStep4Data) => {
    setIsSubmitting(true)

    const success = await updateProfile({
      available_for_mentoring: data.available_for_mentoring,
      seeking_mentorship: data.seeking_mentorship,
      open_to_opportunities: data.open_to_opportunities,
    })

    if (success) {
      router.push('/home')
    }

    setIsSubmitting(false)
  }

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Set your goals</h1>
        <p className="text-muted-foreground">
          Choose how you want to engage with the ReMake community
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Mentoring Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Mentoring
            </CardTitle>
            <CardDescription>
              Connect with experienced entrepreneurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Available for mentoring
                </Label>
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
                <Label className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Seeking mentorship
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get advice from experienced entrepreneurs
                </p>
              </div>
              <Switch
                checked={seekingMentorship}
                onCheckedChange={(checked) => setValue('seeking_mentorship', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Opportunities
            </CardTitle>
            <CardDescription>
              Stay open to new opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Open to opportunities</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications about relevant jobs, investments, and partnerships
                </p>
              </div>
              <Switch
                checked={openToOpportunities}
                onCheckedChange={(checked) => setValue('open_to_opportunities', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">You're all set!</h3>
              <p className="text-sm text-muted-foreground">
                Based on your selections, you'll receive personalized recommendations for:
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {availableForMentoring && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    Mentoring others
                  </span>
                )}
                {seekingMentorship && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    Finding mentors
                  </span>
                )}
                {openToOpportunities && (
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    New opportunities
                  </span>
                )}
              </div>
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
            onClick={() => router.push('/onboarding/step-3')}
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Completing...' : 'Complete Setup'}
          </Button>
        </div>
      </form>
    </div>
  )
}