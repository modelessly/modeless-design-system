# Modeless Design System Package Boundary

This document defines the public package boundary for the standalone Modeless Design System package.

## Package Name

- Current package name: `@modeless/design-system`
- Repository: `modelessly/modeless-design-system`

The package name decision is settled on `@modeless/design-system`.

## Source Of Truth

`src/index.ts` is the package entrypoint.

It exports:

- `src/components/modeless`
- `src/tokens`

Consumers should import through the package surface:

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "@modeless/design-system";
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

## Public Export Groups

### Stable Core

These are safe to document as the starting public API:

- `ModelessButton`
- `ModelessPanel`
- `SignalBadge`
- `TerminalBlock`
- `CommandSurface`
- `ArtifactCard`

### Foundation Components

These are public, but should remain beta until keyboard, focus, dialog behavior, docs, and clean-app usage are boring:

- `ModelessFormField`
- `ModelessTextField`
- `ModelessDropzone`
- `ModelessTextArea`
- `ModelessSearchField`
- `ModelessSelect`
- `ModelessCheckbox`
- `ModelessRadioGroup`
- `ModelessSwitch`
- `ModelessSegmentedControl`
- `ModelessTabs`
- `ModelessTooltip`
- `ModelessIconButton`
- `ModelessCard`
- `ModelessCardHeader`
- `ModelessCardContent`
- `ModelessCardFooter`
- `ModelessList`
- `ModelessListItem`
- `ModelessDivider`
- `ModelessProgress`
- `ModelessDialog`
- `ModelessToast`
- `ModelessEmptyState`
- `ModelessLoadingState`
- `ModelessErrorState`

### Product And Site Primitives

These are public for Modeless-style product sites, but should be documented as opinionated rather than generic app primitives:

- `ProductCard`
- `ProductStatusBadge`
- `ProductCategoryLabel`
- `ProductMaturityMeter`
- `ProductCTACluster`
- `StatusLegend`
- `TagList`
- `SectionHeader`
- `productStatusMeta`
- `ProductHero`
- `BlogPostCard`
- `ModelessShell`

### Visualizations

These are public but experimental. Docs should clearly explain data shapes, accessibility behavior, motion levels, and data-honesty expectations.

- `SignalBloom`
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
- `GenerativeField`
- `GlyphGrid`
- `MotionVisualizationGuide`

### Agentic Commerce

These should remain experimental until they have stronger documentation and more external examples:

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

### Tokens

These are public from `@modeless/design-system/tokens` and the package root:

- `modelessColors`
- `semanticColors`
- `modelessTypography`
- `ModelessMotionIntensity`
- `modelessMotionIntensities`
- `modelessMotionDurations`
- `modelessMotionEasing`
- `modelessMotionOpacity`
- `modelessMotion`

## Internal Or Low-Level APIs

The public package entrypoint uses explicit exports. These helpers are intentionally not exported from the package root:

- CVA variant helpers such as `modelessButtonVariants`, `modelessPanelVariants`, `modelessCardVariants`, `glyphGridVariants`, and `generativeFieldVariants`
- Shared visualization utilities such as `VisualizationFrame`, `toneColor`, `scoreTone`, and `percent`
- Shared commerce utilities such as `CommerceFrame`, `CommerceMetric`, `clampPercent`, and `commerceTone`
- `cn()` from `src/lib/utils.ts`

Keep variant helpers public only if downstream customization creates a clear need for them. Shared frame/helper utilities should stay internal unless a future registry copy bundle requires them.

## CSS Entry Points

The package exposes:

- `@modeless/design-system/globals`: compiled Tailwind base/utilities and shared global utilities
- `@modeless/design-system/styles`: Modeless theme variables, artifact geometry, grid utilities, and motion classes

Required import order:

```ts
import "@modeless/design-system/globals";
import "@modeless/design-system/styles";
```

The theme should keep working from `:root` and `.modeless-theme` so consumers can either apply Modeless globally or scope it to one app region.

## Package Contents

The npm-style package artifact ships the dependency contract, not the source-copy contract.

Included in the package tarball:

- `dist`
- `docs`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `package.json`

Not included in the package tarball by default:

- `src`
- `registry`
- examples, scripts, and planning files

Source-copy and shadcn-style registry adoption remain separate paths. Builders who want to own and modify copied source should use the repository and registry docs, not the npm tarball.

## Release Readiness

| Status | Gate | Evidence | Remaining Work |
| --- | --- | --- | --- |
| Pass | Package boundary is documented | This document defines public, experimental, internal, CSS, package contents, and source-copy boundaries. | Keep it updated when public exports change. |
| Pass | Library build emits package output | `npm run build` emits ESM, declarations, tokens, and CSS assets into `dist`. | Revisit build tooling only if multi-entry output, CJS, or declaration bundling becomes necessary. |
| Pass | Public exports are explicit | `src/components/modeless/index.ts`, visualization barrel, and commerce barrel use named exports. | Add future public exports deliberately. |
| Pass | Public API drift is guarded | `npm run public-api:check` verifies declaration barrels for required exports and forbidden helper leaks. | Update the guard when intentional API changes land. |
| Pass | Package dry-run succeeds | `npm run pack:check` runs `npm pack --dry-run` against the dependency-shaped artifact. | Review tarball contents before any real publish. |
| Pass | Clean Vite app can consume tarball | Tarball smoke test and permanent Vite fixture install `@modeless/design-system`, import CSS/tokens/types, typecheck, and build. | Repeat after major CSS or export changes. |
| Pass | One-command release gate exists | `npm run verify` checks build, public API, pack dry-run, local pack, and the consumer fixture. | Require this before external testing or publishing. |
| Pass | License and basic package metadata exist | Root `LICENSE`, package metadata, repository, homepage, peer dependencies, and files list are present. | Re-check metadata when package name/repo changes. |
| Partial | Foundation Components are documented | Most component groups have docs and readiness notes. | Add richer interactive examples and finish deeper foundations guidance. |
| Partial | Accessibility evidence is recorded | Dialog and Tabs have keyboard/focus QA notes. | Add broader keyboard/focus testing for remaining beta components. |
| Partial | Registry/source-copy path is separate | Package contents exclude `src` and `registry`; docs say registry is separate. | Expand registry docs for dependencies, CSS, tokens, and copy workflow. |
| Partial | CI release gate exists | GitHub Actions workflow exists in this repo. | Confirm CI is green on GitHub after push. |
| Partial | Repo-specific open-source hygiene | Contributing, security, issue, and PR templates exist. | Add more tailored issue forms as usage patterns emerge. |
| Missing | Published package dry run | `npm pack --dry-run` works locally. | Confirm npm scope access, test `npm publish --dry-run`, and document results. |
