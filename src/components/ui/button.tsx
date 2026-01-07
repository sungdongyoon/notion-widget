import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        "2xs":
          "h-5 px-2 text-3xs rounded-sm " +
          "xs:h-6 xs:px-2.5 xs:text-2xs " +
          "sm:h-7 sm:px-3 sm:text-xs",
        xs:
          "h-6 px-3 text-2xs rounded-sm " +
          "xs:h-7 xs:px-3 xs:text-xs " +
          "sm:h-8 sm:px-4 sm:text-sm",
        sm:
          "h-7 px-3 text-xs rounded-md " +
          "xs:h-8 xs:px-3 xs:text-sm " +
          "sm:h-8 sm:px-4 sm:text-sm",
        default:
          "h-8 px-4 text-sm rounded-md " +
          "xs:h-9 xs:px-4 xs:text-sm " +
          "sm:h-9 sm:px-5 sm:text-base",
        lg:
          "h-9 px-6 text-sm rounded-md " +
          "xs:h-10 xs:px-7 xs:text-base " +
          "sm:h-10 sm:px-8 sm:text-lg",
        icon: "h-8 w-8 rounded-md " + "xs:h-9 xs:w-9 " + "sm:h-10 sm:w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
