// Data management component

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useUiStore } from '@/lib/stores/ui-store'
import {
  Database,
  Download,
  Trash2,
  FileText,
  Users,
  MessageSquare,
  Image,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'

interface DataCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  size: string
  items: number
  lastBackup?: Date
}

const dataCategories: DataCategory[] = [
  {
    id: 'profile',
    name: 'Profile Data',
    description: 'Your personal information and settings',
    icon: Users,
    size: '2.4 MB',
    items: 1,
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'posts',
    name: 'Posts & Content',
    description: 'Your posts, comments, and shared content',
    icon: FileText,
    size: '15.7 MB',
    items: 47,
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'messages',
    name: 'Messages',
    description: 'Private messages and conversations',
    icon: MessageSquare,
    size: '8.2 MB',
    items: 234,
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'connections',
    name: 'Connections',
    description: 'Your network and relationship data',
    icon: Users,
    size: '1.8 MB',
    items: 89,
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'media',
    name: 'Media Files',
    description: 'Images, videos, and attachments',
    icon: Image,
    size: '45.3 MB',
    items: 156,
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'settings',
    name: 'Settings & Preferences',
    description: 'Your app settings and preferences',
    icon: Settings,
    size: '0.5 MB',
    items: 1,
    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

export function DataManagement() {
  const { addToast } = useUiStore()
  const [isExporting, setIsExporting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [exportProgress, setExportProgress] = useState(0)

  const totalSize = dataCategories.reduce((acc, cat) => {
    const size = parseFloat(cat.size.replace(' MB', ''))
    return acc + size
  }, 0)

  const totalItems = dataCategories.reduce((acc, cat) => acc + cat.items, 0)

  const handleExportAll = async () => {
    setIsExporting(true)
    setExportProgress(0)

    try {
      // Simulate export progress
      for (let i = 0; i <= 100; i += 10) {
        setExportProgress(i)
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      addToast({
        type: 'success',
        title: 'Data export completed',
        description: 'Your data has been downloaded successfully.',
      })

      // In real app, trigger actual download
      const blob = new Blob(['Sample exported data'], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'remake-data-export.json'
      a.click()
      URL.revokeObjectURL(url)

    } catch (error) {
      addToast({
        type: 'error',
        title: 'Export failed',
        description: 'Please try again.',
      })
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleExportCategory = async (categoryId: string) => {
    try {
      const category = dataCategories.find(c => c.id === categoryId)
      addToast({
        type: 'info',
        title: 'Export started',
        description: `Exporting ${category?.name} data...`,
      })

      // In real app, export specific category
      await new Promise(resolve => setTimeout(resolve, 1000))

      addToast({
        type: 'success',
        title: 'Export completed',
        description: `${category?.name} data has been downloaded.`,
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Export failed',
        description: 'Please try again.',
      })
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    setIsDeleting(categoryId)
    try {
      const category = dataCategories.find(c => c.id === categoryId)
      // In real app, delete specific category data
      await new Promise(resolve => setTimeout(resolve, 1000))

      addToast({
        type: 'warning',
        title: 'Data deleted',
        description: `${category?.name} data has been permanently removed.`,
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Deletion failed',
        description: 'Please try again.',
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleGDPRDelete = async () => {
    try {
      // In real app, initiate GDPR deletion process
      addToast({
        type: 'info',
        title: 'Deletion request submitted',
        description: 'Your request has been submitted. You will receive a confirmation email.',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Request failed',
        description: 'Please contact support.',
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Your Data Overview
          </CardTitle>
          <CardDescription>
            Summary of data stored in your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{totalItems.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
              <div className="text-sm text-muted-foreground">Total Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Storage Usage</span>
              <span>{totalSize.toFixed(1)} MB / 1 GB</span>
            </div>
            <Progress value={(totalSize / 1000) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {(1000 - totalSize).toFixed(1)} MB remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export All Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a complete copy of all your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can download all your data in JSON format. This includes your profile,
              posts, messages, connections, and settings. The export may take a few minutes.
            </p>

            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Exporting data...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            <Button onClick={handleExportAll} disabled={isExporting}>
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export All Data'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Data Categories</CardTitle>
          <CardDescription>
            Manage individual categories of your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dataCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{category.size}</span>
                        <span>{category.items} items</span>
                        {category.lastBackup && (
                          <span>Last backup: {category.lastBackup.toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportCategory(category.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={isDeleting === category.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {category.name} Data</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all {category.name.toLowerCase()} data.
                            This action cannot be undone. Are you sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete Data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* GDPR Compliance */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            GDPR Right to Be Forgotten
          </CardTitle>
          <CardDescription>
            Permanently delete all your data and account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Under GDPR, you have the right to request complete deletion of your personal data.
              This will permanently remove your account and all associated data from our systems.
            </p>

            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive">Irreversible Action</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone. You will lose access to your account
                    and all data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Request Data Deletion (GDPR)
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Data Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your entire account and all associated data
                    in accordance with GDPR regulations. This action cannot be reversed.

                    You will receive a confirmation email and have 30 days to cancel this request.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleGDPRDelete}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, delete everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Data Retention Policy */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Data Retention Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong>Active Accounts:</strong> Your data is retained indefinitely while your account is active.
            </p>
            <p>
              <strong>Inactive Accounts:</strong> If your account is inactive for 2 years, we may delete it after providing notice.
            </p>
            <p>
              <strong>Deleted Accounts:</strong> Account data is permanently deleted within 30 days of deletion request.
            </p>
            <p>
              <strong>Backups:</strong> We maintain encrypted backups for disaster recovery, deleted within 90 days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}