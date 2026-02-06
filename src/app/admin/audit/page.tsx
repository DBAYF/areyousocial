// Admin audit logging page
"use client"

import { useState, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { LoadingState } from '@/components/shared/loading-state'
import { useUiStore } from '@/lib/stores/ui-store'
import { formatDate } from '@/lib/utils/format-date'
import {
  Shield,
  Search,
  Download,
  Filter,
  User,
  Settings,
  MessageSquare,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  LogIn,
  LogOut,
  FileText
} from 'lucide-react'

// Mock audit log data
const mockAuditLogs = [
  {
    id: 'audit_1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    user_id: 'user1',
    user_email: 'admin@remake.com',
    user_name: 'Admin User',
    action: 'user_suspended',
    resource_type: 'user',
    resource_id: 'user2',
    description: 'Suspended user account for violating community guidelines',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    severity: 'warning',
    metadata: {
      reason: 'Harassment',
      duration: '7 days',
    },
  },
  {
    id: 'audit_2',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    user_id: 'user3',
    user_email: 'moderator@remake.com',
    user_name: 'Moderator User',
    action: 'content_removed',
    resource_type: 'post',
    resource_id: 'post_123',
    description: 'Removed inappropriate content from community feed',
    ip_address: '192.168.1.101',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    severity: 'info',
    metadata: {
      reason: 'Spam content',
      content_type: 'post',
    },
  },
  {
    id: 'audit_3',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    user_id: 'user1',
    user_email: 'admin@remake.com',
    user_name: 'Admin User',
    action: 'system_config_changed',
    resource_type: 'system',
    resource_id: 'config_1',
    description: 'Updated system configuration for rate limiting',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    severity: 'info',
    metadata: {
      setting: 'rate_limit_requests_per_minute',
      old_value: '100',
      new_value: '150',
    },
  },
  {
    id: 'audit_4',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    user_id: 'user4',
    user_email: 'user@example.com',
    user_name: 'Regular User',
    action: 'login_successful',
    resource_type: 'auth',
    resource_id: 'session_456',
    description: 'User logged in successfully',
    ip_address: '10.0.0.50',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    severity: 'info',
    metadata: {
      device_type: 'mobile',
      login_method: 'email',
    },
  },
  {
    id: 'audit_5',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    user_id: 'user5',
    user_email: 'newuser@example.com',
    user_name: 'New User',
    action: 'user_registered',
    resource_type: 'user',
    resource_id: 'user5',
    description: 'New user account created',
    ip_address: '203.0.113.1',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    severity: 'info',
    metadata: {
      registration_method: 'email',
      referral_source: 'organic',
    },
  },
  {
    id: 'audit_6',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    user_id: 'user1',
    user_email: 'admin@remake.com',
    user_name: 'Admin User',
    action: 'report_resolved',
    resource_type: 'report',
    resource_id: 'report_1',
    description: 'Resolved user report with content removal',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    severity: 'info',
    metadata: {
      resolution: 'Content removed',
      action_taken: 'user_warned',
    },
  },
]

function AuditLoggingContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [dateRange, setDateRange] = useState('24h')
  const { addToast } = useUiStore()

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.user_email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter

    // Date range filter (simplified)
    const logTime = log.timestamp.getTime()
    const now = Date.now()
    const rangeMs = dateRange === '1h' ? 60 * 60 * 1000 :
                   dateRange === '24h' ? 24 * 60 * 60 * 1000 :
                   dateRange === '7d' ? 7 * 24 * 60 * 60 * 1000 :
                   dateRange === '30d' ? 30 * 24 * 60 * 60 * 1000 : Infinity

    const matchesDate = (now - logTime) <= rangeMs

    return matchesSearch && matchesAction && matchesSeverity && matchesDate
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_suspended':
      case 'user_banned':
        return <User className="w-4 h-4 text-red-500" />
      case 'content_removed':
        return <Trash2 className="w-4 h-4 text-orange-500" />
      case 'system_config_changed':
        return <Settings className="w-4 h-4 text-blue-500" />
      case 'login_successful':
        return <LogIn className="w-4 h-4 text-green-500" />
      case 'user_registered':
        return <User className="w-4 h-4 text-green-500" />
      case 'report_resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'report_created':
        return <Flag className="w-4 h-4 text-yellow-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Warning</Badge>
      case 'info':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Info</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  const getActionBadge = (action: string) => {
    const actionLabels = {
      user_suspended: 'User Suspended',
      user_banned: 'User Banned',
      content_removed: 'Content Removed',
      system_config_changed: 'Config Changed',
      login_successful: 'Login',
      user_registered: 'Registration',
      report_resolved: 'Report Resolved',
      report_created: 'Report Created',
    }

    return (
      <Badge variant="outline">
        {actionLabels[action as keyof typeof actionLabels] || action}
      </Badge>
    )
  }

  const handleExportLogs = async () => {
    try {
      // In real app, export filtered logs
      addToast({
        type: 'success',
        title: 'Export started',
        description: 'Audit logs are being prepared for download.',
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Export failed',
        description: 'Please try again.',
      })
    }
  }

  const criticalLogs = mockAuditLogs.filter(l => l.severity === 'error' || l.severity === 'critical')
  const warningLogs = mockAuditLogs.filter(l => l.severity === 'warning')
  const infoLogs = mockAuditLogs.filter(l => l.severity === 'info')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">
            Monitor system activity and administrative actions
          </p>
        </div>
        <Button onClick={handleExportLogs}>
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{criticalLogs.length}</p>
                <p className="text-xs text-muted-foreground">Critical Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{warningLogs.length}</p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{infoLogs.length}</p>
                <p className="text-xs text-muted-foreground">Info Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
                <p className="text-xs text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search logs by user, action, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="user_suspended">User Suspended</SelectItem>
                <SelectItem value="content_removed">Content Removed</SelectItem>
                <SelectItem value="system_config_changed">Config Changed</SelectItem>
                <SelectItem value="login_successful">Login</SelectItem>
                <SelectItem value="user_registered">Registration</SelectItem>
                <SelectItem value="report_resolved">Report Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log ({filteredLogs.length} events)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(log.timestamp)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar alt={log.user_name} size="sm" />
                      <div>
                        <div className="font-medium text-sm">{log.user_name}</div>
                        <div className="text-xs text-muted-foreground">{log.user_email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      {getActionBadge(log.action)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="text-sm line-clamp-2">{log.description}</p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <span key={key} className="mr-2">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                  <TableCell className="text-sm font-mono">{log.ip_address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No audit events found for the selected filters</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Retention Notice */}
      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Log Retention Policy</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Audit logs are retained for 2 years for security and compliance purposes.
                Logs older than 90 days are archived and may have reduced detail.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuditLoggingPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AuditLoggingContent />
    </Suspense>
  )
}