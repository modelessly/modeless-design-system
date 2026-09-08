import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";

export interface CommerceFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  eyebrow?: string;
  motion?: ModelessMotionIntensity;
  children: React.ReactNode;
}

export function CommerceFrame({
  title,
  eyebrow = "agentic commerce",
  motion = "subtle",
  className,
  children,
  ...props
}: CommerceFrameProps) {
  return (
    <section
      className={cn(
        "artifact-angle artifact-angle-frame live-surface relative min-w-0 max-w-full overflow-hidden border border-border bg-card text-card-foreground",
        `modeless-motion-${motion}`,
        className,
      )}
      {...props}
    >
      <header className="grid min-h-12 grid-cols-[1fr_auto] items-center gap-3 border-b border-border px-3 py-2">
        <div className="min-w-0">
          <p className="text-micro text-muted-foreground">{eyebrow}</p>
          <h3 className="max-w-full break-words font-display text-lg uppercase leading-none sm:text-xl">{title}</h3>
        </div>
        <div className="grid h-7 w-7 place-items-center border border-border bg-background font-mono text-[0.62rem] text-primary" aria-hidden={true}>
          PAY
        </div>
      </header>
      <div className="relative z-10 min-w-0 p-3 sm:p-4">{children}</div>
    </section>
  );
}

export function clampPercent(value: number) {
  return `${Math.max(0, Math.min(100, value))}%`;
}

export function commerceTone(tone?: "safe" | "success" | "review" | "risk" | "settled" | "machine" | "muted") {
  switch (tone) {
    // Acid lime means live, never finished. A completed state resolves to
    // --success so a settled payment does not read as still in flight.
    case "success":
      return "hsl(var(--success))";
    case "review":
      return "hsl(var(--warning))";
    case "risk":
      return "hsl(var(--destructive))";
    case "settled":
      return "hsl(var(--radar-blue))";
    case "machine":
      return "hsl(var(--experimental))";
    case "muted":
      return "hsl(var(--muted-foreground))";
    default:
      return "hsl(var(--primary))";
  }
}

export function CommerceMetric({ label, value, tone = "safe" }: { label: string; value: string; tone?: "safe" | "success" | "review" | "risk" | "settled" | "machine" | "muted" }) {
  return (
    <div className="artifact-angle artifact-angle-sm artifact-angle-frame border border-border bg-background p-3">
      <p className="text-micro text-muted-foreground">{label}</p>
      <p className="mt-1 break-words font-display text-xl uppercase leading-none [overflow-wrap:anywhere] sm:text-2xl" style={{ color: commerceTone(tone) }}>
        {value}
      </p>
    </div>
  );
}
