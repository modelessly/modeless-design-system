# QA Findings — Runtime Calibration Run

Date: 2026-09-08
Agent: Grok QA bot
Target: `https://modeless.io/design-system/specimens`
Brief: `docs/qa-brief-runtime.md`

## Calibration outcome: passed

The run was scored against the sealed key in `docs/qa-brief-runtime.md` Part 2. Three defects were known to be present.

| Canary | Reported as | Found |
| --- | --- | --- |
| Selectable items exposed as `listitem`, discarding the button role | D2 | Yes |
| No selection state exposed on the five commerce components | D1 | Yes |
| Value label on a generic container with no role | D3 | Yes |

**All three found, plus five defects that were not in the key.** The agent has genuine accessibility-tree access and reasons about roles, not just missing labels. Its clean results can be trusted on future runs — the outcome that makes this engagement worth repeating.

## Triage

The target runs a build predating PRs #5, #6 and #7, so three reported defects were already fixed in the library. The rest are real and were confirmed against current source.

| ID | Status | Notes |
| --- | --- | --- |
| D1 | Already fixed | `aria-pressed` on all five commerce components — PR #7 |
| D2 | Already fixed | `role="listitem"` removed from `SignalBloom` items — PR #5 |
| D3 | Already fixed | `role="img"` on `ProductMaturityMeter` and `ContextWindowHeatmap` — PR #6. Remaining `aria-label`s in source sit on `<a>`, `<nav>` and `role="img"` elements, which expose them correctly. |
| D4 | **Fixed here** | Real, but the reported mechanism was wrong — see below |
| D5 | Needs reproduction | Likely site-side — see below |
| D6 | **Fixed here** | Real, and a third instance was found that the report missed |
| D7 | **Fixed here** | Real, but the cause is one class on the frame, not the grid widths |
| D8 | **Confirmed, needs a decision** | Ratio reproduced exactly; the fix is a public token change |

## D4 — completion rendered in acid lime

**Reported as:** `--success` aliased to `--acid-lime`; split the tokens.

**Actually:** the tokens are already correct — `--success: var(--completion-green)`. The failure was in the tone functions. Neither `commerceTone` nor `toneColor` had a case for a finished state, so completion fell through to `default: hsl(var(--primary))`, which is acid lime.

This violated the rule in `docs/tokens.md`: acid lime communicates liveness and must not indicate a task that has already finished.

Four states were affected, all mapped to the tone `"safe"`, which resolves to lime:

- `AgentReceipt` — `settled`, `verified`
- `DelegatedPaymentTimeline` — `complete`
- `X402PaymentHandshake` — `settled`

Fixed by adding a `success` tone that resolves to `hsl(var(--success))`, and pointing those states at it. `toneColor` gained cases for `success` / `complete` / `completed` / `resolved` / `done` so a finished state can no longer fall through to the lime default.

One related change: `ProductFeedReadinessPanel` mapped `ready` to lime. Per the operational state table in `docs/tokens.md`, a loaded-and-ready item is informational, not live — `SignalBadge variant="ready"` is radar blue. It now matches.

Left alone deliberately: `CommerceTrustBoundary` maps `low` risk to lime. Low risk is a steady-state quality, not a finished task, so the rule does not obviously apply. Worth a separate judgement.

## D6 — focus removed with nothing in its place

**Confirmed.** `ModelessTextField` renders its `<input>` with `outline-none` inside a wrapper `<span>` that had no `focus-within` styling, so focusing the field showed nothing at all. `ModelessSearchField` wraps `ModelessTextField` and inherited it.

These are the most-used controls in the system, and both are `beta` tier.

Fixed by moving the focus ring to the wrapper, which is the element that carries the visible border.

**A third instance the report did not mention:** `CommandSurface` had the same defect — an `<input>` with `outline-none` inside a `<label>` with no ring. `CommandSurface` is **`stable` tier**, which makes it the most serious of the three.

It was found by a new rule added to the render harness (`focus-must-stay-visible`), which flags any focusable element that clears its outline without a ring on itself or any ancestor. The rule now runs against all 66 components on every build.

## D7 — page overflow at 375 and 768

**Reported as:** `min-w-[42rem]` / `min-w-[48rem]` on the visualization grids.

**Actually:** those utilities are correct. Both already sit inside an `overflow-x-auto` container, which is the documented pattern — wide content should scroll within its own container.

The cause was one missing class. `VisualizationFrame` lacked `min-w-0`, which `CommerceFrame` has. A grid or flex child defaults to `min-width: auto`, so the frame could not shrink below its content and the inner scroller pushed the page wide instead of scrolling.

Fixed by giving `VisualizationFrame` the same `min-w-0 max-w-full` the commerce frame already had. The inner scrollers are unchanged.

## D8 — muted text contrast

**Confirmed, and the reported ratio is exact.** `--muted-foreground` is `--concrete` at 55% lightness. Measured against every surface in the theme:

| Surface | Lightness | Ratio | AA (4.5:1) |
| --- | --- | --- | --- |
| `--background` off-black | 3% | 5.98:1 | Pass |
| `--card` panel-black | 6% | 5.71:1 | Pass |
| `--muted` graphite | 10% | 5.22:1 | Pass |
| `--input` | 16% | 4.35:1 | **Fail** |
| `--border` | 22% | **3.49:1** | **Fail** |

The reported 3.49:1 is muted text on a `--border` surface.

**This needs a decision, so it is not fixed here.** Raising `--concrete` to 63% lightness clears 4.5:1 on `--border`, but `--concrete` is a core token, `modelessColors.concrete` is public API, and the change would lighten muted text on every surface in the system. The alternative is to stop putting muted text on `border`- and `input`-coloured surfaces, which is narrower but needs the specific elements identified.

The full handoff file has the offending selectors; they were not available when this triage was written.

## D5 — motion `off` collapses sections

**Not reproduced; likely site-side.**

`.modeless-motion-off` sets `--motion-surface-opacity: 0` and `animation: none`. Neither removes layout height, so the library CSS does not explain a section collapsing by 224px.

The named sections point away from the package: "Motion Philosophy" is `MotionVisualizationGuide`, which PR #9 reclassified as `internal` and removed from the public barrel, and "Infographic Surfaces" does not correspond to any exported component. Both are likely site-side compositions where the animated element is the only thing giving a container height.

Reproducing this needs the site source.

## Follow-up

1. **D8 decision** — lighten `--concrete`, or fix the specific surfaces. Needs the selectors from the handoff file.
2. **D5** — reproduce against the site source.
3. **Rebuild the site against the current library.** Until then the specimens page cannot confirm any of these fixes, and D1–D3 will keep being reported.
4. **Tier drift** — `modeless.io/design-system/components` advertises Product Primitives as `stable`; five of them are now `internal` and unexported.
5. `CommerceTrustBoundary` mapping `low` risk to acid lime — judgement call, not covered by the completion rule.

## Readiness impact

`CommandSurface` is `stable` and shipped a focus-visibility defect, which the readiness checklist in `docs/component-readiness.md` treats as a keyboard-behaviour failure. It is fixed, and the harness now enforces the rule for every component, but it is a reminder that the stable tier has been carrying components that no external consumer has ever exercised.
