import * as React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import type { ModelessMotionIntensity } from "../../tokens";
import { GenerativeField } from "./generative-field";
import { ModelessButton } from "./modeless-button";
import { SignalBadge } from "./signal-badge";

export interface ProductHeroProps extends React.HTMLAttributes<HTMLElement> {
  name: string;
  eyebrow?: string;
  version?: string;
  description: string;
  status?: "live" | "beta" | "experimental" | "stable";
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  motion?: ModelessMotionIntensity;
}

export function ProductHero({
  className,
  name,
  eyebrow = "AI product artifact",
  version = "v0.1.0",
  description,
  status = "experimental",
  primaryAction,
  secondaryAction,
  motion = "live",
  ...props
}: ProductHeroProps) {
  return (
    <section className={cn("grid min-h-[620px] border-b border-border lg:grid-cols-[0.95fr_1.05fr]", className)} {...props}>
      <div className="flex flex-col justify-between gap-10 border-r border-border bg-background p-6 lg:p-10">
        <div className="flex items-center justify-between gap-3">
          <p className="text-label text-muted-foreground">{eyebrow}</p>
          <SignalBadge variant={status}>{status}</SignalBadge>
        </div>
        <div>
          <p className="text-micro text-muted-foreground">{version}</p>
          <h1 className="mt-3 font-display text-6xl uppercase leading-[0.82] tracking-normal md:text-8xl">{name}</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryAction ?? (
              <ModelessButton variant="signal">
                Try demo <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </ModelessButton>
            )}
            {secondaryAction ?? <ModelessButton variant="outline">Read docs</ModelessButton>}
          </div>
        </div>
        <div className="artifact-angle artifact-angle-frame grid grid-cols-3 gap-px border border-border bg-border text-micro">
          {["research", "interface", "service"].map((item) => (
            <div key={item} className="bg-card p-3">
              <Sparkles aria-hidden="true" className="mb-2 h-4 w-4 text-primary" />
              {item}
            </div>
          ))}
        </div>
      </div>
      <GenerativeField variant="feed" seedLabel={`${name.toUpperCase()} LIVE FEED`} className="min-h-[420px] border-0" animated motion={motion} />
    </section>
  );
}
