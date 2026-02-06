import { cn } from "@/lib/utils/cn"
import { cva, type VariantProps } from "class-variance-authority"

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "h-3 w-3",
        sm: "h-4 w-4",
        default: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-10 w-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  showLabel?: boolean
  label?: string
}

function Spinner({
  className,
  size,
  showLabel = false,
  label = "Loading...",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <div className={spinnerVariants({ size })} />
      {showLabel && (
        <span className="ml-2 text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  )
}

function SpinnerOverlay({
  className,
  size = "lg",
  label,
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Spinner size={size} showLabel label={label} />
    </div>
  )
}

export { Spinner, SpinnerOverlay }