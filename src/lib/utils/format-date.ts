import { format, formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisYear } from 'date-fns'

// Format date for display
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isToday(dateObj)) {
    return format(dateObj, 'HH:mm')
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }

  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEEE')
  }

  if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM d')
  }

  return format(dateObj, 'MMM d, yyyy')
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Format for messages/conversations
export function formatMessageTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isToday(dateObj)) {
    return format(dateObj, 'HH:mm')
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }

  if (isThisWeek(dateObj)) {
    return format(dateObj, 'EEE')
  }

  if (isThisYear(dateObj)) {
    return format(dateObj, 'MMM d')
  }

  return format(dateObj, 'MM/dd/yy')
}

// Format for posts and activities
export function formatPostTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Format for notifications
export function formatNotificationTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true })
}

// Format for opportunity deadlines
export function formatDeadline(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'HH:mm')}`
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday'
  }

  const daysDiff = Math.ceil((dateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  if (daysDiff === 1) {
    return 'Tomorrow'
  }

  if (daysDiff > 1 && daysDiff <= 7) {
    return `In ${daysDiff} days`
  }

  return format(dateObj, 'MMM d, yyyy')
}

// Format date range
export function formatDateRange(startDate: Date | string, endDate?: Date | string): string {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate

  if (!endDate) {
    return format(start, 'MMM d, yyyy')
  }

  const end = typeof endDate === 'string' ? new Date(endDate) : endDate

  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = sameYear && start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${format(start, 'MMM d')}-${format(end, 'd, yyyy')}`
  }

  if (sameYear) {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`
  }

  return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`
}

// Check if date is in the past
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj < new Date()
}

// Check if date is in the future
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj > new Date()
}