import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const hasStart = Boolean(startIcon);
    const hasEnd = Boolean(endIcon);

    return (
      <div className="relative flex items-center w-full">
        {hasStart && (
          <div className="absolute left-3 top-0 bottom-0 flex items-center pointer-events-none text-muted-foreground [&_svg]:size-4 z-10">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-lg border border-input bg-background text-sm ring-offset-background transition-colors",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "py-2",
            hasStart ? "pl-9" : "pl-3",
            hasEnd ? "pr-9" : "pr-3",
            className
          )}
          ref={ref}
          {...props}
        />
        {hasEnd && (
          <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none text-muted-foreground [&_svg]:size-4 z-10">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
