/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
  {
    variants: {
      variant: {
        default: "bg-primary/20",
        success: "bg-green-200 dark:bg-green-950/30",
        warning: "bg-orange-200 dark:bg-orange-950/30",
        destructive: "bg-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const indicatorVariants = cva("h-full w-full flex-1 transition-all", {
  variants: {
    variant: {
      default: "bg-primary",
      success: "bg-green-500",
      warning: "bg-orange-500",
      destructive: "bg-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

// Definindo a interface ProgressProps
interface ProgressProps 
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

type ProgressRef = any;    

// Corrigindo o forwardRef com uma arrow function adequada
const Progress = React.forwardRef<ProgressRef, ProgressProps>(
  ({ className, value, variant, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(indicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);

// Adicionando o displayName
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress }