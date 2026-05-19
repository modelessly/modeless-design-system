# Foundation Component QA

This pass records visual QA for the current Foundation Component docs and examples.

Date: 2026-05-08

QA harness: `/qa`

## Scope

Routes checked:
- `/components`
- `/components/text-field`
- `/components/tabs`
- `/components/dialog`
- `/components/states`

## Checklist

| Check | Acceptance Criteria | Desktop Status | Small-Screen Status |
| --- | --- | --- | --- |
| Text fit | Labels, headings, code snippets, badges, and buttons do not overlap or clip in the checked docs surfaces. | Pass | Pass |
| Angled borders | Component surfaces use shaped borders where angled treatment is applied. | Pass | Pass |
| Hidden rectangular borders | Angled component surfaces do not expose a conflicting native rectangular border. | Pass | Pass |
| Focus states | Interactive examples expose visible focus and keyboard-reachable controls in checked routes. | Pass | Pass |
| Reduced motion compatibility | Checked examples do not rely on motion to communicate essential meaning. | Pass | Pass |
| Example rendering | Live examples render without missing component output or obvious layout breakage. | Pass | Pass |

## Route Notes

Small-screen QA was performed through `/qa` using the Foundation Components suite with the `Small` viewport preset.

### `/components`

- Catalog, maturity definitions, Foundation Component cards, preview tabs, and state examples render.
- Component cards expose maturity and checklist counts.
- No stale “Normal Components” copy observed.

### `/components/text-field`

- TextField example, import snippet, props, accessibility, and checklist sections render.
- Code block remains horizontally scrollable instead of forcing layout overflow.

### `/components/tabs`

- Tabs example renders with selected state, panel content, and documented keyboard behavior.
- `tab` and `tabpanel` roles are present.

### `/components/dialog`

- Dialog example opens cleanly.
- Focus trap, Escape close, and focus return were verified separately in keyboard QA.
- Dialog surface uses labelled and described ARIA wiring.

### `/components/states`

- Loading and error examples render.
- State surfaces use readable text and contained actions.

## Follow-Up

- Add an automated screenshot or Playwright-based regression pass for `/qa` before public package release.
- Re-run this QA after major theme, spacing, typography, or angled-frame changes.
- Keep `/qa` small-screen review as a release gate before graduating newly changed components to `stable`.

## Readiness Impact

The checked Foundation Component docs can mark `Visual QA complete` as `pass` for this pass. Re-run `/qa` after major theme, spacing, typography, or angled-frame changes.
