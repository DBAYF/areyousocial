// Login page

import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { LoadingState } from '@/components/shared/loading-state'

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginForm />
    </Suspense>
  )
}