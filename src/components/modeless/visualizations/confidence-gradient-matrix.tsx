import * as React from "react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { scoreTone, VisualizationFrame } from "./shared";

export interface ConfidenceRow {
  id: string;
  label: string;
  section?: string;
}

export interface ConfidenceGradientMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  rows: ConfidenceRow[];
  dimensions: string[];
  scores: Record<string, Record<string, number>>;
  thresholds?: { low: number; medium: number; high: number };
  showLabels?: boolean;
  variant?: "claims" | "workflow";
  motion?: ModelessMotionIntensity;
}

export function ConfidenceGradientMatrix({
  rows,
  dimensions,
  scores,
  thresholds,
  showLabels = true,
  variant = "claims",
  motion = "subtle",
  className,
  ...props
}: ConfidenceGradientMatrixProps) {
  const average = rows.reduce((sum, row) => {
    const rowScores = dimensions.map((dimension) => scores[row.id]?.[dimension] ?? 0);
    return sum + rowScores.reduce((a, b) => a + b, 0) / rowScores.length;
  }, 0) / rows.length;

  return (
    <VisualizationFrame title="Confidence Gradient Matrix" eyebrow={`${variant} / avg ${Math.round(average * 100)}%`} motion={motion} className={className} {...props}>
      <div className="overflow-x-auto">
        <div className="min-w-[42rem]">
          <div className="grid gap-px bg-border" style={{ gridTemplateColumns: `13rem repeat(${dimensions.length}, minmax(4.5rem, 1fr))` }}>
            <div className="bg-background p-2 text-micro text-muted-foreground">output section</div>
            {dimensions.map((dimension) => (
              <div key={dimension} className="bg-background p-2 text-micro text-muted-foreground">{dimension}</div>
            ))}
            {rows.map((row, rowIndex) => (
              <React.Fragment key={row.id}>
                <div className="bg-card p-2">
                  <p className="text-sm text-foreground">{row.label}</p>
                  {row.section ? <p className="text-micro text-muted-foreground">{row.section}</p> : null}
                </div>
                {dimensions.map((dimension, index) => {
                  const score = scores[row.id]?.[dimension] ?? 0;
                  return (
                    <div key={`${row.id}-${dimension}`} className="bg-card p-1">
                      <div
                        className={cn(
                          "flex h-12 items-center justify-center border border-background font-mono text-xs",
                          scoreTone(score),
                          motion !== "off" && "motion-data-cell",
                        )}
                        style={{ opacity: 0.62 + score * 0.38, "--motion-index": rowIndex + index } as React.CSSProperties}
                      >
                        {showLabels ? Math.round(score * 100) : null}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {thresholds ? (
        <p className="mt-3 text-micro text-muted-foreground">
          thresholds / low {thresholds.low} / medium {thresholds.medium} / high {thresholds.high}
        </p>
      ) : null}
    </VisualizationFrame>
  );
}
