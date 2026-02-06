// Privacy settings component

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useUiStore } from '@/lib/stores/ui-store'
import { z } from 'zod'
import {
  Eye,
  EyeOff,
  Users,
  Globe,
  Lock,
  UserX,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react'

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'connections', 'private']),
  activityVisibility: z.boolean(),
  searchVisibility: z.boolean(),
  analyticsConsent: z.boolean(),
  marketingConsent: z.boolean(),
  researchConsent: z.boolean(),
})

type PrivacySettingsData = z.infer<typeof privacySettingsSchema>

export function PrivacySettings() {
  const { addToast } = useUiStore()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<PrivacySettingsData>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: 'public',
      activityVisibility: true,
      searchVisibility: true,
      analyticsConsent: true,
      marketingConsent: false,
      researchConsent: false,
    },
  })

  const profileVisibility = watch('profileVisibility')
  const activityVisibility = watch('activityVisibility')
  const searchVisibility = watch('searchVisibility')
  const analyticsConsent = watch('analyticsConsent')
  const marketingConsent = watch('marketingConsent')
  const researchConsent = watch('researchConsent')

  const handleSave = async (data: PrivacySettingsData) => {
    setIsSaving(true)
    try {
      // In real app, save to backend
      console.log('Save privacy settings:', data)
      addToast({
        type: 'success',
        title: 'Privacy settings saved',
        description: 'Your privacy preferences have been updated.',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to save settings',
        description: 'Please try again.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      // In real app, trigger data export
      console.log('Export user data')
      addToast({
        type: 'info',
        title: 'Data export initiated',
        description: 'You will receive an email with your data export link.',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Export failed',
        description: 'Please try again.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {/* Profile Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Profile Visibility
            </CardTitle>
            <CardDescription>
              Control who can see your profile and activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Profile Visibility</Label>
              <Select
                value={profileVisibility}
                onValueChange={(value) => setValue('profileVisibility', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Public</div>
                        <div className="text-xs text-muted-foreground">Anyone can view your profile</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="connections">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Connections Only</div>
                        <div className="text-xs text-muted-foreground">Only your connections can view</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <div>
                        <div className="font-medium">Private</div>
                        <div className="text-xs text-muted-foreground">Profile is hidden from everyone</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="activityVisibility">Show Activity Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Let others see when you're active
                  </p>
                </div>
                <Switch
                  id="activityVisibility"
                  checked={activityVisibility}
                  onCheckedChange={(checked) => setValue('activityVisibility', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="searchVisibility">Appear in Search Results</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow others to find you through search
                  </p>
                </div>
                <Switch
                  id="searchVisibility"
                  checked={searchVisibility}
                  onCheckedChange={(checked) => setValue('searchVisibility', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="w-5 h-5" />
              Data Sharing & Analytics
            </CardTitle>
            <CardDescription>
              Control how your data is used for analytics and personalization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analyticsConsent">Analytics & Performance</Label>
                <p className="text-sm text-muted-foreground">
                  Help improve ReMake by sharing usage analytics
                </p>
              </div>
              <Switch
                id="analyticsConsent"
                checked={analyticsConsent}
                onCheckedChange={(checked) => setValue('analyticsConsent', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketingConsent">Marketing Communications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and opportunities
                </p>
              </div>
              <Switch
                id="marketingConsent"
                checked={marketingConsent}
                onCheckedChange={(checked) => setValue('marketingConsent', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="researchConsent">Research Participation</Label>
                <p className="text-sm text-muted-foreground">
                  Contribute to entrepreneurship research (anonymous)
                </p>
              </div>
              <Switch
                id="researchConsent"
                checked={researchConsent}
                onCheckedChange={(checked) => setValue('researchConsent', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Blocking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="w-5 h-5" />
              Blocked Users
            </CardTitle>
            <CardDescription>
              Manage users you've blocked
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No blocked users</p>
              <p className="text-sm text-muted-foreground mt-1">
                Blocked users won't be able to see your profile or contact you
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Data Export
            </CardTitle>
            <CardDescription>
              Download a copy of your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You can download a copy of all your data including posts, connections,
                messages, and profile information.
              </p>
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export My Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}