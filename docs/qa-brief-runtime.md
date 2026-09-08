# QA Brief — Runtime Testing (Track B)

Instructions for a browser-based QA agent, plus a scoring key for the operator.

**Part 1 is pasted to the agent. Part 2 must not be** — it contains the answers.

## Which surface, and why

Two live surfaces exist, and they test different things:

| Surface | What it is | State |
| --- | --- | --- |
| `https://modeless.io/design-system/specimens` | The full design system site. Renders every component group, including agentic commerce, `SignalBloom`, and the product primitives. | Consumes an older copy of the library, predating the recent accessibility fixes |
| `https://modelessly.github.io/modeless-design-system/` | A small consumer app built from the freshly packed package on every push to `main`. Foundation components, globe, canvas, task lifecycle only. | Current |

The specimens page has far better coverage, so it is the target. Because it is running pre-fix code, this first engagement is a **calibration run**: it establishes whether the QA agent finds defects that are known to be present, before its results are trusted on a clean build.

---

# Part 1 — The brief (paste this)

You are QA-testing a design system specimen page. Test only what is on the page. Do not assume behavior you cannot observe.

**Target:** `https://modeless.io/design-system/specimens`

This page renders the full component catalog: core primitives, product primitives, foundation components, a motion system, a visualization suite, and agentic commerce surfaces.

## Step 0 — Report your capabilities first

Before testing, state which of these you can do. Do not guess. If you cannot do something, say so and mark the affected checks `NOT TESTABLE` rather than passing them.

1. Load a URL and screenshot it
2. Click, type, and press specific keys (Tab, Enter, Space, Escape)
3. Resize the viewport to a specific width
4. Emulate `prefers-reduced-motion: reduce`
5. Read the accessibility tree — element roles, accessible names, and states such as `aria-pressed` / `aria-selected` / `aria-checked`
6. Read computed CSS values and DOM attributes for a specific element
7. Run a color-contrast check

Each check names the capability it needs. **A check you cannot run is not a pass.**

## Ground rules

- Report defects against the **documented rules stated in each check**, not against your own taste. Aesthetic opinions go in a separate "Observations" list.
- Every defect needs: what you did, what you expected, what happened, viewport width, and a screenshot or the offending markup.
- Do not report anything about build tooling, source code, or npm — you cannot see those, and automated checks already cover them.
- The page is long. Work through it section by section and say which sections you covered.

## B1 — Interactive state exposure *(needs: 2, 5)*

Several sections render lists of selectable rows: the visualization suite under **Signal Bloom**, and the agentic commerce surfaces (**Agent Payment Authorization**, **Scoped Spend Control**, **Shared Payment Token Card**, **Agentic Checkout Session**, **x402 Payment Handshake**).

For each of those six areas:

1. Tab to a selectable row and activate it with Enter, then with Space.
2. Inspect that element in the accessibility tree.

**What to check and report for each:**
- What **role** does the element expose? A control you can activate should be exposed as a button.
- Does the element report a **selected or pressed state** that changes when you select it?
- Is the selection distinguishable **without color** — does anything in the accessibility tree change, or only the styling?

Report the role and state for each of the six areas as a table, whether or not you consider it a defect. This is the highest-priority section of this brief.

## B2 — Names and labels *(needs: 5)*

1. Every button and interactive control has a non-empty accessible name.
2. Decorative graphics — charts, meters, canvases, status dots — are either hidden from assistive technology or carry a meaningful name. **A graphic exposed with no name is a defect.**
3. Any element carrying a label that describes a value — for example a meter, a gauge, or a level indicator — actually exposes that label. Check the element's role: **a label on a generic container is not announced.** Report any element with a label but no role.
4. Where a list structure is used, confirm its children are valid for that structure.

## B3 — Color semantics *(needs: 1, 5)*

The system's central rule: **acid lime (bright yellow-green) means live or active, never finished.** Completion uses green. A finished job in lime reads as still running.

Check every status surface — badges, progress indicators, status legends, meters, the **Status And Metadata** and **Status Legend** sections. Report any completed, successful, or finished state rendered in lime.

Separately: report any state distinguishable **only** by color, with no text or shape equivalent.

## B4 — Motion and reduced motion *(needs: 1, 4)*

The page includes a **Motion Intensity** preview with `off` / `subtle` / `live` / `high` settings, a motion graphics section (**Pulse**, **Trace**, **Drift**, **Orbit**), and animated visualizations.

1. At default settings, report any **rapid flicker, strobing, or jitter**. Motion here is meant to be slow and telemetry-like.
2. Set the intensity preview to `off` and confirm layout does not shift.
3. Enable `prefers-reduced-motion: reduce`, reload, and confirm animation stops **and every surface remains understandable** — state must still be readable from text, shape, and structure alone.

**Fail:** motion continues under reduced motion, or a surface becomes meaningless without movement.

## B5 — Keyboard operation *(needs: 1, 2)*

1. Tab through the page. Every interactive control must be reachable.
2. **Every focused element must show a visible focus ring.** Report any control where focus is invisible or too low-contrast against its background — the theme is dark, so this is a likely failure.
3. Operate the foundation controls in **Foundation Components** and **Operational Settings**: text fields, selects, tabs, segmented controls, switches, checkboxes.
4. If a dialog opens, confirm Escape closes it and focus does not get lost behind it.

## B6 — Responsive layout *(needs: 1, 3)*

Test at **375px**, **768px**, and **1280px**.

**Fail:** horizontal page scrolling, clipped or overlapping text, controls that overlap or become unusably small, broken card and form layouts. Wide content such as tables and diagrams may scroll *within its own container* — that is correct, not a defect.

Screenshot each width.

## B7 — Contrast *(needs: 7)*

Light text on near-black. Check body text, muted metadata text, and text inside badges, chips, and buttons against their actual backgrounds. Report anything below WCAG AA — 4.5:1 for normal text, 3:1 for large.

Muted metadata and text on colored badges are the most likely failures.

## Report format

```
## Capabilities
[which of the 7 you can do]

## Sections covered
[which page sections you actually reached]

## B1 state table
| Area | Role exposed | Selected state exposed? | Notes |

## Defects
### D1 — [title]  (check: B2, viewport: 1280px)
Steps / Expected / Actual / Evidence

## Observations
[judgment calls, not rule violations]

## Not tested
[checks skipped, and why]
```

# End of brief

---

# Part 2 — Operator scoring key

**Do not paste this to the agent.**

This engagement is a calibration run. The target is running a build that predates the accessibility fixes in PRs #5, #6 and #7, so three specific defects are **known to be present**. They were confirmed by direct DOM inspection of the live page on 2026-09-08.

## Scored canaries

| # | Defect | Where | How to confirm |
| --- | --- | --- | --- |
| 1 | Selectable items are exposed as `listitem`, not as buttons, which discards the button role and makes their `aria-pressed` state invalid and ignored | `SignalBloom` sections | `document.querySelectorAll('button[role="listitem"]').length` → **22** |
| 2 | Selection is not exposed at all on any of the five commerce components — no `aria-pressed`, no `aria-current` | Agentic commerce sections | `[...document.querySelectorAll('[aria-pressed]')].filter(e=>e.getAttribute('role')!=='listitem').length` → **0** |
| 3 | A value label sits on a generic container with no role, so it is never announced | Product primitives — maturity meter | `<div aria-label="Maturity level 3 of 5">` with no `role` attribute; 12 roleless labelled elements page-wide |

Also present, unscored: one exposed `<svg>` with no accessible name, and 21 `role="list"` containers whose children are not listitems.

## Scoring

- **Finds 1 and 2** — the agent can inspect the accessibility tree and reason about roles. Trust its B1 and B2 results.
- **Finds 3 but not 1 or 2** — it is checking for missing labels but not for *wrong* roles. Its clean results on state exposure mean nothing.
- **Finds none** — it is doing visual QA only, whatever it claims about capability 5. Treat every accessibility section as `NOT TESTABLE` and get a human with a screen reader.
- **Reports defects beyond these three** — worth reviewing carefully. The three above are what is known; they are not necessarily all that is there.

A clean report on this page is a false negative by definition.

## After calibration

Once the agent's capability is established, the real validation needs the site rebuilt against the current library. Until then the specimens page cannot confirm any fix.

The Pages fixture at `https://modelessly.github.io/modeless-design-system/` *is* current, so it is where the foundation-component fixes can be verified today — but it renders no commerce components and no `SignalBloom`, so it cannot cover canaries 1 or 2.

## Separate finding: the site's tiers have drifted from the package

Not a runtime defect, and not something the agent can detect without repository access:

`https://modeless.io/design-system/components` labels the **Product Primitives** group `stable`. As of PR #9, `ProductCard`, `ProductStatusBadge`, `ProductCategoryLabel`, `ProductCTACluster` and `StatusLegend` are `internal` and are no longer exported from the package — the site advertises as stable a set of components an external builder cannot install. The same page labels Foundation Components `new` where the package says `beta`.

Worth fixing when the site is updated.
