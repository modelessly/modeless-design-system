import * as React from "react";
import { AlertTriangle, CheckCircle2, KeyRound, LockKeyhole } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../tokens";
import { CommerceFrame, commerceTone } from "./shared";

export interface CommerceTrustZone {
  id: string;
  label: string;
  level: "user" | "agent" | "merchant" | "processor" | "external";
  risk: "low" | "medium" | "high";
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CommerceTrustControl {
  id: string;
  label: string;
  status: "active" | "review" | "missing";
}

export interface CommerceTrustBoundaryProps extends React.HTMLAttributes<HTMLDivElement> {
  zones: CommerceTrustZone[];
  controls: CommerceTrustControl[];
  selectedZone?: string;
  motion?: ModelessMotionIntensity;
}

const riskTone = {
  low: "safe",
  medium: "review",
  high: "risk",
} as const;

const controlIcon = {
  active: CheckCircle2,
  review: KeyRound,
  missing: AlertTriangle,
} satisfies Record<CommerceTrustControl["status"], React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>>;

export function CommerceTrustBoundary({
  zones,
  controls,
  selectedZone,
  motion = "subtle",
  className,
  ...props
}: CommerceTrustBoundaryProps) {
  const selected = selectedZone ?? zones.find((zone) => zone.risk === "high")?.id;

  return (
    <CommerceFrame title="Commerce Trust Boundary" eyebrow="permission / liability / control" motion={motion} className={className} {...props}>
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <svg className="min-h-72 w-full border border-border bg-grid-thin" viewBox="0 0 640 330" role="img" aria-label="Commerce trust boundary map">
          <rect x="28" y="28" width="584" height="274" fill="none" stroke="hsl(var(--border))" strokeDasharray="6 8" />
          <path className={cn(motion !== "off" && "motion-trace-draw")} d="M 80 270 C 170 70, 280 260, 382 105 S 520 120, 574 62" fill="none" stroke="hsl(var(--primary) / 0.62)" strokeWidth="2" />
          {zones.map((zone, index) => {
            const isSelected = zone.id === selected;
            return (
              <g key={zone.id} className={cn(motion !== "off" && isSelected && "motion-data-node")} style={{ "--motion-index": index } as React.CSSProperties}>
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill={isSelected ? "hsl(var(--primary) / 0.14)" : "hsl(var(--background) / 0.88)"}
                  stroke={commerceTone(riskTone[zone.risk])}
                  strokeWidth={isSelected ? 2 : 1}
                />
                <text x={zone.x + 10} y={zone.y + 22} fill="hsl(var(--foreground))" fontFamily="monospace" fontSize="10">
                  {zone.label}
                </text>
                <text x={zone.x + 10} y={zone.y + 42} fill="hsl(var(--muted-foreground))" fontFamily="monospace" fontSize="8">
                  {zone.level} / {zone.risk}
                </text>
              </g>
            );
          })}
        </svg>
        <aside className="grid min-w-0 content-start gap-2">
          {controls.map((control, index) => {
            const Icon = controlIcon[control.status];
            return (
              <div key={control.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 border border-border bg-background p-3">
                <Icon aria-hidden={true} className="h-4 w-4" style={{ color: commerceTone(control.status === "missing" ? "risk" : control.status === "review" ? "review" : "safe") }} />
                <span className="text-xs text-foreground">{control.label}</span>
                <span
                  className={cn("h-2 w-6", motion !== "off" && "motion-data-cell")}
                  style={{ background: commerceTone(control.status === "missing" ? "risk" : control.status === "review" ? "review" : "safe"), "--motion-index": index } as React.CSSProperties}
                  aria-hidden={true}
                />
              </div>
            );
          })}
          <div className="border border-primary bg-primary/10 p-3">
            <LockKeyhole aria-hidden={true} className="mb-2 h-4 w-4 text-primary" />
            <p className="text-xs leading-5 text-foreground/80">Trust boundaries separate user authority, delegated agent action, merchant systems, processors, and external dependencies.</p>
          </div>
        </aside>
      </div>
    </CommerceFrame>
  );
}
