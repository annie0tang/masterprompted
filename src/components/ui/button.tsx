import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary variants
        default: "bg-gray-900 text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:text-gray-500",
        outline: "border border-gray-900 bg-transparent text-gray-900 hover:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400",
        ghost: "bg-transparent text-gray-900 hover:underline disabled:text-gray-400",
        
        // Secondary variants
        secondary: "bg-green-400 text-gray-900 hover:bg-green-300 disabled:bg-gray-200 disabled:text-gray-400",
        "secondary-outline": "border border-green-400 bg-transparent text-gray-900 hover:bg-green-50 disabled:border-gray-300 disabled:text-gray-400",
        "secondary-ghost": "bg-transparent text-gray-900 hover:underline disabled:text-gray-400",
        
        // Legacy variants for compatibility
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-sm rounded-md",
        lg: "h-12 px-6 text-base rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
