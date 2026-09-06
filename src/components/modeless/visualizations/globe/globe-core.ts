import { hsl, type ModelessVisualizationPalette } from "../lib/palette";
import { hashSeed, mulberry32 } from "../lib/rng";
import type { CanvasFrameInfo } from "../lib/use-canvas-animation";
import {
  latLonToSpherePoint,
  rotateY,
  scaleVec,
  type GlobeProjectedPoint,
  type GlobeVec3,
} from "./globe-math";

export type ModelessGlobeDensity = "compact" | "default" | "dense";

export type ModelessGlobeConfig = {
  tilt?: number;
  spin?: number;
  density?: ModelessGlobeDensity;
  atmosphere?: boolean;
  grid?: boolean;
  surfaceDots?: boolean;
  radiusFactor?: number;
  baseOpacity?: number;
  stars?: boolean;
};

export type ModelessGlobeFrame = {
  cx: number;
  cy: number;
  radius: number;
  rot: number;
  tilt: number;
  spin(v: GlobeVec3): GlobeProjectedPoint;
  view(v: GlobeVec3): GlobeProjectedPoint;
  latLon(lat: number, lon: number, altitude?: number): GlobeProjectedPoint;
  occluded(p: GlobeProjectedPoint): boolean;
};

export type ModelessGlobeRuntime = {
  w: number;
  h: number;
  stars: { x: number; y: number; r: number; phase: number }[];
  dots: GlobeVec3[];
};

const DEFAULTS = {
  tilt: 0.36,
  spin: 0.12,
  density: "default" as ModelessGlobeDensity,
  atmosphere: true,
  grid: true,
  surfaceDots: true,
  radiusFactor: 0.62,
  baseOpacity: 1,
  stars: true,
};

const DENSITY = {
  compact: { dots: 260, stars: 36, grid: 36 },
  default: { dots: 440, stars: 70, grid: 30 },
  dense: { dots: 680, stars: 96, grid: 24 },
} as const;

function fibonacciSphere(n: number): GlobeVec3[] {
  const pts: GlobeVec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }
  return pts;
}

export function ensureGlobeRuntime(
  ref: { current: ModelessGlobeRuntime | null },
  w: number,
  h: number,
  config: ModelessGlobeConfig,
  seed: string,
): ModelessGlobeRuntime {
  const cfg = { ...DEFAULTS, ...config };
  const density = DENSITY[cfg.density];
  const dotCount = cfg.surfaceDots ? density.dots : 0;
  const starCount = cfg.stars ? density.stars : 0;
  if (ref.current && ref.current.w === w && ref.current.h === h && ref.current.dots.length === dotCount && ref.current.stars.length === starCount) {
    return ref.current;
  }

  const rand = mulberry32(hashSeed(seed));
  const stars = Array.from({ length: starCount }, () => ({
    x: rand() * w,
    y: rand() * h,
    r: 0.4 + rand() * 1.1,
    phase: rand() * Math.PI * 2,
  }));

  ref.current = { w, h, stars, dots: fibonacciSphere(dotCount) };
  return ref.current;
}

export function drawModelessGlobeBase(
  info: CanvasFrameInfo,
  runtime: ModelessGlobeRuntime,
  config: ModelessGlobeConfig,
  palette: ModelessVisualizationPalette = info.palette,
): ModelessGlobeFrame {
  const { ctx, w, h, t } = info;
  const cfg = { ...DEFAULTS, ...config };
  const density = DENSITY[cfg.density];
  const structure = palette.structure.leaf;
  const active = palette.active.lime;
  const cx = w / 2;
  const cy = h / 2;
  const radius = (Math.min(w, h) / 2) * cfg.radiusFactor;
  const rot = t * cfg.spin;
  const tilt = cfg.tilt;
  const cosT = Math.cos(tilt);
  const sinT = Math.sin(tilt);

  const toScreen = (v: GlobeVec3): GlobeProjectedPoint => {
    const y = v.y * cosT - v.z * sinT;
    const z = v.y * sinT + v.z * cosT;
    return { x: cx + v.x * radius, y: cy - y * radius, z, visible: z >= 0 };
  };

  const frame: ModelessGlobeFrame = {
    cx,
    cy,
    radius,
    rot,
    tilt,
    spin: (v) => toScreen(rotateY(v, rot)),
    view: (v) => toScreen(v),
    latLon: (lat, lon, altitude = 0) => toScreen(rotateY(scaleVec(latLonToSpherePoint(lat, lon), 1 + altitude), rot)),
    occluded: (p) => p.z < 0 && Math.hypot(p.x - cx, p.y - cy) < radius - 1,
  };

  const bg = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, Math.max(w, h) * 0.75);
  bg.addColorStop(0, "hsl(150 22% 11%)");
  bg.addColorStop(1, "hsl(152 26% 5%)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  for (const s of runtime.stars) {
    const twinkle = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.3 + s.phase));
    ctx.fillStyle = hsl(palette.foreground, 0.1 + twinkle * 0.16);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }

  const base = cfg.baseOpacity;
  if (cfg.atmosphere) {
    const atmosphere = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius * 1.32);
    atmosphere.addColorStop(0, hsl(active, 0));
    atmosphere.addColorStop(0.6, hsl(active, 0.085 * base));
    atmosphere.addColorStop(1, hsl(active, 0));
    ctx.fillStyle = atmosphere;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.32, 0, Math.PI * 2);
    ctx.fill();
  }

  const disc = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, radius * 0.1, cx, cy, radius);
  disc.addColorStop(0, hsl(structure, 0.07 * base));
  disc.addColorStop(1, "hsl(152 26% 5% / 0.6)");
  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  if (cfg.grid) {
    ctx.lineWidth = 1;
    const drawPolyline = (pts: GlobeProjectedPoint[]) => {
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1];
        const b = pts[i];
        const depth = (a.z + b.z) / 2;
        ctx.strokeStyle = hsl(structure, (0.05 + Math.max(0, depth) * 0.22) * base);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };
    for (let lat = -60; lat <= 60; lat += 30) {
      const pts: GlobeProjectedPoint[] = [];
      for (let lon = 0; lon <= 360; lon += 12) pts.push(frame.latLon(lat, lon));
      drawPolyline(pts);
    }
    for (let lon = 0; lon < 360; lon += density.grid) {
      const pts: GlobeProjectedPoint[] = [];
      for (let lat = -90; lat <= 90; lat += 6) pts.push(frame.latLon(lat, lon));
      drawPolyline(pts);
    }
  }

  for (const d of runtime.dots) {
    const p = frame.spin(d);
    if (p.z < -0.05) continue;
    const depth = Math.max(0, p.z);
    ctx.fillStyle = hsl(structure, (0.1 + depth * 0.42) * base);
    ctx.beginPath();
    ctx.arc(p.x, p.y, 0.6 + depth * 0.7, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = hsl(structure, 0.4 * base);
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  return frame;
}
