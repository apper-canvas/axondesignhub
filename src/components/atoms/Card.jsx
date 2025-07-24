import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className,
  hover = true,
  ...props 
}, ref) => {
  const baseClasses = "bg-surface rounded-xl border border-gray-100 shadow-md transition-shadow duration-300";
  const hoverClasses = hover ? "hover:shadow-xl hover:scale-[1.02]" : "";

  const CardComponent = hover ? motion.div : "div";
  const motionProps = hover ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      ref={ref}
      className={cn(baseClasses, hoverClasses, className)}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
});

Card.displayName = "Card";

export default Card;