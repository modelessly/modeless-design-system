# QA Brief — Runtime Testing (Track B)

A self-contained brief for a browser-based QA agent. It assumes **no access to this repository** — everything needed is below. Paste it whole.

Scope, priorities, and the other two test tracks are in `docs/qa-test-plan.md`.

---

## Brief begins

You are QA-testing a deployed design system showcase. Test only what is on the page. Do not assume behavior you cannot observe.

**Target:** `https://modelessly.github.io/modeless-design-system/`

This is a single-page app called "Operations Settings" — a standalone consumer app built against the Modeless Design System package. It exercises the package the way an external builder would.

### Step 0 — Report your capabilities first

Before testing, state which of these you can do. Do not guess; if you cannot do something, say so and mark the affected checks `NOT TESTABLE` rather than passing them.

1. Load a URL and screenshot it
2. Click, type, and press specific keys (Tab, Enter, Space, Escape)
3. Resize the viewport to a specific width
4. Emulate `prefers-reduced-motion: reduce`
5. Read the accessibility tree (roles, accessible names, `aria-pressed` / `aria-checked` states)
6. Read computed CSS values for an element
7. Run a color-contrast check

Checks below name the capability they need. **A check you cannot run is not a pass.**

### Ground rules

- **Report defects against the documented rules stated in each check**, not against your own taste. Aesthetic opinions go in a separate "Observations" list.
- **Every defect needs:** what you did, what you expected, what happened, the viewport width, and a screenshot.
- **Do not report** anything about build tooling, source code, or npm — you cannot see those, and they are covered by automated checks already.
- If the page fails to load or looks broken, stop and report that first — it is the finding.

---

## B1 — Color semantics *(needs: 1, 2)*

**The system's central rule: acid lime (bright yellow-green) means live or active. It must never indicate something finished.** Completion uses green. A finished job rendered in lime reads as still running, which is the specific bug this rule exists to prevent.

Find the **Task Lifecycle** section near the bottom of the page. It has a "Local Import" surface, an "Import Task" progress bar at 0%, and buttons **Start import** and **Mark complete**.

1. Observe the idle state. Record the badge text and its color.
2. Click **Start import**. The task is now active. Record badge text, badge color, and progress bar color.
3. Click **Mark complete**. The task is now finished. Record the same three things.

**Pass:** the active state uses acid lime; the completed state uses a distinctly different green and no longer uses lime anywhere in that surface.
**Fail:** the completed state is still lime, or active and complete are the same color.

Also check the **Sync Health / Queue Depth / Monthly Budget** metric cards and the status dots near the top: no state should be distinguishable *only* by color — each should also carry text.

## B2 — Reduced motion *(needs: 1, 4)*

The page has animated surfaces: a rotating globe under "Regions / Layers / Freshness", a canvas "pressure study", and ambient drift on panels.

1. Load normally and screenshot the animated areas.
2. Enable `prefers-reduced-motion: reduce`, reload, and screenshot again.

**Pass:** with reduced motion on, animation stops or becomes imperceptible, **and every surface remains understandable** — labels, values, and state are still readable from text and shape alone. The globe and pressure study must still communicate their data without movement.
**Fail:** motion continues, or a surface becomes meaningless without it (for example, a value that was only legible while animating).

Also, at normal settings: **report any rapid flicker, strobing, or jitter.** Motion here is meant to be slow and telemetry-like. Anything that pulses fast enough to be distracting is a defect.

## B3 — Keyboard operation *(needs: 1, 2)*

Using only the keyboard, starting from the top of the page:

1. Tab through the entire page. Every interactive control must be reachable.
2. **Every focused element must show a visible focus ring.** Report any control where focus is invisible or where the ring is too low-contrast to see against its background — check especially controls on dark panels.
3. Operate each control type: the **Workspace Name** text field, the **Default Environment** select, the **Daily / Weekly / Manual** segmented control, the **General / Delivery / Audit** tabs, any switches and checkboxes, and the **Choose file** button in the Source File dropzone.
4. Segmented control and tabs: confirm they can be operated with the keyboard and that the selection visibly changes.
5. Open a dialog if one is reachable (try **Save settings** / **Review changes**). If a dialog opens: confirm Escape closes it, and that focus does not get lost behind it.

**Fail conditions:** an unreachable control, an invisible focus ring, a control that cannot be operated by keyboard, or focus escaping to the page behind an open dialog.

## B4 — Accessible names and states *(needs: 5 — if you cannot read the AX tree, mark NOT TESTABLE)*

1. Every button and control has a non-empty accessible name. Icon-only controls are the usual offenders.
2. Decorative graphics — the globe canvas, the pressure study, status dots — are either hidden from assistive technology or carry a meaningful name. **A graphic that is exposed with no name is a defect.**
3. The segmented control and tabs report their selected state (`aria-selected`, `aria-checked`, or `aria-pressed` as appropriate) — not just a color change.
4. The progress bar exposes its value.

## B5 — Responsive layout *(needs: 1, 3)*

Test at **375px**, **768px**, and **1280px**.

**Fail conditions:**
- The page scrolls horizontally at any width
- Text is clipped, overlaps, or overflows its container
- Controls become unusably small or overlap each other
- The metric cards or form fields break their layout

Screenshot each width, full page.

## B6 — Shape language *(needs: 1)*

Cards and panels use a distinctive 45° corner cut on the upper-left and lower-right — the "artifact angle".

**Pass:** the cut appears on component surfaces (cards, panels, metric tiles).
**Fail:** the cut appears on full page sections or on background grids, which are meant to stay square.

## B7 — Contrast *(needs: 7 — if you cannot check contrast, mark NOT TESTABLE)*

The theme is light text on near-black. Check body text, muted metadata text, and text inside badges and buttons against their actual backgrounds. Report anything below WCAG AA (4.5:1 for normal text, 3:1 for large).

Muted metadata text and text on colored badges are the most likely failures.

---

## Calibration check

Somewhere on this page there is at least one genuine issue. If your report contains **zero defects across all sections**, re-check B4 and B7 specifically before submitting — a clean sweep more often means a check did not actually run than that the page is perfect.

## Report format

```
## Capabilities
[which of the 7 you can do]

## Summary
[one paragraph: what you tested, what you could not]

## Defects
### D1 — [short title]  (section: B3, viewport: 375px)
Steps: ...
Expected: ...
Actual: ...
Screenshot: ...

## Observations
[judgment calls, not rule violations]

## Not tested
[checks skipped, and why]
```

## Brief ends

---

## Note for the operator

The deployed showcase renders the foundation components, the globe, the canvas study, badges, and the task lifecycle. It does **not** render the agentic commerce components or `SignalBloom`.

That matters, because the highest-value accessibility checks in `docs/qa-test-plan.md` (Track B1 there) target exactly those: the `aria-pressed` selection fixes across the five commerce components, the `SharedPaymentTokenCard` grant-state text, and `SignalBloom`'s toggle semantics. **Those cannot be tested on the current showcase.** Extending `examples/vite-consumer/src/main.tsx` to render them would make that possible — until then, those fixes remain verified only in static markup.
