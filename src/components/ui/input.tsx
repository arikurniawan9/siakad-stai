import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-[var(--primary)]",
        className,
      )}
      {...props}
    />
  );
}
