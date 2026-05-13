import * as React from "react";
import { BadgeCheck, DatabaseZap, SearchCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, CommerceMetric, clampPercent, commerceTone } from "./shared";

export interface ProductFeedReadinessItem {
  id: string;
  label: string;
  score: number;
  status: "ready" | "review" | "missing";
}

export interface ProductFeedReadinessPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  merchant: string;
  readiness: number;
  channels: ProductFeedReadinessItem[];
  requirements: ProductFeedReadinessItem[];
  motion?: ModelessMotionIntensity;
}

const readinessTone = {
  ready: "safe",
  review: "review",
  missing: "risk",
} as const;

export function ProductFeedReadinessPanel({
  merchant,
  readiness,
  channels,
  requirements,
  motion = "subtle",
  className,
  ...props
}: ProductFeedReadinessPanelProps) {
  return (
    <CommerceFrame title="Product Feed Readiness Panel" eyebrow={`${merchant} / agent catalog`} motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <div className="artifact-angle artifact-angle-frame grid place-items-center border border-border bg-background p-5">
          <div className="relative h-44 w-44">
            <svg viewBox="0 0 160 160" className="h-full w-full" role="img" aria-label="Product feed readiness meter">
              <rect x="18" y="18" width="124" height="124" fill="none" stroke="hsl(var(--border))" />
              <path
                className={cn(motion !== "off" && "motion-trace-draw")}
                d={`M 18 142 L ${18 + (readiness / 100) * 124} 142 L ${18 + (readiness / 100) * 124} 18`}
                fill="none"
                stroke={commerceTone(readiness > 80 ? "safe" : readiness > 58 ? "review" : "risk")}
                strokeWidth="10"
              />
              <path d="M 42 96 L 78 54 L 122 104" fill="none" stroke="hsl(var(--primary) / 0.38)" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <DatabaseZap aria-hidden={true} className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="font-display text-4xl uppercase leading-none">{readiness}%</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid min-w-0 gap-3">
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <CommerceMetric label="merchant" value={merchant} tone="settled" />
            <CommerceMetric label="readiness" value={`${readiness}%`} tone={readiness > 80 ? "safe" : "review"} />
            <CommerceMetric label="channels" value={String(channels.length)} tone="machine" />
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            <ReadinessList title="agent channels" icon={SearchCheck} items={channels} motion={motion} />
            <ReadinessList title="requirements" icon={BadgeCheck} items={requirements} motion={motion} />
          </div>
        </div>
      </div>
    </CommerceFrame>
  );
}

function ReadinessList({
  title,
  icon: Icon,
  items,
  motion,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  items: ProductFeedReadinessItem[];
  motion: ModelessMotionIntensity;
}) {
  return (
    <div className="border border-border bg-background p-3">
      <div className="mb-3 flex items-center gap-2">
        <Icon aria-hidden={true} className="h-4 w-4 text-primary" />
        <p className="text-micro text-muted-foreground">{title}</p>
      </div>
      <div className="grid gap-2">
        {items.map((item, index) => (
          <div key={item.id} className="grid gap-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-foreground">{item.label}</span>
              <span className="text-micro" style={{ color: commerceTone(readinessTone[item.status]) }}>{item.status}</span>
            </div>
            <div className="h-2 border border-border bg-card">
              <div
                className={cn("h-full", motion !== "off" && "motion-data-cell")}
                style={{ width: clampPercent(item.score), background: commerceTone(readinessTone[item.status]), "--motion-index": index } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
