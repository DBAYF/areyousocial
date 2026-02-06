// Forgot password page

import { Suspense } from 'react'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { LoadingState } from '@/components/shared/loading-state'

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ForgotPasswordForm />
    </Suspense>
  )
}