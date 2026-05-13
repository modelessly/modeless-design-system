import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const modelessButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap border font-mono text-label transition-[background-color,border-color,color,box-shadow,transform] hover:-translate-y-px active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary text-primary-foreground hover:bg-primary/86",
        signal: "border-signal bg-signal text-signal-foreground shadow-[0_0_20px_hsl(var(--signal)/0.18)] hover:bg-signal/88",
        ghost: "border-transparent bg-transparent text-foreground hover:border-border hover:bg-muted",
        terminal: "terminal-glow border-terminal-foreground/35 bg-terminal text-terminal-foreground hover:bg-terminal-foreground/10",
        artifact: "border-artifact bg-artifact text-artifact-foreground hover:bg-artifact/88",
        destructive: "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/88",
        outline: "border-border bg-transparent text-foreground hover:border-primary hover:text-primary",
      },
      size: {
        sm: "h-8 px-3 text-[0.68rem]",
        md: "h-10 px-4",
        lg: "h-12 px-5 text-xs",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ModelessButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof modelessButtonVariants> {}

export interface ModelessButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof modelessButtonVariants> {}

export const ModelessButton = React.forwardRef<HTMLButtonElement, ModelessButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(modelessButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
ModelessButton.displayName = "ModelessButton";

export const ModelessButtonLink = React.forwardRef<HTMLAnchorElement, ModelessButtonLinkProps>(
  ({ className, variant, size, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(modelessButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
ModelessButtonLink.displayName = "ModelessButtonLink";
