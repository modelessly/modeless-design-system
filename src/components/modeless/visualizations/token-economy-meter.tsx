import * as React from "react";
import { Coins, Gauge, TrendingDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { percent, VisualizationFrame } from "./shared";

export interface TokenUsage {
  input: number;
  output: number;
  cached: number;
  retrieval: number;
  tool: number;
}

export interface TokenCost {
  model: number;
  retrieval: number;
  tools: number;
  perTask: number;
  perOutcome: number;
}

export interface TokenBreakdownItem {
  label: string;
  value: number;
  tone?: "signal" | "warning" | "muted";
}

export interface TokenEconomyMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  usage: TokenUsage;
  cost: TokenCost;
  savings: number;
  currency?: string;
  modelName: string;
  period: string;
  breakdown: TokenBreakdownItem[];
  motion?: ModelessMotionIntensity;
}

export function TokenEconomyMeter({
  usage,
  cost,
  savings,
  currency = "$",
  modelName,
  period,
  breakdown,
  motion = "subtle",
  className,
  ...props
}: TokenEconomyMeterProps) {
  const totalTokens = usage.input + usage.output + usage.cached + usage.retrieval + usage.tool;
  const max = Math.max(...breakdown.map((item) => item.value));

  return (
    <VisualizationFrame title="Token Economy Meter" eyebrow={`${modelName} / ${period}`} motion={motion} className={className} {...props}>
      <div className="grid gap-4 lg:grid-cols-[15rem_1fr]">
        <div className="artifact-angle artifact-angle-frame grid place-items-center border border-border bg-background p-5">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 160 160" className="h-full w-full" role="img" aria-label="Token economy radial meter">
              <circle cx="80" cy="80" r="62" fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
              <circle
                className={cn(motion !== "off" && "motion-trace-draw")}
                cx="80"
                cy="80"
                r="62"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeLinecap="square"
                strokeWidth="10"
                strokeDasharray={`${Math.min(390, (savings / Math.max(savings + cost.perTask, 1)) * 390)} 390`}
                transform="rotate(-90 80 80)"
              />
              <circle cx="80" cy="80" r="38" fill="hsl(var(--card))" stroke="hsl(var(--border))" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-micro text-muted-foreground">saved</p>
                <p className="font-display text-4xl uppercase leading-none">{currency}{savings}</p>
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">Cost avoided through automation compared with manual handling.</p>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <Metric icon={Coins} label="total tokens" value={totalTokens.toLocaleString()} />
            <Metric icon={Gauge} label="cost / task" value={`${currency}${cost.perTask.toFixed(2)}`} />
            <Metric icon={TrendingDown} label="cost / outcome" value={`${currency}${cost.perOutcome.toFixed(2)}`} />
          </div>
          <div className="grid gap-2">
            {breakdown.map((item, index) => (
              <div key={item.label} className="grid grid-cols-[8rem_1fr_4rem] items-center gap-2 text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <div className="h-5 border border-border bg-background">
                  <div
                    className={cn("h-full", item.tone === "warning" ? "bg-warning" : item.tone === "muted" ? "bg-muted-foreground" : "bg-primary", motion !== "off" && "motion-data-cell")}
                    style={{ width: percent((item.value / max) * 100), "--motion-index": index } as React.CSSProperties}
                  />
                </div>
                <span className="font-mono text-muted-foreground">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualizationFrame>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>; label: string; value: string }) {
  return (
    <div className="bg-background p-3">
      <Icon aria-hidden={true} className="mb-3 h-4 w-4 text-primary" />
      <p className="text-micro text-muted-foreground">{label}</p>
      <p className="font-display text-2xl uppercase leading-none">{value}</p>
    </div>
  );
}
