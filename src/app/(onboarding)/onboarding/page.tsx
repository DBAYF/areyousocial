// Onboarding entry page
"use client"

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/shared/loading-state'
import { useAuth } from '@/lib/hooks/use-auth'
import { Users, Target, Zap, CheckCircle } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.profile) {
      // User already has a profile, redirect to home
      router.push('/home')
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading) {
    return <LoadingState />
  }

  const handleStartOnboarding = () => {
    router.push('/onboarding/step-1')
  }

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
          <Users className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Welcome to ReMake!</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Let's set up your profile to connect you with the right entrepreneurs and mentors in our community.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>What you'll get</CardTitle>
          <CardDescription>
            Complete your profile to unlock personalized recommendations and connections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-success mt-0.5" />
              <div className="text-left">
                <h3 className="font-medium">Personalized Matches</h3>
                <p className="text-sm text-muted-foreground">
                  Get connected with mentors and peers who share your interests and goals
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-primary mt-0.5" />
              <div className="text-left">
                <h3 className="font-medium">Smart Recommendations</h3>
                <p className="text-sm text-muted-foreground">
                  Receive AI-powered suggestions for opportunities and connections
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-warning mt-0.5" />
              <div className="text-left">
                <h3 className="font-medium">Quick Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Get actionable next steps tailored to your entrepreneurial journey
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Users className="w-5 h-5 text-accent mt-0.5" />
              <div className="text-left">
                <h3 className="font-medium">Community Access</h3>
                <p className="text-sm text-muted-foreground">
                  Join discussions and share your progress with like-minded founders
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Button
          onClick={handleStartOnboarding}
          size="lg"
          className="px-8"
        >
          Get Started
        </Button>
        <p className="text-sm text-muted-foreground">
          Takes about 5 minutes to complete
        </p>
      </div>
    </div>
  )
}