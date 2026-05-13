import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import type { ModelessMotionIntensity } from "../../tokens";

export const modelessPanelVariants = cva(
  "artifact-angle artifact-angle-frame live-surface relative overflow-hidden border text-card-foreground",
  {
    variants: {
      variant: {
        default: "border-border bg-card",
        terminal: "terminal-glow scanline-overlay border-terminal-foreground/30 bg-terminal text-terminal-foreground [--artifact-frame-color:hsl(var(--terminal-foreground)/0.3)]",
        artifact: "border-artifact bg-artifact text-artifact-foreground",
        noisy: "noise-overlay border-border bg-card",
        inverted: "border-foreground bg-foreground text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ModelessPanelProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title">,
    VariantProps<typeof modelessPanelVariants> {
  title?: React.ReactNode;
  eyebrow?: React.ReactNode;
  index?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  motion?: ModelessMotionIntensity;
}

export function ModelessPanel({
  className,
  variant,
  title,
  eyebrow,
  index,
  actions,
  footer,
  motion = "subtle",
  children,
  ...props
}: ModelessPanelProps) {
  return (
    <section className={cn(modelessPanelVariants({ variant }), `modeless-motion-${motion}`, className)} {...props}>
      {(title || eyebrow || index || actions) && (
        <header className="relative z-10 flex min-h-12 items-center justify-between gap-3 border-b border-current/18 py-3 pl-[calc(var(--angle-cut)+0.75rem)] pr-5 md:pr-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-micro opacity-70">
              {index && <span>{index}</span>}
              {eyebrow && <span>{eyebrow}</span>}
            </div>
            {title && <h2 className="truncate font-display text-lg uppercase leading-tight">{title}</h2>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="relative z-10 p-5 md:p-6">{children}</div>
      {footer && <footer className="relative z-10 border-t border-current/18 py-4 pl-[calc(var(--angle-cut)+0.75rem)] pr-5 md:pr-6">{footer}</footer>}
    </section>
  );
}
