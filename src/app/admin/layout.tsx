// Admin layout - protected admin interface

import { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/lib/stores/auth-store'
import {
  Shield,
  Users,
  Flag,
  TrendingUp,
  Settings,
  LogOut,
  Home,
  AlertTriangle
} from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

const adminNavigation = [
  { name: 'Dashboard', href: '/admin', icon: TrendingUp },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Reports', href: '/admin/reports', icon: Flag },
  { name: 'Opportunities', href: '/admin/opportunities', icon: Settings },
  { name: 'Audit Log', href: '/admin/audit', icon: Shield },
]

function AdminLayoutContent({ children }: AdminLayoutProps) {
  const { user } = useAuthStore()

  // Mock admin check - in real app, check user roles
  const isAdmin = user?.email?.includes('admin') || true // Mock for demo

  if (!isAdmin) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                <span className="font-bold text-xl">ReMake Admin</span>
              </Link>
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Admin Mode
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Back to App
                </Button>
              </Link>

              <div className="flex items-center gap-2">
                <Avatar src={user?.photoURL} alt={user?.displayName || 'Admin'} size="sm" />
                <span className="text-sm font-medium">{user?.displayName || 'Admin User'}</span>
              </div>

              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-card border-r min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <div className="space-y-2">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminLayoutContent>{children}</AdminLayoutContent>
}