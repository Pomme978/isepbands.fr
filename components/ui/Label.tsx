// components/ui/Label.tsx (MODIFIÉ)
import * as React from "react"
import { cn } from "@/lib/utils"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  icon?: React.ReactNode
  isValid?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, icon, isValid, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 mb-1",
          className
        )}
        {...props}
      >
        {icon && (
          <span className="text-gray-500 w-4 h-4 flex items-center justify-center">
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
        {isValid && (
          <span className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
            <i className="fas fa-check text-white text-xs"></i>
          </span>
        )}
      </label>
    )
  }
)
Label.displayName = "Label"

export { Label }