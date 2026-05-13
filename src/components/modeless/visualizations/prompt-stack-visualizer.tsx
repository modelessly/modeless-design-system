import * as React from "react";
import { LockKeyhole, MessageSquareText, ShieldCheck } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { percent, toneColor, VisualizationFrame } from "./shared";

export interface PromptLayer {
  id: string;
  label: string;
  kind: "system" | "brand" | "user" | "context" | "memory" | "tool" | "safety" | "format";
  tokens: number;
  weight: number;
  risk?: "low" | "medium" | "high";
}

export interface PromptStackVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  layers: PromptLayer[];
  selectedLayer?: string;
  tokenCount?: number;
  riskLevel?: "low" | "medium" | "high";
  collapsed?: boolean;
  motion?: ModelessMotionIntensity;
}

const kindIcon = {
  system: LockKeyhole,
  brand: ShieldCheck,
  user: MessageSquareText,
  context: MessageSquareText,
  memory: MessageSquareText,
  tool: MessageSquareText,
  safety: ShieldCheck,
  format: LockKeyhole,
} satisfies Record<PromptLayer["kind"], React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>;

export function PromptStackVisualizer({
  layers,
  selectedLayer,
  tokenCount,
  riskLevel = "medium",
  collapsed,
  motion = "subtle",
  className,
  ...props
}: PromptStackVisualizerProps) {
  const totalTokens = tokenCount ?? layers.reduce((sum, layer) => sum + layer.tokens, 0);
  const visibleLayers = collapsed ? layers.slice(0, 5) : layers;

  return (
    <VisualizationFrame title="Prompt Stack Visualizer" eyebrow={`prompt / risk ${riskLevel}`} motion={motion} className={className} {...props}>
      <div className="grid gap-4 lg:grid-cols-[1fr_12rem]">
        <div className="relative min-h-80 overflow-hidden bg-grid-thin p-5">
          {visibleLayers.map((layer, index) => {
            const Icon = kindIcon[layer.kind];
            const selected = selectedLayer === layer.id || (!selectedLayer && index === visibleLayers.length - 2);
            return (
              <div
                key={layer.id}
                className={cn(
                  "artifact-angle artifact-angle-sm artifact-angle-frame absolute left-5 right-5 border bg-card/85 p-3 shadow-[0_18px_40px_hsl(var(--off-black)/0.32)] backdrop-blur",
                  selected ? "border-primary" : "border-border",
                  motion !== "off" && "motion-drift",
                )}
                style={{
                  top: `${20 + index * (collapsed ? 36 : 29)}px`,
                  transform: `translateX(${index * 7}px) rotate(${index % 2 === 0 ? -0.25 : 0.25}deg)`,
                  zIndex: visibleLayers.length - index,
                  opacity: 0.94 - index * 0.035,
                  animationDelay: `${index * -1.6}s`,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Icon aria-hidden={true} className="h-4 w-4 shrink-0" style={{ color: toneColor(layer.risk) }} />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-foreground">{layer.label}</p>
                      <p className="text-micro text-muted-foreground">{layer.kind} / {layer.tokens.toLocaleString()} tokens</p>
                    </div>
                  </div>
                  <span className="text-micro text-primary">{Math.round(layer.weight * 100)}%</span>
                </div>
                <div className="mt-3 h-1.5 border border-border bg-background">
                  <div className="h-full bg-primary" style={{ width: percent(layer.weight * 100) }} />
                </div>
              </div>
            );
          })}
        </div>
        <aside className="grid content-start gap-2">
          <div className="border border-border bg-background p-3">
            <p className="text-micro text-muted-foreground">total tokens</p>
            <p className="font-display text-4xl uppercase leading-none">{totalTokens.toLocaleString()}</p>
          </div>
          <div className="border border-border bg-background p-3">
            <p className="text-micro text-muted-foreground">layers</p>
            <p className="font-mono text-sm text-primary">{layers.length} active / {collapsed ? "collapsed" : "expanded"}</p>
          </div>
          <div className="border border-border bg-background p-3">
            <p className="text-micro text-muted-foreground">dominant layer</p>
            <p className="text-sm">{layers.reduce((a, b) => (a.weight > b.weight ? a : b)).label}</p>
          </div>
        </aside>
      </div>
    </VisualizationFrame>
  );
}
