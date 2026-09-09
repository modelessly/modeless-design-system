# Backlog

Prioritised work for Modeless Design System and the design system section of modeless.io.

**North star:** a design system for AI agents first, humans second. The repository is the agent's distribution channel; the site is the human's, and should be generated from what the repository already produces rather than maintained beside it.

Priorities are ordered by what unblocks other work, then by what serves the north star, then by cost. Items marked **decision** need a human answer before the work can start.

---

## P0 — Unblocks everything else

### 1. Rebuild modeless.io against the current library
The site runs a build predating PRs #5, #6 and #7. Until it is rebuilt: no accessibility fix can be confirmed from the live site, QA will keep re-reporting defects that are already fixed, and the tier labels stay wrong. Every other site item below depends on this one.

Blocked on: access to the site's source. Unsized — I have not seen that codebase.

### 2. Write `AGENTS.md`
The repository has no agent entry point. An agent landing here faces a README, a `DESIGN.md`, 31 files in `docs/`, and a 287 KB `registry.json` too large to read whole, with nothing saying what to read, in what order, or that an MCP server exists.

For a system whose north star is agents first, this is the most valuable missing file in the repository. Short: what this is, read order, how to query the registry, the tier rules an agent must respect, and what it may not use.

Small. No dependencies.

### 3. **Decision:** settle the agent distribution channel
The tarball ships `dist`, `docs/`, `DESIGN.md`, README, changelog and licence — but not `registry/` or `mcp/`. So an agent consuming the package gets prose without the machine-readable half.

Either ship `registry/` in the tarball, or state plainly in the README that agent consumption is via the repository. The current half-shipped state is the only bad option. Recommendation: the repository, matching how the system is already shaped.

Small once decided. Unblocks items 4 and 9.

---

## P1 — Make the repository genuinely agent-consumable

### 4. Give agents a usable path into the registry
`registry.json` is 287 KB. An agent cannot read it whole, and nothing tells it not to try. Options: document MCP-first access in `AGENTS.md`, emit a small index alongside the full file, or both.

Depends on 2 and 3.

### 5. Map `docs/`
31 files with no index. An agent — and a new human — cannot tell which matter. A short table at the top of the README or in `AGENTS.md`, ideally generated.

Small.

### 6. Document the muted-text contrast constraint
Muted text passes AA on background, card and muted surfaces, and fails on `border` (3.49:1) and `input` (4.35:1). No component composes it that way today, so this is preventative: state the constraint so nobody builds the composition. Cheaper than lightening a core token.

Small. Closes the library half of QA D8.

---

## P2 — Site restructure

Direction is settled: four sections — Get started, Foundations, Components, Patterns — and the Get started page uses the three-routes design.

### 7. Build out the Get started page
Install, import, the three consumption routes, requirements, and what is safe to depend on. Mockup approved.

### 8. Generate component pages from `registry.json`
The site has no per-component page at all — the single biggest usability gap, and the reason it reads as a brochure rather than a reference. Everything such a page needs already exists in the registry: props, tokens used, do/don't with citations, maturity, source path, version.

Generating them is also what stops the site drifting from the package again. This is the highest-value site item after the rebuild.

Depends on 1.

### 9. Correct the site's factual errors
- Distribution advertises `npm install` as **live**; the package is not published, so an external builder following it hits a dead end.
- The component catalog labels **Product Primitives `stable`**; five of them are `internal` and no longer exported.
- Foundation Components are labelled `new` where the package says `beta`.

Items 8 and 3 remove the cause; this is the interim correction.

### 10. Add search
66 components with no search. Depends on 8.

### 11. Redo the component index and detail mockups
Drawn before I had looked at how the site actually uses lime — too restrained, display type too heavy. Redo in the settled direction.

### 12. Decide what to do about client-side rendering
The section renders nothing without JavaScript, so `curl` and anything that does not execute JS sees an empty page. That matters more than usual for a system whose audience includes agents.

**Decision**, and unsized until the site's source is visible.

---

## P3 — Close the readiness gap

Nothing can reach `stable` until these move — `docs/component-readiness.md` requires a clean external-consumer test, and no component has ever passed one.

### 13. Track A — external builder run
A coding agent builds a real app from the published package using only `docs/`, never `src/`. Also the first genuine exercise of the registry copy path repaired in Phase 3. Brief written in `docs/qa-test-plan.md`.

Highest-value untested path in the whole system.

### 14. Re-run the runtime QA properly
The first Grok run was a calibration run and passed — it found all three sealed canaries plus five real defects. The next run, against a rebuilt site, is the real validation.

Depends on 1.

### 15. Per-component documentation for the 44 that lack it
44 of 66 components have no documentation section, so their composition rules and do/don't guidance are structural only — which limits both the generated site pages and what an agent can be told.

Large, and splittable by family.

---

## P4 — Library debt

### 16. Reconcile `colors.ts` with the theme CSS
The same palette is defined twice and **11 of 13 core colours disagree** — `acid-lime` is `#C7FF2A` in TypeScript and renders `#c6ff29`; `radar-blue` is four steps off in the green channel. What renders is always the CSS, so the two can disagree on screen within one product. Fix by generating one from the other. Full table in `docs/design-md.md`.

Changes public API values. **Decision** on direction, then small.

### 17. Rename `ProductMaturityMeter`
It takes `level: number` and has nothing to do with products. Kept `beta` on review; the name is the only product-specific thing about it.

### 18. Document and consider promoting `ModelessButtonLink`
The anchor variant of stable `ModelessButton` with an identical API, currently undocumented and `beta`. Blocked on 13 like everything else facing promotion.

### 19. Judgement call: `CommerceTrustBoundary` maps `low` risk to acid lime
Lime means live. Low risk is a steady-state quality, not a running task, so the completion rule does not obviously apply — but it is worth a deliberate answer.

### 20. QA D5 — motion `off` collapses two sections
Did not reproduce against the library CSS. Points at site-side compositions and `MotionVisualizationGuide`, which is now internal. Needs the site source.

---

## Deferred by decision

From the original plan's Phase 7, unchanged:

- **npm publication** — deliberately paused until the package stays boring for a few cycles.
- **Automated drift correction** — detection needs a track record first. Phase 6 detects; nothing auto-fixes.
- **Promoting Experimental to Stable** — a human maturity decision, gated on 13.
- **The public case study** — after the rest is live and stable, not before.

---

## Suggested order

1. `AGENTS.md` and the distribution decision (2, 3) — cheap, and they define what everything else documents.
2. The site rebuild (1) — the bottleneck for six other items.
3. Track A (13) — long-running and independent; start it early rather than last.
4. Component page generation (8), then the rest of P2.
5. P1 remainder and P4 as they fit.

Items 2, 3, 5, 6 and 17 are small enough to clear in a single pass.
