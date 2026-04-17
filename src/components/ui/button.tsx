import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] px-4 py-2 text-white hover:bg-[var(--primary-strong)]",
        secondary: "bg-white/80 px-4 py-2 text-[var(--foreground)] ring-1 ring-black/10 hover:bg-white",
        ghost: "px-3 py-2 text-[var(--muted-foreground)] hover:bg-black/5 hover:text-[var(--foreground)]",
      },
      size: {
        default: "h-11",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 px-5 text-base",
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
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
