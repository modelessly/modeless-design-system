import * as React from "react";
import { Eye, Link2, ShieldAlert } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { toneColor, VisualizationFrame } from "./shared";

export interface TrustZone {
  id: string;
  label: string;
  level: "low" | "review" | "high" | "irreversible" | "external";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TrustDependency {
  from: string;
  to: string;
  label: string;
}

export interface TrustRisk {
  label: string;
  level: "low" | "medium" | "high";
}

export interface TrustSurfaceMapProps extends React.HTMLAttributes<HTMLDivElement> {
  zones: TrustZone[];
  dependencies: TrustDependency[];
  risks: TrustRisk[];
  selectedZone?: string;
  domain?: "ai" | "web3" | "product";
  showLegend?: boolean;
  motion?: ModelessMotionIntensity;
}

const levelFill: Record<TrustZone["level"], string> = {
  low: "hsl(var(--primary) / 0.16)",
  review: "hsl(var(--radar-blue) / 0.18)",
  high: "hsl(var(--warning) / 0.2)",
  irreversible: "hsl(var(--destructive) / 0.24)",
  external: "hsl(var(--experimental) / 0.2)",
};

export function TrustSurfaceMap({
  zones,
  dependencies,
  risks,
  selectedZone,
  domain = "ai",
  showLegend = true,
  motion = "subtle",
  className,
  ...props
}: TrustSurfaceMapProps) {
  const selected = selectedZone ?? zones.find((zone) => zone.level === "irreversible")?.id;

  return (
    <VisualizationFrame title="Trust Surface Map" eyebrow={`trust / ${domain}`} motion={motion} className={className} {...props}>
      <div className="grid gap-4 lg:grid-cols-[1fr_14rem]">
        <svg className="min-h-80 w-full bg-grid-dotted" viewBox="0 0 640 360" role="img" aria-label="Layered trust surface map">
          {dependencies.map((dependency) => {
            const from = zones.find((zone) => zone.id === dependency.from);
            const to = zones.find((zone) => zone.id === dependency.to);
            if (!from || !to) return null;
            return (
              <path
                key={`${dependency.from}-${dependency.to}`}
                className={cn(motion !== "off" && "motion-connection")}
                d={`M ${from.x + from.width / 2} ${from.y + from.height / 2} L ${to.x + to.width / 2} ${to.y + to.height / 2}`}
                stroke="hsl(var(--border))"
                strokeWidth="2"
                strokeDasharray="5 8"
              />
            );
          })}
          {zones.map((zone, index) => {
            const active = zone.id === selected;
            return (
              <g key={zone.id} className={cn(active && motion !== "off" && "motion-data-node")} style={{ "--motion-index": index } as React.CSSProperties}>
                <rect x={zone.x} y={zone.y} width={zone.width} height={zone.height} fill={levelFill[zone.level]} stroke={active ? "hsl(var(--primary))" : toneColor(zone.level === "external" ? "experimental" : zone.level)} strokeWidth={active ? 2 : 1} />
                <text x={zone.x + 12} y={zone.y + 24} fill="hsl(var(--foreground))" fontFamily="monospace" fontSize="11">{zone.label}</text>
                <text x={zone.x + 12} y={zone.y + 42} fill="hsl(var(--muted-foreground))" fontFamily="monospace" fontSize="9">{zone.level}</text>
              </g>
            );
          })}
        </svg>
        <aside className="grid content-start gap-2">
          {showLegend ? (
            <div className="border border-border bg-background p-3">
              <div className="mb-2 flex items-center gap-2 text-primary"><Eye aria-hidden={true} className="h-4 w-4" /><span className="text-micro">legend</span></div>
              {Object.keys(levelFill).map((level) => (
                <div key={level} className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="h-2 w-2" style={{ background: levelFill[level as TrustZone["level"]] }} />
                  {level}
                </div>
              ))}
            </div>
          ) : null}
          <div className="border border-border bg-background p-3">
            <div className="mb-2 flex items-center gap-2 text-primary"><ShieldAlert aria-hidden={true} className="h-4 w-4" /><span className="text-micro">risks</span></div>
            {risks.map((risk) => (
              <p key={risk.label} className="text-xs leading-5 text-muted-foreground">{risk.level} / {risk.label}</p>
            ))}
          </div>
          <div className="border border-border bg-background p-3">
            <div className="mb-2 flex items-center gap-2 text-primary"><Link2 aria-hidden={true} className="h-4 w-4" /><span className="text-micro">dependencies</span></div>
            <p className="text-xs leading-5 text-muted-foreground">{dependencies.length} cross-boundary trust links</p>
          </div>
        </aside>
      </div>
    </VisualizationFrame>
  );
}
