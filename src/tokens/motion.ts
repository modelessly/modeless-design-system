export type ModelessMotionIntensity = "off" | "subtle" | "live" | "high";

export const modelessMotionIntensities = ["off", "subtle", "live", "high"] as const satisfies readonly ModelessMotionIntensity[];

export const modelessMotionDurations = {
  instant: "120ms",
  reveal: "700ms",
  telemetry: "9s",
  trace: "22s",
  ambient: "36s",
  gravity: "60s",
} as const;

export const modelessMotionEasing = {
  instrument: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  telemetry: "ease-in-out",
  stepped: "steps(2, end)",
  linear: "linear",
} as const;

export const modelessMotionOpacity = {
  ambient: 0.32,
  signal: 0.72,
  active: 0.92,
  disabled: 0,
} as const;

export const modelessMotion = {
  pulse: "motion-pulse",
  drift: "motion-drift",
  scan: "motion-scan",
  flicker: "motion-flicker",
  reveal: "motion-reveal",
  glitchSubtle: "motion-glitch-subtle",
  orbital: "motion-orbital",
  trace: "motion-trace-draw",
  waveTrace: "motion-wave-trace",
  dataNode: "motion-data-node",
  dataCell: "motion-data-cell",
  connection: "motion-connection",
} as const;
