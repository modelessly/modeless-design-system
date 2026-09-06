# Component Readiness

This policy defines how Modeless decides whether a component is ready for product use, external builders, and eventual `@modeless/design-system` publication.

## Maturity States

| State | Meaning | Public package use |
| --- | --- | --- |
| `stable` | Ready for product use and external builders. API changes should be deliberate and documented. | Yes |
| `beta` | Usable in real products, but API, accessibility, or examples may still tighten before public release. | Yes, with caution |
| `experimental` | Useful for trials and internal products. Behavior, naming, or API may change. | No, unless explicitly documented |
| `internal` | Reserved for the Modeless site or product-specific surfaces. Not part of the public package contract. | No |
| `deprecated` | Present for compatibility, but should not be used for new work. | No |

## Checklist Statuses

| Status | Meaning |
| --- | --- |
| `pass` | The check has been verified and no known blocker remains. |
| `partial` | The component mostly satisfies the check, but a known gap remains. |
| `missing` | The component does not yet satisfy the check. |
| `not tested` | The component may satisfy the check, but it has not been verified. |

## Readiness Checks

### Keyboard Behavior

Acceptance criteria:
- Every interactive control is reachable with keyboard navigation.
- Native controls retain expected browser behavior.
- Composite controls document any keyboard gaps.
- Dialogs trap focus, return focus on close, and support Escape before they can become stable.

### Accessible Naming

Acceptance criteria:
- Interactive controls have a visible label or equivalent accessible name.
- Status and feedback surfaces expose meaningful text, not color-only meaning.
- Decorative icons are hidden from assistive technology.
- Form errors are textual and specific.

### Reduced Motion

Acceptance criteria:
- Component motion respects reduced-motion preferences.
- Loading or animated states remain understandable when motion is disabled.
- Motion indicates state, freshness, or focus rather than decoration.

### Package Export

Acceptance criteria:
- The component is exported from the public package entrypoint when intended for external use.
- Published output does not leak site-only import aliases.
- Type declarations build successfully.
- CSS and token dependencies are documented.

### Visual QA

Acceptance criteria:
- Component renders cleanly in desktop and mobile widths.
- Text does not overlap, clip awkwardly, or overflow controls.
- Angled surfaces use shaped borders and adequate inset.
- Page sections stay rectangular; angled treatment stays on component surfaces.

### External Consumer Test

Acceptance criteria:
- A clean external React/Vite app can install the package.
- The component imports from `@modeless/design-system`.
- Required CSS imports work.
- Typecheck and production build pass in the consumer app.

## Graduation Rule

A Foundation Component can move from `beta` to `stable` when every readiness check is `pass`, public API examples are documented, and the component has passed at least one clean external-consumer test after its latest meaningful API or styling change.

## Current Visualization Readiness

| Surface | State | Notes |
| --- | --- | --- |
| Data visualization style guidance | `beta` | Ready to guide product and package work; should be refined as more studies ship. |
| Visualization palette tokens | `beta` | Public and usable, but semantic ranges may tighten before 1.0. |
| `CanvasSurface` | `beta` | Small primitive with clear package boundary; use for decorative canvas surfaces with accessible wrapper text. |
| `useCanvasAnimation` | `beta` | Handles reduced motion, offscreen pause, tab-hidden pause, DPR scaling, resize, and heavy-animation budgeting. |
| `ModelessGlobe` | `experimental` | Reusable global-systems module with baseline, traffic, and trust variants; API may change as provenance/orbital examples mature. |
| Globe math helpers | `experimental` | Exported for thin variants; keep usage close to globe modules until the API settles. |
| Existing visualization components | `experimental` | Useful for trials and internal products; continue improving examples, mobile behavior, and accessibility notes. |
