// Auth layout for login, signup, and password reset pages

import { AuthGuard } from '@/components/auth/auth-guard'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth={false} redirectTo="/home">
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}