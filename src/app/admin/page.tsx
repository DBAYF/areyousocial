// Admin dashboard - system overview and key metrics

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  MessageSquare,
  Shield,
  Activity,
  BarChart3,
  UserCheck,
  Flag
} from 'lucide-react'

// Mock data for admin dashboard
const dashboardStats = {
  users: {
    total: 12547,
    activeToday: 2341,
    newThisWeek: 456,
    growth: 12.5,
  },
  engagement: {
    dailyActive: 3241,
    sessionDuration: 8.7,
    postsCreated: 892,
    messagesSent: 5432,
  },
  safety: {
    reportsFiled: 23,
    resolvedToday: 18,
    blockedUsers: 45,
    violations: 7,
  },
  business: {
    revenue: 45678,
    opportunitiesPosted: 234,
    applicationsSubmitted: 1456,
    conversionRate: 68.5,
  },
}

const recentActivity = [
  {
    id: 1,
    type: 'user_registration',
    message: 'New user registered: sarah.jones@example.com',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    severity: 'info',
  },
  {
    id: 2,
    type: 'report_filed',
    message: 'Content report filed for post #1234',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    severity: 'warning',
  },
  {
    id: 3,
    type: 'user_suspended',
    message: 'User @badactor suspended for 7 days',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    severity: 'warning',
  },
  {
    id: 4,
    type: 'system_alert',
    message: 'High CPU usage detected on server-2',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    severity: 'error',
  },
  {
    id: 5,
    type: 'opportunity_posted',
    message: 'New opportunity posted: Senior PM at TechCorp',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    severity: 'info',
  },
]

const systemHealth = [
  { name: 'API Response Time', value: 245, unit: 'ms', status: 'good' },
  { name: 'Database CPU', value: 67, unit: '%', status: 'warning' },
  { name: 'Memory Usage', value: 78, unit: '%', status: 'good' },
  { name: 'Error Rate', value: 0.02, unit: '%', status: 'good' },
  { name: 'Uptime', value: 99.9, unit: '%', status: 'good' },
  { name: 'Queue Length', value: 12, unit: 'jobs', status: 'good' },
]

function AdminDashboard() {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            System overview and key metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Shield className="w-4 h-4 mr-2" />
            System Status
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.users.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
              +{dashboardStats.users.growth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.users.activeToday.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {dashboardStats.engagement.sessionDuration}m avg session
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safety Alerts</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dashboardStats.safety.violations}</div>
            <div className="text-xs text-muted-foreground">
              {dashboardStats.safety.resolvedToday} resolved today
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.business.revenue.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {dashboardStats.business.conversionRate}% conversion
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Registration trends and user acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">New users this week</span>
                <span className="font-medium">{dashboardStats.users.newThisWeek}</span>
              </div>
              <Progress value={75} className="h-2" />

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+12%</div>
                  <div className="text-xs text-muted-foreground">vs last week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">89%</div>
                  <div className="text-xs text-muted-foreground">retention</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4.2</div>
                  <div className="text-xs text-muted-foreground">avg rating</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Real-time system performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{metric.name}</span>
                    {metric.status !== 'good' && (
                      <Badge variant={metric.status === 'warning' ? 'secondary' : 'destructive'} className="text-xs">
                        {metric.status}
                      </Badge>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                    {metric.value}{metric.unit}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="reports">Pending Reports</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events and user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="mt-0.5">
                      {getSeverityIcon(activity.severity)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={
                      activity.severity === 'error' ? 'destructive' :
                      activity.severity === 'warning' ? 'secondary' : 'default'
                    } className="text-xs">
                      {activity.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Content and user reports requiring review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Flag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending reports</p>
                <p className="text-sm text-muted-foreground mt-1">
                  All reports have been processed
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Critical system notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">High Database CPU Usage</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Database CPU usage is at 67%. Consider scaling up the database instance.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          Scale Up
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">All other systems operating normally</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">System Messages</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Shield className="w-6 h-6" />
              <span className="text-sm">Security Settings</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPage() {
  return <AdminDashboard />
}