import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 px-2.5 py-0.5",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2.5 py-0.5",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 px-2.5 py-0.5",
        outline: "text-foreground px-2.5 py-0.5",
        // VeChain specific variants
        vechain: "border-transparent bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2.5 py-0.5",
        success: "border-transparent bg-green-500 text-white px-2.5 py-0.5",
        warning: "border-transparent bg-yellow-500 text-white px-2.5 py-0.5",
        error: "border-transparent bg-red-500 text-white px-2.5 py-0.5",
        // Large variants for landing pages
        "outline-lg": "badge-outline-lg",
        "secondary-lg": "badge-secondary-lg",
        "gradient-lg": "badge-gradient-lg",
        "glass-lg": "badge-glass-lg",
      },
      size: {
        sm: "badge-sm",
        md: "badge-md", 
        lg: "badge-lg",
        xl: "badge-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
