// Onboarding progress component
"use client"

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import { CheckCircle, Circle } from 'lucide-react'

const steps = [
  {
    id: 'step-1',
    title: 'Basic Info',
    description: 'Tell us about yourself',
    href: '/onboarding/step-1',
  },
  {
    id: 'step-2',
    title: 'Venture Details',
    description: 'Share your business info',
    href: '/onboarding/step-2',
  },
  {
    id: 'step-3',
    title: 'Focus Areas',
    description: 'Select your interests',
    href: '/onboarding/step-3',
  },
  {
    id: 'step-4',
    title: 'Goals',
    description: 'Set your objectives',
    href: '/onboarding/step-4',
  },
]

export function OnboardingProgress() {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex(step => pathname.includes(step.href))

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          const isUpcoming = index > currentStepIndex

          return (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    {
                      "bg-primary border-primary text-primary-foreground": isCompleted,
                      "border-primary text-primary": isCurrent,
                      "border-muted-foreground/30 text-muted-foreground": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                {/* Step title and description */}
                <div className="mt-2 text-center">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 max-w-20">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    index < currentStepIndex ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}