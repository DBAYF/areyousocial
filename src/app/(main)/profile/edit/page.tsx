// Profile edit page
"use client"

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import { PageContainer } from '@/components/layout/page-container'
import { ProfileForm } from '@/components/profile/profile-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingState } from '@/components/shared/loading-state'
import { EmptyState } from '@/components/shared/empty-state'
import { useUiStore } from '@/lib/stores/ui-store'
import { ArrowLeft, Save } from 'lucide-react'

function ProfileEditContent() {
  const router = useRouter()
  const { user, profile, isLoading } = useAuth()
  const { addToast } = useUiStore()

  if (isLoading) {
    return <LoadingState />
  }

  if (!user) {
    return (
      <EmptyState
        title="Access denied"
        description="You need to be logged in to edit your profile."
      />
    )
  }

  const handleSuccess = () => {
    addToast({
      type: 'success',
      title: 'Profile updated',
      description: 'Your profile has been saved successfully.',
    })
    router.push('/profile')
  }

  const handleCancel = () => {
    router.push('/profile')
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/profile')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </div>

          <div className="text-right">
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your information and preferences
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <ProfileForm
          initialData={profile || undefined}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Tips</CardTitle>
            <CardDescription>
              Make your profile more discoverable and engaging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">📸 Add a profile picture</h4>
                <p className="text-sm text-muted-foreground">
                  Profiles with photos get 3x more connection requests and views.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">✍️ Write a compelling bio</h4>
                <p className="text-sm text-muted-foreground">
                  Share your story, goals, and what makes you unique as an entrepreneur.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">🏷️ Select relevant tags</h4>
                <p className="text-sm text-muted-foreground">
                  Choose skills and interests that match your expertise and goals.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">🔗 Add social links</h4>
                <p className="text-sm text-muted-foreground">
                  Connect your LinkedIn, Twitter, and website to build credibility.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">🎯 Set availability</h4>
                <p className="text-sm text-muted-foreground">
                  Let others know if you're open to mentoring, seeking advice, or new opportunities.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">📍 Include location</h4>
                <p className="text-sm text-muted-foreground">
                  Help local entrepreneurs find you for meetups and collaborations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default function ProfileEditPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProfileEditContent />
    </Suspense>
  )
}