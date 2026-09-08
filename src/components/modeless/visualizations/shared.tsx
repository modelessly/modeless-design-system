import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";

export interface VisualizationBaseProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  eyebrow?: string;
  motion?: ModelessMotionIntensity;
  compact?: boolean;
}

export function VisualizationFrame({
  title,
  eyebrow,
  motion = "subtle",
  compact,
  className,
  children,
  ...props
}: VisualizationBaseProps) {
  return (
    <section
      className={cn(
        "artifact-angle artifact-angle-frame live-surface relative min-w-0 max-w-full overflow-hidden border border-border bg-card text-card-foreground",
        `modeless-motion-${motion}`,
        className,
      )}
      {...props}
    >
      {(title || eyebrow) && (
        <header className="flex min-h-11 items-center justify-between gap-3 border-b border-border px-3 py-2">
          <div className="min-w-0">
            {eyebrow ? <p className="text-micro text-muted-foreground">{eyebrow}</p> : null}
            {title ? <h3 className="truncate font-display text-xl uppercase leading-none">{title}</h3> : null}
          </div>
          <span className="h-2 w-2 shrink-0 bg-primary shadow-[0_0_16px_hsl(var(--primary)/0.35)]" aria-hidden={true} />
        </header>
      )}
      <div className={cn("relative z-10", compact ? "p-3" : "p-4")}>{children}</div>
    </section>
  );
}

export function toneColor(tone?: string) {
  switch (tone) {
    // Finished states resolve to --success. Without these they fall through to
    // the default below, which is acid lime — the colour reserved for live.
    case "success":
    case "complete":
    case "completed":
    case "resolved":
    case "done":
      return "hsl(var(--success))";
    case "warning":
    case "risk":
    case "failed":
    case "high":
      return "hsl(var(--warning))";
    case "experimental":
    case "human":
      return "hsl(var(--experimental))";
    case "system":
    case "chain":
      return "hsl(var(--radar-blue))";
    case "muted":
    case "low":
      return "hsl(var(--muted-foreground))";
    default:
      return "hsl(var(--primary))";
  }
}

export function scoreTone(score: number) {
  if (score >= 0.78) return "bg-primary text-primary-foreground";
  if (score >= 0.55) return "bg-[hsl(var(--radar-blue)/0.32)] text-foreground";
  if (score >= 0.34) return "bg-warning/35 text-foreground";
  return "bg-destructive/45 text-foreground";
}

export function percent(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`;
}
