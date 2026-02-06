// Stage badge component for displaying user entrepreneurial stage

import { Badge } from '@/components/ui/badge'
import { USER_STAGES } from '@/lib/utils/constants'
import { cn } from '@/lib/utils/cn'

interface StageBadgeProps {
  stage: keyof typeof USER_STAGES
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

const stageConfig = {
  [USER_STAGES.IDEA]: {
    label: 'Idea Stage',
    color: 'bg-secondary text-secondary-foreground',
  },
  [USER_STAGES.MVP]: {
    label: 'MVP',
    color: 'bg-info text-white',
  },
  [USER_STAGES.EARLY_TRACTION]: {
    label: 'Early Traction',
    color: 'bg-warning text-white',
  },
  [USER_STAGES.GROWTH]: {
    label: 'Growth',
    color: 'bg-success text-white',
  },
  [USER_STAGES.SCALE]: {
    label: 'Scale',
    color: 'bg-accent text-accent-foreground',
  },
  [USER_STAGES.EXIT]: {
    label: 'Exit',
    color: 'bg-destructive text-white',
  },
}

export function StageBadge({ stage, size = 'default', className }: StageBadgeProps) {
  const config = stageConfig[stage]

  return (
    <Badge
      className={cn(config.color, className)}
      size={size}
    >
      {config.label}
    </Badge>
  )
}

// Display component for showing stage with description
export function StageDisplay({ stage, showDescription = false }: {
  stage: keyof typeof USER_STAGES
  showDescription?: boolean
}) {
  const config = stageConfig[stage]
  const descriptions = {
    [USER_STAGES.IDEA]: 'Validating your business idea and market fit',
    [USER_STAGES.MVP]: 'Building and testing your minimum viable product',
    [USER_STAGES.EARLY_TRACTION]: 'Gaining initial customers and revenue',
    [USER_STAGES.GROWTH]: 'Scaling your business and operations',
    [USER_STAGES.SCALE]: 'Expanding rapidly and optimizing for scale',
    [USER_STAGES.EXIT]: 'Preparing for acquisition or IPO',
  }

  return (
    <div className="flex items-center gap-3">
      <StageBadge stage={stage} />
      {showDescription && (
        <span className="text-sm text-muted-foreground">
          {descriptions[stage]}
        </span>
      )}
    </div>
  )
}