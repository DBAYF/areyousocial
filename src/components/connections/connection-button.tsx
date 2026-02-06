// Connection button component for connecting with other users

import { useState } from 'react'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useConnections } from '@/lib/hooks/use-connections'
import { useUiStore } from '@/lib/stores/ui-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CONNECTION_STATUSES } from '@/lib/utils/constants'
import { UserPlus, UserCheck, Clock, X } from 'lucide-react'

interface ConnectionButtonProps {
  userId: string
  variant?: 'default' | 'compact'
  size?: 'default' | 'sm'
  className?: string
}

export function ConnectionButton({
  userId,
  variant = 'default',
  size = 'default',
  className
}: ConnectionButtonProps) {
  const { user: currentUser } = useAuthStore()
  const { sendConnectionRequest, acceptConnection, rejectConnection, isLoading } = useConnections()
  const { addToast } = useUiStore()
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    CONNECTION_STATUSES.NONE // In real app, this would come from the connection hook
  )

  // Don't show button for own profile
  if (currentUser?.uid === userId) {
    return null
  }

  const handleConnect = async () => {
    const success = await sendConnectionRequest({
      addressee_id: userId,
      message: 'Hi! I\'d like to connect with you on ReMake.'
    })

    if (success) {
      setConnectionStatus(CONNECTION_STATUSES.PENDING)
      addToast({
        type: 'success',
        title: 'Connection request sent',
        description: 'They will be notified of your request.',
      })
    }
  }

  const handleAccept = async () => {
    // In real app, we'd need the connection ID
    const mockConnectionId = `conn_${Date.now()}`
    const success = await acceptConnection(mockConnectionId)

    if (success) {
      setConnectionStatus(CONNECTION_STATUSES.CONNECTED)
      addToast({
        type: 'success',
        title: 'Connection accepted',
        description: 'You are now connected!',
      })
    }
  }

  const handleReject = async () => {
    // In real app, we'd need the connection ID
    const mockConnectionId = `conn_${Date.now()}`
    const success = await rejectConnection(mockConnectionId)

    if (success) {
      setConnectionStatus(CONNECTION_STATUSES.NONE)
    }
  }

  if (variant === 'compact') {
    switch (connectionStatus) {
      case CONNECTION_STATUSES.CONNECTED:
        return (
          <Badge variant="secondary" className="text-xs">
            <UserCheck className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        )

      case CONNECTION_STATUSES.PENDING:
        return (
          <Button
            variant="outline"
            size="sm"
            disabled
            className="text-xs"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Button>
        )

      default:
        return (
          <Button
            variant="default"
            size="sm"
            onClick={handleConnect}
            disabled={isLoading}
            className="text-xs"
          >
            <UserPlus className="w-3 h-3 mr-1" />
            Connect
          </Button>
        )
    }
  }

  // Default variant
  switch (connectionStatus) {
    case CONNECTION_STATUSES.CONNECTED:
      return (
        <Button
          variant="secondary"
          size={size}
          className={`text-green-700 border-green-300 hover:bg-green-50 ${className}`}
        >
          <UserCheck className="w-4 h-4 mr-2" />
          Connected
        </Button>
      )

    case CONNECTION_STATUSES.PENDING:
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size={size}
            onClick={handleAccept}
            disabled={isLoading}
            className="flex-1"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Accept
          </Button>
          <Button
            variant="outline"
            size={size}
            onClick={handleReject}
            disabled={isLoading}
            className="text-destructive hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )

    default:
      return (
        <Button
          variant="default"
          size={size}
          onClick={handleConnect}
          disabled={isLoading}
          className={className}
        >
          <UserPlus className="w-4 h-4 mr-2" />
          {isLoading ? 'Connecting...' : 'Connect'}
        </Button>
      )
  }
}

// Connection status indicator component
export function ConnectionStatusIndicator({
  userId,
  showLabel = false
}: {
  userId: string
  showLabel?: boolean
}) {
  const [status, setStatus] = useState<ConnectionStatus>(CONNECTION_STATUSES.NONE)

  const getStatusInfo = () => {
    switch (status) {
      case CONNECTION_STATUSES.CONNECTED:
        return {
          label: 'Connected',
          color: 'text-green-600',
          icon: UserCheck
        }
      case CONNECTION_STATUSES.PENDING:
        return {
          label: 'Pending',
          color: 'text-yellow-600',
          icon: Clock
        }
      default:
        return {
          label: 'Not connected',
          color: 'text-muted-foreground',
          icon: UserPlus
        }
    }
  }

  const { label, color, icon: Icon } = getStatusInfo()

  if (!showLabel) {
    return <Icon className={`w-4 h-4 ${color}`} />
  }

  return (
    <div className={`flex items-center gap-1 text-sm ${color}`}>
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  )
}