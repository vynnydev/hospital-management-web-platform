/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/organisms/toast"
import { useToast } from "@/components/ui/hooks/use-toast"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="up">
      <div className="relative">
        {toasts.map(function ({ id, title, description, action, variant, ...props }) {
          const isSuccess = title?.toLowerCase().includes('sucedido') || variant === 'default'
          const isError = variant === 'destructive'

          return (
            <Toast 
              key={id} 
              variant={variant} 
              {...props}
              className={cn(
                "min-w-[320px] -top-[700px] border shadow-lg flex items-start gap-3 p-4",
                isSuccess && "bg-green-50 border-green-500 text-green-700",
                isError && "bg-red-50 border-red-500 text-red-700"
              )}
            >
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />}
              {isError && <XCircle className="w-5 h-5 text-red-500 mt-0.5" />}
              
              <div className="grid gap-1 flex-1">
                {title && (
                  <ToastTitle className={cn(
                    "font-semibold",
                    isSuccess && "text-green-700",
                    isError && "text-red-700"
                  )}>
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className={cn(
                    isSuccess && "text-green-600",
                    isError && "text-red-600"
                  )}>
                    {description}
                  </ToastDescription>
                )}
              </div>
              <ToastClose className={cn(
                "opacity-70 transition-opacity hover:opacity-100",
                isSuccess && "text-green-700 hover:text-green-900",
                isError && "text-red-700 hover:text-red-900"
              )} />
            </Toast>
          )
        })}
      </div>
      <ToastViewport 
        className={cn(
          "fixed left-1/2 -translate-x-1/2"
        )} 
      />
    </ToastProvider>
  )
}

export default Toaster;