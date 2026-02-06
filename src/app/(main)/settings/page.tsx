// Settings page - centralized user preferences and account management
"use client"

import { useState, Suspense } from 'react'
import { PageContainer } from '@/components/layout/page-container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingState } from '@/components/shared/loading-state'
import { AccountSettings } from '@/components/settings/account-settings'
import { PrivacySettings } from '@/components/settings/privacy-settings'
import { NotificationSettings } from '@/components/settings/notification-settings'
import { AppearanceSettings } from '@/components/settings/appearance-settings'
import { IntegrationSettings } from '@/components/settings/integration-settings'
import { DataManagement } from '@/components/settings/data-management'
import {
  User,
  Shield,
  Bell,
  Palette,
  Link as LinkIcon,
  Database,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

const settingsTabs = [
  {
    id: 'account',
    label: 'Account',
    description: 'Manage your account settings and security',
    icon: User,
    component: AccountSettings,
  },
  {
    id: 'privacy',
    label: 'Privacy',
    description: 'Control your privacy and visibility settings',
    icon: Shield,
    component: PrivacySettings,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Customize your notification preferences',
    icon: Bell,
    component: NotificationSettings,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Customize your app experience',
    icon: Palette,
    component: AppearanceSettings,
  },
  {
    id: 'integrations',
    label: 'Integrations',
    description: 'Connect external services and apps',
    icon: LinkIcon,
    component: IntegrationSettings,
  },
  {
    id: 'data',
    label: 'Data & Privacy',
    description: 'Manage your data and privacy rights',
    icon: Database,
    component: DataManagement,
  },
]

function SettingsContent() {
  const [activeTab, setActiveTab] = useState('account')

  const ActiveComponent = settingsTabs.find(tab => tab.id === activeTab)?.component || AccountSettings

  return (
    <PageContainer>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <ArrowLeft className="w-5 h-5 text-muted-foreground hover:text-foreground" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences and privacy settings
            </p>
          </div>
        </div>

        {/* Settings Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 h-auto p-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-3 h-auto data-[state=active]:bg-background"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs hidden sm:block">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Settings Content */}
          <div className="mt-6">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsContent key={tab.id} value={tab.id} className="space-y-6">
                  {/* Tab Header */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">{tab.label}</h2>
                          <p className="text-muted-foreground">{tab.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tab Content */}
                  <ActiveComponent />
                </TabsContent>
              )
            })}
          </div>
        </Tabs>

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                Have questions about your settings or need assistance?
              </p>
              <div className="flex gap-4 justify-center mt-4">
                <a
                  href="/help"
                  className="text-primary hover:underline text-sm"
                >
                  Visit Help Center
                </a>
                <span className="text-muted-foreground">•</span>
                <a
                  href="mailto:support@remake.com"
                  className="text-primary hover:underline text-sm"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SettingsContent />
    </Suspense>
  )
}