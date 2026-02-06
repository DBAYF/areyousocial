// Admin reports management page
"use client"

import { useState, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { LoadingState } from '@/components/shared/loading-state'
import { useUiStore } from '@/lib/stores/ui-store'
import { formatDate } from '@/lib/utils/format-date'
import {
  Flag,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Image,
  ExternalLink,
  Shield,
  Ban,
  Trash2,
  Archive
} from 'lucide-react'

// Mock reports data
const mockReports = [
  {
    id: 'report_1',
    type: 'content',
    severity: 'high',
    status: 'pending',
    reporter: {
      uid: 'user1',
      display_name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
    },
    reported_user: {
      uid: 'user2',
      display_name: 'Bad Actor',
      email: 'bad.actor@example.com',
    },
    reported_content: {
      type: 'post',
      id: 'post_123',
      content: 'Inappropriate content that violates community guidelines...',
      url: '/posts/post_123',
    },
    reason: 'Harassment',
    description: 'This post contains harassing content towards other users.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'report_2',
    type: 'user',
    severity: 'medium',
    status: 'investigating',
    reporter: {
      uid: 'user3',
      display_name: 'John Doe',
      email: 'john.doe@example.com',
    },
    reported_user: {
      uid: 'user4',
      display_name: 'Spam Account',
      email: 'spam@example.com',
    },
    reason: 'Spam',
    description: 'This user is sending spam messages to multiple users.',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'report_3',
    type: 'content',
    severity: 'low',
    status: 'resolved',
    reporter: {
      uid: 'user5',
      display_name: 'Jane Smith',
      email: 'jane.smith@example.com',
    },
    reported_user: {
      uid: 'user6',
      display_name: 'Content Creator',
      email: 'creator@example.com',
    },
    reported_content: {
      type: 'comment',
      id: 'comment_456',
      content: 'This comment was reported but found to be acceptable.',
      url: '/posts/post_789#comment_456',
    },
    reason: 'Inappropriate content',
    description: 'Reported for inappropriate language.',
    resolution: 'Content was reviewed and found to be within acceptable limits.',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
]

function ReportsManagementContent() {
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null)
  const [showReportDetails, setShowReportDetails] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [resolutionNote, setResolutionNote] = useState('')
  const { addToast } = useUiStore()

  const filteredReports = mockReports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    return matchesStatus && matchesType
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Medium</Badge>
      case 'low':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Low</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'investigating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700"><Eye className="w-3 h-3 mr-1" />Investigating</Badge>
      case 'resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>
      case 'dismissed':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700"><XCircle className="w-3 h-3 mr-1" />Dismissed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <MessageSquare className="w-4 h-4" />
      case 'user':
        return <User className="w-4 h-4" />
      case 'system':
        return <Shield className="w-4 h-4" />
      default:
        return <Flag className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = async (reportId: string, newStatus: string, note?: string) => {
    // In real app, call admin API
    console.log('Update report status:', reportId, newStatus, note)
    addToast({
      type: 'success',
      title: 'Report updated',
      description: `Report status changed to ${newStatus}.`,
    })
  }

  const handleBulkAction = async (action: string, reportIds: string[]) => {
    // In real app, call admin API
    console.log(`${action} reports:`, reportIds)
    addToast({
      type: 'success',
      title: `Bulk ${action} completed`,
      description: `${reportIds.length} reports have been ${action}ed.`,
    })
  }

  const pendingReports = mockReports.filter(r => r.status === 'pending')
  const investigatingReports = mockReports.filter(r => r.status === 'investigating')
  const resolvedReports = mockReports.filter(r => r.status === 'resolved')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports Management</h1>
          <p className="text-muted-foreground">
            Review and manage user reports and violations
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingReports.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{investigatingReports.length}</p>
                <p className="text-xs text-muted-foreground">Investigating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{resolvedReports.length}</p>
                <p className="text-xs text-muted-foreground">Resolved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockReports.filter(r => r.severity === 'high').length}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No reports found</p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {getTypeIcon(report.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          {report.type === 'content' ? 'Content Report' :
                           report.type === 'user' ? 'User Report' : 'System Report'}
                        </h3>
                        {getSeverityBadge(report.severity)}
                        {getStatusBadge(report.status)}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        Reported by <strong>{report.reporter.display_name}</strong> • {formatDate(report.created_at)}
                      </p>

                      <div className="space-y-2">
                        <p className="text-sm">
                          <strong>Reason:</strong> {report.reason}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>

                        {report.reported_content && (
                          <div className="p-3 bg-muted/50 rounded text-sm">
                            <strong>Reported Content:</strong>
                            <p className="mt-1 line-clamp-2">{report.reported_content.content}</p>
                          </div>
                        )}

                        {report.resolution && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
                            <strong>Resolution:</strong>
                            <p className="mt-1">{report.resolution}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReport(report)
                        setShowReportDetails(true)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </Button>

                    {report.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(report.id, 'investigating')}
                        >
                          Investigate
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Dismiss
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Dismiss Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to dismiss this report? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleStatusUpdate(report.id, 'dismissed')}
                              >
                                Dismiss Report
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}

                    {report.status === 'investigating' && (
                      <div className="flex gap-1">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="default" size="sm">
                              Resolve
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Resolve Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Provide a resolution note for this report.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <Textarea
                                placeholder="Describe the resolution..."
                                value={resolutionNote}
                                onChange={(e) => setResolutionNote(e.target.value)}
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  handleStatusUpdate(report.id, 'resolved', resolutionNote)
                                  setResolutionNote('')
                                }}
                              >
                                Resolve Report
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Report Details Modal */}
      <Dialog open={showReportDetails} onOpenChange={setShowReportDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Detailed information about report #{selectedReport?.id}
            </DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Report ID</label>
                  <p className="text-sm text-muted-foreground">{selectedReport.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <div className="mt-1">{getSeverityBadge(selectedReport.severity)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedReport.type}</p>
                </div>
              </div>

              {/* Reporter */}
              <div>
                <h4 className="font-medium mb-2">Reporter</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar alt={selectedReport.reporter.display_name} size="sm" />
                  <div>
                    <p className="font-medium">{selectedReport.reporter.display_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.reporter.email}</p>
                  </div>
                </div>
              </div>

              {/* Reported User */}
              <div>
                <h4 className="font-medium mb-2">Reported User</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar alt={selectedReport.reported_user.display_name} size="sm" />
                  <div>
                    <p className="font-medium">{selectedReport.reported_user.display_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedReport.reported_user.email}</p>
                  </div>
                </div>
              </div>

              {/* Reported Content */}
              {selectedReport.reported_content && (
                <div>
                  <h4 className="font-medium mb-2">Reported Content</h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <strong>Type:</strong> {selectedReport.reported_content.type}
                    </p>
                    <p className="text-sm mt-2">{selectedReport.reported_content.content}</p>
                    {selectedReport.reported_content.url && (
                      <Button variant="link" size="sm" className="mt-2 p-0">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Content
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Report Details */}
              <div>
                <h4 className="font-medium mb-2">Report Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Reason:</strong> {selectedReport.reason}</p>
                  <p><strong>Description:</strong> {selectedReport.description}</p>
                  <p><strong>Created:</strong> {formatDate(selectedReport.created_at)}</p>
                  <p><strong>Last Updated:</strong> {formatDate(selectedReport.updated_at)}</p>
                </div>
              </div>

              {/* Resolution */}
              {selectedReport.resolution && (
                <div>
                  <h4 className="font-medium mb-2">Resolution</h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm">{selectedReport.resolution}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ReportsManagementPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ReportsManagementContent />
    </Suspense>
  )
}