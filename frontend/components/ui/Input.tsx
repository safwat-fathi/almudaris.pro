import { ComponentProps, forwardRef } from "react";

export interface InputProps extends ComponentProps<"input"> {
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={`w-full h-14 bg-surface-container-lowest border-2 border-transparent focus:border-primary rounded-lg ${icon ? "px-4 pr-11" : "px-6"} text-on-surface placeholder:text-outline/50 focus:ring-0 focus:outline-none transition-all ${className}`}
          {...props}
        />
        {icon && (
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            {icon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
