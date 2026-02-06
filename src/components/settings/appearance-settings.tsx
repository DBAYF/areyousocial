// Appearance settings component

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
  Palette,
  Monitor,
  Moon,
  Sun,
  Type,
  Languages,
  Eye,
  MousePointer,
  Volume2,
  VolumeX
} from 'lucide-react'

const appearanceSettingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  language: z.string(),
  fontSize: z.enum(['small', 'medium', 'large']),
  dateFormat: z.enum(['MDY', 'DMY', 'YMD']),
  timeFormat: z.enum(['12h', '24h']),
  timezone: z.string(),
  animations: z.boolean(),
  reducedMotion: z.boolean(),
  highContrast: z.boolean(),
  compactMode: z.boolean(),
})

type AppearanceSettingsData = z.infer<typeof appearanceSettingsSchema>

export function AppearanceSettings() {
  const { addToast } = useUiStore()
  const [isSaving, setIsSaving] = useState(false)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<AppearanceSettingsData>({
    resolver: zodResolver(appearanceSettingsSchema),
    defaultValues: {
      theme: 'system',
      language: 'en',
      fontSize: 'medium',
      dateFormat: 'MDY',
      timeFormat: '12h',
      timezone: 'America/New_York',
      animations: true,
      reducedMotion: false,
      highContrast: false,
      compactMode: false,
    },
  })

  const watchValues = watch()

  const handleSave = async (data: AppearanceSettingsData) => {
    setIsSaving(true)
    try {
      // In real app, save to backend and apply changes
      console.log('Save appearance settings:', data)

      // Apply theme change immediately
      document.documentElement.className = data.theme === 'dark' ? 'dark' :
                                         data.theme === 'light' ? 'light' : ''

      addToast({
        type: 'success',
        title: 'Appearance settings saved',
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

  const handlePreviewTheme = (theme: string) => {
    // Temporarily apply theme for preview
    const originalTheme = document.documentElement.className
    document.documentElement.className = theme === 'dark' ? 'dark' :
                                       theme === 'light' ? 'light' : ''

    // Reset after 2 seconds
    setTimeout(() => {
      document.documentElement.className = originalTheme
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Theme
            </CardTitle>
            <CardDescription>
              Choose your preferred color scheme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('theme', 'light')
                    handlePreviewTheme('light')
                  }}
                  className={`w-full p-4 border-2 rounded-lg transition-colors ${
                    watchValues.theme === 'light' ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <div className="text-sm font-medium">Light</div>
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('theme', 'dark')
                    handlePreviewTheme('dark')
                  }}
                  className={`w-full p-4 border-2 rounded-lg transition-colors ${
                    watchValues.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-sm font-medium">Dark</div>
                </button>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue('theme', 'system')
                    handlePreviewTheme('')
                  }}
                  className={`w-full p-4 border-2 rounded-lg transition-colors ${
                    watchValues.theme === 'system' ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <div className="text-sm font-medium">System</div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language & Region */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Language & Region
            </CardTitle>
            <CardDescription>
              Customize language and regional preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={watchValues.language}
                  onValueChange={(value) => setValue('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={watchValues.timezone}
                  onValueChange={(value) => setValue('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    <SelectItem value="Asia/Shanghai">Shanghai</SelectItem>
                    <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select
                  value={watchValues.dateFormat}
                  onValueChange={(value) => setValue('dateFormat', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MDY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DMY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YMD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select
                  value={watchValues.timeFormat}
                  onValueChange={(value) => setValue('timeFormat', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Display Options
            </CardTitle>
            <CardDescription>
              Customize how content appears
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select
                value={watchValues.fontSize}
                onValueChange={(value) => setValue('fontSize', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="animations">Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable smooth transitions and animations
                </p>
              </div>
              <Switch
                id="animations"
                checked={watchValues.animations}
                onCheckedChange={(checked) => setValue('animations', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="reducedMotion">Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                id="reducedMotion"
                checked={watchValues.reducedMotion}
                onCheckedChange={(checked) => setValue('reducedMotion', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="highContrast">High Contrast</Label>
                <p className="text-sm text-muted-foreground">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                id="highContrast"
                checked={watchValues.highContrast}
                onCheckedChange={(checked) => setValue('highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compactMode">Compact Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Use less space for a denser layout
                </p>
              </div>
              <Switch
                id="compactMode"
                checked={watchValues.compactMode}
                onCheckedChange={(checked) => setValue('compactMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Preview */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="w-5 h-5" />
              Accessibility Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Sample Content</h3>
                <p className={`text-sm ${
                  watchValues.fontSize === 'small' ? 'text-sm' :
                  watchValues.fontSize === 'large' ? 'text-lg' : 'text-base'
                }`}>
                  This is how your content will appear with the current settings.
                  {watchValues.highContrast && ' High contrast mode is enabled.'}
                  {watchValues.compactMode && ' Compact mode reduces spacing.'}
                </p>
                <div className={`mt-2 p-2 bg-primary/10 rounded ${
                  watchValues.reducedMotion ? 'transition-none' : 'transition-colors duration-200'
                } hover:bg-primary/20`}>
                  Hover effects: {watchValues.animations ? 'Enabled' : 'Disabled'}
                </div>
              </div>
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