# Accessibility

Modeless Design System keeps the visual density without treating usability as optional.

## Contrast

The default theme uses bone text on off-black surfaces, acid lime for active/live states, completion green for successful finished states, and orange for warning/destructive emphasis. When customizing variables, test text contrast on card, terminal, artifact, and popover surfaces.

## Keyboard Focus

Interactive components use visible `focus-visible` rings. Do not remove focus states when composing new variants.

## Motion

Animation utilities are disabled to near-zero duration under `prefers-reduced-motion: reduce`.

Motion should feel like slow telemetry, not an alarm. Prefer long easing curves, low opacity changes, and organic drift. Avoid rapid flicker, hard strobing, jitter, autoplay audio, or effects that block reading.

Visualization components must remain understandable when motion is disabled. Use text labels, legends, shape, and structure; never rely on animation alone to communicate state.

For long-running tasks, animate only active indicators or short status text. Keep frame borders stable, make completion static, and retain an explicit status label when reduced motion removes animation.

## Readability

Use dense metadata styles for labels and short interface text only. Body text should remain `text-sm` or larger with comfortable line-height.

## ARIA

Icon-only buttons need `aria-label`. Decorative glyphs should be hidden from assistive technology unless they are interactive.

`ModelessDropzone` retains a native file input for keyboard and assistive technology access. Provide a useful visible label, accepted-file guidance, a textual error when validation fails, and validate dropped files because browser `accept` filtering applies primarily to the picker.

## Visualization Components

Visualizations must be understandable without color, without motion, and without sight of the graphic.

Every visualization renders inside a titled `<section>`. Beyond that, two exposure patterns are in use, and each component should follow one of them deliberately:

- **Graphic with a name.** Components whose meaning lives in the drawing — `AgentTraceMap`, `OnChainFlowGraph`, `SmartContractStateMachine`, `TokenEconomyMeter`, `TrustSurfaceMap`, and `SignalBloom` — carry `role="img"` with an `aria-label` describing what is depicted, and repeat the significant values as adjacent text.
- **Structure as text.** Components whose content is already textual — `ConfidenceGradientMatrix`, `GovernancePulseBoard`, `HumanAIHandoffTimeline`, and `PromptStackVisualizer` — render labels, states, and metadata as ordinary DOM text and deliberately do not use `role="img"`, which would hide that text from assistive technology.

Neither pattern is preferred, but one of them must be chosen. A graphic with no name and no textual equivalent is not acceptable.

Supply meaningful strings in the data. Most visualizations take `label` and `detail` (or equivalent) per datum and expose them as text; a visualization given opaque identifiers is inaccessible no matter how the component is built.

`SignalBloom` is the reference for interactive visualizations: selectable items are native buttons carrying `aria-pressed` and a composed `aria-label` that states severity, state, and value, grouped inside containers with their own labels. Follow it when adding selection to any visualization.

Per-component notes are in `docs/visualizations.md`.

## Agentic Commerce Components

These components describe money movement, so a reviewer who cannot see the visual must still be able to tell what an agent may do, who approved it, and whether it failed.

Components rendering a diagram or meter carry `role="img"` with an `aria-label`, and expose the underlying figures as adjacent text metrics rather than inside the label — amounts, budgets, failure counts, and settlement health stay readable when the graphic is not. Icons throughout the family are decorative and hidden from assistive technology.

Five components have inspection states and render their selectable rows as native `<button type="button">` elements, keyboard reachable with the standard focus ring. The other five are static.

Put meaning in the data rather than in tone: step actors, event states, protocol status, zone risk, and item status are all rendered as text next to the visual treatment.

All five interactive components expose the selected row through `aria-pressed`, matching the pattern `SignalBloom` uses in the visualization family, and grouped controls carry `role="group"` so their label is exposed. Where an icon or color swatch is the only visual signal — as with permission grant state and risk in `SharedPaymentTokenCard` — the meaning is rendered as text alongside the label.

Per-component notes are in `docs/agentic-commerce.md`.
