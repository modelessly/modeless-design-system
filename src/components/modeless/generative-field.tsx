import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import type { ModelessMotionIntensity } from "../../tokens";

export const generativeFieldVariants = cva(
  "relative overflow-hidden border border-border bg-background text-primary",
  {
    variants: {
      variant: {
        particles: "bg-grid-dotted",
        mesh: "bg-grid-thin",
        waveform: "scanline-overlay",
        orbital: "bg-[radial-gradient(circle_at_center,hsl(var(--experimental)/0.22),transparent_55%)]",
        noise: "noise-overlay bg-card",
        feed: "bg-grid-animated scanline-overlay",
        visualizer: "bg-grid-visualizer",
        isometric: "bg-grid-isometric",
        ascii: "bg-grid-ascii",
      },
    },
    defaultVariants: {
      variant: "particles",
    },
  },
);

export interface GenerativeFieldProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof generativeFieldVariants> {
  seedLabel?: string;
  animated?: boolean;
  motion?: ModelessMotionIntensity;
}

export function GenerativeField({
  className,
  variant = "particles",
  seedLabel = "DATA-FIELD",
  animated = true,
  motion = "subtle",
  ...props
}: GenerativeFieldProps) {
  const gradientId = React.useId();
  const particles = Array.from({ length: 34 });
  const bars = [0.34, 0.72, 0.48, 0.9, 0.42, 0.68, 0.56, 0.84, 0.36, 0.76, 0.62, 0.96, 0.5, 0.7, 0.44, 0.82];
  const ascii = ["AI", "R.07", "++", "MODELESS", "SCAN", "01", "FIELD", "::", "DATA", "x"];
  return (
    <div
      className={cn(
        generativeFieldVariants({ variant }),
        "min-h-72",
        `modeless-motion-${motion}`,
        animated && motion !== "off" && "live-data-field motion-grid",
        className,
      )}
      {...props}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 420" role="img" aria-label={`${seedLabel} generative graphic`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--signal))" stopOpacity="0.85" />
            <stop offset="52%" stopColor="hsl(var(--warning))" stopOpacity="0.68" />
            <stop offset="100%" stopColor="hsl(var(--radar-blue))" stopOpacity="0.82" />
          </linearGradient>
        </defs>
        {variant === "waveform" && (
          <>
            {Array.from({ length: 7 }).map((_, i) => (
              <path
                key={i}
                className={animated ? "motion-wave-trace" : undefined}
                style={{ "--motion-index": i } as React.CSSProperties}
                d={`M 0 ${180 + i * 18} C 120 ${90 + i * 20}, 220 ${300 - i * 14}, 360 ${190 + i * 12} S 620 ${90 + i * 16}, 800 ${210 - i * 9}`}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeOpacity={0.18 + i * 0.04}
                strokeWidth="2"
              />
            ))}
          </>
        )}
        {variant === "mesh" && (
          <>
            {Array.from({ length: 18 }).map((_, i) => (
              <line key={`x-${i}`} x1={i * 48} y1="0" x2={800 - i * 18} y2="420" stroke="hsl(var(--border))" strokeOpacity="0.45" />
            ))}
            <path className={animated ? "motion-trace-draw" : undefined} d="M120 300 L240 100 L370 260 L520 80 L670 300 L120 300" fill="none" stroke={`url(#${gradientId})`} strokeWidth="2" />
          </>
        )}
        {variant === "orbital" && (
          <g className="origin-center motion-orbital">
            <circle cx="400" cy="210" r="136" fill="none" stroke="hsl(var(--signal))" strokeOpacity="0.42" />
            <ellipse cx="400" cy="210" rx="220" ry="74" fill="none" stroke="hsl(var(--experimental))" strokeOpacity="0.5" />
            <ellipse cx="400" cy="210" rx="76" ry="210" fill="none" stroke="hsl(var(--radar-blue))" strokeOpacity="0.45" />
          </g>
        )}
        {(variant === "particles" || variant === "noise") && (
          <>
            {particles.map((_, i) => {
              const x = (i * 73) % 790;
              const y = 30 + ((i * 47) % 360);
              return (
                <g key={i}>
                  <circle
                    className={animated ? "motion-data-node" : undefined}
                    style={{ "--motion-index": i } as React.CSSProperties}
                    cx={x}
                    cy={y}
                    r={i % 5 === 0 ? 3 : 1.5}
                    fill={`url(#${gradientId})`}
                    opacity={0.35 + (i % 6) * 0.08}
                  />
                  {i > 0 && <line className={animated ? "motion-connection" : undefined} x1={x} y1={y} x2={(x + 140) % 800} y2={(y + 80) % 420} stroke="hsl(var(--signal))" strokeOpacity="0.08" />}
                </g>
              );
            })}
          </>
        )}
        {variant === "feed" && (
          <>
            <rect x="36" y="36" width="728" height="348" fill="hsl(var(--panel-black) / 0.7)" stroke="hsl(var(--border))" />
            <path
              className={animated ? "motion-trace-draw" : undefined}
              d="M70 292 C150 110, 238 328, 334 162 S540 88, 730 242"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
            />
            <path d="M70 294 L730 294" stroke="hsl(var(--border))" />
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i}>
                <line className={animated ? "motion-connection" : undefined} x1={88 + i * 54} y1="76" x2={88 + i * 54} y2="332" stroke="hsl(var(--grid-line))" strokeOpacity="0.5" />
                <circle
                  className={animated ? "motion-data-node" : undefined}
                  style={{ "--motion-index": i } as React.CSSProperties}
                  cx={88 + i * 54}
                  cy={110 + ((i * 47) % 168)}
                  r="4"
                  fill={i % 3 === 0 ? "hsl(var(--warning))" : "hsl(var(--signal))"}
                  opacity="0.75"
                />
              </g>
            ))}
            <rect x="70" y="72" width="122" height="28" fill="hsl(var(--signal))" />
            <text x="82" y="91" fill="hsl(var(--signal-foreground))" fontFamily="monospace" fontSize="13">LIVE INPUT</text>
          </>
        )}
        {variant === "visualizer" && (
          <g transform="translate(64 52)">
            {bars.map((height, i) => (
              <rect
                key={i}
                className={animated ? "motion-pulse" : undefined}
                style={{ "--motion-index": i } as React.CSSProperties}
                x={i * 42}
                y={284 - height * 230}
                width="18"
                height={height * 230}
                fill={i % 4 === 0 ? "hsl(var(--warning))" : i % 3 === 0 ? "hsl(var(--experimental))" : "hsl(var(--signal))"}
                opacity="0.74"
              />
            ))}
            <polyline
              className={animated ? "motion-trace-draw" : undefined}
              points="0,230 80,160 160,198 240,88 320,132 400,52 480,140 560,74 660,170"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="2"
            />
          </g>
        )}
        {variant === "isometric" && (
          <g className={animated ? "motion-drift" : undefined} opacity="0.88">
            {Array.from({ length: 8 }).map((_, i) => (
              <path
                key={i}
                d={`M${150 + i * 58} ${270 - i * 16} l78 -42 l78 42 l-78 42 z`}
                fill={i % 2 === 0 ? "hsl(var(--signal) / 0.14)" : "hsl(var(--radar-blue) / 0.14)"}
                stroke="hsl(var(--foreground) / 0.42)"
              />
            ))}
            <path className={animated ? "motion-trace-draw" : undefined} d="M154 304 L650 48" stroke={`url(#${gradientId})`} strokeWidth="2" strokeDasharray="6 8" />
          </g>
        )}
        {variant === "ascii" && (
          <g fontFamily="monospace" fontSize="16">
            {Array.from({ length: 58 }).map((_, i) => (
              <text
                key={i}
                className={animated ? "motion-data-text" : undefined}
                style={{ "--motion-index": i } as React.CSSProperties}
                x={28 + ((i * 83) % 740)}
                y={36 + ((i * 37) % 350)}
                fill={i % 7 === 0 ? "hsl(var(--signal))" : "hsl(var(--foreground))"}
                opacity={0.16 + (i % 5) * 0.08}
              >
                {ascii[i % ascii.length]}
              </text>
            ))}
          </g>
        )}
      </svg>
      <div className="relative z-10 flex h-full min-h-72 items-end justify-between p-4">
        <span className="artifact-angle artifact-angle-sm artifact-angle-frame border border-border bg-background/80 px-2 py-1 text-micro text-muted-foreground">{seedLabel}</span>
        <span className="artifact-angle artifact-angle-sm artifact-angle-frame h-12 w-12 border border-primary bg-primary/10 opacity-60" aria-hidden="true" />
      </div>
    </div>
  );
}
