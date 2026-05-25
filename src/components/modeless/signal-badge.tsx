import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const signalBadgeVariants = cva(
  "inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-micro leading-none",
  {
    variants: {
      variant: {
        live: "border-signal bg-signal text-signal-foreground",
        ready: "border-[hsl(var(--radar-blue))] bg-[hsl(var(--radar-blue)/0.2)] text-[hsl(var(--radar-blue))]",
        beta: "border-[hsl(var(--radar-blue))] bg-[hsl(var(--radar-blue)/0.2)] text-[hsl(var(--radar-blue))]",
        archived: "border-archived bg-archived/20 text-muted-foreground",
        experimental: "border-experimental bg-experimental/20 text-[hsl(var(--experimental))]",
        warning: "border-warning bg-warning/20 text-[hsl(var(--warning))]",
        success: "border-success bg-success/15 text-success",
        error: "border-destructive bg-destructive/15 text-destructive",
        stable: "border-primary/70 bg-primary/15 text-primary",
        deprecated: "border-destructive bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      variant: "stable",
    },
  },
);

export interface SignalBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof signalBadgeVariants> {}

export function SignalBadge({ className, variant, children, ...props }: SignalBadgeProps) {
  return (
    <span className={cn(signalBadgeVariants({ variant }), className)} {...props}>
      <span aria-hidden="true" className="h-1.5 w-1.5 bg-current" />
      {children ?? variant}
    </span>
  );
}
