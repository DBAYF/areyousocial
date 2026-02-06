// Integration settings component

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUiStore } from '@/lib/stores/ui-store'
import {
  Link,
  Unlink,
  Github,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  connected: boolean
  lastSync?: Date
  status?: 'healthy' | 'warning' | 'error'
  permissions: string[]
}

const availableIntegrations: Integration[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Import profile data and share posts',
    icon: ExternalLink,
    connected: true,
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'healthy',
    permissions: ['Read profile', 'Share posts', 'Import connections'],
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Showcase your projects and contributions',
    icon: Github,
    connected: true,
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'healthy',
    permissions: ['Read repositories', 'Show contributions', 'Import projects'],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync meetings and events',
    icon: Calendar,
    connected: false,
    status: 'healthy',
    permissions: ['Read events', 'Create events', 'Sync availability'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connect with teams and communities',
    icon: MessageSquare,
    connected: false,
    status: 'healthy',
    permissions: ['Send messages', 'Read channels', 'Create channels'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Sync notes and documentation',
    icon: FileText,
    connected: true,
    lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'warning',
    permissions: ['Read pages', 'Create pages', 'Sync content'],
  },
]

export function IntegrationSettings() {
  const { addToast } = useUiStore()
  const [connecting, setConnecting] = useState<string | null>(null)

  const handleConnect = async (integrationId: string) => {
    setConnecting(integrationId)
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))

      addToast({
        type: 'success',
        title: 'Integration connected',
        description: `Successfully connected to ${availableIntegrations.find(i => i.id === integrationId)?.name}`,
      })

      // In real app, update the integration status
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Connection failed',
        description: 'Please try again.',
      })
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    try {
      // In real app, disconnect the integration
      console.log('Disconnect:', integrationId)

      addToast({
        type: 'info',
        title: 'Integration disconnected',
        description: `Disconnected from ${availableIntegrations.find(i => i.id === integrationId)?.name}`,
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to disconnect',
        description: 'Please try again.',
      })
    }
  }

  const handleSync = async (integrationId: string) => {
    try {
      // In real app, trigger manual sync
      console.log('Sync:', integrationId)

      addToast({
        type: 'success',
        title: 'Sync completed',
        description: 'Data has been synchronized successfully.',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Sync failed',
        description: 'Please try again.',
      })
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  const connectedIntegrations = availableIntegrations.filter(i => i.connected)
  const availableIntegrationsList = availableIntegrations.filter(i => !i.connected)

  return (
    <div className="space-y-6">
      {/* Connected Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Connected Integrations
          </CardTitle>
          <CardDescription>
            Manage your connected services and accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectedIntegrations.length === 0 ? (
            <div className="text-center py-8">
              <Link className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No integrations connected yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Connect services below to enhance your experience
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {connectedIntegrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{integration.name}</h3>
                          {getStatusIcon(integration.status)}
                          <Badge variant="secondary" className="text-xs">
                            Connected
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                        {integration.lastSync && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Last synced: {integration.lastSync.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(integration.id)}
                      >
                        Sync
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(integration.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>
            Connect additional services to enhance your workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableIntegrationsList.map((integration) => {
              const Icon = integration.icon
              return (
                <div key={integration.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium">{integration.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {integration.description}
                      </p>

                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <strong>Permissions:</strong>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {integration.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full mt-3"
                        onClick={() => handleConnect(integration.id)}
                        disabled={connecting === integration.id}
                      >
                        {connecting === integration.id ? 'Connecting...' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage API keys for integrations and development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">ReMake API Key</h3>
                <p className="text-sm text-muted-foreground">
                  For integrating with external services
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>

            <div className="text-center py-4">
              <Button variant="outline">
                Generate New API Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Receive real-time notifications via webhooks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8">
              <ExternalLink className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No webhooks configured</p>
              <p className="text-sm text-muted-foreground mt-1">
                Set up webhooks to receive notifications about events
              </p>
              <Button variant="outline" className="mt-4">
                Add Webhook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}