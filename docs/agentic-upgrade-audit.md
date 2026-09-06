# Agentic Upgrade Audit (Phase 0)

Audit of the repository against the assumptions in the agentic-upgrade kickoff plan. The plan was written from the public README only; this document records what the actual `docs/`, `registry/`, `scripts/`, and `src/` contents show.

**Status: the plan is directionally sound, but five assumptions are wrong and one phase cannot be executed as written.** Details in [Discrepancies](#discrepancies).

## 1. Documentation

| File | Lines | Notes |
| --- | --- | --- |
| `docs/package-usage.md` | 176 | Consumer guide. Carries its own 3-tier maturity list (Stable/Beta/Experimental). |
| `docs/tokens.md` | 86 | Prose token reference: core colors, semantic roles, operational state colors, visualization palette, typography, motion, geometry/grids. |
| `docs/components.md` | 154 | Lists 67 component names plus conventions, variants, and family descriptions. |
| `docs/accessibility.md` | 31 | System-wide guidance only (contrast, focus, motion, readability, ARIA). Not per-component. |

`docs/` holds 23 files total. The plan named four; the ones it did not name matter:

- **`docs/component-readiness.md` is the canonical maturity policy** — it defines the maturity states, the checklist statuses, six readiness checks with acceptance criteria, and the graduation rule. Any `maturityTier` field must source its vocabulary here, not from the README.
- `docs/visualizations.md` (229 lines) already carries per-component structured prose — see §5.
- `docs/agentic-commerce.md` (282 lines) carries a per-component maturity table that contradicts the README — see §4.

## 2. Registry schema

`registry/` contains exactly one file, `registry/registry.json` (104 lines).

The schema **is** the shadcn registry schema (`$schema: https://ui.shadcn.com/schema/registry.json`), with top-level `name`, `homepage`, and `items`. Fields actually in use across items:

```
name, type, title, description, dependencies, files
```

`cssVars` is **not** used. All 56 file paths referenced across the registry resolve on disk.

**The critical finding: `items` has 4 entries, and they are bundles, not components.**

| Item | Type | Files |
| --- | --- | --- |
| `modeless-theme` | `registry:style` | 2 |
| `modeless-components` | `registry:component` | 15 |
| `modeless-visualizations` | `registry:component` | 26 |
| `modeless-agentic-commerce` | `registry:component` | 13 |

There is no per-component registry entry anywhere. This breaks Phase 3 as written — see [D1](#d1-registry-granularity-blocks-phase-3-as-written).

## 3. Token and component structure

`src/tokens/index.ts` is a 3-line barrel re-exporting `./colors`, `./typography`, `./motion` (101 lines of tokens total). Exported objects: `modelessColors` (13 flat hex values), `modelessVisualizationColors` (15 HSL values), `semanticColors` (11 `hsl(var(--*))` indirections), `modelessTypography`, and the motion set (`modelessMotionIntensities`, `modelessMotionDurations`, `modelessMotionEasing`, `modelessMotionOpacity`, `modelessMotion`).

The token layer is **flat and untiered** — no nesting, no scale ramps. `semanticColors` points at CSS variables whose values live in `src/styles/modeless-theme.css`, so the CSS is the real source of truth for semantic values, exactly as `docs/tokens.md` states.

`src/components/modeless/index.ts` exports explicitly by name, then ends with two wildcards:

```ts
export * from "./visualizations";
export * from "./commerce";
```

Counts from the built declarations (`dist/`, which is current — newer than `src/`):

| Barrel | Value exports | Type exports |
| --- | --- | --- |
| `components/modeless/index.d.ts` | 49 | 0 |
| `components/modeless/visualizations/index.d.ts` | 31 | 4 |
| `components/modeless/commerce/index.d.ts` | 10 | 0 |

Not every value export is a component — `productStatusMeta`, `motionBudget`, `hashSeed`, `mulberry32`, `hsl`, `mixHsl`, and the nine globe math helpers are functions and data. A generator must distinguish components from helpers rather than treating every export as a component.

## 4. Maturity tracking vs. `public-api:check`

**`npm run public-api:check` does not enforce maturity at all.** `scripts/check-public-api.mjs` is a 120-line string-matching script over built `.d.ts` files. It does exactly two things: assert 16 `forbiddenPublicNames` are absent, and assert a hardcoded list of `requiredExports` is present per declaration file. It never reads the README, never parses TypeScript, and has no concept of Stable/Beta/Experimental.

The only tier it encodes implicitly is Internal — `forbiddenPublicNames` (`cn`, `*Variants`, `VisualizationFrame`, `CommerceFrame`, `toneColor`, `clampPercent`, …) is a machine-readable Internal list. That is the one tier assignment the plan can source automatically.

Maturity is otherwise **prose only, in four places that disagree**:

| Source | Vocabulary | Granularity |
| --- | --- | --- |
| `docs/component-readiness.md` | `stable`, `beta`, `experimental`, `internal`, `deprecated` | Policy + per-surface table (7 visualization surfaces) |
| `README.md` "Public API Maturity" | Stable, Beta, Experimental, Internal | Category-level prose |
| `docs/package-usage.md` | Stable, Beta, Experimental | Category-level prose |
| `docs/agentic-commerce.md` | Experimental, Stable, **Research** | Per-component table (10 components) |

Concrete conflicts:

- **README says all agentic commerce components are Experimental. `docs/agentic-commerce.md` marks `ScopedSpendControl`, `ProductFeedReadinessPanel`, and `MachinePaymentMeter` as Stable.**
- `docs/agentic-commerce.md` uses a tier, `Research`, that `docs/component-readiness.md` does not define.
- `docs/component-readiness.md` defines `deprecated`; the plan's four-tier list omits it.
- `docs/package-usage.md` omits Internal entirely.
- `docs/components.md` claims "Component docs mark surfaces as `stable`, `beta`, or `experimental`" — `docs/visualizations.md` contains no such markers. The claim is only true of `component-readiness.md` and `agentic-commerce.md`.

No maturity signal exists in source: zero JSDoc `@beta`/`@experimental`/`@internal` tags, and no maturity field on any component. (`ProductMaturityMeter` / `maturityLevel` in `product-primitives.tsx` is an unrelated product-catalog UI concept — do not mistake it for design-system maturity.)

## 5. What the plan can build on

Not everything is worse than assumed. Two things are better:

- **`docs/visualizations.md` is already near-structured.** Each of the 12 component sections uses a fixed shape: `Purpose:` / `Key props:` / `Use when:` / `Avoid when:` / `Accessibility:`. `Use when`/`Avoid when` map almost directly onto the plan's `compositionRules` and `doDont`, and every visualization section already has an `Accessibility:` line.
- **`docs/component-readiness.md` already defines the six readiness checks** the drift/quality layer would otherwise need invented.

## Discrepancies

### D1: Registry granularity blocks Phase 3 as written

Phase 3 says to "extend each entry" of `registry/*.json` with `maturityTier`, `compositionRules`, `doDont`, and `provenance`, and calls the registry "the single structured artifact." But the registry has 4 bundle entries covering ~90 exports. Attaching a single `maturityTier` to `modeless-visualizations` cannot express that `CanvasSurface` is beta while `ModelessGlobe` is experimental — a distinction `docs/component-readiness.md` makes explicitly.

Phase 3 therefore requires an unstated prerequisite: **restructure the registry from 4 bundles to per-component items.** That is a breaking change to the documented source-copy path (`npx shadcn add` against these item names), which Phase 3's own acceptance criteria require to keep working unmodified. These two requirements are in direct conflict and need a decision before Phase 3 starts. Three options: keep bundles and accept coarse metadata; add per-component items alongside the four bundles (registry supports both; bundles keep working); or split fully and version the change.

### D2: There is no per-component maturity source to read from

Phase 1 says `maturityTier` is "sourced from wherever Phase 0 found this is currently tracked." It is tracked in four disagreeing prose documents (§4), at category granularity for everything except the 10 commerce components and 7 visualization surfaces. For roughly 40 foundation and core components, no per-component tier exists in any form. Phase 1 cannot generate this field — it can only scaffold it. Reconciling the four sources into one machine-readable tier assignment is human work that should happen before or during Phase 1, not a side effect of it.

### D3: The plan's tier vocabulary is wrong

The plan uses four tiers, `Stable/Beta/Experimental/Internal`, title-cased. The canonical policy in `docs/component-readiness.md` defines **five**, lowercase: `stable`, `beta`, `experimental`, `internal`, `deprecated`. `docs/agentic-commerce.md` adds a sixth, `Research`. The Phase 5 trust-tier table has no row for `deprecated` or `Research`, so a query layer built to that table would have no defined behavior for components carrying those labels today.

### D4: The accessibility gap is smaller and differently shaped than Phase 4 assumes

Phase 4 assumes both visualization and commerce components lack accessibility documentation, and that the fix belongs in `docs/accessibility.md` at "parity with existing Stable-tier components."

Two corrections. First, the gap is asymmetric: `docs/visualizations.md` already has an `Accessibility:` line in every component section (20 accessibility/aria/keyboard mentions), while `docs/agentic-commerce.md` has **zero** — no accessibility, aria, keyboard, or screen-reader mention anywhere in 282 lines. The commerce gap is the real one.

Second, there is no per-component accessibility documentation for Stable components to reach parity with. `docs/accessibility.md` is 31 lines of system-wide guidance organized by concern (contrast, focus, motion, readability, ARIA), not by component. "Parity with existing Stable-tier components" describes something that does not exist. The realistic target is the `docs/visualizations.md` per-component `Accessibility:` convention, applied to commerce — which also keeps the docs next to the components they describe, rather than centralizing.

### D5: Script conventions differ from the plan

`scripts/` contains three files, all `.mjs` (`check-public-api.mjs`, `copy-ui-assets.mjs`, `refresh-consumer-install.mjs`), all plain Node ESM invoked as `node scripts/*.mjs`. The plan proposes `scripts/generate-component-registry.ts` "following the existing pattern in `scripts/`" — but a `.ts` script is not the existing pattern, and there is no `tsx` or `ts-node` to run one. Recommend `.mjs` for consistency, or add a runner deliberately and note it.

Related: Phase 1 wants props derived from compiled `.d.ts`. Those files export props by *reference* (`export type { AgentTraceMapProps }`), so enumerating actual prop names and types means resolving declarations with the TypeScript compiler API. `typescript@^5.7.2` is a devDependency, so this is available — but it is real work, not string matching like `check-public-api.mjs`.

### D6: No test framework exists

Phase 5 requires "a small test that asserts an Internal component query returns nothing," and Phase 6 requires a CI drift check. There is no test runner in the repo — no vitest, jest, playwright, or `node:test` usage in `package.json` or the consumer example. CI (`.github/workflows/ci.yml`) runs a single step, `npm run verify`, which chains build → `public-api:check` → `pack:check` → `pack:local` → consumer install/typecheck/build. Phases 5 and 6 will introduce the first test tooling in the repo; that choice should be deliberate. Adding checks as `node --test` scripts wired into `verify` matches existing conventions most closely.

## Minor corrections

- `docs/package-usage.md` states `npm run verify` "checks generated API docs." It does not — there is no API-doc generation step in `verify`.
- `docs/components.md` lists 67 components but omits `MotionVisualizationGuide` and `ModelessButtonLink`, both exported from the barrel. The list is already drifting from the exports — evidence for Phase 6's value.
- `@google/design.md` (Phase 2) exists on npm at v0.4.0 and does ship both `design.md` and `designmd` bin aliases, so the plan's cross-platform `designmd` recommendation is valid.
- Phase 2 expects `DESIGN.md` sections for colors/typography/rounded/spacing. The token layer has colors, typography, and motion — motion has no home in the DESIGN.md spec's canonical sections, and there are no spacing or radius tokens in `src/tokens/` at all (geometry lives in CSS as `artifact-angle`). Expect a lossy mapping in both directions.

## Recommendation

Phases 1, 2, and 4 can proceed once D3 (tier vocabulary) and D5 (script format) are settled — both are small decisions. Phase 3 should not start until the registry-granularity conflict in D1 is decided, since Phases 5 and 6 build on whatever Phase 3 produces. D2 is the largest hidden cost in the plan: the per-component maturity assignments that Phases 1, 3, and 5 all depend on do not exist yet and cannot be generated.
