// Admin opportunities management page
"use client"

import { useState, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { LoadingState } from '@/components/shared/loading-state'
import { useUiStore } from '@/lib/stores/ui-store'
import { formatDate } from '@/lib/utils/format-date'
import {
  Briefcase,
  TrendingUp,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Users,
  Calendar,
  Flag,
  Archive,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react'

// Mock opportunities data
const mockOpportunities = [
  {
    id: 'opp_1',
    title: 'Senior Product Manager',
    type: 'job',
    company: 'TechFlow Inc.',
    creator: {
      uid: 'user1',
      display_name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
    },
    status: 'pending',
    visibility: 'public',
    applications_count: 12,
    views_count: 234,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    salary_range: { min: 150000, max: 200000, currency: 'USD' },
    featured: false,
    flagged: false,
    last_reviewed: null,
  },
  {
    id: 'opp_2',
    title: 'Seed Investment Opportunity',
    type: 'investment',
    company: 'GreenStorage Inc.',
    creator: {
      uid: 'user2',
      display_name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
    },
    status: 'approved',
    visibility: 'public',
    applications_count: 8,
    views_count: 456,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    featured: true,
    flagged: false,
    last_reviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'opp_3',
    title: 'Partnership: AI Content Platform',
    type: 'partnership',
    company: 'WriteAI',
    creator: {
      uid: 'user3',
      display_name: 'Lisa Wong',
      email: 'lisa.wong@example.com',
    },
    status: 'rejected',
    visibility: 'public',
    applications_count: 15,
    views_count: 123,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    featured: false,
    flagged: true,
    last_reviewed: new Date(Date.now() - 12 * 60 * 60 * 1000),
    rejection_reason: 'Insufficient information about partnership terms',
  },
]

function OpportunitiesManagementContent() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<typeof mockOpportunities[0] | null>(null)
  const [showOpportunityDetails, setShowOpportunityDetails] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const { addToast } = useUiStore()

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesStatus = statusFilter === 'all' || opp.status === statusFilter
    const matchesType = typeFilter === 'all' || opp.type === typeFilter
    return matchesStatus && matchesType
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending Review</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'featured':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-700">Featured</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      job: 'bg-blue-100 text-blue-700',
      investment: 'bg-green-100 text-green-700',
      partnership: 'bg-purple-100 text-purple-700',
      mentorship: 'bg-orange-100 text-orange-700',
      internship: 'bg-pink-100 text-pink-700',
      consulting: 'bg-indigo-100 text-indigo-700',
      other: 'bg-gray-100 text-gray-700',
    }

    return (
      <Badge variant="secondary" className={colors[type as keyof typeof colors] || colors.other}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    )
  }

  const handleStatusUpdate = async (opportunityId: string, newStatus: string, reason?: string) => {
    // In real app, call admin API
    console.log('Update opportunity status:', opportunityId, newStatus, reason)
    addToast({
      type: 'success',
      title: 'Opportunity updated',
      description: `Opportunity status changed to ${newStatus}.`,
    })
  }

  const handleBulkAction = async (action: string, opportunityIds: string[]) => {
    // In real app, call admin API
    console.log(`${action} opportunities:`, opportunityIds)
    addToast({
      type: 'success',
      title: `Bulk ${action} completed`,
      description: `${opportunityIds.length} opportunities have been ${action}ed.`,
    })
  }

  const pendingOpportunities = mockOpportunities.filter(o => o.status === 'pending')
  const approvedOpportunities = mockOpportunities.filter(o => o.status === 'approved')
  const rejectedOpportunities = mockOpportunities.filter(o => o.status === 'rejected')
  const flaggedOpportunities = mockOpportunities.filter(o => o.flagged)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Opportunities Management</h1>
          <p className="text-muted-foreground">
            Review and moderate job/investment postings
          </p>
        </div>
        <Button>
          <Briefcase className="w-4 h-4 mr-2" />
          Bulk Actions
        </Button>
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
                <p className="text-2xl font-bold">{pendingOpportunities.length}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
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
                <p className="text-2xl font-bold">{approvedOpportunities.length}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rejectedOpportunities.length}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Flag className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{flaggedOpportunities.length}</p>
                <p className="text-xs text-muted-foreground">Flagged</p>
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="job">Jobs</SelectItem>
                <SelectItem value="investment">Investments</SelectItem>
                <SelectItem value="partnership">Partnerships</SelectItem>
                <SelectItem value="mentorship">Mentorship</SelectItem>
                <SelectItem value="internship">Internships</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No opportunities found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {opportunity.type === 'job' && <Briefcase className="w-5 h-5 text-primary" />}
                      {opportunity.type === 'investment' && <TrendingUp className="w-5 h-5 text-primary" />}
                      {opportunity.type === 'partnership' && <Users className="w-5 h-5 text-primary" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{opportunity.title}</h3>
                        {getTypeBadge(opportunity.type)}
                        {getStatusBadge(opportunity.status)}
                        {opportunity.featured && <Badge variant="secondary" className="bg-purple-100 text-purple-700">Featured</Badge>}
                        {opportunity.flagged && <Badge variant="destructive">Flagged</Badge>}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        Posted by <strong>{opportunity.creator.display_name}</strong> at {opportunity.company} • {formatDate(opportunity.created_at)}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Views:</span>
                          <span className="font-medium ml-1">{opportunity.views_count}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Applications:</span>
                          <span className="font-medium ml-1">{opportunity.applications_count}</span>
                        </div>
                        {opportunity.salary_range && (
                          <div>
                            <span className="text-muted-foreground">Salary:</span>
                            <span className="font-medium ml-1">
                              ${opportunity.salary_range.min.toLocaleString()} - ${opportunity.salary_range.max.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {opportunity.last_reviewed && (
                          <div>
                            <span className="text-muted-foreground">Last Reviewed:</span>
                            <span className="font-medium ml-1">{formatDate(opportunity.last_reviewed)}</span>
                          </div>
                        )}
                      </div>

                      {opportunity.rejection_reason && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm">
                          <strong>Rejection Reason:</strong>
                          <p className="mt-1">{opportunity.rejection_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOpportunity(opportunity)
                        setShowOpportunityDetails(true)
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </Button>

                    {opportunity.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusUpdate(opportunity.id, 'approved')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reject Opportunity</AlertDialogTitle>
                              <AlertDialogDescription>
                                Provide a reason for rejecting this opportunity.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <textarea
                                className="w-full p-3 border border-input rounded-md text-sm"
                                placeholder="Reason for rejection..."
                                rows={3}
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleStatusUpdate(opportunity.id, 'rejected')}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Reject Opportunity
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}

                    {opportunity.status === 'approved' && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(opportunity.id, 'featured')}
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Feature
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Opportunity Details Modal */}
      <Dialog open={showOpportunityDetails} onOpenChange={setShowOpportunityDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Opportunity Review</DialogTitle>
            <DialogDescription>
              Review details for {selectedOpportunity?.title}
            </DialogDescription>
          </DialogHeader>

          {selectedOpportunity && (
            <div className="space-y-6">
              {/* Opportunity Info */}
              <div className="flex items-start gap-4">
                <Avatar alt={selectedOpportunity.creator.display_name} size="md" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{selectedOpportunity.title}</h3>
                  <p className="text-muted-foreground">{selectedOpportunity.company}</p>
                  <div className="flex gap-2 mt-2">
                    {getTypeBadge(selectedOpportunity.type)}
                    {getStatusBadge(selectedOpportunity.status)}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{selectedOpportunity.views_count}</div>
                  <div className="text-xs text-muted-foreground">Views</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{selectedOpportunity.applications_count}</div>
                  <div className="text-xs text-muted-foreground">Applications</div>
                </div>
              </div>

              {/* Creator Info */}
              <div>
                <h4 className="font-medium mb-2">Posted By</h4>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar alt={selectedOpportunity.creator.display_name} size="sm" />
                  <div>
                    <p className="font-medium">{selectedOpportunity.creator.display_name}</p>
                    <p className="text-sm text-muted-foreground">{selectedOpportunity.creator.email}</p>
                  </div>
                </div>
              </div>

              {/* Review Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleStatusUpdate(selectedOpportunity.id, 'approved')}
                  disabled={selectedOpportunity.status === 'approved'}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusUpdate(selectedOpportunity.id, 'featured')}
                  disabled={selectedOpportunity.featured}
                  className="flex-1"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Feature
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleStatusUpdate(selectedOpportunity.id, 'rejected')}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function OpportunitiesManagementPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OpportunitiesManagementContent />
    </Suspense>
  )
}