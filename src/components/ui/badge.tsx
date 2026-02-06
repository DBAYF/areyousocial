import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"
import { USER_STAGES } from "@/lib/utils/constants"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-success text-white hover:bg-success/90",
        warning:
          "border-transparent bg-warning text-white hover:bg-warning/90",
        info:
          "border-transparent bg-info text-white hover:bg-info/90",
        ghost: "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        verified:
          "border-transparent bg-accent text-accent-foreground",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  count?: number
  maxCount?: number
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, leftIcon, rightIcon, count, maxCount, children, ...props }, ref) => {
    const displayCount = maxCount && count && count > maxCount ? `${maxCount}+` : count

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {leftIcon && <span className="mr-1">{leftIcon}</span>}
        {children}
        {displayCount !== undefined && (
          <span className="ml-1 font-bold">{displayCount}</span>
        )}
        {rightIcon && <span className="ml-1">{rightIcon}</span>}
      </div>
    )
  }
)
Badge.displayName = "Badge"

// Specialized badge components
interface StageBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  stage: keyof typeof USER_STAGES
}

const StageBadge = React.forwardRef<HTMLDivElement, StageBadgeProps>(
  ({ stage, ...props }, ref) => {
    const stageConfig = {
      [USER_STAGES.IDEA]: {
        label: 'Idea',
        variant: 'secondary' as const,
      },
      [USER_STAGES.MVP]: {
        label: 'MVP',
        variant: 'info' as const,
      },
      [USER_STAGES.EARLY_TRACTION]: {
        label: 'Early Traction',
        variant: 'warning' as const,
      },
      [USER_STAGES.GROWTH]: {
        label: 'Growth',
        variant: 'success' as const,
      },
      [USER_STAGES.SCALE]: {
        label: 'Scale',
        variant: 'accent' as const,
      },
      [USER_STAGES.EXIT]: {
        label: 'Exit',
        variant: 'destructive' as const,
      },
    }

    const config = stageConfig[stage]

    return (
      <Badge
        ref={ref}
        variant={config.variant}
        {...props}
      >
        {config.label}
      </Badge>
    )
  }
)
StageBadge.displayName = "StageBadge"

interface VerifiedBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  verified: boolean
}

const VerifiedBadge = React.forwardRef<HTMLDivElement, VerifiedBadgeProps>(
  ({ verified, ...props }, ref) => {
    if (!verified) return null

    return (
      <Badge
        ref={ref}
        variant="verified"
        {...props}
      >
        ✓ Verified
      </Badge>
    )
  }
)
VerifiedBadge.displayName = "VerifiedBadge"

interface CountBadgeProps extends Omit<BadgeProps, 'count'> {
  count: number
  maxCount?: number
  showZero?: boolean
}

const CountBadge = React.forwardRef<HTMLDivElement, CountBadgeProps>(
  ({ count, maxCount, showZero = false, variant = "secondary", ...props }, ref) => {
    if (!showZero && count === 0) return null

    return (
      <Badge
        ref={ref}
        variant={variant}
        count={count}
        maxCount={maxCount}
        {...props}
      >
        {count === 0 ? '0' : ''}
      </Badge>
    )
  }
)
CountBadge.displayName = "CountBadge"

export { Badge, StageBadge, VerifiedBadge, CountBadge }