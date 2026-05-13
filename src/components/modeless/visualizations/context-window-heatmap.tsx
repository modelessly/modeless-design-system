import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { percent, VisualizationFrame } from "./shared";

export interface ContextSegment {
  id: string;
  label: string;
  category: "prompt" | "history" | "documents" | "code" | "tools" | "memory" | "instructions" | "draft";
  tokens: number;
  risk?: "stale" | "duplicated" | "irrelevant" | "overcrowded" | "missing-source";
}

export interface ContextWindowHeatmapProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTokens: number;
  usedTokens: number;
  segments: ContextSegment[];
  warnings?: string[];
  selectedSegment?: string;
  density?: "compact" | "normal" | "dense";
  motion?: ModelessMotionIntensity;
}

const categoryClass: Record<ContextSegment["category"], string> = {
  prompt: "bg-primary",
  history: "bg-[hsl(var(--radar-blue))]",
  documents: "bg-[hsl(var(--electric-purple))]",
  code: "bg-[hsl(var(--warning))]",
  tools: "bg-[hsl(var(--signal-pink))]",
  memory: "bg-[hsl(var(--artifact))]",
  instructions: "bg-foreground",
  draft: "bg-muted-foreground",
};

export function ContextWindowHeatmap({
  maxTokens,
  usedTokens,
  segments,
  warnings = [],
  selectedSegment,
  density = "normal",
  motion = "subtle",
  className,
  ...props
}: ContextWindowHeatmapProps) {
  const usage = Math.round((usedTokens / maxTokens) * 100);
  const columns = density === "dense" ? "grid-cols-12" : density === "compact" ? "grid-cols-6" : "grid-cols-8";

  return (
    <VisualizationFrame title="Context Window Heatmap" eyebrow={`${usedTokens.toLocaleString()} / ${maxTokens.toLocaleString()} tokens`} motion={motion} className={className} {...props}>
      <div className="grid gap-4 lg:grid-cols-[1fr_13rem]">
        <div>
          <div className="mb-3 flex items-center justify-between text-micro text-muted-foreground">
            <span>window occupancy</span>
            <span>{usage}% used</span>
          </div>
          <div className={cn("grid gap-1 bg-background p-2", columns)} aria-label={`Context window ${usage}% used`}>
            {segments.flatMap((segment, segmentIndex) => {
              const cells = Math.max(1, Math.round((segment.tokens / maxTokens) * (density === "dense" ? 96 : 64)));
              return Array.from({ length: cells }).map((_, cellIndex) => {
                const selected = segment.id === selectedSegment;
                return (
                  <span
                    key={`${segment.id}-${cellIndex}`}
                    title={`${segment.label}: ${segment.tokens} tokens`}
                    className={cn(
                      "aspect-square border border-background",
                      categoryClass[segment.category],
                      segment.risk && "outline outline-1 outline-warning",
                      selected && "ring-2 ring-primary",
                      motion !== "off" && cellIndex % 7 === 0 && "motion-data-cell",
                    )}
                    style={{
                      opacity: segment.risk ? 0.96 : 0.5 + ((segmentIndex + cellIndex) % 5) * 0.08,
                      "--motion-index": segmentIndex + cellIndex,
                    } as React.CSSProperties}
                  />
                );
              });
            })}
          </div>
          <div className="mt-3 h-2 border border-border bg-background">
            <div className="h-full bg-primary" style={{ width: percent(usage) }} />
          </div>
        </div>
        <aside className="grid content-start gap-2">
          {warnings.map((warning) => (
            <div key={warning} className="flex gap-2 border border-warning/60 bg-warning/10 p-2">
              <AlertTriangle aria-hidden={true} className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
              <p className="text-xs leading-5 text-muted-foreground">{warning}</p>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-1 text-micro text-muted-foreground">
            {Object.keys(categoryClass).map((category) => (
              <div key={category} className="flex items-center gap-1">
                <span className={cn("h-2 w-2", categoryClass[category as ContextSegment["category"]])} />
                {category}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </VisualizationFrame>
  );
}
