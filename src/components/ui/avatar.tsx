import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils/cn"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
        "3xl": "h-24 w-24",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  showOnlineIndicator?: boolean
  isOnline?: boolean
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  ({
    className,
    size,
    src,
    alt,
    fallback,
    showOnlineIndicator = false,
    isOnline = false,
    ...props
  }, ref) => {
    // Generate fallback initials from alt text or fallback prop
    const getFallbackText = () => {
      if (fallback) return fallback

      if (alt) {
        const words = alt.split(' ')
        if (words.length >= 2) {
          return `${words[0][0]}${words[1][0]}`.toUpperCase()
        }
        return words[0].slice(0, 2).toUpperCase()
      }

      return '?'
    }

    return (
      <div className="relative inline-block">
        <AvatarPrimitive.Root
          ref={ref}
          className={cn(avatarVariants({ size }), className)}
          {...props}
        >
          {src && (
            <AvatarPrimitive.Image
              src={src}
              alt={alt}
              className="aspect-square h-full w-full object-cover"
            />
          )}
          <AvatarPrimitive.Fallback
            className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium text-muted-foreground"
          >
            {getFallbackText()}
          </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>

        {showOnlineIndicator && (
          <div
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
              isOnline ? "bg-success" : "bg-muted-foreground"
            )}
            aria-label={isOnline ? "Online" : "Offline"}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = AvatarPrimitive.Root.displayName

export { Avatar }