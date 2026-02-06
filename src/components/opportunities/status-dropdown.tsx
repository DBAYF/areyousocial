// Status dropdown component for tracking application status

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils/cn'
import {
  Check,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  X,
  Calendar,
  FileText,
  Phone,
  Video,
  Handshake,
} from 'lucide-react'

interface StatusDropdownProps {
  currentStatus: string
  onStatusChange: (status: string) => void
  disabled?: boolean
  size?: 'sm' | 'default'
  className?: string
}

const statusOptions = [
  {
    value: 'not_applied',
    label: 'Not Applied',
    description: 'Haven\'t applied yet',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    icon: X,
  },
  {
    value: 'applied',
    label: 'Applied',
    description: 'Application submitted',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: FileText,
  },
  {
    value: 'application_reviewed',
    label: 'Application Reviewed',
    description: 'They\'ve seen your application',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    icon: Check,
  },
  {
    value: 'phone_screen',
    label: 'Phone Screen',
    description: 'Initial phone/video screening',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: Phone,
  },
  {
    value: 'interview_scheduled',
    label: 'Interview Scheduled',
    description: 'Formal interview arranged',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    icon: Calendar,
  },
  {
    value: 'interview_completed',
    label: 'Interview Completed',
    description: 'Interview finished',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    icon: Video,
  },
  {
    value: 'offer_received',
    label: 'Offer Received',
    description: 'Job offer extended',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: CheckCircle,
  },
  {
    value: 'offer_accepted',
    label: 'Offer Accepted',
    description: 'Accepted the offer',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    icon: Handshake,
  },
  {
    value: 'rejected',
    label: 'Rejected',
    description: 'Application not successful',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    icon: AlertCircle,
  },
  {
    value: 'withdrawn',
    label: 'Withdrawn',
    description: 'Withdrew application',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    icon: X,
  },
]

export function StatusDropdown({
  currentStatus,
  onStatusChange,
  disabled = false,
  size = 'default',
  className,
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentStatusOption = statusOptions.find(option => option.value === currentStatus)
  const StatusIcon = currentStatusOption?.icon || Clock

  const handleStatusSelect = (status: string) => {
    onStatusChange(status)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          disabled={disabled}
          className={cn(
            'justify-between',
            currentStatusOption?.bgColor,
            className
          )}
        >
          <div className="flex items-center gap-2">
            <StatusIcon className={cn('w-4 h-4', currentStatusOption?.color)} />
            <span className={cn('font-medium', currentStatusOption?.color)}>
              {currentStatusOption?.label || 'Unknown Status'}
            </span>
          </div>
          <Clock className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        {statusOptions.map((option) => {
          const Icon = option.icon
          const isSelected = option.value === currentStatus

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusSelect(option.value)}
              className={cn(
                'flex items-start gap-3 p-3 cursor-pointer',
                isSelected && 'bg-accent'
              )}
            >
              <div className={cn(
                'p-2 rounded-lg',
                option.bgColor,
                isSelected && 'ring-2 ring-primary ring-offset-2'
              )}>
                <Icon className={cn('w-4 h-4', option.color)} />
              </div>

              <div className="flex-1">
                <div className="font-medium text-sm">{option.label}</div>
                <div className="text-xs text-muted-foreground">
                  {option.description}
                </div>
              </div>

              {isSelected && (
                <Check className="w-4 h-4 text-primary mt-1" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Compact status badge component
export function StatusBadge({
  status,
  showLabel = true,
  size = 'default'
}: {
  status: string
  showLabel?: boolean
  size?: 'sm' | 'default'
}) {
  const statusOption = statusOptions.find(option => option.value === status)
  const Icon = statusOption?.icon || Clock

  if (!statusOption) {
    return (
      <Badge variant="secondary" className={cn(size === 'sm' && 'text-xs')}>
        <Clock className="w-3 h-3 mr-1" />
        Unknown
      </Badge>
    )
  }

  if (!showLabel) {
    return (
      <div className={cn(
        'inline-flex items-center justify-center w-6 h-6 rounded-full',
        statusOption.bgColor
      )}>
        <Icon className={cn('w-3 h-3', statusOption.color)} />
      </div>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        statusOption.bgColor,
        statusOption.color,
        size === 'sm' && 'text-xs'
      )}
    >
      <Icon className={cn('w-3 h-3 mr-1', size === 'sm' && 'w-2 h-2')} />
      {statusOption.label}
    </Badge>
  )
}

// Status timeline component for showing application progress
export function StatusTimeline({
  currentStatus,
  applicationDate,
  className
}: {
  currentStatus: string
  applicationDate?: Date
  className?: string
}) {
  const currentIndex = statusOptions.findIndex(option => option.value === currentStatus)
  const completedStatuses = statusOptions.slice(0, currentIndex + 1)
  const remainingStatuses = statusOptions.slice(currentIndex + 1)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="w-4 h-4" />
        Application Timeline
      </div>

      <div className="space-y-3">
        {statusOptions.map((option, index) => {
          const Icon = option.icon
          const isCompleted = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={option.value} className="flex items-start gap-3">
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2',
                isCompleted
                  ? 'bg-primary border-primary text-primary-foreground'
                  : 'border-muted-foreground/30 text-muted-foreground'
              )}>
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-sm font-medium',
                    isCurrent && 'text-primary'
                  )}>
                    {option.label}
                  </span>
                  {isCurrent && (
                    <Badge variant="secondary" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {applicationDate && (
        <div className="text-xs text-muted-foreground pt-2 border-t">
          Applied on {applicationDate.toLocaleDateString()}
        </div>
      )}
    </div>
  )
}