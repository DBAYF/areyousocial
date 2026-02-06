// Opportunity detail component for full opportunity information

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils/cn'
import { formatDate } from '@/lib/utils/format-date'
import {
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  Building,
  Globe,
  Mail,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Share2,
  Flag,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface OpportunityDetailProps {
  opportunity: {
    id: string
    title: string
    description: string
    type: 'job' | 'investment' | 'partnership' | 'mentorship' | 'internship' | 'consulting' | 'other'
    category: string
    tags: string[]
    location?: string
    remote_possible: boolean
    work_arrangement: 'remote' | 'hybrid' | 'onsite'
    compensation_type?: 'salary' | 'equity' | 'both'
    salary_range?: {
      min: number
      max: number
      currency: string
    }
    equity_range?: {
      min: number
      max: number
    }
    benefits?: string[]
    required_skills: string[]
    preferred_skills?: string[]
    experience_level: 'entry' | 'mid' | 'senior' | 'executive'
    education_requirements?: string[]
    application_deadline?: Date
    application_process?: string
    contact_email?: string
    visibility: 'public' | 'connections' | 'invite_only'
    featured?: boolean
    creator: {
      uid: string
      display_name: string
      company_name?: string
      avatar_url?: string
      verified?: boolean
    }
    created_at: Date
    views_count: number
    applications_count: number
  }
  isOpen: boolean
  onClose: () => void
  onApply?: (opportunityId: string) => void
  onSave?: (opportunityId: string) => void
  onShare?: (opportunityId: string) => void
  onReport?: (opportunityId: string) => void
  userApplicationStatus?: 'not_applied' | 'applied' | 'interviewing' | 'offered' | 'rejected'
}

const typeConfig = {
  job: {
    icon: Building,
    color: 'bg-blue-100 text-blue-700',
    label: 'Job Opportunity',
  },
  investment: {
    icon: TrendingUp,
    color: 'bg-green-100 text-green-700',
    label: 'Investment Opportunity',
  },
  partnership: {
    icon: CheckCircle,
    color: 'bg-purple-100 text-purple-700',
    label: 'Partnership',
  },
  mentorship: {
    icon: Users,
    color: 'bg-orange-100 text-orange-700',
    label: 'Mentorship',
  },
  internship: {
    icon: GraduationCap,
    color: 'bg-pink-100 text-pink-700',
    label: 'Internship',
  },
  consulting: {
    icon: Target,
    color: 'bg-indigo-100 text-indigo-700',
    label: 'Consulting',
  },
  other: {
    icon: Building,
    color: 'bg-gray-100 text-gray-700',
    label: 'Other',
  },
}

const experienceLevelLabels = {
  entry: 'Entry Level (0-2 years)',
  mid: 'Mid Level (3-5 years)',
  senior: 'Senior Level (6-10 years)',
  executive: 'Executive (10+ years)',
}

const applicationStatusConfig = {
  not_applied: { label: 'Not Applied', color: 'text-muted-foreground', icon: null },
  applied: { label: 'Applied', color: 'text-blue-600', icon: Clock },
  interviewing: { label: 'Interviewing', color: 'text-orange-600', icon: Users },
  offered: { label: 'Offer Received', color: 'text-green-600', icon: CheckCircle },
  rejected: { label: 'Not Selected', color: 'text-red-600', icon: AlertCircle },
}

export function OpportunityDetail({
  opportunity,
  isOpen,
  onClose,
  onApply,
  onSave,
  onShare,
  onReport,
  userApplicationStatus = 'not_applied'
}: OpportunityDetailProps) {
  const [isSaved, setIsSaved] = useState(false)
  const typeInfo = typeConfig[opportunity.type]
  const TypeIcon = typeInfo.icon
  const applicationStatus = applicationStatusConfig[userApplicationStatus]
  const StatusIcon = applicationStatus.icon

  const handleSave = () => {
    setIsSaved(!isSaved)
    onSave?.(opportunity.id)
  }

  const handleApply = () => {
    onApply?.(opportunity.id)
  }

  const handleShare = () => {
    onShare?.(opportunity.id)
  }

  const handleReport = () => {
    onReport?.(opportunity.id)
  }

  const formatSalary = () => {
    if (!opportunity.salary_range) return null
    const { min, max, currency } = opportunity.salary_range
    if (min === max) return `${currency} ${min.toLocaleString()}`
    return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  const formatEquity = () => {
    if (!opportunity.equity_range) return null
    const { min, max } = opportunity.equity_range
    if (min === max) return `${min}%`
    return `${min}% - ${max}%`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-lg', typeInfo.color)}>
              <TypeIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl mb-2">{opportunity.title}</DialogTitle>
              <DialogDescription className="text-base">
                {opportunity.creator.company_name || opportunity.creator.display_name}
                {opportunity.creator.verified && (
                  <Badge variant="verified" className="ml-2">Verified</Badge>
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Application Status */}
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            {StatusIcon && <StatusIcon className={cn('w-4 h-4', applicationStatus.color)} />}
            <span className={cn('text-sm font-medium', applicationStatus.color)}>
              {applicationStatus.label}
            </span>
          </div>

          {/* Key Information */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <MapPin className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">
                {opportunity.location || 'Remote'}
              </div>
              <div className="text-xs text-muted-foreground">
                {opportunity.remote_possible && 'Remote OK'}
              </div>
            </div>

            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">
                {experienceLevelLabels[opportunity.experience_level].split(' ')[0]} Level
              </div>
              <div className="text-xs text-muted-foreground">
                {experienceLevelLabels[opportunity.experience_level].split('(')[1]?.replace(')', '')}
              </div>
            </div>

            {opportunity.salary_range && (
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <DollarSign className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm font-medium">
                  {formatSalary()?.split(' ')[0]}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatSalary()?.split(' ').slice(1).join(' ')}
                </div>
              </div>
            )}

            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <Calendar className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="text-sm font-medium">
                {opportunity.application_deadline
                  ? formatDate(opportunity.application_deadline)
                  : 'Ongoing'
                }
              </div>
              <div className="text-xs text-muted-foreground">
                Deadline
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.required_skills.map(skill => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {opportunity.preferred_skills && opportunity.preferred_skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Preferred Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.preferred_skills.map(skill => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Benefits & Compensation */}
          {(opportunity.benefits || opportunity.equity_range) && (
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Compensation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunity.equity_range && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">
                      <strong>Equity:</strong> {formatEquity()}
                    </span>
                  </div>
                )}

                {opportunity.benefits && opportunity.benefits.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <ul className="space-y-1">
                      {opportunity.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Process */}
          {opportunity.application_process && (
            <Card>
              <CardHeader>
                <CardTitle>How to Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {opportunity.application_process}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar
                  src={opportunity.creator.avatar_url}
                  alt={opportunity.creator.display_name}
                  size="sm"
                />
                <div>
                  <div className="font-medium">{opportunity.creator.display_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {opportunity.creator.company_name}
                  </div>
                </div>
              </div>

              {opportunity.contact_email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`mailto:${opportunity.contact_email}`}
                    className="text-primary hover:underline"
                  >
                    {opportunity.contact_email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{opportunity.category}</Badge>
                {opportunity.tags.map(tag => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <div className="flex gap-2">
              <Button
                onClick={handleApply}
                disabled={userApplicationStatus !== 'not_applied'}
                className="flex-1"
              >
                {userApplicationStatus === 'not_applied' ? 'Apply Now' :
                 userApplicationStatus === 'applied' ? 'Application Submitted' :
                 userApplicationStatus === 'interviewing' ? 'Interviewing' :
                 userApplicationStatus === 'offered' ? 'Offer Received' :
                 'Application Closed'}
              </Button>

              <Button
                variant="outline"
                onClick={handleSave}
                className="px-3"
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </Button>

              <Button
                variant="outline"
                onClick={handleShare}
                className="px-3"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-muted-foreground hover:text-destructive">
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Report Opportunity</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to report this opportunity? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReport} className="bg-destructive hover:bg-destructive/90">
                    Report
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
            <span>Posted {formatDate(opportunity.created_at)}</span>
            <div className="flex gap-4">
              <span>{opportunity.views_count} views</span>
              <span>{opportunity.applications_count} applications</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Alert Dialog components (needed for the report functionality)
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogContent = AlertDialogPrimitive.Content
const AlertDialogHeader = AlertDialogPrimitive.Header
const AlertDialogFooter = AlertDialogPrimitive.Footer
const AlertDialogTitle = AlertDialogPrimitive.Title
const AlertDialogDescription = AlertDialogPrimitive.Description
const AlertDialogAction = AlertDialogPrimitive.Action
const AlertDialogCancel = AlertDialogPrimitive.Cancel

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}