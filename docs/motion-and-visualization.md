# Motion And Visualization Guide

This guide defines how Modeless uses motion graphics and data visualization. It is the design system layer for live technical graphics, AI-native visualizations, Web3/protocol surfaces, trust maps, and system-state motion.

Modeless motion should feel like a living technical instrument. It should never feel like a slot machine, a generic sci-fi dashboard, or decoration pasted on top of an interface.

## Philosophy

Motion exists to communicate:

- system state
- activity and liveness
- provenance and flow
- uncertainty and confidence
- ownership transfer
- cost and operational pressure
- risk and trust boundaries
- time, history, and state change

Motion does not exist to impress users at the expense of reading, control, or comfort.

## Sensory Rules

- No autoplay audio.
- No rapid flicker.
- No hard strobing.
- No jitter loops.
- No motion that blocks reading.
- No motion that hides risk.
- No visual effect should be required to understand the interface.
- Respect `prefers-reduced-motion`.

## Motion Intensity

Modeless components use this shared intensity scale:

```ts
motion: "off" | "subtle" | "live" | "high"
```

### off

Use for static output, dense reading, accessibility preferences, exports, documentation screenshots, and environments where motion could distract.

Behavior:

- no component-level animation
- preserve layout and visual identity
- retain labels, status, and structure

### subtle

Default for product surfaces.

Behavior:

- slow telemetry
- low-opacity ambient movement
- soft pulses
- long duration traces
- no urgent visual rhythm

Use for:

- cards
- panels
- metadata
- catalog surfaces
- default design-system demos

### live

Use for primary graphics and active inspection surfaces.

Behavior:

- visible but calm signal activity
- active traces
- animated nodes
- live data fields
- readable at rest

Use for:

- product hero graphics
- visualization components
- agent traces
- on-chain flow
- monitoring dashboards

### high

Use only for controlled previews, prototypes, and motion studies.

Behavior:

- faster signal movement
- stronger surface opacity
- more visible pulses

Do not use as a production default.

## Motion Primitives

### Pulse

Purpose: communicate an active signal, heartbeat, or status confirmation.

Use for:

- active nodes
- current state
- live meters
- selected markers

Avoid:

- body text
- large background areas
- repeated dense lists

Typical duration: `9s` to `14s`.

### Trace

Purpose: show route, provenance, execution, dependency, or transaction path.

Use for:

- agent paths
- source lineage
- on-chain flows
- trust dependencies
- state transitions

Avoid:

- decorative underlines
- dense text panels

Typical duration: `22s` to `32s`.

### Drift

Purpose: create ambient system presence without directional urgency.

Use for:

- live panels
- generative fields
- background instrument surfaces

Avoid:

- navigation
- forms
- small labels

Typical duration: `24s` to `36s`.

### Orbit

Purpose: show networked, cyclic, protocol, or satellite-like motion.

Use for:

- decentralized systems
- orbital product graphics
- protocol context
- relationship maps

Avoid:

- implying actual physical orbit unless the data supports it

Typical duration: `42s`.

### Scan

Purpose: show inspection or system sweep.

Use for:

- low-frequency analysis states
- inactive diagnostics
- scanning fields

Avoid:

- fast “loading” loops
- full-page sweeps

Typical duration: `36s` or slower.

### Reveal

Purpose: show progressive disclosure.

Use for:

- component entrance
- newly available metadata
- expanded panels

Avoid:

- frequent repeated elements that would delay reading

Typical duration: `700ms`.

### Gravity

Purpose: suggest attention, distortion, or pressure around an active region.

Use for:

- animated grid overlays
- active visualization fields
- system load

Avoid:

- moving the entire grid
- strong distortion near body text

Typical duration: `60s`.

## Data Visualization Principles

Modeless visualizations should explain systems, not only values.

### Show provenance

Users should be able to see where data, claims, tool outputs, or transaction flows came from.

### Show uncertainty

Avoid fake precision. Show confidence across dimensions: source reliability, freshness, evidence, model certainty, human review, and business risk.

### Show ownership

Human, AI, system, protocol, and external actors should be distinguishable.

### Show trust boundaries

Make review-needed zones, irreversible actions, external dependencies, bridges, upgrade keys, and unsourced claims visible.

### Show time and state

When systems change over time, represent current state, history, and transition paths.

### Show economics

AI systems have operational costs. Tokens, caching, tool calls, retrieval, and automation savings deserve visual language.

### Use labels and structure

Color alone is never enough. Use labels, shape, position, line style, and metadata.

### Show signal morphology

Collections of incidents, anomalies, stale sources, degraded states, and threshold breaches can use morphology instead of bars or cards. `SignalBloom` maps severity and value to bloom size, abnormality and volatility to distortion, state to structural treatment, and confidence/freshness to opacity, hatch, outline, metadata, and source footer.

Motion remains honest:

- `off`: static glyphs, labels, summary, details, and sources remain visible.
- `subtle`: slow breathing may appear on active non-stale signals.
- `live`: pulse only signals whose source freshness is `live` or `near_real_time`.
- `high`: stronger demo motion, still non-strobing and never applied to text.

## Visualization Taxonomy

### Agentic workflow

Examples:

- `AgentTraceMap`
- `HumanAIHandoffTimeline`

Visual metaphors:

- cognitive route maps
- traces
- forks
- handoff rails
- failed paths

Required metadata:

- actor
- step type
- current state
- failure state
- confidence or risk

### Prompt and context

Examples:

- `PromptStackVisualizer`
- `ContextWindowHeatmap`

Visual metaphors:

- stacked layers
- memory blocks
- context occupancy
- stale/duplicated warning zones

Required metadata:

- token count
- content type
- source
- risk or freshness

### Confidence and review

Examples:

- `ConfidenceGradientMatrix`
- `TrustSurfaceMap`

Visual metaphors:

- matrices
- trust zones
- review checkpoints
- evidence surfaces

Required metadata:

- evidence strength
- source reliability
- freshness
- review status
- business risk

### AI economics

Examples:

- `TokenEconomyMeter`

Visual metaphors:

- efficiency meters
- cost rings
- token bars
- savings deltas

Required metadata:

- input tokens
- output tokens
- cached tokens
- retrieval cost
- tool cost
- model cost
- cost per task
- cost per outcome

### Protocol systems

Examples:

- `OnChainFlowGraph`
- `SmartContractStateMachine`
- `GovernancePulseBoard`

Visual metaphors:

- transaction organisms
- state machines
- governance pulse dashboards
- quorum meters

Required metadata:

- nodes and edges
- state history
- permissions
- gas/cost
- proposal status
- participation
- risk

## Implementation Tokens

The first token layer lives in `design-system/src/tokens/motion.ts`.

```ts
modelessMotionIntensities
modelessMotionDurations
modelessMotionEasing
modelessMotionOpacity
modelessMotion
```

Recommended semantic values:

```ts
motion.duration.instant = "120ms"
motion.duration.reveal = "700ms"
motion.duration.telemetry = "9s"
motion.duration.trace = "22s"
motion.duration.ambient = "36s"
motion.duration.gravity = "60s"

motion.opacity.ambient = 0.32
motion.opacity.signal = 0.72
motion.opacity.active = 0.92
motion.opacity.disabled = 0
```

## Component Guidance

Each visualization component should:

- accept structured data props
- include text labels
- support `motion`
- remain readable on mobile
- avoid live API requirements
- avoid heavy charting dependencies
- use CSS/SVG/React for brand-specific silhouettes
- render useful information without animation

## Anti-Patterns

Avoid:

- generic chart skins with Modeless colors
- fake terminal noise that delays reading
- single global confidence scores
- risk conveyed by color alone
- unlabeled node graphs
- animations that imply real-time data when data is static
- blockchain graphics that hide custody, bridge, or upgrade-key risk
- AI graphics that hide source or review uncertainty
