// Mobile bottom navigation
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { Badge } from '@/components/ui/badge'
import { useUiStore } from '@/lib/stores/ui-store'
import {
  Home,
  Search,
  MessageSquare,
  Briefcase,
  User,
} from 'lucide-react'

const navigation = [
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
    badge: true, // Show unread count
  },
  {
    name: 'Opportunities',
    href: '/opportunities',
    icon: Briefcase,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
]

export function BottomNav() {
  const pathname = usePathname()
  const { unreadCount } = useUiStore()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 px-1 text-xs font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
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
              <span className="mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}