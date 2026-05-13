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
