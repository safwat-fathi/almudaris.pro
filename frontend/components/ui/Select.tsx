import { ComponentProps, forwardRef } from "react";

export interface SelectProps extends ComponentProps<"select"> {
  icon?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, icon, ...props }, ref) => {
    return (
      <div className="relative group">
        <select
          ref={ref}
          className={`w-full h-14 bg-surface-container-lowest border-2 border-transparent focus:border-primary rounded-lg px-4 appearance-none text-on-surface font-medium focus:outline-none transition-all ${icon ? "pr-11" : ""} ${className}`}
          {...props}
        >
          {children}
        </select>
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
          expand_more
        </span>
        {icon && (
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">
            {icon}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
