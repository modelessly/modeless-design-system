# Tokens

Modeless Design System uses CSS variables as the source of truth for theming.

## Core Colors

- `off-black`: `#080808`
- `panel-black`: `#101010`
- `graphite`: `#1A1A1A`
- `steel`: `#444649`
- `concrete`: `#8B8B8B`
- `bone`: `#EEE6D0`
- `xerox-white`: `#F7F2E8`
- `acid-lime`: `#C7FF2A`
- `completion-green`: `#39D98A`
- `electric-purple`: `#8E2EFF`
- `radar-blue`: `#2D78FF`
- `warning-orange`: `#FF5A1F`
- `signal-pink`: `#FF3FA4`

## Semantic Roles

The theme exposes standard shadcn roles: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, and `ring`.

Custom roles include `signal`, `terminal`, `artifact`, `grid-line`, `scanline`, `noise`, `warning`, `success`, `experimental`, and `archived`.

## Operational State Colors

| State | Semantic role | Use |
| --- | --- | --- |
| Idle / waiting | `muted`, `archived` | Work has not started or no item is selected. |
| Loaded / ready | informational (`SignalBadge variant="ready"`) | An item is ready; no process is running. |
| Active / live | `signal` / `primary` (acid lime) | Processing, connected, selected, or receiving live updates. |
| Complete / success | `success` (completion green) | Work finished successfully and is static. |
| Warning | `warning` | A recoverable issue or attention-required condition. |
| Error / destructive | `destructive` | Failed, cancelled, or destructive outcomes/actions. |

Acid lime communicates liveness and active attention. Do not use it to indicate a task that has already finished; successful completion uses `success` so a finished job does not appear to remain in progress.

## Visualization Palette

The data visualization palette is a controlled semantic extension of the core colors. It keeps the soft, atmospheric globe direction while adding enough range for trust maps, provenance timelines, pressure fields, agent traces, signal morphology, and non-geographic studies.

Exported token object: `modelessVisualizationColors`.

CSS variables:

- Structure: `--viz-structure-leaf`, `--viz-structure-cyan`, `--viz-structure-graphite`
- Active/signal: `--viz-active-lime`, `--viz-active-mint`, `--viz-active-electric-blue`
- Warning/pressure: `--viz-warning-amber`, `--viz-warning-warm-yellow`
- Risk/failure: `--viz-risk-rose`, `--viz-risk-coral`, `--viz-risk-red-orange`
- Trust/identity: `--viz-trust-violet`, `--viz-trust-blue-violet`
- Provenance/history: `--viz-provenance-blue`, `--viz-provenance-gray-lavender`

Use one dominant structural hue, one active hue, and no more than two secondary accents in a component. Never rely on color alone.

## Typography

- `font-display`: condensed/heavy display stack.
- `font-ui`: readable interface stack.
- `font-mono`: terminal and metadata stack.
- `text-label`, `text-caption`, `text-micro`, `text-terminal`, and `text-machine` are Tailwind utilities.

## Motion

Motion tokens live in `src/tokens/motion.ts`.

- `modelessMotionIntensities`
- `modelessMotionDurations`
- `modelessMotionEasing`
- `modelessMotionOpacity`
- `modelessMotion`

Motion classes include `motion-pulse`, `motion-drift`, `motion-scan`, `motion-flicker`, `motion-reveal`, `motion-glitch-subtle`, `motion-orbital`, `motion-trace-draw`, `motion-wave-trace`, `motion-data-node`, `motion-data-cell`, and `motion-connection`. They respect `prefers-reduced-motion`.

The public intensity scale is:

```ts
"off" | "subtle" | "live" | "high"
```

## Geometry And Grids

Cards and content sections use `artifact-angle` to cut the upper-left and lower-right corners at 45 degrees. The background grid is intentionally exempt from that rule and remains square.

Grid utilities include `bg-grid-thin`, `bg-grid-dotted`, `bg-grid-animated`, `bg-grid-isometric`, `bg-grid-ascii`, `bg-grid-visualizer`, `grid-perspective`, and `motion-grid`. Animated grids keep the grid stationary and ripple a diffuse dark gravity wave across the surface about once per minute.
