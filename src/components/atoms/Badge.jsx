import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  variant = "default", 
  size = "md",
  className,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary to-primary/80 text-white",
    secondary: "bg-gradient-to-r from-secondary to-secondary/80 text-white",
    accent: "bg-gradient-to-r from-accent to-warning text-white",
    success: "bg-gradient-to-r from-success to-success/80 text-white",
    warning: "bg-gradient-to-r from-warning to-warning/80 text-white",
    error: "bg-gradient-to-r from-error to-error/80 text-white"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;