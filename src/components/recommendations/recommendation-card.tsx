// Recommendation card component

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { useRecommendations } from '@/lib/hooks/use-recommendations'
import type { Recommendation } from '@/lib/types/recommendation'
import { User, X, ExternalLink, CheckCircle, AlertTriangle, Target } from 'lucide-react'

interface RecommendationCardProps {
  recommendation: Recommendation
  onAction?: (action: string) => void
}

export function RecommendationCard({ recommendation, onAction }: RecommendationCardProps) {
  const { dismissRecommendation } = useRecommendations()
  const [isDismissing, setIsDismissing] = useState(false)

  const handleDismiss = async () => {
    setIsDismissing(true)
    const success = await dismissRecommendation(recommendation.id)
    if (success && onAction) {
      onAction('dismiss')
    }
    setIsDismissing(false)
  }

  const getPriorityIcon = () => {
    switch (recommendation.priority) {
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-error" />
      case 'high':
        return <Target className="w-4 h-4 text-warning" />
      case 'medium':
        return <CheckCircle className="w-4 h-4 text-info" />
      default:
        return <CheckCircle className="w-4 h-4 text-success" />
    }
  }

  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'urgent':
        return 'border-error/20 bg-error/5'
      case 'high':
        return 'border-warning/20 bg-warning/5'
      case 'medium':
        return 'border-info/20 bg-info/5'
      default:
        return 'border-success/20 bg-success/5'
    }
  }

  return (
    <Card className={`relative ${getPriorityColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getPriorityIcon()}
            <Badge variant="secondary" className="text-xs">
              {recommendation.category}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            disabled={isDismissing}
            className="h-6 w-6 p-0 hover:bg-destructive/10"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
        <CardDescription>{recommendation.description}</CardDescription>
      </CardHeader>

      {recommendation.action_required && recommendation.action_url && (
        <CardContent className="pt-0">
          <Button
            variant="default"
            size="sm"
            onClick={() => onAction?.('action')}
            className="w-full"
          >
            {recommendation.action_text || 'Take Action'}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      )}
    </Card>
  )
}

// Specialized recommendation cards for different types

export function ConnectionRecommendationCard({
  recommendation,
  onAction
}: {
  recommendation: Recommendation
  onAction?: (action: string) => void
}) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar size="sm" />
          <div>
            <CardTitle className="text-base">Connect with Sarah Chen</CardTitle>
            <CardDescription>Founder at TechFlow, interested in AI startups</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">
          You both work in AI/ML and have similar experience levels. This could be a valuable connection.
        </p>
        <Button variant="default" size="sm" onClick={() => onAction?.('connect')}>
          Send Connection Request
        </Button>
      </CardContent>
    </Card>
  )
}

export function OpportunityRecommendationCard({
  recommendation,
  onAction
}: {
  recommendation: Recommendation
  onAction?: (action: string) => void
}) {
  return (
    <Card className="border-accent/20 bg-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-base">Senior Product Manager Role</CardTitle>
            <CardDescription>at InnovateLab • $120k-$150k • Remote</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3">
          Matches your skills in product management and interest in healthcare technology.
        </p>
        <Button variant="default" size="sm" onClick={() => onAction?.('apply')}>
          View Opportunity
        </Button>
      </CardContent>
    </Card>
  )
}