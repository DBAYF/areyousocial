// Desktop sidebar navigation
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/auth-store'
import { useUiStore } from '@/lib/stores/ui-store'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Home,
  Search,
  MessageSquare,
  Briefcase,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const mainNavigation = [
  {
    name: 'Home',
    href: '/home',
    icon: Home,
  },
  {
    name: 'Feed',
    href: '/feed',
    icon: Search,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
    badge: true,
  },
  {
    name: 'Opportunities',
    href: '/opportunities',
    icon: Briefcase,
  },
  {
    name: 'Mentors',
    href: '/mentors',
    icon: Users,
  },
]

const secondaryNavigation = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { profile } = useAuthStore()
  const { sidebarCollapsed, setSidebarCollapsed, unreadCount } = useUiStore()

  return (
    <aside className={cn(
      "flex flex-col h-screen bg-background border-r transition-all duration-300",
      sidebarCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex justify-center"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* User profile section */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b">
          <Link href="/profile" className="flex items-center space-x-3 hover:bg-accent rounded-lg p-2 transition-colors">
            <Avatar
              src={profile?.avatar_url}
              alt={profile?.display_name || 'Profile'}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {profile?.display_name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile?.title || 'Entrepreneur'}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Main navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {mainNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </div>
              {!sidebarCollapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Secondary navigation */}
      <div className="p-4 border-t">
        <nav className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <Icon className="h-5 w-5" />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}