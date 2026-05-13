# Registry

This project includes a starter `design-system/registry/registry.json` compatible with the direction of shadcn custom registries.

The current registry points to local source files and theme files. Before publishing, update URLs to raw GitHub URLs or your hosted registry endpoint.

## Goals

- Let users install Modeless components one at a time.
- Include required dependencies and Tailwind configuration notes.
- Keep the source readable after installation.

## Planned Items

- `modeless-theme`
- `modeless-button`
- `modeless-panel`
- `artifact-card`
- `signal-badge`
- `terminal-block`
- `glyph-grid`
- `generative-field`
- `specimen-card`
- `command-surface`
- `blog-post-card`
- `product-hero`
- `modeless-shell`
- `modeless-visualizations`

## Visualization Bundle

`modeless-visualizations` is a registry bundle for the AI-native and Web3 visualization suite:

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

The bundle includes `visualizations/shared.tsx`, `tokens/motion.ts`, and `utils.ts`. Consumers still need the Modeless theme styles and Tailwind tokens for the intended visual treatment.
