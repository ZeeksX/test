import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/classNames";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-vividBlue text-white hover:bg-primary-vividBlueHover",
        secondary:
          "border-transparent bg-secondary-mutedPurple text-white hover:bg-secondary-mutedPurple/80",
        destructive:
          "border-transparent bg-primary-brightRed text-white hover:bg-primary-brightRedHover",
        outline: "text-foreground",
        success:
          "border-transparent bg-primary-livelyGreen text-white hover:bg-primary-livelyGreenHover",
        warning:
          "border-transparent bg-orange-500 text-white hover:bg-orange-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Badge = ({ className, variant, ...props }) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
};

export { Badge, badgeVariants };
