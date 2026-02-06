// Admin user management page
"use client"

import { useState, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingState } from '@/components/shared/loading-state'
import { useUiStore } from '@/lib/stores/ui-store'
import { formatDate } from '@/lib/utils/format-date'
import {
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  UserCheck,
  UserX,
  Ban,
  AlertTriangle,
  Mail,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

// Mock user data
const mockUsers = [
  {
    uid: 'user1',
    email: 'sarah.chen@example.com',
    display_name: 'Sarah Chen',
    avatar_url: null,
    created_at: new Date('2024-01-15'),
    last_login: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'active',
    role: 'user',
    verified: true,
    connections: 45,
    posts: 23,
    reports: 0,
    risk_score: 15,
  },
  {
    uid: 'user2',
    email: 'john.doe@example.com',
    display_name: 'John Doe',
    avatar_url: null,
    created_at: new Date('2024-02-01'),
    last_login: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'suspended',
    role: 'user',
    verified: false,
    connections: 12,
    posts: 8,
    reports: 3,
    risk_score: 75,
  },
  {
    uid: 'user3',
    email: 'admin@remake.com',
    display_name: 'Admin User',
    avatar_url: null,
    created_at: new Date('2023-12-01'),
    last_login: new Date(Date.now() - 30 * 60 * 1000),
    status: 'active',
    role: 'admin',
    verified: true,
    connections: 156,
    posts: 89,
    reports: 0,
    risk_score: 5,
  },
  {
    uid: 'user4',
    email: 'mentor@example.com',
    display_name: 'Jane Mentor',
    avatar_url: null,
    created_at: new Date('2024-01-20'),
    last_login: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'active',
    role: 'mentor',
    verified: true,
    connections: 78,
    posts: 34,
    reports: 0,
    risk_score: 10,
  },
]

function UserManagementContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const { addToast } = useUiStore()

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
      case 'suspended':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Suspended</Badge>
      case 'banned':
        return <Badge variant="destructive">Banned</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive"><Shield className="w-3 h-3 mr-1" />Admin</Badge>
      case 'moderator':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Moderator</Badge>
      case 'mentor':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Mentor</Badge>
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-600'
    if (score >= 40) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleUserAction = async (action: string, userId: string) => {
    // In real app, call admin API
    console.log(`${action} user:`, userId)
    addToast({
      type: 'success',
      title: `User ${action}ed`,
      description: `User has been ${action}ed successfully.`,
    })
  }

  const handleBulkAction = async (action: string, userIds: string[]) => {
    // In real app, call admin API
    console.log(`${action} users:`, userIds)
    addToast({
      type: 'success',
      title: `Bulk ${action} completed`,
      description: `${userIds.length} users have been ${action}ed.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and account status
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Users
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsers.length}</p>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsers.filter(u => u.status === 'active').length}</p>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockUsers.filter(u => u.status !== 'active').length}</p>
                <p className="text-xs text-muted-foreground">Suspended/Banned</p>
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
                <p className="text-2xl font-bold">{mockUsers.filter(u => u.risk_score >= 50).length}</p>
                <p className="text-xs text-muted-foreground">High Risk Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Risk Score</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
                      <div>
                        <div className="font-medium">{user.display_name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <span className={getRiskColor(user.risk_score)}>
                      {user.risk_score}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.last_login)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setShowUserDetails(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      <Select>
                        <SelectTrigger className="w-8 h-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </SelectTrigger>
                        <SelectContent align="end">
                          <SelectItem onClick={() => handleUserAction('suspend', user.uid)}>
                            <Ban className="w-4 h-4 mr-2" />
                            Suspend
                          </SelectItem>
                          <SelectItem onClick={() => handleUserAction('ban', user.uid)}>
                            <UserX className="w-4 h-4 mr-2" />
                            Ban
                          </SelectItem>
                          <SelectItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Message
                          </SelectItem>
                          <SelectItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </SelectItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <SelectItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete User
                              </SelectItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete {user.display_name}'s account and all associated data.
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleUserAction('delete', user.uid)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.display_name}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <Avatar src={selectedUser.avatar_url} alt={selectedUser.display_name} size="lg" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedUser.display_name}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    {getStatusBadge(selectedUser.status)}
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{selectedUser.connections}</div>
                  <div className="text-xs text-muted-foreground">Connections</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{selectedUser.posts}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{selectedUser.reports}</div>
                  <div className="text-xs text-muted-foreground">Reports</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className={`text-lg font-semibold ${getRiskColor(selectedUser.risk_score)}`}>
                    {selectedUser.risk_score}
                  </div>
                  <div className="text-xs text-muted-foreground">Risk Score</div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-3">
                <h4 className="font-medium">Account Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">User ID:</span>
                    <div className="font-mono text-xs">{selectedUser.uid}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <div>{formatDate(selectedUser.created_at)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Login:</span>
                    <div>{formatDate(selectedUser.last_login)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Verified:</span>
                    <div>{selectedUser.verified ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function UserManagementPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UserManagementContent />
    </Suspense>
  )
}