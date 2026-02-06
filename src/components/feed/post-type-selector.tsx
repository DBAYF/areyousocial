// Post type selector component

import { POST_TYPES } from '@/lib/utils/constants'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MessageSquare,
  HelpCircle,
  Target,
  TrendingUp,
  Lightbulb,
  ChevronDown
} from 'lucide-react'

interface PostTypeSelectorProps {
  value: string
  onChange: (type: string) => void
  variant?: 'badge' | 'dropdown'
  size?: 'sm' | 'default'
}

const postTypeConfig = {
  [POST_TYPES.UPDATE]: {
    label: 'Update',
    description: 'Share news, progress, or thoughts',
    icon: MessageSquare,
    color: 'bg-primary/10 text-primary',
  },
  [POST_TYPES.QUESTION]: {
    label: 'Question',
    description: 'Ask for advice or insights',
    icon: HelpCircle,
    color: 'bg-accent/10 text-accent',
  },
  [POST_TYPES.OPPORTUNITY]: {
    label: 'Opportunity',
    description: 'Share jobs, investments, or partnerships',
    icon: Target,
    color: 'bg-success/10 text-success',
  },
  [POST_TYPES.MILESTONE]: {
    label: 'Milestone',
    description: 'Celebrate achievements and wins',
    icon: TrendingUp,
    color: 'bg-warning/10 text-warning',
  },
  [POST_TYPES.ADVICE_SEEKING]: {
    label: 'Advice',
    description: 'Seek guidance from the community',
    icon: Lightbulb,
    color: 'bg-info/10 text-info',
  },
}

export function PostTypeSelector({
  value,
  onChange,
  variant = 'badge',
  size = 'default'
}: PostTypeSelectorProps) {
  const currentType = postTypeConfig[value as keyof typeof postTypeConfig]

  if (variant === 'badge') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={size}
            className="h-auto p-1 hover:bg-transparent"
          >
            <Badge
              variant="secondary"
              className={`cursor-pointer hover:opacity-80 ${currentType?.color}`}
            >
              {currentType?.icon && <currentType.icon className="w-3 h-3 mr-1" />}
              {currentType?.label}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Badge>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64">
          {Object.entries(postTypeConfig).map(([type, config]) => {
            const Icon = config.icon
            return (
              <DropdownMenuItem
                key={type}
                onClick={() => onChange(type)}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{config.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {config.description}
                  </div>
                </div>
                {value === type && (
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // Dropdown variant for larger forms
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={size} className="justify-between">
          <div className="flex items-center gap-2">
            {currentType?.icon && <currentType.icon className="w-4 h-4" />}
            {currentType?.label}
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        {Object.entries(postTypeConfig).map(([type, config]) => {
          const Icon = config.icon
          return (
            <DropdownMenuItem
              key={type}
              onClick={() => onChange(type)}
              className="flex items-start gap-3 p-3 cursor-pointer"
            >
              <div className={`p-2 rounded-lg ${config.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-medium">{config.label}</div>
                <div className="text-xs text-muted-foreground">
                  {config.description}
                </div>
              </div>
              {value === type && (
                <div className="w-2 h-2 bg-primary rounded-full mt-2" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Post type indicator (read-only)
export function PostTypeIndicator({ type }: { type: string }) {
  const config = postTypeConfig[type as keyof typeof postTypeConfig]

  if (!config) return null

  const Icon = config.icon

  return (
    <Badge variant="secondary" className={`text-xs ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}