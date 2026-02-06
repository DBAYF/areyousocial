// Next moves panel component

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar } from '@/components/ui/avatar'
import { useRecommendations } from '@/lib/hooks/use-recommendations'
import type { NextMove } from '@/lib/types/recommendation'
import { Clock, CheckCircle, Target, Users, Zap, BookOpen, ExternalLink } from 'lucide-react'

interface NextMovesPanelProps {
  nextMoves: NextMove[]
  onMoveComplete?: (moveId: string) => void
  onMoveAction?: (moveId: string, action: string) => void
}

// Mock data for demonstration
const mockNextMoves: NextMove[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Complete your founder profile',
    description: 'Add more details about your startup journey to attract better matches',
    category: 'immediate',
    estimated_time: 'quick',
    difficulty: 'easy',
    impact: 'high',
    completed: false,
    created_at: new Date(),
  },
  {
    id: '2',
    user_id: 'user1',
    title: 'Connect with 3 mentors',
    description: 'Reach out to experienced entrepreneurs in your industry',
    category: 'short_term',
    estimated_time: 'hours',
    difficulty: 'medium',
    impact: 'high',
    completed: false,
    created_at: new Date(),
  },
  {
    id: '3',
    user_id: 'user1',
    title: 'Update your business metrics',
    description: 'Share your latest traction numbers and KPIs',
    category: 'short_term',
    estimated_time: 'quick',
    difficulty: 'easy',
    impact: 'medium',
    completed: true,
    completed_at: new Date(),
    created_at: new Date(),
  },
]

const categoryIcons = {
  immediate: <Zap className="w-4 h-4" />,
  short_term: <Clock className="w-4 h-4" />,
  long_term: <Target className="w-4 h-4" />,
}

const timeLabels = {
  quick: '5-15 min',
  hours: '1-2 hours',
  days: '1-2 days',
  weeks: '1-2 weeks',
  months: '1-2 months',
}

const difficultyColors = {
  easy: 'text-success',
  medium: 'text-warning',
  hard: 'text-error',
}

const impactColors = {
  low: 'text-muted-foreground',
  medium: 'text-info',
  high: 'text-primary',
}

export function NextMovesPanel({ nextMoves = mockNextMoves, onMoveComplete, onMoveAction }: NextMovesPanelProps) {
  const [expandedMove, setExpandedMove] = useState<string | null>(null)

  const immediateMoves = nextMoves.filter(move => move.category === 'immediate' && !move.completed)
  const shortTermMoves = nextMoves.filter(move => move.category === 'short_term' && !move.completed)
  const completedMoves = nextMoves.filter(move => move.completed)

  const completionRate = (completedMoves.length / nextMoves.length) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Your Next Moves
            </CardTitle>
            <CardDescription>
              Personalized action items to accelerate your progress
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {completedMoves.length}/{nextMoves.length} Complete
          </Badge>
        </div>
        <Progress value={completionRate} className="mt-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Immediate Actions */}
        {immediateMoves.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Immediate Actions
            </h4>
            <div className="space-y-3">
              {immediateMoves.map((move) => (
                <NextMoveItem
                  key={move.id}
                  move={move}
                  isExpanded={expandedMove === move.id}
                  onToggle={() => setExpandedMove(expandedMove === move.id ? null : move.id)}
                  onComplete={() => onMoveComplete?.(move.id)}
                  onAction={(action) => onMoveAction?.(move.id, action)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Short Term Goals */}
        {shortTermMoves.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-warning" />
              Short Term Goals
            </h4>
            <div className="space-y-3">
              {shortTermMoves.map((move) => (
                <NextMoveItem
                  key={move.id}
                  move={move}
                  isExpanded={expandedMove === move.id}
                  onToggle={() => setExpandedMove(expandedMove === move.id ? null : move.id)}
                  onComplete={() => onMoveComplete?.(move.id)}
                  onAction={(action) => onMoveAction?.(move.id, action)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Moves */}
        {completedMoves.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-foreground mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              Completed ({completedMoves.length})
            </h4>
            <div className="space-y-2">
              {completedMoves.slice(0, 3).map((move) => (
                <div key={move.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm line-through text-muted-foreground">
                    {move.title}
                  </span>
                </div>
              ))}
              {completedMoves.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{completedMoves.length - 3} more completed
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface NextMoveItemProps {
  move: NextMove
  isExpanded: boolean
  onToggle: () => void
  onComplete: () => void
  onAction: (action: string) => void
}

function NextMoveItem({ move, isExpanded, onToggle, onComplete, onAction }: NextMoveItemProps) {
  return (
    <div className="border rounded-lg p-3 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium text-sm">{move.title}</h5>
          <p className="text-xs text-muted-foreground mt-1">{move.description}</p>

          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs ${timeLabels[move.estimated_time] ? '' : 'text-muted-foreground'}`}>
              {timeLabels[move.estimated_time] || move.estimated_time}
            </span>
            <span className={`text-xs ${difficultyColors[move.difficulty]}`}>
              {move.difficulty}
            </span>
            <span className={`text-xs ${impactColors[move.impact]}`}>
              {move.impact} impact
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="ml-2"
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-3 border-t">
          {move.prerequisites && move.prerequisites.length > 0 && (
            <div>
              <h6 className="text-xs font-medium text-muted-foreground mb-1">Prerequisites</h6>
              <ul className="text-xs space-y-1">
                {move.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {move.resources && move.resources.length > 0 && (
            <div>
              <h6 className="text-xs font-medium text-muted-foreground mb-1">Resources</h6>
              <div className="space-y-1">
                {move.resources.map((resource, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-2 text-left justify-start"
                    onClick={() => onAction(`resource-${index}`)}
                  >
                    <div className="flex items-center gap-2">
                      {resource.type === 'article' && <BookOpen className="w-3 h-3" />}
                      {resource.type === 'video' && <ExternalLink className="w-3 h-3" />}
                      {resource.type === 'tool' && <Zap className="w-3 h-3" />}
                      <span className="text-xs">{resource.title}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={onComplete}
            className="w-full"
            size="sm"
          >
            Mark as Complete
          </Button>
        </div>
      )}
    </div>
  )
}