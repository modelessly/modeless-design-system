# Modeless UI Package Boundary

This document defines the intended package boundary for the future `@modeless/ui` package while the source still lives inside the main `modeless` repository.

The goal is to make `design-system/` behave like the future installable package before splitting it into a separate `modeless-ui` repository.

## Proposed Package Name

- npm package: `@modeless/ui`
- repository later: `modelessly/modeless-ui`
- package source for now: `design-system/src`
- site/docs consumer for now: main Modeless site

## Source Of Truth

`design-system/src/index.ts` is the intended future package entrypoint.

It exports:

- `design-system/src/components/modeless`
- `design-system/src/tokens`

The current site imports from the same package-shaped entrypoint that external builders use. During local development, Vite and TypeScript alias `modeless-ui` to `design-system/src/index.ts` so the docs site dogfoods the public contract without requiring a published package:

```tsx
import { ModelessButton, ModelessPanel, ModelessTextField } from "@modeless/ui";
import "@modeless/ui/globals";
import "@modeless/ui/styles";
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

These should be public, but marked beta until keyboard, focus, dialog behavior, docs, and clean-app usage are reviewed:

- `ModelessFormField`
- `ModelessTextField`
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

These are public but experimental. They are useful to external builders, but the docs must clearly explain expected data shapes, accessibility behavior, motion levels, and data-honesty requirements.

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

These should remain experimental until they have stronger documentation and a clean example app:

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

These should be public from `@modeless/ui/tokens` or the package root:

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
- `cn()` from `design-system/src/lib/utils.ts`

Keep variant helpers public only if downstream customization creates a clear need for them. Shared frame/helper utilities should stay internal unless a future registry copy bundle requires them.

## CSS Entry Points

The package should eventually expose:

- `@modeless/ui/globals`: compiled Tailwind base/utilities and shared global utilities.
- `@modeless/ui/styles`: Modeless theme variables, artifact geometry, grid utilities, and motion classes.

Required import order:

```ts
import "@modeless/ui/globals";
import "@modeless/ui/styles";
```

The theme should keep working from `:root` and `.modeless-theme` so consumers can either apply Modeless globally or scope it to one app region.

## Package Contents

The npm-style package artifact should ship the dependency contract, not the source-copy contract.

Included in the package tarball:

- `design-system/dist`
- `design-system/docs`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- `package.json`

Not included in the package tarball by default:

- `design-system/src`
- `design-system/registry`
- site source, examples, scripts, and planning files

Source-copy and shadcn-style registry adoption remain separate repo/documentation paths. Builders who want to own and modify copied source should use the repository and registry docs, not the npm tarball.

## External Consumption Blockers

These must be resolved before installing from GitHub or npm is reliable:

1. **CSS coverage is still young:** packaged components no longer require a consumer Tailwind pipeline, but we still need broader external-app testing for utility coverage, reset behavior, and app-specific styling expectations.
2. **Maturity labels are informal:** public docs need stable, beta, experimental, and internal labels.

Resolved in-repo:

- `design-system/src/index.ts` is the future package entrypoint.
- package entrypoint exports are explicit so helper internals do not become accidental public API.
- `npm run public-api:check` verifies built declaration barrels for required exports and forbidden helper leaks.
- `npm run build:ui` emits ESM, declarations, and CSS assets into `design-system/dist`.
- component source imports are package-safe and no longer depend on `@design-system/*`.
- `npm run pack:ui` runs a dry-run package inspection using a local npm cache.
- `prepare` runs the UI build so GitHub installs can build the package from source.
- a clean temporary Vite app can install the packed tarball, import components, import styles, import tokens, typecheck, build, and render in the browser.

## Recommended Package Exports

Target shape after the library build exists:

```json
{
  "name": "@modeless/ui",
  "type": "module",
  "exports": {
    ".": {
      "types": "./design-system/dist/index.d.ts",
      "import": "./design-system/dist/index.js"
    },
    "./tokens": {
      "types": "./design-system/dist/tokens/index.d.ts",
      "import": "./design-system/dist/tokens/index.js"
    },
    "./styles": "./design-system/dist/styles/modeless-theme.css",
    "./globals": "./design-system/dist/styles/globals.css"
  },
  "sideEffects": [
    "./design-system/dist/styles/*.css"
  ],
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  }
}
```

## Repo Split Readiness

Create the separate `modeless-ui` repository only when the package is boring to consume from outside this repo.

Status meanings:

- **Pass:** enough evidence exists to treat this as satisfied.
- **Partial:** working, but needs one more check, decision, or documentation pass.
- **Missing:** not in place yet.

| Status | Gate | Evidence | Remaining Work |
| --- | --- | --- | --- |
| Pass | Package boundary is documented | This document defines public, experimental, internal, CSS, package contents, and source-copy boundaries. | Keep it updated when public exports change. |
| Pass | Library build emits package output | `npm run build:ui` emits ESM, declarations, tokens, and CSS assets into `design-system/dist`. | Revisit build tooling only if multi-entry output, CJS, or declaration bundling becomes necessary. |
| Pass | Public exports are explicit | `design-system/src/components/modeless/index.ts`, visualization barrel, and commerce barrel use named exports. | Add future public exports deliberately. |
| Pass | Public API drift is guarded | `npm run public-api:check` verifies declaration barrels for required exports and forbidden helper leaks. | Update the guard when intentional API changes land. |
| Pass | Package dry-run succeeds | `npm run pack:ui` runs `npm pack --dry-run` against the dependency-shaped artifact. | Review tarball contents before any real publish. |
| Pass | Clean Vite app can consume tarball | Tarball smoke test installed `modeless-ui`, imported components/styles/tokens, typechecked, built, and rendered in a browser. | Repeat after major CSS or export changes. |
| Pass | Permanent consumer fixture exists | `examples/vite-consumer` imports `modeless-ui`, `modeless-ui/globals`, `modeless-ui/styles`, tokens, and types. | Expand fixture if we need Next.js or SSR coverage. |
| Pass | Site dogfoods package entrypoints | The Modeless site imports through local `modeless-ui` aliases for components, tokens, globals, and styles. | Keep internal source imports limited to docs/source-copy workflows. |
| Pass | One-command release gate exists | `npm run verify:ui` checks generated API docs, TypeScript, package build, public API, pack dry-run, and consumer fixture. | Require this before external testing, repo split, or publish attempts. |
| Pass | README quickstart exists | Root README and `design-system/README.md` explain local package testing, imports, maturity, and not-ready items. | Validate with another external-builder test. |
| Pass | License and basic package metadata exist | Root `LICENSE`, package metadata, repository, homepage, peer dependencies, and files list are present. | Re-check metadata when package name/repo changes. |
| Pass | Maturity labels are documented | Component docs and README describe stable, beta, experimental, and internal surfaces. | Keep labels synchronized with component readiness docs. |
| Partial | Foundation Components are documented | Most component groups have docs, generated API tables, maturity metadata, and readiness checklists. | Add richer interactive examples and finish deeper foundations guidance. |
| Partial | Accessibility evidence is recorded | Dialog and Tabs have keyboard/focus improvements; QA notes exist for docs routes. | Add broader keyboard/focus testing for the remaining beta components. |
| Partial | Visual QA is recorded | Desktop and small-screen Foundation Component QA passes are documented. | Continue angled-frame QA and package-consumer visual checks after major changes. |
| Pass | External-builder testing is representative | Clean Vite tarball test, permanent Vite fixture, and fresh external-builder validation all pass. | Consider a Next.js fixture before claiming SSR coverage. |
| Partial | Registry/source-copy path is separate | Package contents exclude `design-system/src` and `design-system/registry`; docs say registry is separate. | Expand registry docs for dependencies, CSS, tokens, and copy workflow. |
| Partial | Package name and repository target are proposed | Proposed npm name is `@modeless/ui`; proposed repo is `modelessly/modeless-ui`. | Make a final naming/org decision before repo creation. |
| Partial | CI release gate exists | GitHub Actions runs generated API drift, typecheck/build, UI package build, and consumer checks. | Confirm CI is green on GitHub after the current batch of changes is pushed. |
| Missing | Repo-specific open-source hygiene | Root docs exist, but split-repo issue templates, PR template, release process, security policy, and contribution flow are not tailored yet. | Add these before inviting broad public use. |
| Missing | Published package dry run | `npm pack --dry-run` works locally; no actual npm publish or provenance check has been performed. | Decide npm scope/access, test `npm publish --dry-run`, and document release steps. |
| Missing | Versioning/release policy | Changelog exists, but semver policy and prerelease flow are not formalized. | Define alpha/beta/stable versioning before public package publication. |

Current recommendation: keep Modeless UI inside this repo until the partial items above are boring, CI is confirmed green on GitHub, and the package name/repo target decision is final.
