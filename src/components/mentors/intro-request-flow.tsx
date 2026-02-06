// Intro request flow component - multi-step mentorship request wizard

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { useUiStore } from '@/lib/stores/ui-store'
import { cn } from '@/lib/utils/cn'
import { z } from 'zod'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Users,
} from 'lucide-react'

// Validation schemas for each step
const step1Schema = z.object({
  interest_reason: z.string().min(50, 'Please provide at least 50 characters explaining your interest').max(500, 'Too long (max 500 characters)'),
  current_stage: z.enum(['idea', 'mvp', 'early_traction', 'growth', 'scale']),
  goals: z.array(z.string()).min(1, 'Select at least one goal').max(3, 'Select up to 3 goals'),
})

const step2Schema = z.object({
  background: z.string().min(100, 'Please provide at least 100 characters about your background').max(1000, 'Too long (max 1000 characters)'),
  experience: z.string().min(1, 'Experience level is required'),
  skills: z.array(z.string()).min(1, 'Select at least one skill').max(5, 'Select up to 5 skills'),
  challenges: z.string().max(500, 'Too long (max 500 characters)').optional(),
})

const step3Schema = z.object({
  availability: z.array(z.string()).min(1, 'Select at least one time slot'),
  preferred_format: z.enum(['call', 'video', 'message', 'in_person']),
  time_commitment: z.enum(['15_min', '30_min', '1_hour', 'ongoing']),
  location: z.string().optional(),
})

const step4Schema = z.object({
  specific_questions: z.array(z.object({
    question: z.string().min(10, 'Question too short').max(200, 'Question too long'),
    priority: z.enum(['high', 'medium', 'low']),
  })).min(1, 'Ask at least one question').max(5, 'Maximum 5 questions'),
  expected_outcome: z.string().min(50, 'Please describe expected outcomes').max(500, 'Too long'),
  follow_up_agreement: z.boolean().refine(val => val === true, 'You must agree to follow up'),
})

type Step1Data = z.infer<typeof step1Schema>
type Step2Data = z.infer<typeof step2Schema>
type Step3Data = z.infer<typeof step3Schema>
type Step4Data = z.infer<typeof step4Schema>

interface IntroRequestFlowProps {
  mentor: {
    uid: string
    display_name: string
    avatar_url?: string
    title?: string
    company_name?: string
    expertise: string[]
  }
  isOpen: boolean
  onClose: () => void
  onSubmit: (requestData: any) => void
}

const goals = [
  'Product Strategy',
  'Fundraising',
  'Team Building',
  'Market Expansion',
  'Technical Architecture',
  'User Growth',
  'Operations',
  'Leadership Development',
  'Industry Connections',
  'Personal Growth',
]

const skills = [
  'Entrepreneurship',
  'Product Management',
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Finance',
  'Legal',
  'Operations',
  'AI/ML',
  'Data Science',
  'Blockchain',
  'Mobile Development',
  'Web Development',
]

const timeSlots = [
  'Weekdays 9AM-12PM EST',
  'Weekdays 12PM-5PM EST',
  'Weekdays 5PM-8PM EST',
  'Weekends 9AM-12PM EST',
  'Weekends 12PM-5PM EST',
  'Weekends 5PM-8PM EST',
]

export function IntroRequestFlow({ mentor, isOpen, onClose, onSubmit }: IntroRequestFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [stepData, setStepData] = useState<{
    step1?: Step1Data
    step2?: Step2Data
    step3?: Step3Data
    step4?: Step4Data
  }>({})
  const { addToast } = useUiStore()

  const totalSteps = 4

  const handleNext = (data: any) => {
    setStepData(prev => ({ ...prev, [`step${currentStep}`]: data }))
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinalSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinalSubmit = () => {
    const completeData = {
      mentor_id: mentor.uid,
      ...stepData,
      submitted_at: new Date(),
    }

    onSubmit(completeData)
    addToast({
      type: 'success',
      title: 'Mentorship request sent!',
      description: 'The mentor will review your request and get back to you soon.',
    })
    onClose()
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Form onSubmit={handleNext} initialData={stepData.step1} />
      case 2:
        return <Step2Form onSubmit={handleNext} initialData={stepData.step2} />
      case 3:
        return <Step3Form onSubmit={handleNext} initialData={stepData.step3} />
      case 4:
        return <Step4Form onSubmit={handleNext} initialData={stepData.step4} />
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Request Mentorship from {mentor.display_name}
          </DialogTitle>
          <DialogDescription>
            Complete this form to submit a personalized mentorship request
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-6">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className="flex items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                i + 1 <= currentStep
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}>
                {i + 1 <= currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < totalSteps - 1 && (
                <div className={cn(
                  'w-12 h-0.5 mx-2',
                  i + 1 < currentStep ? 'bg-primary' : 'bg-muted'
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Mentor Info Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar
                src={mentor.avatar_url}
                alt={mentor.display_name}
                size="md"
              />
              <div>
                <h3 className="font-semibold">{mentor.display_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {mentor.title} at {mentor.company_name}
                </p>
                <div className="flex gap-1 mt-1">
                  {mentor.expertise.slice(0, 3).map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? onClose : handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Step 1: Interest and Goals
function Step1Form({ onSubmit, initialData }: { onSubmit: (data: Step1Data) => void, initialData?: Step1Data }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: initialData || {
      goals: [],
    },
  })

  const selectedGoals = watch('goals')

  const toggleGoal = (goal: string) => {
    const current = selectedGoals || []
    const newGoals = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal]

    setValue('goals', newGoals)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Why do you want to connect?
          </CardTitle>
          <CardDescription>
            Explain your interest in this mentor and what you're hoping to achieve
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="interest_reason">Your Interest Statement *</Label>
            <Textarea
              id="interest_reason"
              placeholder="Tell the mentor why you're reaching out and what makes them a good fit for your needs..."
              {...register('interest_reason')}
              error={errors.interest_reason?.message}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Current Business Stage</Label>
            <Select onValueChange={(value) => setValue('current_stage', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your current stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea Stage</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="early_traction">Early Traction</SelectItem>
                <SelectItem value="growth">Growth</SelectItem>
                <SelectItem value="scale">Scale</SelectItem>
              </SelectContent>
            </Select>
            {errors.current_stage && (
              <p className="text-sm text-destructive">{errors.current_stage.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Areas You Need Help With (select 1-3)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {goals.map((goal) => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${goal}`}
                    checked={selectedGoals?.includes(goal) || false}
                    onCheckedChange={() => toggleGoal(goal)}
                    disabled={!selectedGoals?.includes(goal) && (selectedGoals?.length || 0) >= 3}
                  />
                  <Label
                    htmlFor={`goal-${goal}`}
                    className="text-sm cursor-pointer"
                  >
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
            {errors.goals && (
              <p className="text-sm text-destructive">{errors.goals.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          Continue
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  )
}

// Step 2: Background and Experience
function Step2Form({ onSubmit, initialData }: { onSubmit: (data: Step2Data) => void, initialData?: Step2Data }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: initialData || {
      skills: [],
    },
  })

  const selectedSkills = watch('skills')

  const toggleSkill = (skill: string) => {
    const current = selectedSkills || []
    const newSkills = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill]

    setValue('skills', newSkills)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Background
          </CardTitle>
          <CardDescription>
            Help the mentor understand your context and experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="background">Tell us about yourself *</Label>
            <Textarea
              id="background"
              placeholder="Share your entrepreneurial journey, current projects, and relevant experience..."
              {...register('background')}
              error={errors.background?.message}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <Select onValueChange={(value) => setValue('experience', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
            {errors.experience && (
              <p className="text-sm text-destructive">{errors.experience.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Your Skills (select up to 5)</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={`skill-${skill}`}
                    checked={selectedSkills?.includes(skill) || false}
                    onCheckedChange={() => toggleSkill(skill)}
                    disabled={!selectedSkills?.includes(skill) && (selectedSkills?.length || 0) >= 5}
                  />
                  <Label
                    htmlFor={`skill-${skill}`}
                    className="text-sm cursor-pointer"
                  >
                    {skill}
                  </Label>
                </div>
              ))}
            </div>
            {errors.skills && (
              <p className="text-sm text-destructive">{errors.skills.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">Current Challenges (Optional)</Label>
            <Textarea
              id="challenges"
              placeholder="What obstacles are you facing that you hope to get advice on?"
              {...register('challenges')}
              error={errors.challenges?.message}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          Continue
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  )
}

// Step 3: Availability and Preferences
function Step3Form({ onSubmit, initialData }: { onSubmit: (data: Step3Data) => void, initialData?: Step3Data }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: initialData || {
      availability: [],
    },
  })

  const selectedAvailability = watch('availability')
  const preferredFormat = watch('preferred_format')

  const toggleAvailability = (slot: string) => {
    const current = selectedAvailability || []
    const newSlots = current.includes(slot)
      ? current.filter(s => s !== slot)
      : [...current, slot]

    setValue('availability', newSlots)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Availability & Preferences
          </CardTitle>
          <CardDescription>
            When and how would you like to connect?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Availability (select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2">
              {timeSlots.map((slot) => (
                <div key={slot} className="flex items-center space-x-2">
                  <Checkbox
                    id={`availability-${slot}`}
                    checked={selectedAvailability?.includes(slot) || false}
                    onCheckedChange={() => toggleAvailability(slot)}
                  />
                  <Label
                    htmlFor={`availability-${slot}`}
                    className="text-sm cursor-pointer"
                  >
                    {slot}
                  </Label>
                </div>
              ))}
            </div>
            {errors.availability && (
              <p className="text-sm text-destructive">{errors.availability.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preferred Format</Label>
              <Select onValueChange={(value) => setValue('preferred_format', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="How to connect" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Phone Call</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="message">Messaging</SelectItem>
                  <SelectItem value="in_person">In Person</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferred_format && (
                <p className="text-sm text-destructive">{errors.preferred_format.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Time Commitment</Label>
              <Select onValueChange={(value) => setValue('time_commitment', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Session length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15_min">15 minutes</SelectItem>
                  <SelectItem value="30_min">30 minutes</SelectItem>
                  <SelectItem value="1_hour">1 hour</SelectItem>
                  <SelectItem value="ongoing">Ongoing relationship</SelectItem>
                </SelectContent>
              </Select>
              {errors.time_commitment && (
                <p className="text-sm text-destructive">{errors.time_commitment.message}</p>
              )}
            </div>
          </div>

          {(preferredFormat === 'in_person' || preferredFormat === 'call') && (
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                placeholder="City, State or Time Zone"
                {...register('location')}
                error={errors.location?.message}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          Continue
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </form>
  )
}

// Step 4: Specific Questions and Goals
function Step4Form({ onSubmit, initialData }: { onSubmit: (data: Step4Data) => void, initialData?: Step4Data }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: initialData || {
      specific_questions: [{ question: '', priority: 'medium' }],
      follow_up_agreement: false,
    },
  })

  const questions = watch('specific_questions') || []
  const followUpAgreement = watch('follow_up_agreement')

  const addQuestion = () => {
    if (questions.length < 5) {
      setValue('specific_questions', [...questions, { question: '', priority: 'medium' }])
    }
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setValue('specific_questions', questions.filter((_, i) => i !== index))
    }
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setValue('specific_questions', updated)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Specific Questions & Goals
          </CardTitle>
          <CardDescription>
            What do you want to ask and what do you hope to achieve?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Label>Specific Questions (1-5)</Label>
            {questions.map((question, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder={`Question ${index + 1}...`}
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                    <Select
                      value={question.priority}
                      onValueChange={(value) => updateQuestion(index, 'priority', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {questions.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {questions.length < 5 && (
              <Button type="button" variant="outline" onClick={addQuestion}>
                Add Another Question
              </Button>
            )}

            {errors.specific_questions && (
              <p className="text-sm text-destructive">{errors.specific_questions.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expected_outcome">Expected Outcomes *</Label>
            <Textarea
              id="expected_outcome"
              placeholder="What do you hope to achieve from this mentorship? What success would look like?"
              {...register('expected_outcome')}
              error={errors.expected_outcome?.message}
              rows={3}
            />
          </div>

          <div className="flex items-start space-x-2 pt-4 border-t">
            <Checkbox
              id="follow_up_agreement"
              checked={followUpAgreement}
              onCheckedChange={(checked) => setValue('follow_up_agreement', checked as boolean)}
            />
            <div className="text-sm">
              <Label htmlFor="follow_up_agreement" className="cursor-pointer">
                I agree to follow up respectfully and maintain communication with the mentor
              </Label>
              {errors.follow_up_agreement && (
                <p className="text-destructive mt-1">{errors.follow_up_agreement.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Enhancement Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">AI-Enhanced Request</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your request will be analyzed and potentially enhanced with AI suggestions to improve response rates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">
          <CheckCircle className="w-4 h-4 mr-2" />
          Submit Request
        </Button>
      </div>
    </form>
  )
}