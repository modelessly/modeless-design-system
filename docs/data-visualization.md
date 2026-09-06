# Data Visualization

Modeless data visualization is built for systems that are probabilistic, agentic, decentralized, operational, or trust-sensitive.

Traditional dashboards are good at showing stable metrics. Modeless visualizations also need to show:

- how an output was produced
- what context shaped it
- where confidence is weak
- who acted when
- where cost accumulates
- which parts of a system require trust
- what changed over time

## Core Rules

1. Prefer system explanations over decorative charts.
2. Use shape, text, position, and line style before relying on color.
3. Make uncertainty visible.
4. Make source/provenance visible.
5. Make actor ownership visible.
6. Make irreversible or externally controlled actions visible.
7. Keep dense data inspectable on mobile.
8. Never let motion be the only carrier of meaning.

## Visual Direction

Modeless data visualization uses dark instrument surfaces, soft atmospheric fields, and generated marks that feel measured rather than decorative. The style is broader than any single component: use it for agent traces, provenance timelines, trust maps, signal morphology, context and cost views, matrix studies, global systems, and non-geographic animated studies.

Preferred geometry:

- dotted fields, line traces, shells, rings, arcs, matrices, pulses, and path fragments
- slow signal motion that communicates state, activity, flow, provenance, freshness, or pressure
- occlusion and depth only when they clarify layered systems
- restrained glow only for data, active state, or signal emphasis

Avoid generic glowing node clouds, unlabeled background animation, rainbow palettes, and decorative motion behind reading surfaces.

## Palette

The visualization palette extends the soft globe palette into a controlled semantic range. It is not a loose chart rainbow.

| Family | Use |
| --- | --- |
| Structure: muted leaf, cyan, graphite | Base geometry, shells, grids, inactive lines, maps, and frames. |
| Active/signal: lime, mint, electric blue | Motion, selected state, live flow, current path, and active inspection. |
| Warning/pressure: amber, warm yellow | Backlog, saturation, deadline pressure, degraded freshness, or approaching limits. |
| Risk/failure: rose, coral, red-orange | Failed paths, incidents, irreversible action, destructive state, or urgent risk. |
| Trust/identity: violet, blue-violet | Permission, identity, authority, attestations, and reviewer roles. |
| Provenance/history: desaturated blue, gray-lavender | Prior states, lineage, audit trails, source history, and retained memory. |

Rules:

- Use one dominant structural hue per visual.
- Use one active hue for motion or state.
- Use no more than two secondary accents in one component.
- Never rely on color alone; pair it with shape, position, label, line style, or motion.
- Keep saturation restrained unless the state is urgent.

The package exposes this direction through `modelessVisualizationColors`, CSS variables such as `--viz-active-mint`, and canvas helpers such as `resolveModelessVisualizationPalette`, `hsl`, and `mixHsl`.

## Motion And Canvas

Default to `motion="subtle"`. Use `live` only for primary inspection surfaces. Use `high` only for controlled studies or demos.

Canvas-based studies should use `CanvasSurface` and `useCanvasAnimation` when they fit the package boundary. The shared loop handles DPR scaling, resize, offscreen pause, tab-hidden pause, heavy-animation budgeting, and a static reduced-motion frame.

Canvas is usually decorative. The surrounding component should carry `role="img"` or equivalent accessible naming, visible labels, a concise description, and adjacent metadata.

## Families

### Agentic Systems

Use route maps, traces, forks, and handoff timelines.

Components:

- `AgentTraceMap`
- `HumanAIHandoffTimeline`

### Prompt And Context Systems

Use layers, blocks, token density, and warning overlays.

Components:

- `PromptStackVisualizer`
- `ContextWindowHeatmap`

### Confidence And Review Systems

Use matrices and trust zones instead of single scores.

Components:

- `ConfidenceGradientMatrix`
- `TrustSurfaceMap`

### Signal Morphology

Use organic severity glyphs when many events, risks, stale sources, anomalies, delays, incidents, bottlenecks, or threshold breaches need to be inspected without implying a conventional ranking chart.

Components:

- `SignalBloom`

`SignalBloom` is domain-agnostic. Train delays, API incidents, energy pressure, workflow failures, procurement risk, support escalation, fraud alerts, sensor breaches, and model-confidence drops all map into the same `SignalBloomDatum` shape.

### AI Economics

Use meters that explain cost, savings, caching, and operational efficiency.

Components:

- `TokenEconomyMeter`

### Protocol And Governance Systems

Use state machines, flow organisms, quorum meters, and risk boards.

Components:

- `OnChainFlowGraph`
- `SmartContractStateMachine`
- `GovernancePulseBoard`

### Global Systems

Use the globe module only when geography, global infrastructure, orbital systems, trust layers, data traffic, provenance, or world-scale flow is genuinely part of the model.

Components:

- `ModelessGlobe`

Avoid using the globe as a generic decorative background. It is one reusable module inside the larger visualization system, not the default direction for every study.

## Required States

Every visualization should define:

- empty state
- loading state if data can be delayed
- selected state
- warning state
- reduced-motion state
- mobile layout

`SignalBloom` must additionally preserve source freshness and confidence when those fields exist, because stale or low-confidence data can be as important as the event itself.

## Density

Use three density levels when a component needs variants:

- `compact`: summary surfaces, cards, sidebars
- `default`: product panels and docs examples
- `dense`: dashboards and expert tools

Never shrink body text below readable size just to fit more data.
