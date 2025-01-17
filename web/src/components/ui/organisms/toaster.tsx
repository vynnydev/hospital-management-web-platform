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

export function Toaster({ className }: { className?: string }) {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]", 
        className
      )} />
    </ToastProvider>
  )
}
