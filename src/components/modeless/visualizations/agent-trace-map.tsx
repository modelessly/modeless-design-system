import * as React from "react";
import { AlertTriangle, CheckCircle2, GitFork, Search, Terminal, UserRound } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { toneColor, VisualizationFrame } from "./shared";

export type AgentTraceStepType = "intent" | "plan" | "retrieval" | "tool" | "decision" | "failure" | "output";
export type AgentTraceStatus = "running" | "complete" | "failed" | "review";

export interface AgentTraceStep {
  id: string;
  label: string;
  type: AgentTraceStepType;
  detail?: string;
  confidence?: number;
  risk?: "low" | "medium" | "high";
  x: number;
  y: number;
  parentId?: string;
}

export interface AgentTraceMapProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: AgentTraceStep[];
  activeStep?: string;
  status?: AgentTraceStatus;
  confidence?: number;
  showFailures?: boolean;
  compact?: boolean;
  motion?: ModelessMotionIntensity;
}

const iconMap = {
  intent: UserRound,
  plan: GitFork,
  retrieval: Search,
  tool: Terminal,
  decision: GitFork,
  failure: AlertTriangle,
  output: CheckCircle2,
} satisfies Record<AgentTraceStepType, React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>;

export function AgentTraceMap({
  steps,
  activeStep,
  status = "running",
  confidence = 0.74,
  showFailures = true,
  compact,
  motion = "subtle",
  className,
  ...props
}: AgentTraceMapProps) {
  const visibleSteps = showFailures ? steps : steps.filter((step) => step.type !== "failure");
  const active = activeStep ?? visibleSteps.find((step) => step.type === "tool")?.id ?? visibleSteps[0]?.id;

  return (
    <VisualizationFrame title="Agent Trace Map" eyebrow={`agent / ${status}`} motion={motion} compact={compact} className={className} {...props}>
      <div className="grid gap-4 lg:grid-cols-[1fr_13rem]">
        <svg className="min-h-72 w-full bg-grid-thin" viewBox="0 0 640 320" role="img" aria-label="AI agent execution trace map">
          {visibleSteps.map((step) => {
            const parent = visibleSteps.find((item) => item.id === step.parentId);
            if (!parent) return null;
            const failed = step.type === "failure";
            return (
              <path
                key={`${parent.id}-${step.id}`}
                className={cn(motion !== "off" && "motion-trace-draw")}
                d={`M ${parent.x} ${parent.y} C ${(parent.x + step.x) / 2} ${parent.y}, ${(parent.x + step.x) / 2} ${step.y}, ${step.x} ${step.y}`}
                fill="none"
                stroke={toneColor(failed ? "failed" : step.risk)}
                strokeDasharray={failed ? "4 7" : undefined}
                strokeOpacity={failed ? 0.46 : 0.72}
                strokeWidth="2"
              />
            );
          })}
          {visibleSteps.map((step, index) => {
            const Icon = iconMap[step.type];
            const isActive = step.id === active;
            return (
              <g key={step.id} className={cn(motion !== "off" && isActive && "motion-data-node")} style={{ "--motion-index": index } as React.CSSProperties}>
                <rect
                  x={step.x - 42}
                  y={step.y - 24}
                  width="84"
                  height="48"
                  fill={isActive ? "hsl(var(--primary) / 0.18)" : "hsl(var(--background) / 0.92)"}
                  stroke={toneColor(step.type === "failure" ? "failed" : step.risk)}
                  strokeWidth={isActive ? 2 : 1}
                />
                <Icon aria-hidden={true} className="text-primary" x={step.x - 32} y={step.y - 8} width="16" height="16" />
                <text x={step.x - 8} y={step.y - 2} fill="hsl(var(--foreground))" fontFamily="monospace" fontSize="9">
                  {step.type.toUpperCase()}
                </text>
                <text x={step.x - 32} y={step.y + 14} fill="hsl(var(--muted-foreground))" fontFamily="monospace" fontSize="8">
                  {Math.round((step.confidence ?? confidence) * 100)}% / {step.risk ?? "low"}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="grid content-start gap-2">
          <div className="border border-border bg-background p-3">
            <p className="text-micro text-muted-foreground">confidence</p>
            <p className="font-display text-4xl uppercase leading-none">{Math.round(confidence * 100)}%</p>
          </div>
          {visibleSteps.slice(0, compact ? 4 : 7).map((step) => (
            <div key={step.id} className={cn("border border-border bg-background p-2", step.id === active && "border-primary")}>
              <p className="text-micro text-muted-foreground">{step.type}</p>
              <p className="text-sm text-foreground">{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    </VisualizationFrame>
  );
}
