# Visualization Components

The Modeless visualization suite explores interface patterns for AI-native, agentic, decentralized, and trust-sensitive systems. These are not generic chart wrappers. They are reusable product components with distinctive silhouettes, structured props, and motion-aware rendering.

All components support `motion="off" | "subtle" | "live" | "high"` where motion is relevant. Prefer `subtle` by default and reserve `live` for hero or inspection surfaces.

## Import

```tsx
import {
  AgentTraceMap,
  ContextWindowHeatmap,
  ModelessGlobe,
  SignalBloom,
  TrustSurfaceMap,
} from "@modeless/design-system";
```

## Shared Utilities

- `CanvasSurface` provides a positioned decorative canvas host.
- `useCanvasAnimation` drives Canvas 2D visuals with DPR scaling, resize handling, offscreen pause, tab-hidden pause, reduced-motion static frames, and a small concurrency budget for heavy pieces.
- `resolveModelessVisualizationPalette`, `modelessVisualizationPalette`, `hsl`, `mixHsl`, `hashSeed`, and `mulberry32` support custom visual studies without drifting away from the Modeless data visualization style.
- Globe helpers such as `latLonToSpherePoint`, `createGlobeArc`, and `projectSpherePoint` are exported for thin globe variants.

## Components

### ModelessGlobe

Purpose: render global-scale systems with a shared orthographic globe shell, depth, occlusion, dotted surfaces, atmospheric field, arcs, and thin variant layers.

Key props: `seed`, `label`, `description`, `metadata`, `motion`, `palette`, `config`, `variant`.

Built-in variants: `baseline`, `traffic`, and `trust`.

Use when: the system is meaningfully global, geographic, orbital, infrastructural, provenance-based, or trust-layered.

Avoid when: a matrix, trace, timeline, bloom, meter, or non-geographic animated study would explain the system more honestly.

Accessibility: the canvas is decorative; the wrapper carries `role="img"` with `label`, optional `description`, and visible adjacent metadata.

### AgentTraceMap

Purpose: visualize an AI agent's execution path from user intent through planning, retrieval, tool use, decision forks, failures, and final output.

Key props: `steps`, `activeStep`, `status`, `confidence`, `showFailures`, `compact`, `motion`.

Use when: users need to inspect agent behavior, debug failures, or understand why an output happened.

Avoid when: a plain ordered checklist is enough.

Accessibility: provide descriptive `label` and `detail` values in `steps`; the component includes an SVG `aria-label` and textual step summaries.

### PromptStackVisualizer

Purpose: show layered prompt/context composition across system instructions, brand/personality, user prompt, project context, memory, tool results, safety constraints, and formatting.

Key props: `layers`, `selectedLayer`, `tokenCount`, `riskLevel`, `collapsed`, `motion`.

Use when: prompt construction and context influence need to be visible.

Avoid when: prompt internals should remain hidden from the user.

Accessibility: layer metadata is rendered as text, not only visual depth.

### ContextWindowHeatmap

Purpose: visualize how model context is allocated across prompts, history, documents, code, tools, memory, instructions, and draft output.

Key props: `maxTokens`, `usedTokens`, `segments`, `warnings`, `selectedSegment`, `density`, `motion`.

Use when: debugging context bloat, stale retrieval, duplicated context, or missing source coverage.

Avoid when: exact token accounting is unavailable and an approximate view would mislead users.

Accessibility: warnings and legends are textual; color is not the only signal.

### ConfidenceGradientMatrix

Purpose: show confidence across dimensions such as evidence strength, freshness, source reliability, model certainty, human review, and business risk.

Key props: `rows`, `dimensions`, `scores`, `thresholds`, `showLabels`, `variant`, `motion`.

Use when: individual claims or workflow sections need multi-dimensional confidence.

Avoid when: stakeholders expect a single approval state rather than nuanced review.

Accessibility: numeric score labels can be shown inside cells.

### HumanAIHandoffTimeline

Purpose: show ownership transfer between AI agents, humans, and systems.

Key props: `events`, `orientation`, `actorFilter`, `currentEvent`, `showDurations`, `motion`.

Use when: auditability, escalation, and human-in-the-loop workflows matter.

Avoid when: there is only one actor or no meaningful transfer of responsibility.

Accessibility: each event includes actor, type, label, duration, and optional detail in text.

### TokenEconomyMeter

Purpose: visualize AI usage, costs, savings, and operational efficiency.

Key props: `usage`, `cost`, `savings`, `currency`, `modelName`, `period`, `breakdown`, `motion`.

Use when: teams need to understand AI economics beyond raw token counts.

Avoid when: cost estimates are too speculative to communicate responsibly.

Accessibility: totals, costs, savings, and breakdown values are rendered as text.

### OnChainFlowGraph

Purpose: visualize asset movement between wallets, contracts, bridges, exchanges, and protocols.

Key props: `nodes`, `edges`, `selectedNode`, `timeRange`, `showRisk`, `showGas`, `animate`, `motion`.

Use when: directional transaction flow, risk, and gas context need to be inspected together.

Avoid when: regulatory-grade transaction tracing is required without verification.

Accessibility: edge summaries are listed alongside the SVG.

### SmartContractStateMachine

Purpose: visualize contract lifecycle state, callable functions, permissions, ownership, and recent state-changing events.

Key props: `states`, `currentState`, `transitions`, `functions`, `permissions`, `recentEvents`, `motion`.

Use when: contract operational state and access control need to be readable.

Avoid when: the state model is not well-defined.

Accessibility: function permissions and recent events are text-first.

### GovernancePulseBoard

Purpose: show DAO/protocol governance health across proposal lifecycle, participation, quorum, sentiment, influence, and risk.

Key props: `proposals`, `participation`, `quorum`, `sentiment`, `risk`, `selectedProposal`, `motion`.

Use when: governance activity needs an at-a-glance health read.

Avoid when: proposals require full legal or voting detail on the same surface.

Accessibility: each proposal exposes state and metric labels in text.

### TrustSurfaceMap

Purpose: map trust zones and dependencies across AI workflows, Web3 products, or digital systems.

Key props: `zones`, `dependencies`, `risks`, `selectedZone`, `domain`, `showLegend`, `motion`.

Use when: users need to understand where review, reversibility, external control, or irreversible action enters the system.

Avoid when: a risk label could create false certainty without underlying evidence.

Accessibility: legends, risks, and dependency counts are textual.

### SignalBloom

Purpose: visualize a collection of domain-agnostic signals as organic bloom glyphs whose size, outline, density, distortion, opacity, and metadata treatment reflect severity, value, state, confidence, source, and freshness.

Key props: `items`, `variant`, `density`, `scale`, `sortBy`, `groupBy`, `selectedItemId`, `onSelectedItemChange`, `showLabels`, `showValues`, `showLegend`, `showSummary`, `showDetails`, `showConfidence`, `showSources`, `motion`, `loading`, `emptyMessage`.

Use when: events, risks, anomalies, stale sources, incidents, threshold breaches, degraded states, or bottlenecks need to be scanned as a living operational field.

Avoid when: users need exact time-series comparison, stacked totals, regulatory reporting, or a simple table would be more honest.

Visual encoding: severity and value affect bloom size; critical signals become structurally fragmented; resolved signals are hollow and faded; stale signals are crosshatched and low contrast; unknown signals use incomplete/dotted outlines; confidence affects opacity and the confidence mark; source freshness appears in details and source footer.

Accessibility: each glyph is a keyboard-focusable button with a text equivalent for label, severity, state, value, source, and freshness. Selection uses outline and details, not color alone. Summary, legend, details, and source footer remain readable when motion is off.

See `docs/signal-bloom.md` for the full data model, mapping guidance, motion behavior, and future adapter notes.

## Example

```tsx
<TrustSurfaceMap
  domain="ai"
  zones={[
    { id: "model", label: "Model output", level: "review", x: 50, y: 56, width: 170, height: 88 },
    { id: "action", label: "Irreversible action", level: "irreversible", x: 338, y: 214, width: 190, height: 88 },
  ]}
  dependencies={[{ from: "model", to: "action", label: "approval" }]}
  risks={[{ label: "Human review required before action", level: "medium" }]}
  motion="subtle"
/>
```

## Globe Example

```tsx
<ModelessGlobe
  seed="global-trust-demo"
  label="Global trust layer"
  description="Identity, permission, and provenance shells around active infrastructure regions."
  variant="trust"
  motion="subtle"
  config={{ density: "default", atmosphere: true }}
/>
```

## Custom Canvas Study

```tsx
<section role="img" aria-label="Agent trace pressure" aria-describedby="trace-pressure-copy">
  <div className="relative aspect-[16/9] overflow-hidden bg-card">
    <CanvasSurface
      render={({ ctx, w, h, t, palette }) => {
        ctx.fillStyle = "hsl(0 0% 3%)";
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = `hsl(${palette.active.mint} / 0.45)`;
        ctx.beginPath();
        for (let i = 0; i < 80; i++) {
          const x = (i / 79) * w;
          const y = h * 0.5 + Math.sin(i * 0.24 + t) * h * 0.18;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }}
    />
  </div>
  <p id="trace-pressure-copy">Signal pressure rises through the active agent path.</p>
</section>
```
