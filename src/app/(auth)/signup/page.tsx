// Signup page

import { Suspense } from 'react'
import { SignupForm } from '@/components/auth/signup-form'
import { LoadingState } from '@/components/shared/loading-state'

export default function SignupPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SignupForm />
    </Suspense>
  )
}