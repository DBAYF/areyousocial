import * as React from "react"
import { cn } from "@/lib/utils/cn"
import { Label } from "./label"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
  showCharCount?: boolean
  containerClassName?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, maxLength, showCharCount = false, containerClassName, id, value, ...props }, ref) => {
    const textareaId = id || React.useId()
    const hasError = !!error
    const charCount = String(value || '').length
    const isOverLimit = maxLength && charCount > maxLength

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {label && (
          <Label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium",
              hasError && "text-error"
            )}
          >
            {label}
          </Label>
        )}

        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
            hasError && "border-error focus-visible:ring-error",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />

        <div className="flex justify-between items-center">
          {(error || helperText) && (
            <div className={cn(
              "text-xs",
              hasError ? "text-error" : "text-muted-foreground"
            )}>
              {error || helperText}
            </div>
          )}

          {showCharCount && maxLength && (
            <div className={cn(
              "text-xs text-muted-foreground ml-auto",
              isOverLimit && "text-error"
            )}>
              {charCount}/{maxLength}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }