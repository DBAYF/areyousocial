// Notification settings component

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
  Bell,
  Mail,
  Smartphone,
  Monitor,
  Clock,
  Volume2,
  VolumeX,
  Moon,
  Sun
} from 'lucide-react'

const notificationSettingsSchema = z.object({
  // Email notifications
  emailConnections: z.boolean(),
  emailMessages: z.boolean(),
  emailMentorship: z.boolean(),
  emailOpportunities: z.boolean(),
  emailSystem: z.boolean(),
  emailMarketing: z.boolean(),

  // Push notifications
  pushConnections: z.boolean(),
  pushMessages: z.boolean(),
  pushMentorship: z.boolean(),
  pushOpportunities: z.boolean(),
  pushSystem: z.boolean(),

  // In-app notifications
  inAppConnections: z.boolean(),
  inAppMessages: z.boolean(),
  inAppMentorship: z.boolean(),
  inAppOpportunities: z.boolean(),
  inAppRecommendations: z.boolean(),
  inAppAchievements: z.boolean(),

  // Advanced settings
  frequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']),
  quietHours: z.boolean(),
  quietStart: z.string(),
  quietEnd: z.string(),
  soundEnabled: z.boolean(),
  vibrationEnabled: z.boolean(),
})

type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>

export function NotificationSettings() {
  const { addToast } = useUiStore()
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<NotificationSettingsData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      // Email defaults
      emailConnections: true,
      emailMessages: true,
      emailMentorship: true,
      emailOpportunities: true,
      emailSystem: true,
      emailMarketing: false,

      // Push defaults
      pushConnections: true,
      pushMessages: true,
      pushMentorship: false,
      pushOpportunities: false,
      pushSystem: true,

      // In-app defaults
      inAppConnections: true,
      inAppMessages: true,
      inAppMentorship: true,
      inAppOpportunities: true,
      inAppRecommendations: true,
      inAppAchievements: true,

      // Advanced defaults
      frequency: 'immediate',
      quietHours: false,
      quietStart: '22:00',
      quietEnd: '08:00',
      soundEnabled: true,
      vibrationEnabled: true,
    },
  })

  const watchValues = watch()

  const handleSave = async (data: NotificationSettingsData) => {
    setIsSaving(true)
    try {
      // In real app, save to backend
      console.log('Save notification settings:', data)
      addToast({
        type: 'success',
        title: 'Notification settings saved',
        description: 'Your preferences have been updated.',
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

  const handleQuickSetup = (preset: 'all' | 'important' | 'minimal' | 'none') => {
    const presets = {
      all: {
        emailConnections: true, emailMessages: true, emailMentorship: true, emailOpportunities: true, emailSystem: true, emailMarketing: true,
        pushConnections: true, pushMessages: true, pushMentorship: true, pushOpportunities: true, pushSystem: true,
        inAppConnections: true, inAppMessages: true, inAppMentorship: true, inAppOpportunities: true, inAppRecommendations: true, inAppAchievements: true,
      },
      important: {
        emailConnections: true, emailMessages: true, emailMentorship: false, emailOpportunities: false, emailSystem: true, emailMarketing: false,
        pushConnections: true, pushMessages: true, pushMentorship: false, pushOpportunities: false, pushSystem: true,
        inAppConnections: true, inAppMessages: true, inAppMentorship: true, inAppOpportunities: true, inAppRecommendations: true, inAppAchievements: true,
      },
      minimal: {
        emailConnections: false, emailMessages: false, emailMentorship: false, emailOpportunities: false, emailSystem: true, emailMarketing: false,
        pushConnections: false, pushMessages: false, pushMentorship: false, pushOpportunities: false, pushSystem: true,
        inAppConnections: false, inAppMessages: false, inAppMentorship: false, inAppOpportunities: false, inAppRecommendations: false, inAppAchievements: false,
      },
      none: {
        emailConnections: false, emailMessages: false, emailMentorship: false, emailOpportunities: false, emailSystem: false, emailMarketing: false,
        pushConnections: false, pushMessages: false, pushMentorship: false, pushOpportunities: false, pushSystem: false,
        inAppConnections: false, inAppMessages: false, inAppMentorship: false, inAppOpportunities: false, inAppRecommendations: false, inAppAchievements: false,
      },
    }

    Object.entries(presets[preset]).forEach(([key, value]) => {
      setValue(key as keyof NotificationSettingsData, value)
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick Setup */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Setup</CardTitle>
          <CardDescription>
            Choose a preset to quickly configure your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => handleQuickSetup('all')}>
              All Notifications
            </Button>
            <Button variant="outline" onClick={() => handleQuickSetup('important')}>
              Important Only
            </Button>
            <Button variant="outline" onClick={() => handleQuickSetup('minimal')}>
              Minimal
            </Button>
            <Button variant="outline" onClick={() => handleQuickSetup('none')}>
              None
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
            <CardDescription>
              Choose what emails you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailConnections">New Connections</Label>
                <p className="text-sm text-muted-foreground">When someone connects with you</p>
              </div>
              <Switch
                id="emailConnections"
                checked={watchValues.emailConnections}
                onCheckedChange={(checked) => setValue('emailConnections', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailMessages">Messages</Label>
                <p className="text-sm text-muted-foreground">New messages and replies</p>
              </div>
              <Switch
                id="emailMessages"
                checked={watchValues.emailMessages}
                onCheckedChange={(checked) => setValue('emailMessages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailMentorship">Mentorship</Label>
                <p className="text-sm text-muted-foreground">Mentorship requests and updates</p>
              </div>
              <Switch
                id="emailMentorship"
                checked={watchValues.emailMentorship}
                onCheckedChange={(checked) => setValue('emailMentorship', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailOpportunities">Opportunities</Label>
                <p className="text-sm text-muted-foreground">New jobs and opportunities</p>
              </div>
              <Switch
                id="emailOpportunities"
                checked={watchValues.emailOpportunities}
                onCheckedChange={(checked) => setValue('emailOpportunities', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailSystem">System Updates</Label>
                <p className="text-sm text-muted-foreground">Security alerts and important updates</p>
              </div>
              <Switch
                id="emailSystem"
                checked={watchValues.emailSystem}
                onCheckedChange={(checked) => setValue('emailSystem', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailMarketing">Marketing</Label>
                <p className="text-sm text-muted-foreground">Product updates and newsletters</p>
              </div>
              <Switch
                id="emailMarketing"
                checked={watchValues.emailMarketing}
                onCheckedChange={(checked) => setValue('emailMarketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Push Notifications
            </CardTitle>
            <CardDescription>
              Receive notifications on your devices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushConnections">Connections</Label>
                <p className="text-sm text-muted-foreground">Connection requests and acceptances</p>
              </div>
              <Switch
                id="pushConnections"
                checked={watchValues.pushConnections}
                onCheckedChange={(checked) => setValue('pushConnections', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushMessages">Messages</Label>
                <p className="text-sm text-muted-foreground">New messages</p>
              </div>
              <Switch
                id="pushMessages"
                checked={watchValues.pushMessages}
                onCheckedChange={(checked) => setValue('pushMessages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushMentorship">Mentorship</Label>
                <p className="text-sm text-muted-foreground">Mentorship updates</p>
              </div>
              <Switch
                id="pushMentorship"
                checked={watchValues.pushMentorship}
                onCheckedChange={(checked) => setValue('pushMentorship', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushOpportunities">Opportunities</Label>
                <p className="text-sm text-muted-foreground">New opportunities</p>
              </div>
              <Switch
                id="pushOpportunities"
                checked={watchValues.pushOpportunities}
                onCheckedChange={(checked) => setValue('pushOpportunities', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushSystem">System</Label>
                <p className="text-sm text-muted-foreground">Important system notifications</p>
              </div>
              <Switch
                id="pushSystem"
                checked={watchValues.pushSystem}
                onCheckedChange={(checked) => setValue('pushSystem', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* In-App Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              In-App Notifications
            </CardTitle>
            <CardDescription>
              Notifications within the ReMake app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppConnections">Connections</Label>
                <p className="text-sm text-muted-foreground">Connection activity</p>
              </div>
              <Switch
                id="inAppConnections"
                checked={watchValues.inAppConnections}
                onCheckedChange={(checked) => setValue('inAppConnections', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppMessages">Messages</Label>
                <p className="text-sm text-muted-foreground">Message notifications</p>
              </div>
              <Switch
                id="inAppMessages"
                checked={watchValues.inAppMessages}
                onCheckedChange={(checked) => setValue('inAppMessages', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppMentorship">Mentorship</Label>
                <p className="text-sm text-muted-foreground">Mentorship activity</p>
              </div>
              <Switch
                id="inAppMentorship"
                checked={watchValues.inAppMentorship}
                onCheckedChange={(checked) => setValue('inAppMentorship', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppOpportunities">Opportunities</Label>
                <p className="text-sm text-muted-foreground">New opportunities</p>
              </div>
              <Switch
                id="inAppOpportunities"
                checked={watchValues.inAppOpportunities}
                onCheckedChange={(checked) => setValue('inAppOpportunities', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppRecommendations">Recommendations</Label>
                <p className="text-sm text-muted-foreground">AI-powered suggestions</p>
              </div>
              <Switch
                id="inAppRecommendations"
                checked={watchValues.inAppRecommendations}
                onCheckedChange={(checked) => setValue('inAppRecommendations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inAppAchievements">Achievements</Label>
                <p className="text-sm text-muted-foreground">Badges and milestones</p>
              </div>
              <Switch
                id="inAppAchievements"
                checked={watchValues.inAppAchievements}
                onCheckedChange={(checked) => setValue('inAppAchievements', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Advanced Settings
            </CardTitle>
            <CardDescription>
              Fine-tune your notification experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select
                value={watchValues.frequency}
                onValueChange={(value) => setValue('frequency', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Digest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="quietHours">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Pause notifications during specified hours
                </p>
              </div>
              <Switch
                id="quietHours"
                checked={watchValues.quietHours}
                onCheckedChange={(checked) => setValue('quietHours', checked)}
              />
            </div>

            {watchValues.quietHours && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quietStart">Start Time</Label>
                  <input
                    id="quietStart"
                    type="time"
                    value={watchValues.quietStart}
                    onChange={(e) => setValue('quietStart', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quietEnd">End Time</Label>
                  <input
                    id="quietEnd"
                    type="time"
                    value={watchValues.quietEnd}
                    onChange={(e) => setValue('quietEnd', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="soundEnabled">Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Play notification sounds
                </p>
              </div>
              <Switch
                id="soundEnabled"
                checked={watchValues.soundEnabled}
                onCheckedChange={(checked) => setValue('soundEnabled', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="vibrationEnabled">Vibration</Label>
                <p className="text-sm text-muted-foreground">
                  Vibrate on notifications (mobile only)
                </p>
              </div>
              <Switch
                id="vibrationEnabled"
                checked={watchValues.vibrationEnabled}
                onCheckedChange={(checked) => setValue('vibrationEnabled', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  )
}