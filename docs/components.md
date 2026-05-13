# Components

All components live in `design-system/src/components/modeless` and are exported from `design-system/src/components/modeless/index.ts`.

## Included

- `ModelessButton`
- `ModelessPanel`
- `ModelessCard`
- `ModelessCardHeader`
- `ModelessCardContent`
- `ModelessCardFooter`
- `ModelessTextField`
- `ModelessTextArea`
- `ModelessSearchField`
- `ModelessSelect`
- `ModelessFormField`
- `ModelessCheckbox`
- `ModelessRadioGroup`
- `ModelessSwitch`
- `ModelessSegmentedControl`
- `ModelessTabs`
- `ModelessTooltip`
- `ModelessIconButton`
- `ModelessDialog`
- `ModelessToast`
- `ModelessProgress`
- `ModelessList`
- `ModelessListItem`
- `ModelessDivider`
- `ModelessEmptyState`
- `ModelessLoadingState`
- `ModelessErrorState`
- `ArtifactCard`
- `SignalBadge`
- `TerminalBlock`
- `GlyphGrid`
- `GenerativeField`
- `SpecimenCard`
- `CommandSurface`
- `BlogPostCard`
- `ProductHero`
- `ModelessShell`
- `SectionHeader`
- `ProductCard`
- `ProductStatusBadge`
- `ProductCategoryLabel`
- `ProductMaturityMeter`
- `TagList`
- `ProductCTACluster`
- `StatusLegend`
- `AgentTraceMap`
- `PromptStackVisualizer`
- `ContextWindowHeatmap`
- `ConfidenceGradientMatrix`
- `HumanAIHandoffTimeline`
- `TokenEconomyMeter`
- `OnChainFlowGraph`
- `SmartContractStateMachine`
- `GovernancePulseBoard`
- `TrustSurfaceMap`
- `SignalBloom`
- `AgentPaymentAuthorization`
- `ScopedSpendControl`
- `SharedPaymentTokenCard`
- `AgenticCheckoutSession`
- `X402PaymentHandshake`
- `AgentReceipt`
- `DelegatedPaymentTimeline`
- `CommerceTrustBoundary`
- `ProductFeedReadinessPanel`
- `MachinePaymentMeter`

## Product Primitives

The product primitives are stable enough to live in the design system because they describe reusable Modeless catalog language, not one route's implementation.

- `ProductCard` renders a product/release artifact card.
- `ProductStatusBadge` maps shared product states to accessible badge variants.
- `ProductCategoryLabel` displays a category with a semantic product accent.
- `ProductMaturityMeter` shows a 0-5 maturity signal with text and shape, not color alone.
- `TagList` renders compact metadata tags.
- `ProductCTACluster` renders primary and secondary product actions as links.
- `StatusLegend` explains every product state.

Shared product types and metadata are exported from the same module:

- `ProductStatus`
- `ProductAccent`
- `ProductCardData`
- `productStatusMeta`

## Foundation Components

The app foundation layer covers the practical middle of the design system: forms, selection controls, navigation controls, simple feedback, generic cards, lists, dividers, and reusable empty/loading/error states.

These components are intentionally less domain-specific than the product, visualization, and commerce families. They should be used before creating page-local form controls or ad hoc list rows.

First-pass foundation components:

- `ModelessTextField`, `ModelessTextArea`, `ModelessSearchField`, `ModelessSelect`, and `ModelessFormField`
- `ModelessCheckbox`, `ModelessRadioGroup`, `ModelessSwitch`, and `ModelessSegmentedControl`
- `ModelessTabs`, `ModelessTooltip`, `ModelessIconButton`, `ModelessDialog`, `ModelessToast`, and `ModelessProgress`
- `ModelessCard`, `ModelessList`, `ModelessListItem`, `ModelessDivider`
- `ModelessEmptyState`, `ModelessLoadingState`, `ModelessErrorState`

See `design-system/docs/material-3-gap-audit.md` for the component coverage roadmap.

## AI-Native And Web3 Visualizations

The visualization components live in `design-system/src/components/modeless/visualizations` and are exported from the main modeless component barrel. They are built with React, TypeScript, Tailwind, SVG/CSS motion, and lucide icons where useful. They do not require charting libraries or live APIs.

These components are intended for agentic workflows, AI product operations, token economics, protocol dashboards, governance health, smart contract state, universal signal morphology, and trust-sensitive systems. Each component accepts structured props and supports `motion`.

See `design-system/docs/visualizations.md` for prop summaries, usage guidance, and accessibility notes. See `design-system/docs/motion-and-visualization.md` for the larger motion and visualization design system.

`SignalBloom` visualizes domain-agnostic events, entities, risks, anomalies, incidents, threshold breaches, stale sources, and degraded states as organic severity glyphs. Domain examples, including transit or energy examples, must be provided through `SignalBloomDatum` data only.

The design-system specimen page marks components as `stable`, `experimental`, or `research` so adopters can distinguish production-ready primitives from directional patterns.

## Agentic Commerce Components

The agentic commerce components live in `design-system/src/components/modeless/commerce` and are exported from the main modeless component barrel. They are built for products that need to explain agent-led purchases, scoped payment credentials, spend policy, checkout ownership, or machine-payment protocol state.

See `design-system/docs/agentic-commerce.md` for use cases, target users, inclusion rationale, motion guidance, and security notes.

## Conventions

Components use typed props, `cn()`, CSS variables, accessible focus styles, and CVA variants where variants are part of the public API.

They are intentionally composable. For example, `ArtifactCard` accepts an `actions` slot instead of hardcoding a navigation model.

## GenerativeField Variants

`GenerativeField` supports `particles`, `mesh`, `waveform`, `orbital`, `noise`, `feed`, `visualizer`, `isometric`, and `ascii`. It animates by default with slow telemetry-style motion; pass `animated={false}` for static output.

Motion-aware components support `motion="off" | "subtle" | "live" | "high"`.

- `subtle` is the default for cards, panels, and catalog surfaces.
- `live` is appropriate for hero graphics and primary product-detail visualizations.
- `high` is reserved for controlled demos and should not be used as a production default.
- `off` disables component-level motion while preserving layout.

Motion is intentionally quiet: no audio, no rapid flicker, no jittery grid movement, and all animation respects `prefers-reduced-motion`.
