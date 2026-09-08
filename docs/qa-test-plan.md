# QA Test Plan

A plan for testing Modeless Design System with external AI agents.

## Goal

Find what the automated gate cannot: whether the documentation is sufficient for someone who has never seen this repo, whether the components behave correctly in a real browser, and whether the agentic layer actually serves an agent that is not its author.

## What is already machine-checked — do not re-test

`npm run verify` runs on every push and covers:

| Check | Covers |
| --- | --- |
| `build` | Package build, declaration output, generated `registry.json` and `DESIGN.md` |
| `public-api:check` | Required exports present, internal names absent from the public barrel |
| `registry:check` | Every export has an item, tiers valid, items self-contained, bundles intact |
| `design:lint` | `DESIGN.md` structural validity |
| `test` (76) | Structural accessibility rules on every rendered component, MCP trust tiers |
| `pack:check` / `pack:local` | Tarball contents |
| `example:consumer:*` | The checked-in Vite fixture installs, typechecks, and builds |

Asking an agent to re-run these produces no new information. Every track below targets something none of them can see.

## Recommendation

Three tracks, matched to what each kind of agent is actually good at. They are independent and can run in parallel.

| Track | Agent | Tests |
| --- | --- | --- |
| A — External builder | Codex, or any coding agent with a shell | Whether the docs are sufficient to build with |
| B — Runtime QA | The Grok QA bot | Whether it looks and behaves correctly in a real browser |
| C — Agentic consumption | Either, with MCP client support | Whether the registry and trust tiers work for a real agent |

Track A is the highest priority. `docs/component-readiness.md` requires a clean external app to install the package before a component can be stable, and **no component has ever passed that check** — it is the single blocker holding the whole system pre-1.0.

---

## Track A — External builder

**Agent:** a coding agent with shell access and the ability to create files (Codex fits).

**Rule: the agent may read `docs/` and the published package. It may not read `src/`.** The point is to find out whether the documentation is sufficient on its own. An agent that peeks at the implementation tests nothing.

### A1. Package install path

```bash
npm run build && npm pack --cache ./.npm-pack-cache
# in a fresh directory, outside this repo:
npm create vite@latest builder-test -- --template react-ts
cd builder-test && npm install
npm install /path/to/modeless-design-system-0.1.0.tgz
```

Then build **an operations dashboard for an AI agent fleet**, using only public imports, containing:

1. A shell with navigation and a page header
2. A form for configuring an agent — text field, select, switch, and a submit action
3. A long-running task surface showing idle → active → complete, using the correct badge and progress tones
4. One visualization component showing agent activity
5. An empty state and an error state

Requirements: TypeScript passes, production build succeeds, page renders in a browser, and both CSS entrypoints are imported as documented.

### A2. Source-copy path — never actually exercised

Phase 3 fixed the registry bundles, which were shipping files that could not resolve their imports. **The fix has been verified by a checker, not by an actual install.** This is the first real test of it.

In a second fresh app, install from the registry rather than the package:

```bash
npx shadcn@latest add /path/to/modeless-design-system/registry/registry.json
```

Try both a bundle (`modeless-components`) and a single per-component item (`agent-trace-map`). Confirm the copied files compile without adding imports by hand.

If the shadcn CLI cannot consume a local registry file, record that as the finding and copy the files listed in the item manually instead — the question being tested is whether an item's `files` list is complete.

### A3. What to report

Friction is the product here, not a pass mark. Specifically:

- Every point where the agent had to guess, or read `src/` after all
- Any documented import, class, or prop that did not work as described
- Anything that required knowledge not in `docs/`
- Time or attempts needed to get a first render on screen

**Deliverable:** `docs/external-builder-validation-<date>.md`, following the existing format in `docs/external-builder-validation.md` — Goal, Fixture, Commands, Results, Friction, Finding.

---

## Track B — Runtime QA

**Agent:** the Grok QA bot. **Capabilities needed:** load a URL, interact, screenshot, and ideally inspect the accessibility tree. Where it cannot inspect the AX tree, the checks below marked ⚠️ need a human with a screen reader.

**Target:** the deployed showcase at `https://modelessly.github.io/modeless-design-system/`, which builds from the freshly packed package.

### B1. Accessibility fixes, verified in a real browser

Nine accessibility defects were fixed recently. **All were verified in JSDOM-equivalent static markup, never in a real browser with real assistive technology.** That gap is the reason this track matters.

- Selectable rows in `AgentPaymentAuthorization`, `ScopedSpendControl`, `SharedPaymentTokenCard`, `AgenticCheckoutSession`, `X402PaymentHandshake`: reachable by Tab, activate with Enter *and* Space, and the selected row reports its state ⚠️
- `SharedPaymentTokenCard`: grant state readable as text, not only as icon and color — the permission list should announce something like "Recurring charges, granted, risk review" ⚠️
- `SignalBloom`: items are announced as toggle buttons, not list items, and the selected one reports as pressed ⚠️
- `ProductMaturityMeter`: the level is announced, not only drawn
- Every icon-only control has a name; no focus ring is missing or invisible against its surface

### B2. Motion and reduced motion

- With `prefers-reduced-motion: reduce`, every animation stops and **every component remains understandable** — state must still be legible from text, shape, and structure
- No rapid flicker, strobing, or jitter at any motion level
- `motion="off"` leaves layout unchanged
- Completed states are static — a finished task must not keep animating

### B3. Color semantics

The system's central rule: **acid lime means live, never complete.** Verify no finished or successful state renders in lime; completion uses green. Check every status surface — badges, progress, toasts, meters.

Also confirm no state is carried by color alone anywhere.

### B4. Responsive and visual

- 375px, 768px, 1280px: no horizontal overflow, no clipped or overlapping text
- The 45° `artifact-angle` cut appears on component surfaces and **not** on page sections or background grids
- Dense metadata text stays legible; body text is not shrunk below `text-sm`

### B5. What to report

Screenshot every defect with viewport and steps to reproduce. Separate **defects** (wrong against documented behavior) from **observations** (judgment calls), and cite the doc rule that a defect violates.

**Deliverable:** a findings doc in the format of `docs/foundation-component-qa.md` — Scope, Checklist, Notes, Follow-Up, Readiness Impact.

---

## Track C — Agentic consumption

**Agent:** either, provided it can connect to an MCP server.

This tests what the upgrade was built for, and **it has never been run with an agent other than the one that wrote it.**

**Setup:** give the agent the MCP server (`npm run mcp:serve`, see `docs/mcp-server.md`) and **nothing else** — no repo access, no docs. The server is the entire context.

### C1. Can it build from metadata alone?

Ask for a checkout-review screen for an agent-led purchase. The agent must discover components, read their props, and produce code compiling against the real API.

Measure: did it find the right components? Did it invent props that do not exist? Did it respect required props and composition rules?

### C2. Does it respect the trust tiers?

The layer exposes policy; it cannot force compliance. This measures whether the guidance is legible enough to be followed.

- Ask for something an experimental component would serve. **Expected:** the agent uses it but flags the output as not eligible for unsupervised use, per the guidance in the response.
- Ask for something using a beta component. **Expected:** output flagged for human review.
- Ask directly for `ProductCard` or `StatusLegend`. **Expected:** the agent reports it is unavailable and does not invent one. Watch specifically for **fabrication** — an agent that invents a `ProductCard` API after being refused is the failure mode worth catching.

### C3. Is the metadata sufficient?

- Ask what tokens to use for a warning state, and for a completed task
- Ask when *not* to use `ModelessGlobe` — the `doDont` rules should surface it
- Ask for something the system has no component for. **Expected:** it says so, rather than inventing one.

### C4. What to report

- Fabricated props, components, or tokens — the most important signal
- Questions the metadata could not answer
- Whether tier guidance was followed, ignored, or not noticed
- Places where a `description` or `doDont` rule was misleading rather than merely absent

**Deliverable:** `docs/agentic-consumption-validation-<date>.md`.

---

## Calibration canaries

Two known-true issues. If a track does not surface the one in its scope, that track's coverage is weaker than it appears — useful information about the testing setup itself.

1. **Token drift (Track A or C).** `modelessColors.acidLime` is `#C7FF2A` in TypeScript, but the CSS renders `hsl(76 100% 58%)` = `#c6ff29`. Eleven of thirteen core colors disagree between `src/tokens/colors.ts` and the theme CSS; `radar-blue` is off by four steps in the green channel. An agent comparing an imported token against a computed style should catch it. Documented in `docs/design-md.md`.

2. **Undocumented components (Track A).** 44 of 66 components have no per-component documentation section. An external builder should hit this as friction on any component outside the visualization and commerce families.

## What none of these can test

State plainly rather than letting the plan imply coverage it does not have:

- **Real assistive technology.** Automated AX tree inspection is not a screen reader. The commerce and `SignalBloom` fixes deserve one VoiceOver or NVDA pass by a human.
- **Whether the design is any good.** Every track tests correctness against documented intent. None asks whether the intent is right.
- **Long-term drift.** A point-in-time test says nothing about what happens on the twentieth change. That is Phase 6.

## Exit criteria

The engagement has succeeded when:

1. Track A produced a working app from docs alone, and its friction list is written down
2. Track A's registry install either worked or produced a specific reproducible failure
3. Track B checked every ⚠️ item, or explicitly recorded which need a human pass
4. Track C recorded whether the agent fabricated anything, and whether it followed tier guidance
5. Findings land as docs in the repo, in the existing formats

A track that finds nothing is not a pass — it is a reason to check the track was actually capable of finding something, starting with its canary.
