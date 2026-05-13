import * as React from "react";
import { Activity, Cpu, Gauge } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, CommerceMetric, clampPercent, commerceTone } from "./shared";

export interface MachinePaymentMetric {
  id: string;
  label: string;
  value: number;
  max: number;
  unit: string;
  tone?: "safe" | "review" | "risk" | "machine";
}

export interface MachinePaymentMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  agentName: string;
  period: string;
  totalSpend: string;
  settlementRate: number;
  metrics: MachinePaymentMetric[];
  motion?: ModelessMotionIntensity;
}

export function MachinePaymentMeter({
  agentName,
  period,
  totalSpend,
  settlementRate,
  metrics,
  motion = "subtle",
  className,
  ...props
}: MachinePaymentMeterProps) {
  return (
    <CommerceFrame title="Machine Payment Meter" eyebrow={`${agentName} / ${period}`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="artifact-angle artifact-angle-frame grid place-items-center border border-border bg-background p-5">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 160 160" className="h-full w-full" role="img" aria-label="Machine payment settlement meter">
              <circle cx="80" cy="80" r="62" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
              <circle
                className={cn(motion !== "off" && "motion-trace-draw")}
                cx="80"
                cy="80"
                r="62"
                fill="none"
                stroke={commerceTone(settlementRate > 94 ? "safe" : settlementRate > 82 ? "review" : "risk")}
                strokeWidth="8"
                strokeDasharray={`${Math.min(390, (settlementRate / 100) * 390)} 390`}
                transform="rotate(-90 80 80)"
              />
              <path d="M 42 88 H 62 L 72 64 L 90 108 L 100 82 H 122" fill="none" stroke="hsl(var(--primary) / 0.42)" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <Cpu aria-hidden={true} className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="font-display text-4xl uppercase leading-none">{settlementRate}%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 gap-3">
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <CommerceMetric label="spend" value={totalSpend} tone="safe" />
            <CommerceMetric label="settled" value={`${settlementRate}%`} tone={settlementRate > 94 ? "safe" : "review"} />
            <CommerceMetric label="period" value={period} tone="machine" />
          </div>
          <div className="grid gap-2">
            {metrics.map((metric, index) => {
              const percent = (metric.value / Math.max(metric.max, 1)) * 100;
              return (
                <div key={metric.id} className="grid gap-2 border border-border bg-background p-3 sm:grid-cols-[8rem_minmax(0,1fr)_5rem] sm:items-center">
                  <div className="flex items-center gap-2">
                    {index % 2 === 0 ? <Gauge aria-hidden={true} className="h-4 w-4 text-primary" /> : <Activity aria-hidden={true} className="h-4 w-4 text-primary" />}
                    <span className="text-xs text-foreground">{metric.label}</span>
                  </div>
                  <div className="h-5 border border-border bg-card">
                    <div
                      className={cn("h-full", motion !== "off" && "motion-data-cell")}
                      style={{ width: clampPercent(percent), background: commerceTone(metric.tone ?? "safe"), "--motion-index": index } as React.CSSProperties}
                    />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">{metric.value}{metric.unit}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CommerceFrame>
  );
}
