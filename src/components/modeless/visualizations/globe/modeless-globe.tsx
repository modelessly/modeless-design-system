import * as React from "react";
import { cn } from "../../../../lib/utils";
import type { ModelessMotionIntensity } from "../../../../tokens";
import { CanvasSurface } from "../canvas-surface";
import { hsl, type ModelessVisualizationPalette } from "../lib/palette";
import type { CanvasFrameInfo } from "../lib/use-canvas-animation";
import { createGlobeArc, latLonToSpherePoint, rotateY, type GlobeProjectedPoint } from "./globe-math";
import {
  drawModelessGlobeBase,
  ensureGlobeRuntime,
  type ModelessGlobeConfig,
  type ModelessGlobeFrame,
  type ModelessGlobeRuntime,
} from "./globe-core";

export type ModelessGlobeVariant = "baseline" | "traffic" | "trust" | ((info: CanvasFrameInfo, frame: ModelessGlobeFrame) => void);

export interface ModelessGlobeProps extends React.HTMLAttributes<HTMLDivElement> {
  seed: string;
  label: string;
  description?: string;
  metadata?: React.ReactNode;
  motion?: ModelessMotionIntensity;
  palette?: ModelessVisualizationPalette;
  config?: ModelessGlobeConfig;
  variant?: ModelessGlobeVariant;
}

const HUBS = [
  { label: "North America", lat: 37.8, lon: -122.4 },
  { label: "Northern Europe", lat: 59.3, lon: 18.1 },
  { label: "East Asia", lat: 35.7, lon: 139.7 },
  { label: "South Asia", lat: 19.0, lon: 72.8 },
  { label: "South America", lat: -23.5, lon: -46.6 },
  { label: "Oceania", lat: -33.9, lon: 151.2 },
];

const FLOWS = [
  [0, 1, 0.1],
  [1, 2, 0.35],
  [2, 3, 0.55],
  [0, 4, 0.72],
  [3, 5, 0.86],
] as const;

export function ModelessGlobe({
  seed,
  label,
  description,
  metadata,
  motion = "subtle",
  palette,
  config = {},
  variant = "baseline",
  className,
  ...props
}: ModelessGlobeProps) {
  const rtRef = React.useRef<ModelessGlobeRuntime | null>(null);
  const variantRef = React.useRef(variant);
  const configRef = React.useRef(config);
  const seedRef = React.useRef(seed);
  const paletteRef = React.useRef(palette);
  variantRef.current = variant;
  configRef.current = config;
  seedRef.current = seed;
  paletteRef.current = palette;

  const render = React.useCallback((info: CanvasFrameInfo) => {
    const activePalette = paletteRef.current ?? info.palette;
    const rt = ensureGlobeRuntime(rtRef, info.w, info.h, configRef.current, seedRef.current);
    const frame = drawModelessGlobeBase(info, rt, configRef.current, activePalette);
    const activeVariant = variantRef.current;
    if (typeof activeVariant === "function") {
      activeVariant(info, frame);
      return;
    }
    drawBuiltInVariant(activeVariant, info, frame, activePalette);
  }, []);

  const descriptionId = React.useId();
  const describedBy = description ? `${descriptionId}-description` : undefined;

  return (
    <section
      className={cn(
        "artifact-angle artifact-angle-frame border-border bg-card text-card-foreground",
        `modeless-motion-${motion}`,
        "grid overflow-hidden",
        className,
      )}
      role="img"
      aria-label={label}
      aria-describedby={describedBy}
      {...props}
    >
      <div className="relative aspect-[4/3] min-h-64 overflow-hidden">
        <CanvasSurface render={render} cost="light" />
      </div>
      {(description || metadata) && (
        <div className="grid gap-3 border-t border-border p-4">
          {description ? (
            <p id={describedBy} className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
          {metadata ? <div className="text-xs leading-5 text-muted-foreground">{metadata}</div> : null}
        </div>
      )}
    </section>
  );
}

function drawBuiltInVariant(
  variant: Exclude<ModelessGlobeVariant, Function>,
  info: CanvasFrameInfo,
  frame: ModelessGlobeFrame,
  palette: ModelessVisualizationPalette,
) {
  if (variant === "traffic") drawTraffic(info, frame, palette);
  if (variant === "trust") drawTrustShells(info, frame, palette);
}

function drawTraffic(info: CanvasFrameInfo, frame: ModelessGlobeFrame, palette: ModelessVisualizationPalette) {
  const { ctx, t } = info;
  ctx.save();
  ctx.lineCap = "round";

  for (const [fromIndex, toIndex, phase] of FLOWS) {
    const from = HUBS[fromIndex];
    const to = HUBS[toIndex];
    const arc = createGlobeArc(latLonToSpherePoint(from.lat, from.lon), latLonToSpherePoint(to.lat, to.lon), 0.34, 44);
    let previous: GlobeProjectedPoint | null = null;
    for (const point of arc) {
      const p = frame.spin(rotateY(point, 0));
      if (frame.occluded(p)) {
        previous = null;
        continue;
      }
      if (previous) {
        const depth = Math.max(0, (previous.z + p.z) / 2);
        ctx.strokeStyle = hsl(palette.active.mint, 0.08 + depth * 0.28);
        ctx.lineWidth = 1 + depth * 0.8;
        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
      previous = p;
    }

    const progress = (t * 0.13 + phase) % 1;
    const pulse = frame.spin(arc[Math.floor(progress * (arc.length - 1))]);
    if (!frame.occluded(pulse)) {
      ctx.fillStyle = hsl(palette.active.lime, 0.82);
      ctx.shadowColor = hsl(palette.active.lime, 0.42);
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, 2.2 + Math.max(0, pulse.z) * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  for (const hub of HUBS) {
    const p = frame.latLon(hub.lat, hub.lon, 0.012);
    if (frame.occluded(p)) continue;
    const depth = Math.max(0, p.z);
    ctx.fillStyle = hsl(palette.active.electricBlue, 0.48 + depth * 0.3);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2 + depth * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawTrustShells(info: CanvasFrameInfo, frame: ModelessGlobeFrame, palette: ModelessVisualizationPalette) {
  const { ctx, t } = info;
  ctx.save();
  const shells = [
    { r: 1.06, color: palette.trust.violet, phase: 0 },
    { r: 1.17, color: palette.provenance.grayLavender, phase: 1.4 },
    { r: 1.29, color: palette.active.mint, phase: 2.8 },
  ];

  for (const shell of shells) {
    ctx.strokeStyle = hsl(shell.color, 0.22);
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.lineDashOffset = -(t * 10 + shell.phase * 8);
    ctx.beginPath();
    ctx.ellipse(frame.cx, frame.cy, frame.radius * shell.r, frame.radius * shell.r * 0.42, -frame.tilt, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.setLineDash([]);
  for (let i = 0; i < 9; i++) {
    const a = t * 0.16 + i * 0.72;
    const p = frame.view({ x: Math.cos(a) * 1.2, y: Math.sin(a * 0.7) * 0.42, z: Math.sin(a) * 1.2 });
    if (p.z < -0.15) continue;
    ctx.fillStyle = hsl(i % 3 === 0 ? palette.trust.violet : palette.provenance.blue, 0.45 + Math.max(0, p.z) * 0.28);
    ctx.beginPath();
    ctx.rect(p.x - 2.2, p.y - 2.2, 4.4, 4.4);
    ctx.fill();
  }
  ctx.restore();
}
