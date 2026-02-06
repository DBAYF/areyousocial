// Offline banner component

import { useOnlineStatus } from '@/lib/hooks/use-online-status'
import { cn } from '@/lib/utils/cn'
import { Wifi, WifiOff } from 'lucide-react'

interface OfflineBannerProps {
  className?: string
}

export function OfflineBanner({ className }: OfflineBannerProps) {
  const { isOnline } = useOnlineStatus()

  if (isOnline) return null

  return (
    <div className={cn(
      "bg-warning text-warning-foreground px-4 py-2 text-sm font-medium flex items-center justify-center gap-2",
      className
    )}>
      <WifiOff className="w-4 h-4" />
      <span>You're currently offline. Some features may not be available.</span>
    </div>
  )
}

export function ConnectionStatus({ className }: { className?: string }) {
  const { isOnline } = useOnlineStatus()

  return (
    <div className={cn(
      "flex items-center gap-2 text-xs",
      isOnline ? "text-success" : "text-muted-foreground",
      className
    )}>
      {isOnline ? (
        <>
          <Wifi className="w-3 h-3" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-3 h-3" />
          <span>Offline</span>
        </>
      )}
    </div>
  )
}