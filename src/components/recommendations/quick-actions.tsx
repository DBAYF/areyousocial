// Quick actions component

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import type { QuickAction } from '@/lib/types/recommendation'
import {
  MessageSquare,
  UserPlus,
  FileText,
  Calendar,
  Users,
  Target,
  Zap,
  CheckCircle
} from 'lucide-react'

// Mock quick actions data
const mockQuickActions: QuickAction[] = [
  {
    id: '1',
    user_id: 'user1',
    type: 'send_message',
    title: 'Message Sarah Chen',
    description: 'She responded to your connection request',
    action_url: '/messages/thread-123',
    action_text: 'Reply now',
    priority: 1,
    created_at: new Date(),
    completed: false,
  },
  {
    id: '2',
    user_id: 'user1',
    type: 'connect',
    title: 'Connect with Mike Johnson',
    description: 'Former CTO at your target company',
    action_url: '/profile/mike-johnson',
    action_text: 'Send request',
    priority: 2,
    created_at: new Date(),
    completed: false,
  },
  {
    id: '3',
    user_id: 'user1',
    type: 'apply_opportunity',
    title: 'Apply to Product Manager role',
    description: 'Deadline: Tomorrow at 5 PM',
    action_url: '/opportunities/pm-role-456',
    action_text: 'Apply now',
    priority: 3,
    created_at: new Date(),
    completed: false,
  },
  {
    id: '4',
    user_id: 'user1',
    type: 'update_profile',
    title: 'Complete your profile',
    description: 'Add your company description to get better matches',
    action_url: '/profile/edit',
    action_text: 'Update profile',
    priority: 4,
    created_at: new Date(),
    completed: false,
  },
]

const actionIcons = {
  send_message: MessageSquare,
  connect: UserPlus,
  apply_opportunity: FileText,
  update_profile: Users,
  join_event: Calendar,
  complete_onboarding: CheckCircle,
  review_connections: Target,
  post_update: Zap,
}

const actionColors = {
  send_message: 'bg-primary/10 text-primary border-primary/20',
  connect: 'bg-accent/10 text-accent border-accent/20',
  apply_opportunity: 'bg-success/10 text-success border-success/20',
  update_profile: 'bg-warning/10 text-warning border-warning/20',
  join_event: 'bg-info/10 text-info border-info/20',
  complete_onboarding: 'bg-primary/10 text-primary border-primary/20',
  review_connections: 'bg-secondary/10 text-secondary border-secondary/20',
  post_update: 'bg-accent/10 text-accent border-accent/20',
}

interface QuickActionsProps {
  actions?: QuickAction[]
  onActionClick?: (actionId: string, action: string) => void
  maxItems?: number
}

export function QuickActions({
  actions = mockQuickActions,
  onActionClick,
  maxItems = 4
}: QuickActionsProps) {
  const sortedActions = actions
    .filter(action => !action.completed)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, maxItems)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          High-priority tasks to boost your progress
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {sortedActions.map((action) => (
            <QuickActionItem
              key={action.id}
              action={action}
              onClick={() => onActionClick?.(action.id, action.action_url)}
            />
          ))}

          {sortedActions.length === 0 && (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                All caught up! No pending actions.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickActionItemProps {
  action: QuickAction
  onClick: () => void
}

function QuickActionItem({ action, onClick }: QuickActionItemProps) {
  const Icon = actionIcons[action.type] || Zap

  return (
    <div className={`p-3 rounded-lg border ${actionColors[action.type] || 'bg-muted'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">{action.title}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {action.description}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onClick}
          className="ml-3"
        >
          {action.action_text}
        </Button>
      </div>
    </div>
  )
}

// Specialized quick action components

export function MessageQuickAction({
  senderName,
  threadId,
  onClick
}: {
  senderName: string
  threadId: string
  onClick: () => void
}) {
  return (
    <div className="p-3 rounded-lg border bg-primary/10 text-primary border-primary/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size="sm" />
          <div>
            <p className="text-sm font-medium">Message from {senderName}</p>
            <p className="text-xs text-muted-foreground">2 minutes ago</p>
          </div>
        </div>
        <Button size="sm" onClick={onClick}>
          Reply
        </Button>
      </div>
    </div>
  )
}

export function ConnectionQuickAction({
  personName,
  company,
  onClick
}: {
  personName: string
  company: string
  onClick: () => void
}) {
  return (
    <div className="p-3 rounded-lg border bg-accent/10 text-accent border-accent/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar size="sm" />
          <div>
            <p className="text-sm font-medium">Connect with {personName}</p>
            <p className="text-xs text-muted-foreground">{company}</p>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={onClick}>
          Connect
        </Button>
      </div>
    </div>
  )
}